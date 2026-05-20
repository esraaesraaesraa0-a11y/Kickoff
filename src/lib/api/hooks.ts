"use client";

import { useQuery } from "@tanstack/react-query";
import { type Match, type Standing, type TopScorer, type MatchEvent, type PlayerLineup } from "@/lib/mock-data";
import { leagues } from "@/lib/mock-data";

// ==========================================
// FETCH HELPERS
// ==========================================

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

// ==========================================
// FIXTURES HOOKS
// ==========================================

interface FixturesResponse {
  success: boolean;
  data: Match[];
  source: 'api' | 'mock' | 'mock-fallback';
  warning?: string;
  count: number;
}

export function useFixtures(type: 'live' | 'today' | 'date' = 'today', date?: string, leagueId?: string) {
  const today = new Date().toISOString().split('T')[0];
  const params = new URLSearchParams({ type });
  if (date) params.set('date', date);
  if (leagueId) params.set('league', leagueId);

  return useQuery({
    queryKey: ['fixtures', type, date || today, leagueId],
    queryFn: () => fetchJSON<FixturesResponse>(`/api/fixtures?${params.toString()}`),
    select: (data) => data,
    refetchInterval: type === 'live' ? 30000 : 120000, // 30s for live, 2min for others
  });
}

// ==========================================
// STANDINGS HOOKS
// ==========================================

interface StandingsResponse {
  success: boolean;
  data: {
    league: {
      id: number;
      name: string;
      country?: string;
      logo?: string;
      flag?: string;
      season?: number;
    };
    standings: Standing[];
    scorers: TopScorer[] | null;
  };
  source: 'api' | 'mock' | 'mock-fallback';
  warning?: string;
}

export function useStandings(leagueId: string, includeScorers = false) {
  const params = new URLSearchParams({ league: leagueId });
  if (includeScorers) params.set('scorers', 'true');

  return useQuery({
    queryKey: ['standings', leagueId, includeScorers],
    queryFn: () => fetchJSON<StandingsResponse>(`/api/standings?${params.toString()}`),
    select: (data) => data,
    refetchInterval: 300000, // 5min
  });
}

// ==========================================
// FIXTURE DETAIL HOOK
// ==========================================

interface FixtureDetailResponse {
  success: boolean;
  data: {
    match: Match;
    lineups: {
      home: PlayerLineup[];
      away: PlayerLineup[];
    } | null;
  };
  source: 'api' | 'mock' | 'mock-fallback';
  warning?: string;
}

export function useFixtureDetail(fixtureId: string | null) {
  return useQuery({
    queryKey: ['fixture-detail', fixtureId],
    queryFn: () => fetchJSON<FixtureDetailResponse>(`/api/fixtures/${fixtureId}`),
    enabled: !!fixtureId,
    select: (data) => data,
    refetchInterval: 30000, // 30s for live match details
  });
}

// ==========================================
// NEWS HOOK (using web search for real news)
// ==========================================

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  league: string;
  date: string;
  readTime: string;
  isBreaking: boolean;
  url?: string;
}

// We'll use the existing mock news for now, but could integrate with a news API
export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      // Return mock news - can be replaced with a real news API
      const { newsArticles } = await import('@/lib/mock-data');
      return newsArticles;
    },
    refetchInterval: 600000, // 10min
  });
}

// ==========================================
// HOOK RETURN TYPE HELPERS
// ==========================================

export type UseFixturesReturn = ReturnType<typeof useFixtures>;
export type UseStandingsReturn = ReturnType<typeof useStandings>;
export type UseFixtureDetailReturn = ReturnType<typeof useFixtureDetail>;
