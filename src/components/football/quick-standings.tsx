"use client";

import React from "react";
import { useStandings } from "@/lib/api/hooks";
import { leagues, getFormColor, type NavTab } from "@/lib/mock-data";
import { ChevronRight, TrendingUp, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuickStandingsProps {
  onTabChange: (tab: NavTab) => void;
}

export function QuickStandings({ onTabChange }: QuickStandingsProps) {
  const [selectedLeague, setSelectedLeague] = React.useState('epl');
  const { data, isLoading } = useStandings(selectedLeague);
  const standings = data?.data?.standings || [];
  const isMock = data?.source === 'mock' || data?.source === 'mock-fallback';

  return (
    <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sports-green" />
            <h3 className="font-bold text-sm">League Standings</h3>
            {isMock && <span className="text-[9px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">DEMO</span>}
          </div>
          <button onClick={() => onTabChange('standings')} className="text-xs text-sports-green hover:text-sports-green-light font-medium flex items-center gap-0.5 transition-colors">
            Full Table <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1">
          {leagues.map((league) => (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedLeague === league.id
                  ? 'bg-sports-green/15 text-sports-green border border-sports-green/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
              }`}
            >
              {league.logo} {league.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <div className="flex-1" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border/20">
                <th className="text-left py-2 px-4 font-medium w-8">#</th>
                <th className="text-left py-2 px-2 font-medium">Team</th>
                <th className="text-center py-2 px-2 font-medium">P</th>
                <th className="text-center py-2 px-2 font-medium">W</th>
                <th className="text-center py-2 px-2 font-medium">D</th>
                <th className="text-center py-2 px-2 font-medium">L</th>
                <th className="text-center py-2 px-2 font-medium">GD</th>
                <th className="text-center py-2 px-3 font-medium">Pts</th>
                <th className="text-center py-2 px-2 font-medium">Form</th>
              </tr>
            </thead>
            <tbody>
              {standings.slice(0, 6).map((row) => (
                <tr key={row.rank} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-4">
                    <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${
                      row.rank <= 4 ? 'bg-sports-green/15 text-sports-green' : 'text-muted-foreground'
                    }`}>{row.rank}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      {row.team.logo?.startsWith('http') ? (
                        <img src={row.team.logo} alt={row.team.name} className="w-5 h-5 object-contain" />
                      ) : (
                        <span className="text-base">{row.team.logo}</span>
                      )}
                      <span className="font-medium text-xs truncate max-w-[100px]">{row.team.shortName || row.team.name.substring(0, 3)}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center text-xs text-muted-foreground">{row.played}</td>
                  <td className="py-2.5 px-2 text-center text-xs">{row.won}</td>
                  <td className="py-2.5 px-2 text-center text-xs text-muted-foreground">{row.drawn}</td>
                  <td className="py-2.5 px-2 text-center text-xs text-muted-foreground">{row.lost}</td>
                  <td className="py-2.5 px-2 text-center text-xs font-medium">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                  <td className="py-2.5 px-3 text-center text-xs font-bold">{row.points}</td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-0.5 justify-center">
                      {row.form?.map((result, i) => (
                        <span key={i} className={`w-4 h-4 flex items-center justify-center rounded text-[8px] font-bold ${getFormColor(result)}`}>{result}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-3 border-t border-border/20 text-center">
        <span className="text-[10px] text-muted-foreground">
          {leagues.find(l => l.id === selectedLeague)?.logo} {leagues.find(l => l.id === selectedLeague)?.name}
        </span>
      </div>
    </div>
  );
}
