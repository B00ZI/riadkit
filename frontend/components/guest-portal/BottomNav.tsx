"use client";

import { Home, Utensils, Compass, Sparkles, LucideIcon } from "lucide-react";

export type TabId = "home" | "menu" | "explore" | "services";

interface TabItem {
  id: TabId;
  icon: LucideIcon;
  label: string;
}

const TABS: TabItem[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "menu", icon: Utensils, label: "Menu" },
  { id: "explore", icon: Compass, label: "Explore" },
  { id: "services", icon: Sparkles, label: "Services" },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => (
  <nav className="absolute bottom-0 w-full h-16 bg-background/90 backdrop-blur-md border-t border-border/80 flex items-center justify-around px-4 z-40">
    {TABS.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition-all ${
            isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground opacity-70"
          }`}
        >
          <tab.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
          <span className="text-[9px] font-black uppercase tracking-wider">{tab.label}</span>
        </button>
      );
    })}
  </nav>
);
