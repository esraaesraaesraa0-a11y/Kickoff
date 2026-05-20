"use client";

import React from "react";
import { allMatches, getStatusBadge, type Match, type NavTab } from "@/lib/mock-data";
import { Calendar, MapPin, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type DayTab = 'yesterday' | 'today' | 'tomorrow';

interface LiveScoresProps {
  onMatchSelect: (match: Match) => void;
  onTabChange: (tab: NavTab) => void;
}

export function LiveScores({ onMatchSelect, onTabChange }: LiveScoresProps) {
  const [activeDay, setActiveDay] = React.useState<DayTab>('today');
  const [leagueFilter, setLeagueFilter] = React.useState('all');

  const leagueOptions = [
    { id: 'all', label: 'All Leagues' },
    { id: 'epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
    { id: 'laliga', label: '🇪🇸 La Liga' },
    { id: 'ucl', label: '⭐ Champions League' },
    { id: 'egypt', label: '🇪🇬 Egyptian PL' },
  ];

  const dayMatches = React.useMemo(() => {
    let matches = allMatches;
    if (leagueFilter !== 'all') {
      matches = matches.filter(m => m.leagueId === leagueFilter);
    }
    if (activeDay === 'yesterday') {
      return matches.filter(m => m.date === '2026-05-19');
    }
    if (activeDay === 'tomorrow') {
      return matches.filter(m => m.date === '2026-05-21');
    }
    return matches.filter(m => m.date === '2026-05-20');
  }, [activeDay, leagueFilter]);

  const liveCount = dayMatches.filter(m => m.status === 'LIVE' || m.status === 'HT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Live Scores</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time match updates</p>
        </div>
        {liveCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sports-green/10 border border-sports-green/20 w-fit">
            <span className="w-2 h-2 rounded-full bg-sports-green live-pulse" />
            <span className="text-xs font-semibold text-sports-green">{liveCount} Live Match{liveCount > 1 ? 'es' : ''}</span>
          </div>
        )}
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2">
        {(['yesterday', 'today', 'tomorrow'] as DayTab[]).map((day) => (
          <Button
            key={day}
            variant={activeDay === day ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDay(day)}
            className={activeDay === day ? 'bg-sports-green hover:bg-sports-green-dark text-white' : ''}
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Button>
        ))}
      </div>

      {/* League Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        {leagueOptions.map((league) => (
          <button
            key={league.id}
            onClick={() => setLeagueFilter(league.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              leagueFilter === league.id
                ? 'bg-sports-green/15 text-sports-green border-sports-green/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent'
            }`}
          >
            {league.label}
          </button>
        ))}
      </div>

      {/* Matches */}
      {dayMatches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No matches scheduled</p>
          <p className="text-sm mt-1">Try selecting a different day or league</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Group by league */}
          {Object.entries(
            dayMatches.reduce((acc, match) => {
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
                  <div
                    key={match.id}
                    onClick={() => onMatchSelect(match)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                      isLive || isHT
                        ? 'border-sports-green/30 bg-surface/80 hover:border-sports-green/60'
                        : 'border-border/40 bg-card/50 hover:border-border/80 hover:bg-card/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Home Team */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xl">{match.homeTeam.logo}</span>
                        <span className="font-medium text-sm truncate">{match.homeTeam.name}</span>
                      </div>

                      {/* Score / Time */}
                      <div className="flex flex-col items-center shrink-0 px-4">
                        {isLive || isHT || match.status === 'FT' ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>
                              {match.homeScore}
                            </span>
                            <span className="text-muted-foreground">-</span>
                            <span className={`text-xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>
                              {match.awayScore}
                            </span>
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

                      {/* Away Team */}
                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <span className="font-medium text-sm truncate text-right">{match.awayTeam.name}</span>
                        <span className="text-xl">{match.awayTeam.logo}</span>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center justify-center gap-1 mt-2 text-[11px] text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {match.venue}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
