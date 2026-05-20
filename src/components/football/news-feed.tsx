"use client";

import React from "react";
import { newsArticles, type NavTab } from "@/lib/mock-data";
import { Clock, AlertTriangle, ChevronRight, Newspaper } from "lucide-react";

interface NewsFeedProps {
  onTabChange: (tab: NavTab) => void;
}

export function NewsFeed({ onTabChange }: NewsFeedProps) {
  const [selectedLeague, setSelectedLeague] = React.useState('all');
  const leagueFilters = ['all', 'Premier League', 'La Liga', 'UEFA Champions League', 'Egyptian Premier League'];

  const filteredNews = selectedLeague === 'all'
    ? newsArticles
    : newsArticles.filter(n => n.league === selectedLeague);

  return (
    <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-sports-green" />
            <h3 className="font-bold text-sm">Latest News</h3>
          </div>
          <button
            onClick={() => onTabChange('news')}
            className="text-xs text-sports-green hover:text-sports-green-light font-medium flex items-center gap-0.5 transition-colors"
          >
            All News <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* League Filter */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {leagueFilters.map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedLeague === league
                  ? 'bg-sports-green/15 text-sports-green border border-sports-green/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
              }`}
            >
              {league === 'all' ? 'All' : league}
            </button>
          ))}
        </div>
      </div>

      {/* News Items */}
      <div className="divide-y divide-border/20 max-h-[500px] overflow-y-auto">
        {filteredNews.map((article) => (
          <article
            key={article.id}
            className="p-4 hover:bg-muted/20 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              {/* Breaking Badge */}
              {article.isBreaking && (
                <div className="shrink-0 mt-0.5">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-destructive/15 text-destructive text-[10px] font-bold">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    BREAKING
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold leading-snug group-hover:text-sports-green transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                  <span className="font-medium text-sports-green/70">{article.category}</span>
                  <span>•</span>
                  <span>{article.league}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
