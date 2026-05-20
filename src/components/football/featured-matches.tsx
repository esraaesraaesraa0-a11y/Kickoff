"use client";

import React from "react";
import { useFixtures } from "@/lib/api/hooks";
import { getStatusBadge, type Match, type NavTab } from "@/lib/mock-data";
import { Clock, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
      {(isLive || isHT) && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sports-green via-sports-green-light to-sports-green rounded-t-xl" />
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground font-medium">{match.league}</span>
          {badge.label && (
            <Badge className={`text-[10px] font-bold px-2 py-0 h-5 ${badge.color} border-0`}>
              {(isLive || isHT) && <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 live-pulse inline-block" />}
              {badge.label}
            </Badge>
          )}
          {match.status === 'UPCOMING' && (
            <Badge className="text-[10px] font-bold px-2 py-0 h-5 bg-blue-500/20 text-blue-400 border-0">SOON</Badge>
          )}
          {match.status === 'SCHEDULED' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />{match.time}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {match.homeTeam.logo?.startsWith('http') ? (
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-7 h-7 object-contain" />
            ) : (
              <span className="text-2xl shrink-0">{match.homeTeam.logo}</span>
            )}
            <span className="font-semibold text-sm truncate">{match.homeTeam.name}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0 px-3">
            {isLive || isHT || isFT ? (
              <>
                <span className={`text-2xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>{match.homeScore}</span>
                <span className="text-lg text-muted-foreground">-</span>
                <span className={`text-2xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>{match.awayScore}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground font-medium">vs</span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
            <span className="font-semibold text-sm truncate text-right">{match.awayTeam.name}</span>
            {match.awayTeam.logo?.startsWith('http') ? (
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-7 h-7 object-contain" />
            ) : (
              <span className="text-2xl shrink-0">{match.awayTeam.logo}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{match.venue}</div>
          <span>{match.time}</span>
        </div>

        {(isLive || isHT || isFT) && match.events.filter(e => e.type === 'GOAL').length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/30 space-y-1">
            {match.events.filter(e => e.type === 'GOAL').map((event) => (
              <div key={event.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-sports-green font-bold w-6 text-center">{event.minute}&apos;</span>
                <span>⚽</span>
                <span className="truncate">{event.playerName}</span>
                {event.assistBy && <span className="text-muted-foreground/60">(ast. {event.assistBy})</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function MatchCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-10" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2"><Skeleton className="h-7 w-7 rounded-full" /><Skeleton className="h-4 w-20" /></div>
        <Skeleton className="h-8 w-16" />
        <div className="flex items-center gap-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-7 w-7 rounded-full" /></div>
      </div>
      <div className="flex justify-center mt-3"><Skeleton className="h-3 w-32" /></div>
    </div>
  );
}

export function FeaturedMatches({ onMatchSelect, onTabChange }: FeaturedMatchesProps) {
  const { data: liveData, isLoading: liveLoading } = useFixtures('live');
  const today = new Date().toISOString().split('T')[0];
  const { data: todayData, isLoading: todayLoading } = useFixtures('today', today);

  const liveMatches = liveData?.data || [];
  const todayMatches = todayData?.data || [];
  const upcoming = todayMatches.filter(m => m.status === 'SCHEDULED' || m.status === 'UPCOMING');
  const finished = todayMatches.filter(m => m.status === 'FT');

  const isLoading = liveLoading && todayLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Today&apos;s Matches</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => onTabChange('livescores')}
          className="text-sm text-sports-green hover:text-sports-green-light font-medium flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin text-sports-green" />
            <span className="text-sm text-muted-foreground">Loading matches...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => <MatchCardSkeleton key={i} />)}
          </div>
        </div>
      ) : (
        <>
          {liveMatches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sports-green live-pulse" />
                <h3 className="text-sm font-semibold text-sports-green uppercase tracking-wider">Live Now ({liveMatches.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} onSelect={onMatchSelect} />
                ))}
              </div>
            </div>
          )}

          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Upcoming</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {upcoming.map((match) => (
                  <MatchCard key={match.id} match={match} onSelect={onMatchSelect} />
                ))}
              </div>
            </div>
          )}

          {finished.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Finished</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {finished.map((match) => (
                  <MatchCard key={match.id} match={match} onSelect={onMatchSelect} />
                ))}
              </div>
            </div>
          )}

          {liveMatches.length === 0 && upcoming.length === 0 && finished.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No matches today</p>
              <p className="text-sm mt-1">Check back later or browse other dates</p>
            </div>
          )}
        </>
      )}

      {/* Data source indicator */}
      {(liveData?.source === 'mock' || todayData?.source === 'mock') && (
        <div className="text-center">
          <span className="text-[10px] text-muted-foreground/60 bg-muted/30 px-3 py-1 rounded-full">
            📋 Demo data — Add API key for real live scores
          </span>
        </div>
      )}
    </div>
  );
}
