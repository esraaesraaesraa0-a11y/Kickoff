"use client";

import React from "react";
import { Header, type NavTab } from "@/components/football/header";
import { LiveTicker } from "@/components/football/live-ticker";
import { FeaturedMatches } from "@/components/football/featured-matches";
import { QuickStandings } from "@/components/football/quick-standings";
import { NewsFeed } from "@/components/football/news-feed";
import { LiveScores } from "@/components/football/live-scores";
import { FullStandings } from "@/components/football/full-standings";
import { MatchCenter } from "@/components/football/match-center";
import { FullNews } from "@/components/football/full-news";
import { MobileNav } from "@/components/football/mobile-nav";
import { liveMatches, type Match } from "@/lib/mock-data";

export default function Home() {
  const [activeTab, setActiveTab] = React.useState<NavTab>('home');
  const [selectedMatch, setSelectedMatch] = React.useState<Match | null>(null);

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setActiveTab('matchcenter');
  };

  const handleBackFromMatch = () => {
    setSelectedMatch(null);
    setActiveTab('livescores');
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'matchcenter') {
      setSelectedMatch(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <LiveTicker />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 lg:px-6 py-6 pb-24 md:pb-6">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              <FeaturedMatches onMatchSelect={handleMatchSelect} onTabChange={handleTabChange} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <QuickStandings onTabChange={handleTabChange} />
              <NewsFeed onTabChange={handleTabChange} />
            </div>
          </div>
        )}

        {/* LIVE SCORES TAB */}
        {activeTab === 'livescores' && (
          <LiveScores onMatchSelect={handleMatchSelect} onTabChange={handleTabChange} />
        )}

        {/* STANDINGS TAB */}
        {activeTab === 'standings' && (
          <FullStandings />
        )}

        {/* MATCH CENTER TAB */}
        {activeTab === 'matchcenter' && (
          selectedMatch ? (
            <MatchCenter match={selectedMatch} onBack={handleBackFromMatch} />
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Match Center</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Select a match to view details</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => handleMatchSelect(match)}
                    className="rounded-xl border border-border/40 bg-card/50 p-4 cursor-pointer hover:border-sports-green/40 hover:bg-card/80 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{match.league}</span>
                      {match.status === 'LIVE' && (
                        <span className="flex items-center gap-1 text-xs text-sports-green font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-sports-green live-pulse" />
                          {match.minute}&apos;
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{match.homeTeam.logo}</span>
                        <span className="font-medium text-sm">{match.homeTeam.shortName}</span>
                      </div>
                      <span className="text-lg font-bold tabular-nums">
                        {match.homeScore} - {match.awayScore}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{match.awayTeam.shortName}</span>
                        <span className="text-xl">{match.awayTeam.logo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <FullNews />
        )}
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-border/30 bg-card/30">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-lg">⚽</span>
              <span className="font-semibold">KickOff</span>
              <span>•</span>
              <span>Premium Football Platform</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Live Scores</span>
              <span>•</span>
              <span>Standings</span>
              <span>•</span>
              <span>News</span>
              <span>•</span>
              <span>© 2026 KickOff</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
