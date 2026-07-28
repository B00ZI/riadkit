"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_available?: boolean;
  requires_quantity?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  menu_items: MenuItem[];
}

interface MenuTabProps {
  categories: MenuCategory[];
  isExpired: boolean;
  onRequestItem: (item: MenuItem & { requestType: string }) => void;
}

export const MenuTab = ({ categories, isExpired, onRequestItem }: MenuTabProps) => {
  const [filter, setFilter] = useState("All");

  const filteredCategories = useMemo(() => {
    if (filter === "All") return categories;
    return categories.filter((cat) => cat.name === filter);
  }, [categories, filter]);

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={Utensils}
        title="Kitchen Closed"
        message="Our kitchen menu is currently being updated. Contact reception for direct requests."
      />
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300 py-5">
      <div className="px-6 mb-4">
        <h2 className="text-xl font-black uppercase tracking-tight">In-Room Dining</h2>
        <p className="text-xs text-muted-foreground font-medium">Freshly prepared local delicacies & drinks</p>
      </div>

      {/* Category filter */}
      <div className="w-full overflow-x-auto no-scrollbar px-6 mb-5">
        <div className="flex gap-2 w-max">
          <Badge
            onClick={() => setFilter("All")}
            variant={filter === "All" ? "default" : "outline"}
            className={`px-4 py-1.5 font-black uppercase text-[10px] rounded-xl cursor-pointer transition-all ${
              filter === "All" ? "shadow-sm" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            All Items
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              onClick={() => setFilter(cat.name)}
              variant={filter === cat.name ? "default" : "outline"}
              className={`px-4 py-1.5 font-black uppercase text-[10px] rounded-xl cursor-pointer transition-all ${
                filter === cat.name ? "shadow-sm" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="px-6 space-y-6">
        {filteredCategories.map((cat) => {
          const items = cat.menu_items ?? [];
          if (items.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {cat.name}
                </span>
                <div className="h-px bg-border/60 flex-1" />
              </div>

              <div className="grid gap-4">
                {items.map((item) => {
                  const isAvailable = item.is_available ?? true;

                  return (
                    <Card
                      key={item.id}
                      className={`overflow-hidden border-border/80 bg-card rounded-2xl shadow-sm transition-all ${
                        !isAvailable
                          ? "opacity-60 bg-muted/20"
                          : "hover:border-primary/20"
                      }`}
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-base uppercase tracking-tight text-foreground">
                                {item.name}
                              </span>
                              {!isAvailable && (
                                <Badge
                                  variant="destructive"
                                  className="text-[8px] font-black px-1.5 py-0 uppercase"
                                >
                                  Sold Out
                                </Badge>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="shrink-0">
                            <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                              {item.price} MAD
                            </span>
                          </div>
                        </div>

                        <Button
                          disabled={!isAvailable || isExpired}
                          onClick={() => onRequestItem({ ...item, requestType: "menu" })}
                          variant="outline"
                          className="w-full h-9 text-xs font-medium uppercase tracking-wider rounded-xl border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all"
                        >
                          {isAvailable ? "Add" : "Unavailable"}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};