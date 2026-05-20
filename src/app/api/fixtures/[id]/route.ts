import { NextRequest, NextResponse } from "next/server";
import { getFixtureDetails, mapFixtureToMatch, mapEventsToMatchEvents } from "@/lib/api/football-api";
import { liveMatches, matchLineups, type Match } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const details = await getFixtureDetails(Number(id));
    const match = mapFixtureToMatch(details.fixture);

    // Enrich with real events
    match.events = mapEventsToMatchEvents(details.events);

    // Enrich with real statistics
    if (details.statistics.length >= 2) {
      const homeStats = details.statistics[0].statistics;
      const awayStats = details.statistics[1].statistics;

      const getStatValue = (stats: typeof homeStats, type: string) => {
        const stat = stats.find(s => s.type === type);
        return typeof stat?.value === 'number' ? stat.value : undefined;
      };

      match.homePossession = getStatValue(homeStats, 'Ball Possession') !== undefined
        ? Number(String(getStatValue(homeStats, 'Ball Possession')).replace('%', ''))
        : undefined;
      match.awayPossession = getStatValue(awayStats, 'Ball Possession') !== undefined
        ? Number(String(getStatValue(awayStats, 'Ball Possession')).replace('%', ''))
        : undefined;
      match.homeShots = getStatValue(homeStats, 'Total Shots');
      match.awayShots = getStatValue(awayStats, 'Total Shots');
      match.homeShotsOnTarget = getStatValue(homeStats, 'Shots on Goal');
      match.awayShotsOnTarget = getStatValue(awayStats, 'Shots on Goal');
      match.homeFouls = getStatValue(homeStats, 'Fouls');
      match.awayFouls = getStatValue(awayStats, 'Fouls');
      match.homeCorners = getStatValue(homeStats, 'Corner Kicks');
      match.awayCorners = getStatValue(awayStats, 'Corner Kicks');
    }

    // Map lineups
    const lineups = details.lineups.length >= 2 ? {
      home: details.lineups[0].startXI.map(p => ({
        name: p.name,
        position: p.pos,
        number: p.number || 0,
        isSubstitute: false,
      })).concat(details.lineups[0].substitutes.map(p => ({
        name: p.name,
        position: p.pos,
        number: p.number || 0,
        isSubstitute: true,
      }))),
      away: details.lineups[1].startXI.map(p => ({
        name: p.name,
        position: p.pos,
        number: p.number || 0,
        isSubstitute: false,
      })).concat(details.lineups[1].substitutes.map(p => ({
        name: p.name,
        position: p.pos,
        number: p.number || 0,
        isSubstitute: true,
      }))),
    } : null;

    return NextResponse.json({
      success: true,
      data: { match, lineups },
      source: 'api',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    // Fall back to mock data
    const mockMatch = liveMatches.find(m => m.id === id) || liveMatches[0];
    const mockLineup = matchLineups[id] || null;

    if (message === 'API_KEY_NOT_CONFIGURED') {
      return NextResponse.json({
        success: true,
        data: { match: mockMatch, lineups: mockLineup },
        source: 'mock',
        warning: 'Using demo data. Add your free API-Football key for real match details.',
      });
    }

    return NextResponse.json({
      success: false,
      error: message,
      data: { match: mockMatch, lineups: mockLineup },
      source: 'mock-fallback',
    });
  }
}
