"use client";

import React from "react";
import { useFixtures } from "@/lib/api/hooks";
import { getStatusBadge, type Match, type NavTab } from "@/lib/mock-data";
import { Calendar, MapPin, Filter, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type DayTab = 'yesterday' | 'today' | 'tomorrow';

interface LiveScoresProps {
  onMatchSelect: (match: Match) => void;
  onTabChange: (tab: NavTab) => void;
}

export function LiveScores({ onMatchSelect, onTabChange }: LiveScoresProps) {
  const [activeDay, setActiveDay] = React.useState<DayTab>('today');
  const [leagueFilter, setLeagueFilter] = React.useState('all');

  const getDateForTab = (tab: DayTab): string => {
    const d = new Date();
    if (tab === 'yesterday') d.setDate(d.getDate() - 1);
    if (tab === 'tomorrow') d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const dateStr = getDateForTab(activeDay);
  const { data: liveData, isLoading: liveLoading } = useFixtures('live');
  const { data: dayData, isLoading: dayLoading } = useFixtures('date', dateStr, leagueFilter !== 'all' ? leagueFilter : undefined);

  const liveMatches = liveData?.data || [];
  const dayMatches = dayData?.data || [];

  // Combine live + day matches, dedup by id
  const allMatches = React.useMemo(() => {
    if (activeDay !== 'today') return dayMatches;
    const liveIds = new Set(liveMatches.map(m => m.id));
    const combined = [...liveMatches, ...dayMatches.filter(m => !liveIds.has(m.id))];
    return leagueFilter === 'all' ? combined : combined.filter(m => m.leagueId === leagueFilter);
  }, [liveMatches, dayMatches, activeDay, leagueFilter]);

  const isLoading = liveLoading && dayLoading;
  const liveCount = allMatches.filter(m => m.status === 'LIVE' || m.status === 'HT').length;

  const leagueOptions = [
    { id: 'all', label: 'All Leagues' },
    { id: 'epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
    { id: 'laliga', label: '🇪🇸 La Liga' },
    { id: 'ucl', label: '⭐ Champions League' },
    { id: 'egypt', label: '🇪🇬 Egyptian PL' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Live Scores</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time match updates</p>
        </div>
        {liveCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sports-green/10 border border-sports-green/20 w-fit">
            <span className="w-2 h-2 rounded-full bg-sports-green live-pulse" />
            <span className="text-xs font-semibold text-sports-green">{liveCount} Live</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {(['yesterday', 'today', 'tomorrow'] as DayTab[]).map((day) => (
          <Button key={day} variant={activeDay === day ? 'default' : 'ghost'} size="sm"
            onClick={() => setActiveDay(day)}
            className={activeDay === day ? 'bg-sports-green hover:bg-sports-green-dark text-white' : ''}>
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        {leagueOptions.map((league) => (
          <button key={league.id} onClick={() => setLeagueFilter(league.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              leagueFilter === league.id ? 'bg-sports-green/15 text-sports-green border-sports-green/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent'
            }`}>
            {league.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-sports-green" />
            <span className="text-sm">Loading matches...</span>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-card/50 p-4 space-y-3">
              <Skeleton className="h-3 w-24" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-4 w-20" /></div>
                <Skeleton className="h-6 w-16" />
                <div className="flex items-center gap-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-6 rounded-full" /></div>
              </div>
            </div>
          ))}
        </div>
      ) : allMatches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No matches found</p>
          <p className="text-sm mt-1">Try a different day or league filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(
            allMatches.reduce((acc, match) => {
              if (!acc[match.league]) acc[match.league] = [];
              acc[match.league].push(match);
              return acc;
            }, {} as Record<string, Match[]>)
          ).map(([leagueName, matches]) => (
            <div key={leagueName} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{leagueName}</span>
                <div className="flex-1 h-px bg-border/30" />
              </div>
              {matches.map((match) => {
                const badge = getStatusBadge(match.status, match.minute);
                const isLive = match.status === 'LIVE';
                const isHT = match.status === 'HT';
                return (
                  <div key={match.id} onClick={() => onMatchSelect(match)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                      isLive || isHT ? 'border-sports-green/30 bg-surface/80 hover:border-sports-green/60' : 'border-border/40 bg-card/50 hover:border-border/80 hover:bg-card/80'
                    }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {match.homeTeam.logo?.startsWith('http') ? (
                          <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-6 h-6 object-contain" />
                        ) : (
                          <span className="text-xl">{match.homeTeam.logo}</span>
                        )}
                        <span className="font-medium text-sm truncate">{match.homeTeam.name}</span>
                      </div>
                      <div className="flex flex-col items-center shrink-0 px-4">
                        {isLive || isHT || match.status === 'FT' ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>{match.homeScore}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className={`text-xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>{match.awayScore}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">{match.time}</span>
                        )}
                        {badge.label && (
                          <Badge className={`text-[9px] font-bold px-1.5 py-0 h-4 mt-1 ${badge.color} border-0`}>
                            {(isLive || isHT) && <span className="w-1 h-1 rounded-full bg-white mr-1 live-pulse inline-block" />}
                            {badge.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <span className="font-medium text-sm truncate text-right">{match.awayTeam.name}</span>
                        {match.awayTeam.logo?.startsWith('http') ? (
                          <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-6 h-6 object-contain" />
                        ) : (
                          <span className="text-xl">{match.awayTeam.logo}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2 text-[11px] text-muted-foreground">
                      <MapPin className="w-3 h-3" />{match.venue}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {(liveData?.source === 'mock' || dayData?.source === 'mock') && (
        <div className="text-center">
          <span className="text-[10px] text-muted-foreground/60 bg-muted/30 px-3 py-1 rounded-full">
            📋 Demo data — Add API key for real live scores
          </span>
        </div>
      )}
    </div>
  );
}
