// app/dashboard/reception/stock-tab.tsx
"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Utensils,
  Sparkles,
  Map,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PackageCheck,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { useCatalog, type MenuItem, type Service, type Excursion } from "@/hooks/useCatalog";

type DomainFilter = "menu" | "services" | "explore";

type StockItem = {
  id: number;
  name: string;
  category: DomainFilter;
  sub: string;
  inStock: boolean;
  original: MenuItem | Service | Excursion;
};

const DOMAIN_CONFIG: Record<DomainFilter, { label: string; icon: LucideIcon }> = {
  menu: { label: "Menu", icon: Utensils },
  services: { label: "Services", icon: Sparkles },
  explore: { label: "Explore", icon: Map },
};

const DOMAIN_NOUNS: Record<DomainFilter, string> = {
  menu: "menu items",
  services: "services",
  explore: "excursions",
};

function formatPrice(item: StockItem) {
  const price = item.original.price;
  if (!price) return "Complimentary";
  return `${price} MAD`;
}

function StockStatusBadge({ inStock }: { inStock: boolean }) {
  if (inStock) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md h-6 bg-emerald-500/10 px-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5" />
        In Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md h-6 bg-destructive/10 px-2.5 text-[10px] font-black uppercase tracking-widest text-destructive shrink-0">
      <XCircle className="w-3.5 h-3.5" />
      Out of Stock
    </span>
  );
}

function StockItemRow({ item, onToggle }: { item: StockItem; onToggle: () => void }) {
  return (
    <Card
      className={
        item.inStock
          ? "px-4 py-3 bg-card border-border shadow-sm"
          : "px-4 py-3 bg-destructive/3 border-destructive/20 shadow-none"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-bold text-foreground truncate">{item.name}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide truncate">
            {item.sub} · {formatPrice(item)}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StockStatusBadge inStock={item.inStock} />
          <Switch
            checked={item.inStock}
            onCheckedChange={onToggle}
            aria-label={`${item.inStock ? "Mark" : "Restore"} ${item.name} as ${item.inStock ? "out of stock" : "in stock"}`}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>
    </Card>
  );
}

export function StockTab() {
  const {
    categories,
    menuItems,
    services,
    excursions,
    isLoading,
    error,
    toggleMenuItemAvailability,
    toggleServiceAvailability,
    toggleExcursionAvailability,
    refresh,
  } = useCatalog();

  const [mainFilter, setMainFilter] = useState<DomainFilter>("menu");
  const [subFilter, setSubFilter] = useState<string>("all");

  // ─── Category lookup map ──────────────────────────────────
  const categoryMap = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  // ─── All items with proper sub‑category names ─────────────
  const allItems = useMemo<StockItem[]>(() => {
    const items: StockItem[] = [];

    menuItems.forEach((item) => {
      const categoryName = categoryMap[item.category_id] || "Uncategorized";
      items.push({
        id: item.id,
        name: item.name,
        category: "menu",
        sub: categoryName,
        inStock: item.is_available,
        original: item,
      });
    });

    services.forEach((item) => {
      const categoryName = item.category_id ? categoryMap[item.category_id] : "Services";
      items.push({
        id: item.id,
        name: item.name,
        category: "services",
        sub: categoryName || "Services",
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
  }, [menuItems, services, excursions, categoryMap]);

  // ─── Filter by main domain ──────────────────────────────────
  const domainItems = useMemo(
    () => allItems.filter((item) => item.category === mainFilter),
    [allItems, mainFilter]
  );

  // ─── Sub‑categories (only meaningful for menu) ─────────────
  const subCategories = useMemo(() => {
    if (mainFilter !== "menu") return [];
    const subs = Array.from(new Set(domainItems.map((item) => item.sub)));
    return ["all", ...subs];
  }, [domainItems, mainFilter]);

  // ─── Out of Stock ──────────────────────────────────────────
  const outOfStockItems = domainItems.filter((item) => !item.inStock);

  // ─── Available items (subFilter only for menu) ─────────────
  const availableItems = useMemo(() => {
    if (mainFilter !== "menu") {
      return domainItems.filter((item) => item.inStock);
    }
    return domainItems.filter(
      (item) => item.inStock && (subFilter === "all" || item.sub === subFilter)
    );
  }, [domainItems, mainFilter, subFilter]);

  // ─── Toggle Handler ──────────────────────────────────────────
  const handleToggle = (item: StockItem) => {
    if (item.category === "menu") {
      toggleMenuItemAvailability(item.id, !item.inStock);
    } else if (item.category === "services") {
      toggleServiceAvailability(item.id, !item.inStock);
    } else if (item.category === "explore") {
      toggleExcursionAvailability(item.id, !item.inStock);
    }
  };

  // ─── Loading ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="px-4 py-3 bg-card border-border shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-2 min-w-0">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-9 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error ───────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground text-center max-w-xs">{error}</p>
        <Button variant="outline" onClick={() => refresh()} className="font-bold">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 pb-6">
      {/* 1. Sticky filter bar */}
      <div className="  z-10 -mx-4 -mt-4 border-b border-border bg-card/95 shadow-sm px-4 pt-2 pb-3 backdrop-blur-sm">
        {/* Main Domain Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {(Object.keys(DOMAIN_CONFIG) as DomainFilter[]).map((key) => {
            const { label, icon: Icon } = DOMAIN_CONFIG[key];
            return (
              <Button
                key={key}
                variant={mainFilter === key ? "default" : "secondary"}
                className="rounded-full px-4 h-10 text-sm font-bold shrink-0"
                onClick={() => {
                  setMainFilter(key);
                  setSubFilter("all");
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            );
          })}
        </div>

        {/* SUB‑CATEGORY FILTER PILLS – only for Menu */}
        {mainFilter === "menu" && subCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none mt-3">
            {subCategories.map((cat) => (
              <Button
                key={cat}
                variant={subFilter === cat ? "default" : "secondary"}
                className="rounded-full h-9 px-3 text-xs font-bold shrink-0"
                onClick={() => setSubFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Content */}
      {domainItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-1.5 py-12 border border-dashed border-border rounded-xl bg-card/50 px-6">
          <PackageCheck className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">Nothing here yet</p>
          <p className="text-xs text-muted-foreground max-w-[240px]">
            No {DOMAIN_NOUNS[mainFilter]} are available to manage right now.
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {/* SECTION: Out of Stock */}
          {outOfStockItems.length > 0 && (
            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Out of Stock
                </h3>
                <Badge
                  variant="outline"
                  className="rounded-md px-2 h-5 text-[10px] font-black text-destructive border-destructive/30 bg-destructive/5"
                >
                  {outOfStockItems.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {outOfStockItems.map((item) => (
                  <StockItemRow key={item.id} item={item} onToggle={() => handleToggle(item)} />
                ))}
              </div>
            </section>
          )}

          {/* SECTION: Available Items */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Available Items
              </h3>
              <Badge
                variant="outline"
                className="rounded-md px-2 h-5 text-[10px] font-black text-muted-foreground border-border"
              >
                {availableItems.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {availableItems.map((item) => (
                <StockItemRow key={item.id} item={item} onToggle={() => handleToggle(item)} />
              ))}

              {availableItems.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center gap-1.5 py-12 border border-dashed border-border rounded-xl bg-card/50 px-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500/40" />
                  <p className="text-sm font-semibold text-foreground">No available items</p>
                  <p className="text-xs text-muted-foreground max-w-[240px]">
                    {mainFilter === "menu"
                      ? "All menu items are currently out of stock."
                      : "All items in this section are currently out of stock."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
