"use client";

import React from "react";
import { liveMatches, getStatusBadge } from "@/lib/mock-data";
import { ChevronRight } from "lucide-react";

export function LiveTicker() {
  const tickerMatches = [...liveMatches, ...liveMatches]; // Duplicate for infinite scroll

  return (
    <div className="w-full overflow-hidden bg-surface/50 border-b border-border/30">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center">
          {/* LIVE indicator */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-sports-green/10 border-r border-border/30 shrink-0">
            <span className="w-2 h-2 rounded-full bg-sports-green live-pulse" />
            <span className="text-xs font-bold text-sports-green tracking-wider">LIVE</span>
          </div>

          {/* Scrolling Ticker */}
          <div className="flex-1 overflow-hidden">
            <div className="ticker-animate flex items-center gap-6 whitespace-nowrap py-2 px-4">
              {tickerMatches.map((match, idx) => {
                const badge = getStatusBadge(match.status, match.minute);
                return (
                  <div
                    key={`${match.id}-${idx}`}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:text-sports-green transition-colors"
                  >
                    <span className="text-xs text-muted-foreground font-medium">
                      {match.leagueId.toUpperCase()}
                    </span>
                    <span className="font-medium">{match.homeTeam.shortName}</span>
                    <span className="font-bold text-foreground">
                      {match.homeScore} - {match.awayScore}
                    </span>
                    <span className="font-medium">{match.awayTeam.shortName}</span>
                    {badge.label && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${badge.color}`}>
                        {badge.label}
                      </span>
                    )}
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
