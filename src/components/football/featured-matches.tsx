"use client";

import React from "react";
import { liveMatches, upcomingMatches, getStatusBadge, type Match, type NavTab } from "@/lib/mock-data";
import { Clock, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeaturedMatchesProps {
  onMatchSelect: (match: Match) => void;
  onTabChange: (tab: NavTab) => void;
}

function MatchCard({ match, onSelect }: { match: Match; onSelect: (m: Match) => void }) {
  const badge = getStatusBadge(match.status, match.minute);
  const isLive = match.status === 'LIVE';
  const isHT = match.status === 'HT';
  const isFT = match.status === 'FT';

  return (
    <div
      onClick={() => onSelect(match)}
      className={`group relative rounded-xl border transition-all duration-300 cursor-pointer
        ${isLive || isHT
          ? 'border-sports-green/30 bg-surface/80 hover:border-sports-green/60 hover:shadow-lg hover:shadow-sports-green/5'
          : 'border-border/40 bg-card/50 hover:border-border/80 hover:bg-card/80'
        }`}
    >
      {/* Live indicator strip */}
      {(isLive || isHT) && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sports-green via-sports-green-light to-sports-green rounded-t-xl" />
      )}

      <div className="p-4">
        {/* League & Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground font-medium">{match.league}</span>
          {badge.label && (
            <Badge className={`text-[10px] font-bold px-2 py-0 h-5 ${badge.color} border-0`}>
              {(isLive || isHT) && <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 live-pulse inline-block" />}
              {badge.label}
            </Badge>
          )}
          {match.status === 'UPCOMING' && (
            <Badge className="text-[10px] font-bold px-2 py-0 h-5 bg-blue-500/20 text-blue-400 border-0">
              SOON
            </Badge>
          )}
          {match.status === 'SCHEDULED' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {match.time}
            </div>
          )}
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl shrink-0">{match.homeTeam.logo}</span>
            <span className="font-semibold text-sm truncate">{match.homeTeam.name}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 shrink-0 px-3">
            {isLive || isHT || isFT ? (
              <>
                <span className={`text-2xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>
                  {match.homeScore}
                </span>
                <span className="text-lg text-muted-foreground">-</span>
                <span className={`text-2xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>
                  {match.awayScore}
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground font-medium">vs</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
            <span className="font-semibold text-sm truncate text-right">{match.awayTeam.name}</span>
            <span className="text-2xl shrink-0">{match.awayTeam.logo}</span>
          </div>
        </div>

        {/* Venue & Time */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {match.venue}
          </div>
          <span>{match.time}</span>
        </div>

        {/* Goal Scorers (for live/FT matches) */}
        {(isLive || isHT || isFT) && match.events.filter(e => e.type === 'GOAL').length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/30 space-y-1">
            {match.events.filter(e => e.type === 'GOAL').map((event) => (
              <div key={event.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-sports-green font-bold w-6 text-center">{event.minute}&apos;</span>
                <span>⚽</span>
                <span className="truncate">{event.playerName}</span>
                {event.assistBy && (
                  <span className="text-muted-foreground/60">(ast. {event.assistBy})</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hover Arrow */}
      <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}

export function FeaturedMatches({ onMatchSelect, onTabChange }: FeaturedMatchesProps) {
  const todayLive = liveMatches;
  const todayUpcoming = upcomingMatches.filter(m => m.date === '2026-05-20');
  const finishedToday = upcomingMatches.filter(m => m.status === 'FT');

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Today&apos;s Matches</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Tuesday, May 20, 2026</p>
        </div>
        <button
          onClick={() => onTabChange('livescores')}
          className="text-sm text-sports-green hover:text-sports-green-light font-medium flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Live Matches */}
      {todayLive.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sports-green live-pulse" />
            <h3 className="text-sm font-semibold text-sports-green uppercase tracking-wider">Live Now</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {todayLive.map((match) => (
              <MatchCard key={match.id} match={match} onSelect={onMatchSelect} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Today */}
      {todayUpcoming.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Upcoming Today</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {todayUpcoming.map((match) => (
              <MatchCard key={match.id} match={match} onSelect={onMatchSelect} />
            ))}
          </div>
        </div>
      )}

      {/* Finished Today */}
      {finishedToday.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Finished</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {finishedToday.map((match) => (
              <MatchCard key={match.id} match={match} onSelect={onMatchSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
