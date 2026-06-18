// components/guest-portal/PhonePreview.tsx
"use client";

import { MenuItem, Excursion } from "@/hooks/useCatalog";
import { Sparkles, Wifi } from "lucide-react";

interface PhonePreviewProps {
  riadName?: string;
  wifiName?: string;
  menuItems: MenuItem[];
  excursions: Excursion[];
}

export function PhonePreview({
  riadName,
  wifiName,
  menuItems,
  excursions,
}: PhonePreviewProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[310px] h-[630px] bg-zinc-950 rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl overflow-hidden ring-1 ring-zinc-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-900 rounded-b-2xl z-20" />
        <div className="w-full h-full bg-background overflow-hidden flex flex-col pt-8">
          {/* Preview Header */}
          <div className="px-6 py-4">
            <div className="w-7 h-7 rounded-lg bg-primary mb-3 shadow-lg shadow-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <h4 className="font-black text-xl text-foreground leading-none">
              {riadName || "Your Riad"}
            </h4>
            <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1 tracking-tight">
              Marrakech, Morocco
            </p>
          </div>

          {/* Preview Content */}
          <div className="px-6 flex-1 space-y-6 overflow-y-auto no-scrollbar">
            {/* WiFi Quick Access */}
            <div className="bg-muted/40 p-3.5 rounded-2xl border border-border/50">
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-muted-foreground leading-none mb-1">
                    Guest WiFi
                  </span>
                  <span className="text-xs font-bold leading-none tracking-tight">
                    {wifiName || "Riad_Guest_WiFi"}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Preview */}
            {menuItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
                </div>
                <div className="space-y-2">
                  {menuItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="bg-card border border-border p-3 rounded-xl shadow-sm flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-muted rounded-lg shrink-0 flex items-center justify-center text-xs font-black uppercase">
                        {item.name?.charAt(0)}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[11px] font-bold truncate">{item.name}</span>
                        <span className="text-[9px] text-muted-foreground font-medium">
                          {item.price} MAD
                        </span>
                      </div>
                    </div>
                  ))}
                  {menuItems.length > 3 && (
                    <span className="text-[9px] text-muted-foreground font-bold block text-center">
                      +{menuItems.length - 3} more items
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Excursions Preview */}
            {excursions.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Experiences
                </span>
                {excursions.slice(0, 1).map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-zinc-900 rounded-2xl aspect-[4/3] relative overflow-hidden flex flex-col justify-end p-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                    <span className="relative z-10 text-xs font-black text-white uppercase">
                      {ex.name}
                    </span>
                    <span className="relative z-10 text-[9px] font-bold text-white/70">
                      {ex.price} MAD • {ex.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Nav Simulation */}
          <div className="h-16 border-t border-border bg-card/80 backdrop-blur-md flex items-center justify-around px-4">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          </div>
        </div>
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground tracking-widest opacity-60">
        Mobile Preview
      </p>
    </div>
  );
}