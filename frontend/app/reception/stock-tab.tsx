"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LayoutGrid, Utensils, Sparkles, Map, AlertTriangle } from "lucide-react";

// Updated Mock Data with sub-categories
const mockStock = [
  { id: "1", name: "Mint Tea", category: "menu", sub: "Drinks", inStock: false },
  { id: "2", name: "Msemen + Honey", category: "menu", sub: "Breakfast", inStock: true },
  { id: "3", name: "Orange Juice", category: "menu", sub: "Drinks", inStock: true },
  { id: "4", name: "Tagine Kefta", category: "menu", sub: "Dinner", inStock: true },
  { id: "5", name: "60min Hammam", category: "services", sub: "Spa", inStock: true },
  { id: "6", name: "Argan Oil Massage", category: "services", sub: "Spa", inStock: false },
  { id: "7", name: "Atlas Mountains Trip", category: "explore", sub: "Excursions", inStock: true },
];

export function StockTab() {
  const [mainFilter, setMainFilter] = useState<"menu" | "services" | "explore">("menu");
  const [subFilter, setSubFilter] = useState<string>("all");

  // 1. Get all items for the selected Main Domain (Menu/Services/Explore)
  const domainItems = useMemo(() => 
    mockStock.filter((item) => item.category === mainFilter),
    [mainFilter]
  );

  // 2. Get unique sub-categories for the sub-filter bar (e.g., Breakfast, Dinner)
  const subCategories = useMemo(() => {
    const subs = Array.from(new Set(domainItems.map(item => item.sub)));
    return ["all", ...subs];
  }, [domainItems]);

  // 3. Separate Out of Stock (Always show all for the domain)
  const outOfStockItems = domainItems.filter((item) => !item.inStock);

  // 4. Filter Available items by the selected Sub-Category
  const availableItems = domainItems.filter((item) => 
    item.inStock && (subFilter === "all" || item.sub === subFilter)
  );

  return (
    <div className="flex flex-col h-full space-y-4 pb-6">
      
      {/* 1. Main Domain Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
        <Button
          variant={mainFilter === "menu" ? "default" : "secondary"}
          className="rounded-full px-4 h-9 text-xs font-bold shrink-0"
          onClick={() => { setMainFilter("menu"); setSubFilter("all"); }}
        >
          <Utensils className="w-3.5 h-3.5 mr-1.5" /> Menu
        </Button>
        <Button
          variant={mainFilter === "services" ? "default" : "secondary"}
          className="rounded-full px-4 h-9 text-xs font-bold shrink-0"
          onClick={() => { setMainFilter("services"); setSubFilter("all"); }}
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Services
        </Button>
        <Button
          variant={mainFilter === "explore" ? "default" : "secondary"}
          className="rounded-full px-4 h-9 text-xs font-bold shrink-0"
          onClick={() => { setMainFilter("explore"); setSubFilter("all"); }}
        >
          <Map className="w-3.5 h-3.5 mr-1.5" /> Explore
        </Button>
      </div>

      <div className="flex-col space-y-6">
        
        {/* SECTION: ACTION REQUIRED (Emergency - Domain Wide) */}
        {outOfStockItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-destructive flex items-center px-1">
      out of stock items
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {outOfStockItems.map((item) => (
                <Card key={item.id} className="bg-destructive/[0.03] border-destructive/20 shadow-none">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-destructive">{item.name}</span>
                      <span className="text-[10px] font-bold text-destructive/50 uppercase">{item.sub}</span>
                    </div>
                    <Switch checked={item.inStock} className="data-[state=checked]:bg-emerald-500" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: AVAILABLE (With Sub-Filtering) */}
        <div className="space-y-3">
          <div className="flex flex-col space-y-3 px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Available Items
            </h3>
            
            {/* SUB-CATEGORY FILTER PILLS */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {subCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSubFilter(cat)}
                  className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all border ${
                    subFilter === cat 
                    ? "bg-foreground text-background border-foreground" 
                    : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {availableItems.map((item) => (
              <Card key={item.id} className="bg-card border-border shadow-sm">
                <div className="p-3 flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{item.name}</span>
                  <Switch checked={item.inStock} className="data-[state=checked]:bg-emerald-500" />
                </div>
              </Card>
            ))}
            
            {availableItems.length === 0 && (
              <div className="text-center text-xs font-bold text-muted-foreground py-8 border border-dashed border-border rounded-xl">
                No available items in this sub-category.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}