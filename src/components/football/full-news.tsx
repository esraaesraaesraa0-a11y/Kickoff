"use client";

import React from "react";
import { newsArticles } from "@/lib/mock-data";
import { Clock, AlertTriangle, Newspaper, Tag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function FullNews() {
  const [selectedLeague, setSelectedLeague] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const leagueFilters = ['all', 'Premier League', 'La Liga', 'UEFA Champions League', 'Egyptian Premier League'];

  const filteredNews = React.useMemo(() => {
    let results = newsArticles;
    if (selectedLeague !== 'all') {
      results = results.filter(n => n.league === selectedLeague);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
      );
    }
    return results;
  }, [selectedLeague, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Football News</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Latest stories and breaking news</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card/50 border-border/40"
        />
      </div>

      {/* League Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1.5" />
        {leagueFilters.map((league) => (
          <button
            key={league}
            onClick={() => setSelectedLeague(league)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              selectedLeague === league
                ? 'bg-sports-green/15 text-sports-green border-sports-green/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent'
            }`}
          >
            {league === 'all' ? 'All Leagues' : league}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No articles found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              className="group rounded-xl border border-border/40 bg-card/50 overflow-hidden hover:border-border/80 hover:bg-card/80 transition-all cursor-pointer"
            >
              {/* Color bar by category */}
              <div className={`h-1 ${
                article.isBreaking ? 'bg-destructive' :
                article.category === 'Transfer News' ? 'bg-blue-500' :
                article.category === 'League News' ? 'bg-yellow-500' :
                'bg-sports-green'
              }`} />

              <div className="p-5">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  {article.isBreaking && (
                    <Badge className="bg-destructive/15 text-destructive border-0 text-[10px] font-bold px-2">
                      <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                      BREAKING
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px] font-medium">
                    {article.category}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base leading-snug group-hover:text-sports-green transition-colors">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 mt-4 text-[11px] text-muted-foreground">
                  <span className="font-medium text-sports-green/70">{article.league}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
