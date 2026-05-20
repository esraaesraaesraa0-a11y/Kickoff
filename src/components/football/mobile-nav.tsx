"use client";

import React from "react";
import { Home, Zap, BarChart3, Trophy, Newspaper } from "lucide-react";
import type { NavTab } from "./header";

interface MobileNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'livescores', label: 'Live', icon: <Zap className="w-5 h-5" /> },
  { id: 'standings', label: 'Standings', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'matchcenter', label: 'Matches', icon: <Trophy className="w-5 h-5" /> },
  { id: 'news', label: 'News', icon: <Newspaper className="w-5 h-5" /> },
];

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
              activeTab === item.id
                ? 'text-sports-green'
                : 'text-muted-foreground'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
            {activeTab === item.id && (
              <span className="w-1 h-1 rounded-full bg-sports-green" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
