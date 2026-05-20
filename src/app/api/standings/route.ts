import { NextRequest, NextResponse } from "next/server";
import { getStandings, getTopScorers, mapStandings, mapTopScorers, LEAGUE_IDS } from "@/lib/api/football-api";
import { standingsByLeague, topScorers as mockTopScorers } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const leagueId = searchParams.get('league') || 'epl';
  const includeScorers = searchParams.get('scorers') === 'true';

  const apiLeagueId = LEAGUE_IDS[leagueId as keyof typeof LEAGUE_IDS] || LEAGUE_IDS.epl;

  try {
    const standingsData = await getStandings(apiLeagueId);
    const standings = mapStandings(standingsData.league.standings);

    let scorers = null;
    if (includeScorers) {
      try {
        const scorersData = await getTopScorers(apiLeagueId);
        scorers = mapTopScorers(scorersData);
      } catch {
        scorers = mockTopScorers[leagueId] || [];
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        league: standingsData.league,
        standings,
        scorers,
      },
      source: 'api',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message === 'API_KEY_NOT_CONFIGURED') {
      return NextResponse.json({
        success: true,
        data: {
          league: { id: apiLeagueId, name: leagueId === 'epl' ? 'Premier League' : leagueId === 'laliga' ? 'La Liga' : leagueId === 'ucl' ? 'Champions League' : 'Egyptian Premier League' },
          standings: standingsByLeague[leagueId] || [],
          scorers: includeScorers ? (mockTopScorers[leagueId] || []) : null,
        },
        source: 'mock',
        warning: 'Using demo data. Add your free API-Football key to .env for real data.',
      });
    }

    return NextResponse.json({
      success: false,
      error: message,
      data: {
        league: { id: apiLeagueId, name: leagueId },
        standings: standingsByLeague[leagueId] || [],
        scorers: includeScorers ? (mockTopScorers[leagueId] || []) : null,
      },
      source: 'mock-fallback',
    });
  }
}
