"use client";

import { MenuItem, Category } from "@/hooks/useCatalog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  UtensilsCrossed,
  Loader2,
} from "lucide-react";
import { useState, useCallback } from "react";

interface MenuTabProps {
  categories: Category[];
  menuItems: MenuItem[];
  onOpenCategoryDialog: () => void;
  onOpenItemDialog: (item?: MenuItem, categoryId?: number) => void;
  onDeleteCategory: (id: number, name: string) => void;
  onDeleteMenuItem: (id: number, name: string) => void;
  onToggleAvailability?: (id: number, currentStatus: boolean) => Promise<void>;
}

export function MenuTab({
  categories,
  menuItems,
  onOpenCategoryDialog,
  onOpenItemDialog,
  onDeleteCategory,
  onDeleteMenuItem,
  onToggleAvailability,
}: MenuTabProps) {
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const menuCategories = categories.filter((c) => c.type === "menu");

  const toggleCollapse = useCallback((catId: number) => {
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));
  }, []);

  const handleToggleVisibility = async (item: MenuItem) => {
    if (!onToggleAvailability) return;
    setTogglingId(item.id);
    try {
      await onToggleAvailability(item.id, !item.is_available);
    } catch (err) {
      // Ignore
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
            Menu Categories
          </h3>
          <p className="text-xs text-muted-foreground">
            Manage your food, drinks, and dining offerings
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 text-xs font-black uppercase tracking-wide px-4"
          onClick={onOpenCategoryDialog}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Category
        </Button>
      </div>

      {menuCategories.length === 0 ? (
        <Card className="p-12 border-dashed bg-card/50 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
          <UtensilsCrossed className="w-10 h-10 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-bold text-foreground">No menu categories yet</p>
            <p className="text-xs">Create your first category (e.g., Breakfast, Drinks) to get started.</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCategoryDialog}
            className="mt-2 text-xs font-black uppercase"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Category
          </Button>
        </Card>
      ) : (
        menuCategories.map((cat) => {
          const items = menuItems.filter((i) => i.category_id === cat.id);
          const isCollapsed = collapsed[cat.id] !== false;

          return (
            <Card key={cat.id} className="bg-card border-border shadow-sm overflow-hidden">
              {/* Category Header */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleCollapse(cat.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCollapse(cat.id); } }}
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border hover:bg-muted/60 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground/60" />
                  )}
                  <span className="font-black text-sm uppercase tracking-tight text-foreground">
                    {cat.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px] font-extrabold px-2 py-0.5">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </Badge>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteCategory(cat.id, cat.name)}
                    className="h-8 text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>

              {/* Items List */}
              {!isCollapsed && (
                <div className="p-3 space-y-2">
                  {items.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                      No items in this category yet.
                    </div>
                  ) : (
                    items.map((item) => {
                      const isVisible = item.is_available ?? true;
                      const isToggling = togglingId === item.id;

                      return (
                        <div
                          key={item.id}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border transition-all gap-3 animate-in fade-in duration-300 ${
                            isVisible
                              ? "bg-card border-border/80 hover:border-primary/40 shadow-2xs"
                              : "bg-muted/20 border-border/40 opacity-60"
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground truncate">
                                  {item.name}
                                </span>
                                {!isVisible && (
                                  <Badge variant="destructive" className="text-[9px] font-black uppercase px-1.5 py-0">
                                    Hidden
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/50">
                            <span className="text-sm font-black text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                              {item.price} MAD
                            </span>

                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant={isVisible ? "outline" : "secondary"}
                                disabled={isToggling}
                                onClick={() => handleToggleVisibility(item)}
                                className={`h-8 text-[11px] font-black uppercase px-2.5 ${
                                  isVisible
                                    ? "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-950/30"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
                                }`}
                              >
                                {isToggling ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : isVisible ? (
                                  <><EyeOff className="w-3.5 h-3.5 mr-1" /> Hide</>
                                ) : (
                                  <><Eye className="w-3.5 h-3.5 mr-1" /> Show</>
                                )}
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onOpenItemDialog(item)}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                title="Edit item"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onDeleteMenuItem(item.id, item.name)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                                title="Delete item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <Button
                    variant="outline"
                    className="w-full h-9 border-dashed text-xs font-black uppercase mt-3 hover:border-primary hover:text-primary transition-colors"
                    onClick={() => onOpenItemDialog(undefined, cat.id)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Add item to {cat.name}
                  </Button>
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
