"use client";

import React from "react";
import { useFixtureDetail, useFixtures } from "@/lib/api/hooks";
import { getStatusBadge, type Match } from "@/lib/mock-data";
import { ArrowLeft, BarChart3, Users, Clock, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface MatchCenterProps {
  match: Match;
  onBack: () => void;
}

export function MatchCenter({ match, onBack }: MatchCenterProps) {
  // Fetch full match details from API
  const { data: detailData, isLoading: detailLoading } = useFixtureDetail(match.id);

  // Use API data if available, otherwise use the match passed in
  const liveMatch = detailData?.data?.match || match;
  const lineups = detailData?.data?.lineups;
  const isLive = liveMatch.status === 'LIVE';
  const isHT = liveMatch.status === 'HT';

  // Parse statistics from API if available
  const homePossession = liveMatch.homePossession;
  const awayPossession = liveMatch.awayPossession;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to matches
      </button>

      {/* Match Header */}
      <div className={`rounded-xl border p-6 ${
        isLive || isHT ? 'border-sports-green/30 bg-gradient-to-br from-surface via-surface/90 to-sports-green/5' : 'border-border/40 bg-card/50'
      }`}>
        <div className="text-center text-xs text-muted-foreground font-medium mb-4">{liveMatch.league}</div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            {liveMatch.homeTeam.logo?.startsWith('http') ? (
              <img src={liveMatch.homeTeam.logo} alt={liveMatch.homeTeam.name} className="w-14 h-14 object-contain" />
            ) : (
              <span className="text-4xl">{liveMatch.homeTeam.logo}</span>
            )}
            <span className="font-bold text-base text-center">{liveMatch.homeTeam.name}</span>
          </div>

          <div className="flex flex-col items-center gap-2 px-6">
            {(isLive || isHT || liveMatch.status === 'FT') ? (
              <div className="flex items-center gap-3">
                <span className={`text-4xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>{liveMatch.homeScore}</span>
                <span className="text-2xl text-muted-foreground">-</span>
                <span className={`text-4xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>{liveMatch.awayScore}</span>
              </div>
            ) : (
              <span className="text-xl text-muted-foreground font-medium">vs</span>
            )}
            {(isLive || isHT) && (
              <Badge className="bg-sports-green text-white border-0 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 live-pulse inline-block" />
                {isHT ? 'Half Time' : `${liveMatch.minute}'`}
              </Badge>
            )}
            {liveMatch.status === 'FT' && <Badge variant="secondary" className="text-xs">Full Time</Badge>}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            {liveMatch.awayTeam.logo?.startsWith('http') ? (
              <img src={liveMatch.awayTeam.logo} alt={liveMatch.awayTeam.name} className="w-14 h-14 object-contain" />
            ) : (
              <span className="text-4xl">{liveMatch.awayTeam.logo}</span>
            )}
            <span className="font-bold text-base text-center">{liveMatch.awayTeam.name}</span>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4">
          📍 {liveMatch.venue} • {liveMatch.date} • {liveMatch.time}
        </div>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="bg-muted/50 w-full justify-start">
          <TabsTrigger value="timeline" className="text-xs flex-1 sm:flex-none"><Clock className="w-3.5 h-3.5 mr-1.5" />Timeline</TabsTrigger>
          <TabsTrigger value="stats" className="text-xs flex-1 sm:flex-none"><BarChart3 className="w-3.5 h-3.5 mr-1.5" />Statistics</TabsTrigger>
          <TabsTrigger value="lineups" className="text-xs flex-1 sm:flex-none"><Users className="w-3.5 h-3.5 mr-1.5" />Lineups</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-4">
          <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
            <div className="p-4 border-b border-border/30"><h3 className="font-bold text-sm">Match Events</h3></div>
            {detailLoading ? (
              <div className="p-6 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Loading events...</span>
              </div>
            ) : liveMatch.events.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No events yet — match hasn&apos;t started</div>
            ) : (
              <div className="divide-y divide-border/10">
                {liveMatch.events.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 hover:bg-muted/10 transition-colors">
                    <span className="w-10 text-right text-xs font-bold text-sports-green tabular-nums">{event.minute}&apos;</span>
                    <span className="text-base">
                      {event.type === 'GOAL' ? '⚽' : event.type === 'YELLOW_CARD' ? '🟨' : event.type === 'RED_CARD' ? '🟥' : event.type === 'SUBSTITUTION' ? '🔄' : '•'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{event.playerName}</span>
                        {event.type === 'GOAL' && <span className="text-xs text-sports-green font-bold">GOAL</span>}
                        {event.type === 'YELLOW_CARD' && <span className="text-xs text-yellow-500 font-bold">Yellow Card</span>}
                        {event.type === 'RED_CARD' && <span className="text-xs text-destructive font-bold">Red Card</span>}
                        {event.type === 'SUBSTITUTION' && (
                          <span className="text-xs text-muted-foreground">
                            <span className="text-sports-green">{event.playerIn}</span> ↔ <span className="text-destructive">{event.playerOut}</span>
                          </span>
                        )}
                      </div>
                      {event.assistBy && event.type === 'GOAL' && <span className="text-xs text-muted-foreground">Assist: {event.assistBy}</span>}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {event.teamId === liveMatch.homeTeam.id ? liveMatch.homeTeam.shortName : liveMatch.awayTeam.shortName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
            <div className="p-4 border-b border-border/30"><h3 className="font-bold text-sm">Match Statistics</h3></div>
            {homePossession !== undefined ? (
              <div className="divide-y divide-border/10">
                <StatBar label="Possession" homeValue={`${homePossession}%`} awayValue={`${awayPossession}%`} homePercent={homePossession!} awayPercent={awayPossession!} />
                {liveMatch.homeShots !== undefined && <StatBar label="Shots" homeValue={`${liveMatch.homeShots}`} awayValue={`${liveMatch.awayShots}`} homePercent={(liveMatch.homeShots! / (liveMatch.homeShots! + liveMatch.awayShots!)) * 100} awayPercent={(liveMatch.awayShots! / (liveMatch.homeShots! + liveMatch.awayShots!)) * 100} />}
                {liveMatch.homeShotsOnTarget !== undefined && <StatBar label="Shots on Target" homeValue={`${liveMatch.homeShotsOnTarget}`} awayValue={`${liveMatch.awayShotsOnTarget}`} homePercent={(liveMatch.homeShotsOnTarget! / Math.max(liveMatch.homeShotsOnTarget! + liveMatch.awayShotsOnTarget!, 1)) * 100} awayPercent={(liveMatch.awayShotsOnTarget! / Math.max(liveMatch.homeShotsOnTarget! + liveMatch.awayShotsOnTarget!, 1)) * 100} />}
                {liveMatch.homeFouls !== undefined && <StatBar label="Fouls" homeValue={`${liveMatch.homeFouls}`} awayValue={`${liveMatch.awayFouls}`} homePercent={(liveMatch.homeFouls! / (liveMatch.homeFouls! + liveMatch.awayFouls!)) * 100} awayPercent={(liveMatch.awayFouls! / (liveMatch.homeFouls! + liveMatch.awayFouls!)) * 100} invertHighlight />}
                {liveMatch.homeCorners !== undefined && <StatBar label="Corners" homeValue={`${liveMatch.homeCorners}`} awayValue={`${liveMatch.awayCorners}`} homePercent={(liveMatch.homeCorners! / Math.max(liveMatch.homeCorners! + liveMatch.awayCorners!, 1)) * 100} awayPercent={(liveMatch.awayCorners! / Math.max(liveMatch.homeCorners! + liveMatch.awayCorners!, 1)) * 100} />}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">Statistics will be available once the match starts</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="lineups" className="mt-4">
          {lineups ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{ data: lineups.home, team: liveMatch.homeTeam }, { data: lineups.away, team: liveMatch.awayTeam }].map(({ data: lineup, team }) => (
                <div key={team.id} className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
                  <div className="p-4 border-b border-border/30 flex items-center gap-2">
                    {team.logo?.startsWith('http') ? <img src={team.logo} alt={team.name} className="w-6 h-6 object-contain" /> : <span className="text-xl">{team.logo}</span>}
                    <h3 className="font-bold text-sm">{team.name}</h3>
                  </div>
                  <div className="divide-y divide-border/10">
                    {lineup.filter(p => !p.isSubstitute).map((player) => (
                      <div key={player.number} className="flex items-center gap-3 p-3">
                        <span className="w-7 h-7 flex items-center justify-center rounded-md bg-sports-green/10 text-sports-green text-xs font-bold">{player.number}</span>
                        <div><p className="text-sm font-medium">{player.name}</p><p className="text-[10px] text-muted-foreground">{player.position}</p></div>
                      </div>
                    ))}
                    <div className="p-3 bg-muted/10">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Substitutes</p>
                      {lineup.filter(p => p.isSubstitute).map((player) => (
                        <div key={player.number} className="flex items-center gap-3 py-1.5">
                          <span className="w-6 h-6 flex items-center justify-center rounded-md bg-muted/30 text-muted-foreground text-[10px] font-bold">{player.number}</span>
                          <p className="text-xs text-muted-foreground">{player.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 bg-card/50 p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium text-muted-foreground">Lineups not available</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Lineups are usually released 1 hour before kickoff</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatBar({ label, homeValue, awayValue, homePercent, awayPercent, invertHighlight = false }: {
  label: string; homeValue: string; awayValue: string; homePercent: number; awayPercent: number; invertHighlight?: boolean;
}) {
  const homeIsBetter = invertHighlight ? homePercent < awayPercent : homePercent > awayPercent;
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-bold tabular-nums ${homeIsBetter ? 'text-sports-green' : ''}`}>{homeValue}</span>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${!homeIsBetter ? 'text-sports-green' : ''}`}>{awayValue}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${homeIsBetter ? 'bg-sports-green' : 'bg-muted-foreground/50'}`} style={{ width: `${homePercent}%` }} />
        </div>
        <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden flex justify-end">
          <div className={`h-full rounded-full transition-all duration-500 ${!homeIsBetter ? 'bg-sports-green' : 'bg-muted-foreground/50'}`} style={{ width: `${awayPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
