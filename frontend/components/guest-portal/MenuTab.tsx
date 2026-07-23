"use client";

import { MenuItem, Category } from "@/hooks/useCatalog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  Loader2,
} from "lucide-react";
import { useState } from "react";

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

  const menuCategories = categories.filter((c) => c.type === "menu");

  const handleToggleStock = async (item: MenuItem) => {
    if (!onToggleAvailability) return;
    setTogglingId(item.id);
    try {
      await onToggleAvailability(item.id, !item.is_available);
    } catch (err) {
      console.error("Failed to toggle availability", err);
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

          return (
            <Card key={cat.id} className="bg-card border-border shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab" />
                  <span className="font-black text-sm uppercase tracking-tight text-foreground">
                    {cat.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px] font-extrabold px-2 py-0.5">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteCategory(cat.id, cat.name)}
                    className="h-8 text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Category
                  </Button>
                </div>
              </div>

              {/* Items List */}
              <div className="p-3 space-y-2">
                {items.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                    No items in this category yet.
                  </div>
                ) : (
                  items.map((item) => {
                    const isAvailable = item.is_available ?? true;
                    const isToggling = togglingId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border transition-all gap-3 ${
                          isAvailable
                            ? "bg-card border-border/80 hover:border-primary/40 shadow-2xs"
                            : "bg-muted/20 border-border/40 opacity-70"
                        }`}
                      >
                        {/* Item Info */}
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground truncate">
                                {item.name}
                              </span>
                              {!isAvailable && (
                                <Badge variant="destructive" className="text-[9px] font-black uppercase px-1.5 py-0">
                                  Out of stock
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

                        {/* Right Actions & Price Row */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/50">
                          <span className="text-sm font-black text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                            {item.price} MAD
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Stock Toggle Button */}
                            <Button
                              size="sm"
                              variant={isAvailable ? "outline" : "secondary"}
                              disabled={isToggling}
                              onClick={() => handleToggleStock(item)}
                              className={`h-8 text-[11px] font-black uppercase px-2.5 ${
                                isAvailable
                                  ? "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-950/30"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
                              }`}
                            >
                              {isToggling ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : isAvailable ? (
                                <>
                                  <XCircle className="w-3.5 h-3.5 mr-1 text-amber-500" /> Mark Out
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Restock
                                </>
                              )}
                            </Button>

                            {/* Edit Button */}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onOpenItemDialog(item)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                              title="Edit item"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>

                            {/* Delete Button */}
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

                {/* Add Item Button */}
                <Button
                  variant="outline"
                  className="w-full h-9 border-dashed text-xs font-black uppercase mt-3 hover:border-primary hover:text-primary transition-colors"
                  onClick={() => onOpenItemDialog(undefined, cat.id)}
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add item to {cat.name}
                </Button>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}