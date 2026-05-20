"use client";

import React from "react";
import { liveMatches, matchLineups, type Match } from "@/lib/mock-data";
import { ArrowLeft, BarChart3, Users, Clock, Target, Frown, CornerUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MatchCenterProps {
  match: Match;
  onBack: () => void;
}

export function MatchCenter({ match, onBack }: MatchCenterProps) {
  const isLive = match.status === 'LIVE';
  const isHT = match.status === 'HT';
  const lineupData = matchLineups[match.id];
  const homeLineup = lineupData?.home || [];
  const awayLineup = lineupData?.away || [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to matches
      </button>

      {/* Match Header */}
      <div className={`rounded-xl border p-6 ${
        isLive || isHT ? 'border-sports-green/30 bg-gradient-to-br from-surface via-surface/90 to-sports-green/5' : 'border-border/40 bg-card/50'
      }`}>
        {/* League */}
        <div className="text-center text-xs text-muted-foreground font-medium mb-4">{match.league}</div>

        {/* Teams & Score */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-4xl">{match.homeTeam.logo}</span>
            <span className="font-bold text-base text-center">{match.homeTeam.name}</span>
          </div>

          <div className="flex flex-col items-center gap-2 px-6">
            {(isLive || isHT || match.status === 'FT') ? (
              <div className="flex items-center gap-3">
                <span className={`text-4xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>
                  {match.homeScore}
                </span>
                <span className="text-2xl text-muted-foreground">-</span>
                <span className={`text-4xl font-bold tabular-nums ${isLive ? 'text-sports-green' : ''}`}>
                  {match.awayScore}
                </span>
              </div>
            ) : (
              <span className="text-xl text-muted-foreground font-medium">vs</span>
            )}
            {(isLive || isHT) && (
              <Badge className="bg-sports-green text-white border-0 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 live-pulse inline-block" />
                {isHT ? 'Half Time' : `${match.minute}'`}
              </Badge>
            )}
            {match.status === 'FT' && (
              <Badge variant="secondary" className="text-xs">Full Time</Badge>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-4xl">{match.awayTeam.logo}</span>
            <span className="font-bold text-base text-center">{match.awayTeam.name}</span>
          </div>
        </div>

        {/* Venue */}
        <div className="text-center text-xs text-muted-foreground mt-4">
          📍 {match.venue} • {match.date} • {match.time}
        </div>
      </div>

      {/* Match Details Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="bg-muted/50 w-full justify-start">
          <TabsTrigger value="timeline" className="text-xs flex-1 sm:flex-none">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs flex-1 sm:flex-none">
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="lineups" className="text-xs flex-1 sm:flex-none">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Lineups
          </TabsTrigger>
        </TabsList>

        {/* Timeline */}
        <TabsContent value="timeline" className="mt-4">
          <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
            <div className="p-4 border-b border-border/30">
              <h3 className="font-bold text-sm">Match Events</h3>
            </div>
            {match.events.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No events yet — match hasn&apos;t started
              </div>
            ) : (
              <div className="divide-y divide-border/10">
                {match.events.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 hover:bg-muted/10 transition-colors">
                    {/* Minute */}
                    <span className="w-10 text-right text-xs font-bold text-sports-green tabular-nums">{event.minute}&apos;</span>

                    {/* Event Icon */}
                    <span className="text-base">
                      {event.type === 'GOAL' ? '⚽' :
                       event.type === 'YELLOW_CARD' ? '🟨' :
                       event.type === 'RED_CARD' ? '🟥' :
                       event.type === 'SUBSTITUTION' ? '🔄' :
                       event.type === 'VAR' ? '📺' : '•'}
                    </span>

                    {/* Event Detail */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{event.playerName}</span>
                        {event.type === 'GOAL' && <span className="text-xs text-sports-green font-bold">GOAL</span>}
                        {event.type === 'YELLOW_CARD' && <span className="text-xs text-yellow-500 font-bold">Yellow Card</span>}
                        {event.type === 'RED_CARD' && <span className="text-xs text-destructive font-bold">Red Card</span>}
                        {event.type === 'SUBSTITUTION' && (
                          <span className="text-xs text-muted-foreground">
                            <span className="text-sports-green">{event.playerIn}</span>
                            {' '}↔{' '}
                            <span className="text-destructive">{event.playerOut}</span>
                          </span>
                        )}
                      </div>
                      {event.assistBy && event.type === 'GOAL' && (
                        <span className="text-xs text-muted-foreground">Assist: {event.assistBy}</span>
                      )}
                    </div>

                    {/* Team */}
                    <span className="text-xs text-muted-foreground font-medium">
                      {event.teamId === match.homeTeam.id ? match.homeTeam.shortName : match.awayTeam.shortName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats" className="mt-4">
          <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
            <div className="p-4 border-b border-border/30">
              <h3 className="font-bold text-sm">Match Statistics</h3>
            </div>
            {match.homePossession !== undefined ? (
              <div className="divide-y divide-border/10">
                {/* Possession */}
                <StatBar
                  label="Possession"
                  homeValue={`${match.homePossession}%`}
                  awayValue={`${match.awayPossession}%`}
                  homePercent={match.homePossession!}
                  awayPercent={match.awayPossession!}
                />
                <StatBar
                  label="Shots"
                  homeValue={`${match.homeShots}`}
                  awayValue={`${match.awayShots}`}
                  homePercent={(match.homeShots! / (match.homeShots! + match.awayShots!)) * 100}
                  awayPercent={(match.awayShots! / (match.homeShots! + match.awayShots!)) * 100}
                />
                <StatBar
                  label="Shots on Target"
                  homeValue={`${match.homeShotsOnTarget}`}
                  awayValue={`${match.awayShotsOnTarget}`}
                  homePercent={(match.homeShotsOnTarget! / Math.max(match.homeShotsOnTarget! + match.awayShotsOnTarget!, 1)) * 100}
                  awayPercent={(match.awayShotsOnTarget! / Math.max(match.homeShotsOnTarget! + match.awayShotsOnTarget!, 1)) * 100}
                />
                <StatBar
                  label="Fouls"
                  homeValue={`${match.homeFouls}`}
                  awayValue={`${match.awayFouls}`}
                  homePercent={(match.homeFouls! / (match.homeFouls! + match.awayFouls!)) * 100}
                  awayPercent={(match.awayFouls! / (match.homeFouls! + match.awayFouls!)) * 100}
                  invertHighlight
                />
                <StatBar
                  label="Corners"
                  homeValue={`${match.homeCorners}`}
                  awayValue={`${match.awayCorners}`}
                  homePercent={(match.homeCorners! / Math.max(match.homeCorners! + match.awayCorners!, 1)) * 100}
                  awayPercent={(match.awayCorners! / Math.max(match.homeCorners! + match.awayCorners!, 1)) * 100}
                />
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Statistics will be available once the match starts
              </div>
            )}
          </div>
        </TabsContent>

        {/* Lineups */}
        <TabsContent value="lineups" className="mt-4">
          {lineupData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Home Lineup */}
              <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
                <div className="p-4 border-b border-border/30 flex items-center gap-2">
                  <span className="text-xl">{match.homeTeam.logo}</span>
                  <h3 className="font-bold text-sm">{match.homeTeam.name}</h3>
                </div>
                <div className="divide-y divide-border/10">
                  {homeLineup.filter(p => !p.isSubstitute).map((player) => (
                    <div key={player.number} className="flex items-center gap-3 p-3">
                      <span className="w-7 h-7 flex items-center justify-center rounded-md bg-sports-green/10 text-sports-green text-xs font-bold">
                        {player.number}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{player.name}</p>
                        <p className="text-[10px] text-muted-foreground">{player.position}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-muted/10">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Substitutes</p>
                    {homeLineup.filter(p => p.isSubstitute).map((player) => (
                      <div key={player.number} className="flex items-center gap-3 py-1.5">
                        <span className="w-6 h-6 flex items-center justify-center rounded-md bg-muted/30 text-muted-foreground text-[10px] font-bold">
                          {player.number}
                        </span>
                        <p className="text-xs text-muted-foreground">{player.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Away Lineup */}
              <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
                <div className="p-4 border-b border-border/30 flex items-center gap-2">
                  <span className="text-xl">{match.awayTeam.logo}</span>
                  <h3 className="font-bold text-sm">{match.awayTeam.name}</h3>
                </div>
                <div className="divide-y divide-border/10">
                  {awayLineup.filter(p => !p.isSubstitute).map((player) => (
                    <div key={player.number} className="flex items-center gap-3 p-3">
                      <span className="w-7 h-7 flex items-center justify-center rounded-md bg-sports-green/10 text-sports-green text-xs font-bold">
                        {player.number}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{player.name}</p>
                        <p className="text-[10px] text-muted-foreground">{player.position}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-muted/10">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Substitutes</p>
                    {awayLineup.filter(p => p.isSubstitute).map((player) => (
                      <div key={player.number} className="flex items-center gap-3 py-1.5">
                        <span className="w-6 h-6 flex items-center justify-center rounded-md bg-muted/30 text-muted-foreground text-[10px] font-bold">
                          {player.number}
                        </span>
                        <p className="text-xs text-muted-foreground">{player.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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

// Stat Bar Component
function StatBar({
  label,
  homeValue,
  awayValue,
  homePercent,
  awayPercent,
  invertHighlight = false,
}: {
  label: string;
  homeValue: string;
  awayValue: string;
  homePercent: number;
  awayPercent: number;
  invertHighlight?: boolean;
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
          <div
            className={`h-full rounded-full transition-all duration-500 ${homeIsBetter ? 'bg-sports-green' : 'bg-muted-foreground/50'}`}
            style={{ width: `${homePercent}%` }}
          />
        </div>
        <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden flex justify-end">
          <div
            className={`h-full rounded-full transition-all duration-500 ${!homeIsBetter ? 'bg-sports-green' : 'bg-muted-foreground/50'}`}
            style={{ width: `${awayPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
