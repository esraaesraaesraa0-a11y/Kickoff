"use client";

import React from "react";
import { standingsByLeague, leagues, topScorers, getFormColor } from "@/lib/mock-data";
import { Trophy, Target, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FullStandings() {
  const [selectedLeague, setSelectedLeague] = React.useState('epl');
  const standings = standingsByLeague[selectedLeague] || [];
  const scorers = topScorers[selectedLeague] || [];
  const currentLeague = leagues.find(l => l.id === selectedLeague);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">League Standings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Complete tables and top scorers</p>
      </div>

      {/* League Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => setSelectedLeague(league.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
              selectedLeague === league.id
                ? 'bg-sports-green/15 text-sports-green border-sports-green/30 shadow-sm shadow-sports-green/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border/40'
            }`}
          >
            <span className="text-lg">{league.logo}</span>
            <div className="text-left">
              <div className="text-xs font-semibold">{league.name}</div>
              <div className="text-[10px] opacity-70">{league.country}</div>
            </div>
          </button>
        ))}
      </div>

      <Tabs defaultValue="standings" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="standings" className="text-xs">
            <Trophy className="w-3.5 h-3.5 mr-1.5" />
            Standings
          </TabsTrigger>
          <TabsTrigger value="scorers" className="text-xs">
            <Target className="w-3.5 h-3.5 mr-1.5" />
            Top Scorers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="mt-4">
          <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border/30 bg-muted/20">
                    <th className="text-left py-3 px-4 font-medium w-10">#</th>
                    <th className="text-left py-3 px-3 font-medium">Club</th>
                    <th className="text-center py-3 px-2 font-medium">MP</th>
                    <th className="text-center py-3 px-2 font-medium">W</th>
                    <th className="text-center py-3 px-2 font-medium">D</th>
                    <th className="text-center py-3 px-2 font-medium">L</th>
                    <th className="text-center py-3 px-2 font-medium">GF</th>
                    <th className="text-center py-3 px-2 font-medium">GA</th>
                    <th className="text-center py-3 px-2 font-medium">GD</th>
                    <th className="text-center py-3 px-3 font-medium">Pts</th>
                    <th className="text-center py-3 px-3 font-medium">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row) => (
                    <tr
                      key={row.rank}
                      className="border-b border-border/10 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-md text-[11px] font-bold ${
                          row.rank <= 4
                            ? 'bg-sports-green/15 text-sports-green'
                            : row.rank <= 6
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'text-muted-foreground'
                        }`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{row.team.logo}</span>
                          <span className="font-semibold text-sm">{row.team.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center text-sm">{row.played}</td>
                      <td className="py-3 px-2 text-center text-sm font-medium">{row.won}</td>
                      <td className="py-3 px-2 text-center text-sm text-muted-foreground">{row.drawn}</td>
                      <td className="py-3 px-2 text-center text-sm text-muted-foreground">{row.lost}</td>
                      <td className="py-3 px-2 text-center text-sm">{row.goalsFor}</td>
                      <td className="py-3 px-2 text-center text-sm text-muted-foreground">{row.goalsAgainst}</td>
                      <td className="py-3 px-2 text-center text-sm font-medium">
                        <span className={row.goalDifference > 0 ? 'text-sports-green' : row.goalDifference < 0 ? 'text-destructive' : ''}>
                          {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-sm font-bold">{row.points}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 justify-center">
                          {row.form.map((result, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold ${getFormColor(result)}`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="p-3 border-t border-border/20 flex items-center gap-4 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sports-green/15 border border-sports-green/30" />
                Champions League
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500/15 border border-blue-500/30" />
                Europa League
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scorers" className="mt-4">
          <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
            <div className="p-4 border-b border-border/30 flex items-center gap-2">
              <Award className="w-4 h-4 text-sports-green" />
              <h3 className="font-bold text-sm">Top Scorers - {currentLeague?.name}</h3>
            </div>
            <div className="divide-y divide-border/10">
              {scorers.map((scorer) => (
                <div key={scorer.rank} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${
                    scorer.rank === 1 ? 'bg-yellow-500/15 text-yellow-500' :
                    scorer.rank === 2 ? 'bg-gray-400/15 text-gray-400' :
                    scorer.rank === 3 ? 'bg-amber-600/15 text-amber-600' :
                    'bg-muted/30 text-muted-foreground'
                  }`}>
                    {scorer.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{scorer.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base">{scorer.team.logo}</span>
                      <span className="text-xs text-muted-foreground">{scorer.team.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-sports-green">{scorer.goals}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {scorer.assists}A • {scorer.matches}MP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
