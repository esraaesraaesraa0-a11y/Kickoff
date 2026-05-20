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
import { useFixtures } from "@/lib/api/hooks";
import { type Match } from "@/lib/mock-data";
import { Loader2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
            <div className="lg:col-span-8 space-y-6">
              <FeaturedMatches onMatchSelect={handleMatchSelect} onTabChange={handleTabChange} />
            </div>
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
            <MatchCenterFallback onMatchSelect={handleMatchSelect} />
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
              <span>Live Scores</span><span>•</span><span>Standings</span><span>•</span><span>News</span><span>•</span><span>© 2026 KickOff</span>
            </div>
          </div>
        </div>
      </footer>

      <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

// Fallback for Match Center when no match is selected
function MatchCenterFallback({ onMatchSelect }: { onMatchSelect: (m: Match) => void }) {
  const { data: liveData, isLoading } = useFixtures('live');
  const matches = liveData?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Match Center</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Select a match to view details</p>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-sports-green" />
          <span className="text-sm">Loading matches...</span>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-medium">No live matches at the moment</p>
          <p className="text-sm mt-1">Check the Live Scores tab for upcoming matches</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <div key={match.id} onClick={() => onMatchSelect(match)}
              className="rounded-xl border border-border/40 bg-card/50 p-4 cursor-pointer hover:border-sports-green/40 hover:bg-card/80 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{match.league}</span>
                {(match.status === 'LIVE' || match.status === 'HT') && (
                  <span className="flex items-center gap-1 text-xs text-sports-green font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-sports-green live-pulse" />
                    {match.status === 'HT' ? 'HT' : `${match.minute}'`}
                  </span>
                )}
                {match.status === 'FT' && <Badge variant="secondary" className="text-[10px]">FT</Badge>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {match.homeTeam.logo?.startsWith('http') ? (
                    <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <span className="text-xl">{match.homeTeam.logo}</span>
                  )}
                  <span className="font-medium text-sm">{match.homeTeam.shortName}</span>
                </div>
                <span className="text-lg font-bold tabular-nums">{match.homeScore} - {match.awayScore}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{match.awayTeam.shortName}</span>
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
          ))}
        </div>
      )}
    </div>
  );
}
