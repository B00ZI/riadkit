// app/dashboard/reception/stock-tab.tsx
"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LayoutGrid, Utensils, Sparkles, Map, AlertTriangle, Loader2 } from "lucide-react";
import { useCatalog } from "@/hooks/useCatalog";

type DomainFilter = "menu" | "services" | "explore";

export function StockTab() {
  const {
    menuItems,
    services,
    excursions,
    isLoading,
    error,
    toggleMenuItemAvailability,
  } = useCatalog();

  const [mainFilter, setMainFilter] = useState<DomainFilter>("menu");
  const [subFilter, setSubFilter] = useState<string>("all");

  // ─── Combine all items into a single list with category metadata ──
  const allItems = useMemo(() => {
    const items: any[] = [];

    menuItems.forEach((item) => {
      items.push({
        id: item.id,
        name: item.name,
        category: "menu",
        sub: "Menu Items", // or you can use category name if available
        inStock: item.is_available,
        original: item,
      });
    });

    services.forEach((item) => {
      items.push({
        id: item.id,
        name: item.name,
        category: "services",
        sub: "Services",
        inStock: item.is_available,
        original: item,
      });
    });

    excursions.forEach((item) => {
      items.push({
        id: item.id,
        name: item.name,
        category: "explore",
        sub: "Excursions",
        inStock: item.is_available,
        original: item,
      });
    });

    return items;
  }, [menuItems, services, excursions]);

  // ─── Filter by main domain ──────────────────────────────────
  const domainItems = useMemo(
    () => allItems.filter((item) => item.category === mainFilter),
    [allItems, mainFilter]
  );

  // ─── Get unique sub-categories for the sub-filter bar ──────
  const subCategories = useMemo(() => {
    const subs = Array.from(new Set(domainItems.map((item) => item.sub)));
    return ["all", ...subs];
  }, [domainItems]);

  // ─── Separate Out of Stock ──────────────────────────────────
  const outOfStockItems = domainItems.filter((item) => !item.inStock);

  // ─── Filter Available items by Sub-Category ─────────────────
  const availableItems = domainItems.filter(
    (item) => item.inStock && (subFilter === "all" || item.sub === subFilter)
  );

  // ─── Toggle Handler ──────────────────────────────────────────
  const handleToggle = (item: any) => {
    if (item.category === "menu") {
      toggleMenuItemAvailability(item.id, !item.inStock);
    }
    // For services/excursions – add similar functions if needed
  };

  // ─── Loading / Error ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4 pb-6">
      {/* 1. Main Domain Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
        <Button
          variant={mainFilter === "menu" ? "default" : "secondary"}
          className="rounded-full px-4 h-9 text-xs font-bold shrink-0"
          onClick={() => {
            setMainFilter("menu");
            setSubFilter("all");
          }}
        >
          <Utensils className="w-3.5 h-3.5 mr-1.5" /> Menu
        </Button>
        <Button
          variant={mainFilter === "services" ? "default" : "secondary"}
          className="rounded-full px-4 h-9 text-xs font-bold shrink-0"
          onClick={() => {
            setMainFilter("services");
            setSubFilter("all");
          }}
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Services
        </Button>
        <Button
          variant={mainFilter === "explore" ? "default" : "secondary"}
          className="rounded-full px-4 h-9 text-xs font-bold shrink-0"
          onClick={() => {
            setMainFilter("explore");
            setSubFilter("all");
          }}
        >
          <Map className="w-3.5 h-3.5 mr-1.5" /> Explore
        </Button>
      </div>

      <div className="flex-col space-y-6">
        {/* SECTION: ACTION REQUIRED (Out of Stock) */}
        {outOfStockItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-destructive flex items-center px-1">
              Out of Stock
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {outOfStockItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-destructive/3 border-destructive/20 shadow-none"
                >
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-destructive">{item.name}</span>
                      <span className="text-[10px] font-bold text-destructive/50 uppercase">
                        {item.sub}
                      </span>
                    </div>
                    <Switch
                      checked={item.inStock}
                      onCheckedChange={() => handleToggle(item)}
                      className="data-[state=checked]:bg-emerald-500"
                    />
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
                  <Switch
                    checked={item.inStock}
                    onCheckedChange={() => handleToggle(item)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
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