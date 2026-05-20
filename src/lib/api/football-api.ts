// ==========================================
// API-FOOTBALL SERVICE LAYER
// Handles all communication with api-sports.io
// ==========================================

const BASE_URL = process.env.API_FOOTALL_BASE_URL || 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;

// League IDs on API-Football
export const LEAGUE_IDS = {
  epl: 39,       // Premier League
  laliga: 140,   // La Liga
  ucl: 2,        // Champions League
  egypt: 204,    // Egyptian Premier League
} as const;

export type LeagueKey = keyof typeof LEAGUE_IDS;

// In-memory cache to prevent hitting API rate limits
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

// Cache TTLs (milliseconds)
const CACHE_TTL = {
  LIVE: 30_000,       // 30s for live matches
  FIXTURES: 120_000,  // 2min for fixtures by date
  STANDINGS: 300_000, // 5min for standings
  FIXTURE_DETAIL: 60_000, // 1min for fixture details
} as const;

async function apiRequest<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('API_KEY_NOT_CONFIGURED');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      'x-apisports-key': API_KEY,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(`API errors: ${JSON.stringify(json.errors)}`);
  }

  return json.response as T;
}

// ==========================================
// FIXTURE ENDPOINTS
// ==========================================

export interface APIFixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: { first: number | null; second: number | null };
    venue: { id: number; name: string; city: string } | null;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface FixtureEvents {
  time: { elapsed: number; extra: number | null };
  type: string;
  detail: string;
  comments: string | null;
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string } | null;
  assist: { id: number; name: string } | null;
}

export interface FixtureLineupPlayer {
  id: number;
  name: string;
  number: number | null;
  pos: string;
  grid: string | null;
}

export interface FixtureLineup {
  team: { id: number; name: string; logo: string; colors: Record<string, string> };
  formation: string;
  startXI: FixtureLineupPlayer[];
  substitutes: FixtureLineupPlayer[];
  coach: { id: number; name: string };
}

export interface FixtureStatistics {
  team: { id: number; name: string; logo: string };
  statistics: {
    type: string;
    value: number | string | null;
  }[];
}

// Get live fixtures
export async function getLiveFixtures(): Promise<APIFixture[]> {
  const cacheKey = 'fixtures:live';
  const cached = getCached<APIFixture[]>(cacheKey);
  if (cached) return cached;

  const data = await apiRequest<APIFixture[]>('/fixtures', { live: 'all' });
  setCache(cacheKey, data, CACHE_TTL.LIVE);
  return data;
}

// Get fixtures by date
export async function getFixturesByDate(date: string, leagueId?: number): Promise<APIFixture[]> {
  const cacheKey = `fixtures:date:${date}:${leagueId || 'all'}`;
  const cached = getCached<APIFixture[]>(cacheKey);
  if (cached) return cached;

  const params: Record<string, string> = { date };
  if (leagueId) params.league = String(leagueId);
  params.season = new Date().getFullYear().toString();

  const data = await apiRequest<APIFixture[]>('/fixtures', params);
  setCache(cacheKey, data, CACHE_TTL.FIXTURES);
  return data;
}

// Get fixture details (events, lineups, statistics)
export async function getFixtureDetails(fixtureId: number): Promise<{
  fixture: APIFixture;
  events: FixtureEvents[];
  lineups: FixtureLineup[];
  statistics: FixtureStatistics[];
}> {
  const cacheKey = `fixture:detail:${fixtureId}`;
  const cached = getCached<typeof cache extends null ? never : ReturnType<typeof getFixtureDetails>>(cacheKey);
  if (cached) return cached;

  const [fixtures, events, lineups, statistics] = await Promise.all([
    apiRequest<APIFixture[]>('/fixtures', { id: String(fixtureId) }),
    apiRequest<FixtureEvents[]>('/fixtures/events', { fixture: String(fixtureId) }),
    apiRequest<FixtureLineup[]>('/fixtures/lineups', { fixture: String(fixtureId) }),
    apiRequest<FixtureStatistics[]>('/fixtures/statistics', { fixture: String(fixtureId) }),
  ]);

  const result = {
    fixture: fixtures[0],
    events,
    lineups,
    statistics,
  };

  setCache(cacheKey, result, CACHE_TTL.FIXTURE_DETAIL);
  return result;
}

// ==========================================
// STANDINGS ENDPOINTS
// ==========================================

export interface APIStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals: { for: number; against: number };
  goalDiff: number;
  form: string;
  description: string | null;
}

export interface APIStandingsResponse {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    standings: APIStanding[][];
  };
}

export async function getStandings(leagueId: number, season?: number): Promise<APIStandingsResponse> {
  const currentYear = season || new Date().getFullYear();
  const cacheKey = `standings:${leagueId}:${currentYear}`;
  const cached = getCached<APIStandingsResponse>(cacheKey);
  if (cached) return cached;

  const data = await apiRequest<APIStandingsResponse[]>('/standings', {
    league: String(leagueId),
    season: String(currentYear),
  });

  const result = data[0];
  setCache(cacheKey, result, CACHE_TTL.STANDINGS);
  return result;
}

// ==========================================
// TOP SCORERS
// ==========================================

export interface APITopScorer {
  player: {
    id: number;
    name: string;
    photo: string;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: {
    games: { appearances: number; minutes: number };
    goals: { total: number; assists: number };
    cards: { yellow: number; red: number };
  }[];
}

export async function getTopScorers(leagueId: number, season?: number): Promise<APITopScorer[]> {
  const currentYear = season || new Date().getFullYear();
  const cacheKey = `scorers:${leagueId}:${currentYear}`;
  const cached = getCached<APITopScorer[]>(cacheKey);
  if (cached) return cached;

  const data = await apiRequest<APITopScorer[]>('/players/topscorers', {
    league: String(leagueId),
    season: String(currentYear),
  });

  setCache(cacheKey, data, CACHE_TTL.STANDINGS);
  return data;
}

// ==========================================
// DATA TRANSFORMERS
// Convert API responses to our app format
// ==========================================

import {
  type Match,
  type MatchEvent,
  type MatchStatus,
  type Standing,
  type TopScorer,
  type Team,
} from '@/lib/mock-data';

export function mapStatus(shortStatus: string): MatchStatus {
  switch (shortStatus) {
    case '1H':
    case '2H':
    case 'ET':
    case 'BT':
    case 'P':
    case 'SUSP':
    case 'INT':
    case 'LIVE':
      return 'LIVE';
    case 'HT':
      return 'HT';
    case 'FT':
    case 'AET':
    case 'PEN':
      return 'FT';
    case 'PST':
    case 'CANC':
    case 'ABD':
      return 'POSTPONED';
    case 'TBD':
    case 'NS':
    default:
      return 'SCHEDULED';
  }
}

export function mapFixtureToMatch(fixture: APIFixture): Match {
  const status = mapStatus(fixture.fixture.status.short);
  const isLive = status === 'LIVE';
  const isHT = status === 'HT';
  const isFT = status === 'FT';
  const homeScore = fixture.goals.home ?? 0;
  const awayScore = fixture.goals.away ?? 0;

  // Determine the league key
  let leagueId = 'epl';
  if (fixture.league.id === 140) leagueId = 'laliga';
  else if (fixture.league.id === 2) leagueId = 'ucl';
  else if (fixture.league.id === 204) leagueId = 'egypt';

  // Extract team short names
  const homeShort = fixture.teams.home.name
    .replace(/FC|CF|SC|Club|Athletic|Association/g, '')
    .trim()
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .substring(0, 3)
    .toUpperCase();

  const awayShort = fixture.teams.away.name
    .replace(/FC|CF|SC|Club|Athletic|Association/g, '')
    .trim()
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .substring(0, 3)
    .toUpperCase();

  return {
    id: String(fixture.fixture.id),
    homeTeam: {
      id: String(fixture.teams.home.id),
      name: fixture.teams.home.name,
      shortName: homeShort,
      logo: fixture.teams.home.logo,
      color: '#3B82F6',
    },
    awayTeam: {
      id: String(fixture.teams.away.id),
      name: fixture.teams.away.name,
      shortName: awayShort,
      logo: fixture.teams.away.logo,
      color: '#EF4444',
    },
    homeScore,
    awayScore,
    status,
    minute: isLive ? (fixture.fixture.status.elapsed || 0) : undefined,
    league: fixture.league.name,
    leagueId,
    date: fixture.fixture.date.split('T')[0],
    time: new Date(fixture.fixture.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    venue: fixture.fixture.venue?.name || 'TBD',
    events: [],
    homePossession: undefined,
    awayPossession: undefined,
    homeShots: undefined,
    awayShots: undefined,
    homeShotsOnTarget: undefined,
    awayShotsOnTarget: undefined,
    homeFouls: undefined,
    awayFouls: undefined,
    homeCorners: undefined,
    awayCorners: undefined,
  };
}

export function mapEventsToMatchEvents(events: FixtureEvents[]): MatchEvent[] {
  return events.map((event, idx) => ({
    id: `event-${idx}`,
    type: event.type === 'Goal' ? 'GOAL' as const :
          event.detail === 'Yellow Card' ? 'YELLOW_CARD' as const :
          event.detail === 'Red Card' ? 'RED_CARD' as const :
          event.type === 'subst' ? 'SUBSTITUTION' as const :
          'GOAL' as const,
    minute: event.time.elapsed,
    teamId: String(event.team.id),
    playerName: event.player?.name || '',
    assistBy: event.assist?.name || undefined,
    playerIn: event.type === 'subst' ? event.assist?.name : undefined,
    playerOut: event.type === 'subst' ? event.player?.name : undefined,
    detail: event.detail,
  }));
}

export function mapStandings(standingsData: APIStanding[][]): Standing[] {
  return standingsData[0]?.map((s) => ({
    rank: s.rank,
    team: {
      id: String(s.team.id),
      name: s.team.name,
      shortName: s.team.name.substring(0, 3).toUpperCase(),
      logo: s.team.logo,
      color: '#3B82F6',
    },
    played: s.played,
    won: s.won,
    drawn: s.draw,
    lost: s.lost,
    goalsFor: s.goals.for,
    goalsAgainst: s.goals.against,
    goalDifference: s.goalDiff,
    points: s.points,
    form: s.form ? s.form.split('').map((c: string) => c === 'W' ? 'W' as const : c === 'D' ? 'D' as const : 'L' as const) : [],
  })) || [];
}

export function mapTopScorers(scorers: APITopScorer[]): TopScorer[] {
  return scorers.map((s, idx) => ({
    rank: idx + 1,
    name: s.player.name,
    team: {
      id: String(s.team.id),
      name: s.team.name,
      shortName: s.team.name.substring(0, 3).toUpperCase(),
      logo: s.team.logo,
      color: '#3B82F6',
    },
    goals: s.statistics[0]?.goals.total || 0,
    assists: s.statistics[0]?.goals.assists || 0,
    matches: s.statistics[0]?.games.appearances || 0,
  }));
}
