import { NextRequest, NextResponse } from "next/server";
import { getFixturesByDate, getLiveFixtures, mapFixtureToMatch } from "@/lib/api/football-api";
import { allMatches, liveMatches as mockLiveMatches, upcomingMatches as mockUpcoming } from "@/lib/mock-data";
import { type Match } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'today'; // 'live', 'today', 'date'
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const leagueId = searchParams.get('league');

  try {
    let fixtures;

    if (type === 'live') {
      fixtures = await getLiveFixtures();
    } else {
      fixtures = await getFixturesByDate(date, leagueId ? Number(leagueId) : undefined);
    }

    const matches: Match[] = fixtures.map(mapFixtureToMatch);

    // Enrich live matches with events from mock data as API events need separate calls
    return NextResponse.json({
      success: true,
      data: matches,
      source: 'api',
      count: matches.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    // If API key not configured, fall back to mock data
    if (message === 'API_KEY_NOT_CONFIGURED') {
      let matches: Match[];
      if (type === 'live') {
        matches = mockLiveMatches;
      } else if (date === new Date().toISOString().split('T')[0]) {
        matches = allMatches.filter(m => m.date === date);
      } else {
        matches = allMatches;
      }

      return NextResponse.json({
        success: true,
        data: matches,
        source: 'mock',
        warning: 'Using demo data. Add your free API-Football key to .env for real live data.',
        count: matches.length,
      });
    }

    return NextResponse.json({
      success: false,
      error: message,
      data: allMatches,
      source: 'mock-fallback',
    }, { status: 200 }); // Return 200 with mock data instead of error
  }
}
