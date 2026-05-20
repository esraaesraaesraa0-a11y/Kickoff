"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Trophy, Zap, Newspaper, BarChart3, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export type NavTab = 'home' | 'livescores' | 'standings' | 'matchcenter' | 'news';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { id: 'livescores', label: 'Live Scores', icon: <Zap className="w-4 h-4" /> },
  { id: 'standings', label: 'Standings', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'matchcenter', label: 'Match Center', icon: <Trophy className="w-4 h-4" /> },
  { id: 'news', label: 'News', icon: <Newspaper className="w-4 h-4" /> },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const handleTabChange = (tab: NavTab) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabChange('home')}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sports-green text-white font-bold text-lg">
            ⚽
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-none">KickOff</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">LIVE FOOTBALL</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-sports-green/15 text-sports-green'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Live Count Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sports-green/10 border border-sports-green/20">
            <span className="w-2 h-2 rounded-full bg-sports-green live-pulse" />
            <span className="text-xs font-semibold text-sports-green">5 Live</span>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-lg"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background border-border">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center justify-between mb-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sports-green flex items-center justify-center text-white font-bold">
                    ⚽
                  </div>
                  <span className="text-lg font-bold">KickOff</span>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-sports-green/15 text-sports-green'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="mt-6 flex items-center gap-1.5 px-3 py-2 rounded-full bg-sports-green/10 border border-sports-green/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-sports-green live-pulse" />
                <span className="text-xs font-semibold text-sports-green">5 Live Matches</span>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
