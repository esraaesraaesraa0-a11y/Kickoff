// ==========================================
// FOOTBALL PLATFORM - COMPREHENSIVE MOCK DATA
// ==========================================

export type MatchStatus = 'LIVE' | 'HT' | 'FT' | 'UPCOMING' | 'POSTPONED' | 'SCHEDULED';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
}

export interface MatchEvent {
  id: string;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR';
  minute: number;
  teamId: string;
  playerName: string;
  assistBy?: string;
  playerIn?: string;
  playerOut?: string;
  detail?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  league: string;
  leagueId: string;
  date: string;
  time: string;
  venue: string;
  events: MatchEvent[];
  homePossession?: number;
  awayPossession?: number;
  homeShots?: number;
  awayShots?: number;
  homeShotsOnTarget?: number;
  awayShotsOnTarget?: number;
  homeFouls?: number;
  awayFouls?: number;
  homeCorners?: number;
  awayCorners?: number;
  homeLineup?: PlayerLineup[];
  awayLineup?: PlayerLineup[];
}

export interface PlayerLineup {
  name: string;
  position: string;
  number: number;
  isSubstitute: boolean;
}

export interface Standing {
  rank: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface TopScorer {
  rank: number;
  name: string;
  team: Team;
  goals: number;
  assists: number;
  matches: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  league: string;
  imageUrl: string;
  date: string;
  readTime: string;
  isBreaking: boolean;
}

export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
  color: string;
}

// ==========================================
// TEAMS
// ==========================================

export const teams: Record<string, Team> = {
  // Premier League
  arsenal: { id: 'arsenal', name: 'Arsenal', shortName: 'ARS', logo: '🔴', color: '#EF4444' },
  manCity: { id: 'manCity', name: 'Manchester City', shortName: 'MCI', logo: '🔵', color: '#3B82F6' },
  liverpool: { id: 'liverpool', name: 'Liverpool', shortName: 'LIV', logo: '🔴', color: '#DC2626' },
  chelsea: { id: 'chelsea', name: 'Chelsea', shortName: 'CHE', logo: '🔵', color: '#2563EB' },
  manUtd: { id: 'manUtd', name: 'Manchester United', shortName: 'MUN', logo: '🔴', color: '#DC2626' },
  tottenham: { id: 'tottenham', name: 'Tottenham Hotspur', shortName: 'TOT', logo: '⚪', color: '#FFFFFF' },
  newcastle: { id: 'newcastle', name: 'Newcastle United', shortName: 'NEW', logo: '⬛', color: '#1E293B' },
  astonVilla: { id: 'astonVilla', name: 'Aston Villa', shortName: 'AVL', logo: '🟣', color: '#7C3AED' },
  brighton: { id: 'brighton', name: 'Brighton & Hove Albion', shortName: 'BHA', logo: '🔵', color: '#2563EB' },
  westHam: { id: 'westHam', name: 'West Ham United', shortName: 'WHU', logo: '🟤', color: '#92400E' },
  // La Liga
  barca: { id: 'barca', name: 'FC Barcelona', shortName: 'BAR', logo: '🔵', color: '#2563EB' },
  realMadrid: { id: 'realMadrid', name: 'Real Madrid', shortName: 'RMA', logo: '⚪', color: '#FFFFFF' },
  atletico: { id: 'atletico', name: 'Atletico Madrid', shortName: 'ATM', logo: '🔴', color: '#DC2626' },
  sevilla: { id: 'sevilla', name: 'Sevilla FC', shortName: 'SEV', logo: '🔴', color: '#EF4444' },
  realSociedad: { id: 'realSociedad', name: 'Real Sociedad', shortName: 'RSO', logo: '🔵', color: '#2563EB' },
  villarreal: { id: 'villarreal', name: 'Villarreal CF', shortName: 'VIL', logo: '🟡', color: '#EAB308' },
  // Egyptian Premier League
  alAhly: { id: 'alAhly', name: 'Al Ahly SC', shortName: 'AHL', logo: '🔴', color: '#DC2626' },
  zamalek: { id: 'zamalek', name: 'Zamalek SC', shortName: 'ZAM', logo: '⚪', color: '#FFFFFF' },
  ismaily: { id: 'ismaily', name: 'Ismaily SC', shortName: 'ISM', logo: '🟡', color: '#EAB308' },
  pyramids: { id: 'pyramids', name: 'Pyramids FC', shortName: 'PYR', logo: '🟠', color: '#F97316' },
  // UCL
  bayern: { id: 'bayern', name: 'Bayern Munich', shortName: 'BAY', logo: '🔴', color: '#DC2626' },
  psg: { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', logo: '🔵', color: '#2563EB' },
  inter: { id: 'inter', name: 'Inter Milan', shortName: 'INT', logo: '🔵', color: '#2563EB' },
  dortmund: { id: 'dortmund', name: 'Borussia Dortmund', shortName: 'BVB', logo: '🟡', color: '#EAB308' },
};

// ==========================================
// LEAGUES
// ==========================================

export const leagues: League[] = [
  { id: 'epl', name: 'Premier League', country: 'England', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#3B82F6' },
  { id: 'laliga', name: 'La Liga', country: 'Spain', logo: '🇪🇸', color: '#EF4444' },
  { id: 'ucl', name: 'UEFA Champions League', country: 'Europe', logo: '⭐', color: '#1E40AF' },
  { id: 'egypt', name: 'Egyptian Premier League', country: 'Egypt', logo: '🇪🇬', color: '#DC2626' },
];

// ==========================================
// LIVE & FEATURED MATCHES
// ==========================================

export const liveMatches: Match[] = [
  {
    id: 'm1',
    homeTeam: teams.arsenal,
    awayTeam: teams.manCity,
    homeScore: 2,
    awayScore: 1,
    status: 'LIVE',
    minute: 67,
    league: 'Premier League',
    leagueId: 'epl',
    date: '2026-05-20',
    time: '20:00',
    venue: 'Emirates Stadium',
    events: [
      { id: 'e1', type: 'GOAL', minute: 12, teamId: 'arsenal', playerName: 'Bukayo Saka', assistBy: 'Martin Ødegaard' },
      { id: 'e2', type: 'GOAL', minute: 28, teamId: 'manCity', playerName: 'Erling Haaland', assistBy: 'Kevin De Bruyne' },
      { id: 'e3', type: 'YELLOW_CARD', minute: 35, teamId: 'manCity', playerName: 'Rodri' },
      { id: 'e4', type: 'GOAL', minute: 55, teamId: 'arsenal', playerName: 'Gabriel Jesus', assistBy: 'Bukayo Saka' },
      { id: 'e5', type: 'SUBSTITUTION', minute: 60, teamId: 'manCity', playerName: 'Phil Foden', playerIn: 'Jack Grealish', playerOut: 'Phil Foden' },
    ],
    homePossession: 54,
    awayPossession: 46,
    homeShots: 12,
    awayShots: 8,
    homeShotsOnTarget: 5,
    awayShotsOnTarget: 3,
    homeFouls: 9,
    awayFouls: 11,
    homeCorners: 5,
    awayCorners: 3,
  },
  {
    id: 'm2',
    homeTeam: teams.barca,
    awayTeam: teams.realMadrid,
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    minute: 42,
    league: 'La Liga',
    leagueId: 'laliga',
    date: '2026-05-20',
    time: '21:00',
    venue: 'Camp Nou',
    events: [
      { id: 'e6', type: 'GOAL', minute: 18, teamId: 'barca', playerName: 'Lamine Yamal', assistBy: 'Pedri' },
      { id: 'e7', type: 'GOAL', minute: 33, teamId: 'realMadrid', playerName: 'Vinícius Jr.', assistBy: 'Jude Bellingham' },
      { id: 'e8', type: 'YELLOW_CARD', minute: 38, teamId: 'barca', playerName: 'Gavi' },
    ],
    homePossession: 62,
    awayPossession: 38,
    homeShots: 7,
    awayShots: 5,
    homeShotsOnTarget: 3,
    awayShotsOnTarget: 2,
    homeFouls: 6,
    awayFouls: 8,
    homeCorners: 3,
    awayCorners: 1,
  },
  {
    id: 'm3',
    homeTeam: teams.alAhly,
    awayTeam: teams.zamalek,
    homeScore: 3,
    awayScore: 0,
    status: 'LIVE',
    minute: 78,
    league: 'Egyptian Premier League',
    leagueId: 'egypt',
    date: '2026-05-20',
    time: '19:00',
    venue: 'Cairo International Stadium',
    events: [
      { id: 'e9', type: 'GOAL', minute: 15, teamId: 'alAhly', playerName: 'Mohamed Sherif' },
      { id: 'e10', type: 'GOAL', minute: 34, teamId: 'alAhly', playerName: 'Hussein El Shahat', assistBy: 'Mohamed Sherif' },
      { id: 'e11', type: 'RED_CARD', minute: 55, teamId: 'zamalek', playerName: 'Mahmoud Hamdy' },
      { id: 'e12', type: 'GOAL', minute: 71, teamId: 'alAhly', playerName: 'Mohamed Sherif' },
    ],
    homePossession: 68,
    awayPossession: 32,
    homeShots: 18,
    awayShots: 4,
    homeShotsOnTarget: 8,
    awayShotsOnTarget: 1,
    homeFouls: 7,
    awayFouls: 14,
    homeCorners: 7,
    awayCorners: 2,
  },
  {
    id: 'm4',
    homeTeam: teams.bayern,
    awayTeam: teams.psg,
    homeScore: 2,
    awayScore: 2,
    status: 'HT',
    minute: 45,
    league: 'UEFA Champions League',
    leagueId: 'ucl',
    date: '2026-05-20',
    time: '21:00',
    venue: 'Allianz Arena',
    events: [
      { id: 'e13', type: 'GOAL', minute: 8, teamId: 'bayern', playerName: 'Harry Kane' },
      { id: 'e14', type: 'GOAL', minute: 22, teamId: 'psg', playerName: 'Ousmane Dembélé', assistBy: 'Vitinha' },
      { id: 'e15', type: 'GOAL', minute: 36, teamId: 'bayern', playerName: 'Jamal Musiala', assistBy: 'Leroy Sané' },
      { id: 'e16', type: 'GOAL', minute: 44, teamId: 'psg', playerName: 'Bradley Barcola' },
    ],
    homePossession: 57,
    awayPossession: 43,
    homeShots: 9,
    awayShots: 6,
    homeShotsOnTarget: 4,
    awayShotsOnTarget: 3,
    homeFouls: 5,
    awayFouls: 7,
    homeCorners: 4,
    awayCorners: 2,
  },
  {
    id: 'm5',
    homeTeam: teams.liverpool,
    awayTeam: teams.chelsea,
    homeScore: 0,
    awayScore: 0,
    status: 'LIVE',
    minute: 23,
    league: 'Premier League',
    leagueId: 'epl',
    date: '2026-05-20',
    time: '20:00',
    venue: 'Anfield',
    events: [
      { id: 'e17', type: 'YELLOW_CARD', minute: 14, teamId: 'chelsea', playerName: 'Enzo Fernández' },
    ],
    homePossession: 58,
    awayPossession: 42,
    homeShots: 4,
    awayShots: 2,
    homeShotsOnTarget: 1,
    awayShotsOnTarget: 0,
    homeFouls: 3,
    awayFouls: 5,
    homeCorners: 2,
    awayCorners: 1,
  },
];

export const upcomingMatches: Match[] = [
  {
    id: 'm6',
    homeTeam: teams.inter,
    awayTeam: teams.dortmund,
    homeScore: 0,
    awayScore: 0,
    status: 'UPCOMING',
    league: 'UEFA Champions League',
    leagueId: 'ucl',
    date: '2026-05-20',
    time: '21:00',
    venue: 'San Siro',
    events: [],
  },
  {
    id: 'm7',
    homeTeam: teams.atletico,
    awayTeam: teams.sevilla,
    homeScore: 0,
    awayScore: 0,
    status: 'SCHEDULED',
    league: 'La Liga',
    leagueId: 'laliga',
    date: '2026-05-21',
    time: '20:00',
    venue: 'Metropolitano',
    events: [],
  },
  {
    id: 'm8',
    homeTeam: teams.tottenham,
    awayTeam: teams.newcastle,
    homeScore: 0,
    awayScore: 0,
    status: 'SCHEDULED',
    league: 'Premier League',
    leagueId: 'epl',
    date: '2026-05-21',
    time: '20:00',
    venue: 'Tottenham Hotspur Stadium',
    events: [],
  },
  {
    id: 'm9',
    homeTeam: teams.pyramids,
    awayTeam: teams.ismaily,
    homeScore: 0,
    awayScore: 0,
    status: 'SCHEDULED',
    league: 'Egyptian Premier League',
    leagueId: 'egypt',
    date: '2026-05-21',
    time: '18:00',
    venue: '30 June Stadium',
    events: [],
  },
  {
    id: 'm10',
    homeTeam: teams.astonVilla,
    awayTeam: teams.brighton,
    homeScore: 2,
    awayScore: 1,
    status: 'FT',
    league: 'Premier League',
    leagueId: 'epl',
    date: '2026-05-19',
    time: '15:00',
    venue: 'Villa Park',
    events: [
      { id: 'e18', type: 'GOAL', minute: 11, teamId: 'astonVilla', playerName: 'Ollie Watkins' },
      { id: 'e19', type: 'GOAL', minute: 34, teamId: 'brighton', playerName: 'Kaoru Mitoma' },
      { id: 'e20', type: 'GOAL', minute: 72, teamId: 'astonVilla', playerName: 'Douglas Luiz' },
    ],
  },
  {
    id: 'm11',
    homeTeam: teams.villarreal,
    awayTeam: teams.realSociedad,
    homeScore: 0,
    awayScore: 1,
    status: 'FT',
    league: 'La Liga',
    leagueId: 'laliga',
    date: '2026-05-19',
    time: '18:30',
    venue: 'Estadio de la Cerámica',
    events: [
      { id: 'e21', type: 'GOAL', minute: 66, teamId: 'realSociedad', playerName: 'Mikel Oyarzabal' },
    ],
  },
  {
    id: 'm12',
    homeTeam: teams.westHam,
    awayTeam: teams.manUtd,
    homeScore: 1,
    awayScore: 1,
    status: 'FT',
    league: 'Premier League',
    leagueId: 'epl',
    date: '2026-05-19',
    time: '15:00',
    venue: 'London Stadium',
    events: [
      { id: 'e22', type: 'GOAL', minute: 23, teamId: 'westHam', playerName: 'Jarrod Bowen' },
      { id: 'e23', type: 'GOAL', minute: 58, teamId: 'manUtd', playerName: 'Marcus Rashford' },
    ],
  },
];

export const allMatches: Match[] = [...liveMatches, ...upcomingMatches];

// ==========================================
// STANDINGS
// ==========================================

export const premierLeagueStandings: Standing[] = [
  { rank: 1, team: teams.arsenal, played: 37, won: 28, drawn: 5, lost: 4, goalsFor: 85, goalsAgainst: 28, goalDifference: 57, points: 89, form: ['W','W','D','W','W'] },
  { rank: 2, team: teams.manCity, played: 37, won: 26, drawn: 7, lost: 4, goalsFor: 90, goalsAgainst: 32, goalDifference: 58, points: 85, form: ['W','D','W','W','L'] },
  { rank: 3, team: teams.liverpool, played: 37, won: 24, drawn: 8, lost: 5, goalsFor: 78, goalsAgainst: 35, goalDifference: 43, points: 80, form: ['W','W','L','W','D'] },
  { rank: 4, team: teams.astonVilla, played: 37, won: 22, drawn: 7, lost: 8, goalsFor: 72, goalsAgainst: 42, goalDifference: 30, points: 73, form: ['D','W','W','L','W'] },
  { rank: 5, team: teams.chelsea, played: 37, won: 20, drawn: 9, lost: 8, goalsFor: 68, goalsAgainst: 40, goalDifference: 28, points: 69, form: ['W','L','W','D','W'] },
  { rank: 6, team: teams.newcastle, played: 37, won: 19, drawn: 8, lost: 10, goalsFor: 65, goalsAgainst: 44, goalDifference: 21, points: 65, form: ['L','W','W','D','L'] },
  { rank: 7, team: teams.tottenham, played: 37, won: 18, drawn: 6, lost: 13, goalsFor: 62, goalsAgainst: 50, goalDifference: 12, points: 60, form: ['W','L','L','W','D'] },
  { rank: 8, team: teams.brighton, played: 37, won: 16, drawn: 9, lost: 12, goalsFor: 55, goalsAgainst: 48, goalDifference: 7, points: 57, form: ['D','D','W','L','W'] },
  { rank: 9, team: teams.westHam, played: 37, won: 14, drawn: 10, lost: 13, goalsFor: 50, goalsAgainst: 52, goalDifference: -2, points: 52, form: ['D','L','D','W','L'] },
  { rank: 10, team: teams.manUtd, played: 37, won: 13, drawn: 7, lost: 17, goalsFor: 48, goalsAgainst: 55, goalDifference: -7, points: 46, form: ['L','D','L','W','L'] },
];

export const laLigaStandings: Standing[] = [
  { rank: 1, team: teams.barca, played: 36, won: 27, drawn: 6, lost: 3, goalsFor: 88, goalsAgainst: 30, goalDifference: 58, points: 87, form: ['W','W','W','D','W'] },
  { rank: 2, team: teams.realMadrid, played: 36, won: 26, drawn: 5, lost: 5, goalsFor: 82, goalsAgainst: 33, goalDifference: 49, points: 83, form: ['W','L','W','W','D'] },
  { rank: 3, team: teams.atletico, played: 36, won: 23, drawn: 7, lost: 6, goalsFor: 65, goalsAgainst: 30, goalDifference: 35, points: 76, form: ['D','W','W','L','W'] },
  { rank: 4, team: teams.realSociedad, played: 36, won: 19, drawn: 10, lost: 7, goalsFor: 55, goalsAgainst: 35, goalDifference: 20, points: 67, form: ['W','D','D','W','L'] },
  { rank: 5, team: teams.villarreal, played: 36, won: 17, drawn: 9, lost: 10, goalsFor: 58, goalsAgainst: 45, goalDifference: 13, points: 60, form: ['L','W','D','W','W'] },
  { rank: 6, team: teams.sevilla, played: 36, won: 15, drawn: 10, lost: 11, goalsFor: 45, goalsAgainst: 42, goalDifference: 3, points: 55, form: ['D','D','W','L','D'] },
];

export const egyptianLeagueStandings: Standing[] = [
  { rank: 1, team: teams.alAhly, played: 30, won: 25, drawn: 3, lost: 2, goalsFor: 68, goalsAgainst: 15, goalDifference: 53, points: 78, form: ['W','W','W','W','W'] },
  { rank: 2, team: teams.pyramids, played: 30, won: 20, drawn: 5, lost: 5, goalsFor: 52, goalsAgainst: 25, goalDifference: 27, points: 65, form: ['W','D','W','W','L'] },
  { rank: 3, team: teams.zamalek, played: 30, won: 18, drawn: 6, lost: 6, goalsFor: 48, goalsAgainst: 28, goalDifference: 20, points: 60, form: ['L','W','D','W','W'] },
  { rank: 4, team: teams.ismaily, played: 30, won: 14, drawn: 8, lost: 8, goalsFor: 40, goalsAgainst: 32, goalDifference: 8, points: 50, form: ['D','W','L','D','W'] },
];

export const uclStandings: Standing[] = [
  { rank: 1, team: teams.bayern, played: 12, won: 9, drawn: 2, lost: 1, goalsFor: 32, goalsAgainst: 12, goalDifference: 20, points: 29, form: ['W','W','D','W','W'] },
  { rank: 2, team: teams.barca, played: 12, won: 8, drawn: 2, lost: 2, goalsFor: 28, goalsAgainst: 14, goalDifference: 14, points: 26, form: ['W','D','W','L','W'] },
  { rank: 3, team: teams.inter, played: 12, won: 7, drawn: 3, lost: 2, goalsFor: 22, goalsAgainst: 11, goalDifference: 11, points: 24, form: ['W','W','D','W','D'] },
  { rank: 4, team: teams.arsenal, played: 12, won: 7, drawn: 2, lost: 3, goalsFor: 24, goalsAgainst: 15, goalDifference: 9, points: 23, form: ['W','L','W','W','D'] },
  { rank: 5, team: teams.psg, played: 12, won: 6, drawn: 3, lost: 3, goalsFor: 22, goalsAgainst: 16, goalDifference: 6, points: 21, form: ['D','W','L','W','W'] },
  { rank: 6, team: teams.realMadrid, played: 12, won: 6, drawn: 2, lost: 4, goalsFor: 21, goalsAgainst: 18, goalDifference: 3, points: 20, form: ['L','W','W','D','L'] },
  { rank: 7, team: teams.dortmund, played: 12, won: 5, drawn: 3, lost: 4, goalsFor: 20, goalsAgainst: 19, goalDifference: 1, points: 18, form: ['W','D','L','W','D'] },
  { rank: 8, team: teams.manCity, played: 12, won: 5, drawn: 2, lost: 5, goalsFor: 19, goalsAgainst: 20, goalDifference: -1, points: 17, form: ['L','W','W','L','W'] },
];

export const standingsByLeague: Record<string, Standing[]> = {
  epl: premierLeagueStandings,
  laliga: laLigaStandings,
  ucl: uclStandings,
  egypt: egyptianLeagueStandings,
};

// ==========================================
// TOP SCORERS
// ==========================================

export const topScorers: Record<string, TopScorer[]> = {
  epl: [
    { rank: 1, name: 'Erling Haaland', team: teams.manCity, goals: 28, assists: 5, matches: 35 },
    { rank: 2, name: 'Bukayo Saka', team: teams.arsenal, goals: 22, assists: 12, matches: 36 },
    { rank: 3, name: 'Mohamed Salah', team: teams.liverpool, goals: 20, assists: 8, matches: 35 },
    { rank: 4, name: 'Ollie Watkins', team: teams.astonVilla, goals: 18, assists: 10, matches: 36 },
    { rank: 5, name: 'Cole Palmer', team: teams.chelsea, goals: 17, assists: 7, matches: 34 },
  ],
  laliga: [
    { rank: 1, name: 'Lamine Yamal', team: teams.barca, goals: 24, assists: 11, matches: 34 },
    { rank: 2, name: 'Vinícius Jr.', team: teams.realMadrid, goals: 22, assists: 8, matches: 33 },
    { rank: 3, name: 'Antoine Griezmann', team: teams.atletico, goals: 18, assists: 9, matches: 35 },
  ],
  ucl: [
    { rank: 1, name: 'Harry Kane', team: teams.bayern, goals: 12, assists: 4, matches: 11 },
    { rank: 2, name: 'Lamine Yamal', team: teams.barca, goals: 9, assists: 5, matches: 10 },
    { rank: 3, name: 'Erling Haaland', team: teams.manCity, goals: 8, assists: 2, matches: 10 },
  ],
  egypt: [
    { rank: 1, name: 'Mohamed Sherif', team: teams.alAhly, goals: 20, assists: 5, matches: 28 },
    { rank: 2, name: 'Ahmed Sayed', team: teams.pyramids, goals: 15, assists: 7, matches: 27 },
    { rank: 3, name: 'Mostafa Mohamed', team: teams.zamalek, goals: 13, assists: 3, matches: 26 },
  ],
};

// ==========================================
// NEWS
// ==========================================

export const newsArticles: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Arsenal Extend Lead at the Top After Dramatic Win Over Man City',
    summary: 'Arsenal moved four points clear at the Premier League summit with a thrilling 2-1 victory over Manchester City at the Emirates. Saka opened the scoring before Haaland equalized, but Gabriel Jesus grabbed the winner in the second half.',
    category: 'Match Report',
    league: 'Premier League',
    imageUrl: '',
    date: '2026-05-20',
    readTime: '4 min',
    isBreaking: true,
  },
  {
    id: 'n2',
    title: 'El Clásico Ends Level as Barça and Real Share Spoils',
    summary: 'Lamine Yamal and Vinícius Jr exchanged first-half goals as the latest El Clásico at Camp Nou ended 1-1. Barcelona dominated possession but could not find a breakthrough against a resilient Real Madrid defense.',
    category: 'Match Report',
    league: 'La Liga',
    imageUrl: '',
    date: '2026-05-20',
    readTime: '3 min',
    isBreaking: false,
  },
  {
    id: 'n3',
    title: 'Al Ahly Crush Zamalek in Cairo Derby Dominance',
    summary: 'Mohamed Sherif scored a hat-trick as Al Ahly demolished 10-man Zamalek 3-0 in the Cairo Derby. The Red Devils maintained their commanding lead at the top of the Egyptian Premier League.',
    category: 'Match Report',
    league: 'Egyptian Premier League',
    imageUrl: '',
    date: '2026-05-20',
    readTime: '3 min',
    isBreaking: true,
  },
  {
    id: 'n4',
    title: 'Champions League Semi-Finals: Bayern vs PSG Ends 2-2 in Thriller',
    summary: 'A breathless first half at the Allianz Arena saw four goals as Bayern Munich and PSG played out an enthralling 2-2 draw in the first leg of their Champions League semi-final.',
    category: 'Match Report',
    league: 'UEFA Champions League',
    imageUrl: '',
    date: '2026-05-20',
    readTime: '5 min',
    isBreaking: false,
  },
  {
    id: 'n5',
    title: 'Transfer Window: Man Utd Target Brazilian Wonderkid',
    summary: 'Manchester United are reportedly in advanced negotiations to sign the highly-rated Brazilian forward from Palmeiras. The 18-year-old has a release clause of €60m and is also being monitored by Real Madrid.',
    category: 'Transfer News',
    league: 'Premier League',
    imageUrl: '',
    date: '2026-05-19',
    readTime: '2 min',
    isBreaking: false,
  },
  {
    id: 'n6',
    title: 'Liverpool Boss Confirms New Contract Extension',
    summary: 'Liverpool manager has signed a new long-term contract extension that will keep him at Anfield until 2030. The club confirmed the deal ahead of their crucial Premier League clash against Chelsea.',
    category: 'Club News',
    league: 'Premier League',
    imageUrl: '',
    date: '2026-05-19',
    readTime: '3 min',
    isBreaking: false,
  },
  {
    id: 'n7',
    title: 'La Liga Introduces New Financial Fair Play Rules',
    summary: 'La Liga has announced stricter financial fair play regulations starting next season, including salary caps based on club revenue. The move aims to ensure competitive balance across the league.',
    category: 'League News',
    league: 'La Liga',
    imageUrl: '',
    date: '2026-05-18',
    readTime: '4 min',
    isBreaking: false,
  },
  {
    id: 'n8',
    title: 'Egyptian Premier League Announces Expanded Format for Next Season',
    summary: 'The Egyptian Football Association confirmed the league will expand to 20 teams next season with a new playoff system. The changes are designed to increase competitiveness and match revenue.',
    category: 'League News',
    league: 'Egyptian Premier League',
    imageUrl: '',
    date: '2026-05-18',
    readTime: '3 min',
    isBreaking: false,
  },
];

// ==========================================
// MATCH LINEUPS (for match center)
// ==========================================

export const matchLineups: Record<string, { home: PlayerLineup[]; away: PlayerLineup[] }> = {
  m1: {
    home: [
      { name: 'Raya', position: 'GK', number: 22, isSubstitute: false },
      { name: 'White', position: 'RB', number: 4, isSubstitute: false },
      { name: 'Saliba', position: 'CB', number: 2, isSubstitute: false },
      { name: 'Gabriel', position: 'CB', number: 6, isSubstitute: false },
      { name: 'Zinchenko', position: 'LB', number: 35, isSubstitute: false },
      { name: 'Rice', position: 'CM', number: 41, isSubstitute: false },
      { name: 'Ødegaard', position: 'CM', number: 8, isSubstitute: false },
      { name: 'Havertz', position: 'CM', number: 29, isSubstitute: false },
      { name: 'Saka', position: 'RW', number: 7, isSubstitute: false },
      { name: 'Jesus', position: 'LW', number: 9, isSubstitute: false },
      { name: 'Martinelli', position: 'ST', number: 11, isSubstitute: false },
      { name: 'Ramsdale', position: 'GK', number: 1, isSubstitute: true },
      { name: 'Trossard', position: 'FW', number: 19, isSubstitute: true },
      { name: 'Nketiah', position: 'FW', number: 14, isSubstitute: true },
      { name: 'Tomiyasu', position: 'DF', number: 18, isSubstitute: true },
      { name: 'Jorginho', position: 'MF', number: 20, isSubstitute: true },
    ],
    away: [
      { name: 'Ederson', position: 'GK', number: 31, isSubstitute: false },
      { name: 'Walker', position: 'RB', number: 2, isSubstitute: false },
      { name: 'Dias', position: 'CB', number: 3, isSubstitute: false },
      { name: 'Stones', position: 'CB', number: 5, isSubstitute: false },
      { name: 'Gvardiol', position: 'LB', number: 24, isSubstitute: false },
      { name: 'Rodri', position: 'CDM', number: 16, isSubstitute: false },
      { name: 'De Bruyne', position: 'CM', number: 17, isSubstitute: false },
      { name: 'Bernardo', position: 'CM', number: 20, isSubstitute: false },
      { name: 'Foden', position: 'RW', number: 47, isSubstitute: false },
      { name: 'Haaland', position: 'ST', number: 9, isSubstitute: false },
      { name: 'Grealish', position: 'LW', number: 10, isSubstitute: false },
      { name: 'Ortega', position: 'GK', number: 18, isSubstitute: true },
      { name: 'Álvarez', position: 'FW', number: 19, isSubstitute: true },
      { name: 'Doku', position: 'MF', number: 11, isSubstitute: true },
      { name: 'Akanji', position: 'DF', number: 25, isSubstitute: true },
      { name: 'Kovacic', position: 'MF', number: 8, isSubstitute: true },
    ],
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getStatusBadge(status: MatchStatus, minute?: number): { label: string; color: string } {
  switch (status) {
    case 'LIVE':
      return { label: `${minute}'`, color: 'bg-sports-green text-white' };
    case 'HT':
      return { label: 'HT', color: 'bg-warning-amber text-black' };
    case 'FT':
      return { label: 'FT', color: 'bg-muted text-muted-foreground' };
    case 'UPCOMING':
      return { label: 'SOON', color: 'bg-blue-500 text-white' };
    case 'POSTPONED':
      return { label: 'PPD', color: 'bg-destructive text-white' };
    case 'SCHEDULED':
      return { label: '', color: '' };
    default:
      return { label: '', color: '' };
  }
}

export function getFormColor(result: 'W' | 'D' | 'L'): string {
  switch (result) {
    case 'W': return 'bg-sports-green text-white';
    case 'D': return 'bg-yellow-500 text-black';
    case 'L': return 'bg-destructive text-white';
  }
}
