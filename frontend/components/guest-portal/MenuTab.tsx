// components/guest-portal/MenuTab.tsx
"use client";

import { MenuItem, Category } from "@/hooks/useCatalog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, Pencil, Trash2 } from "lucide-react";

interface MenuTabProps {
  categories: Category[];
  menuItems: MenuItem[];
  onOpenCategoryDialog: () => void;
  onOpenItemDialog: (item?: MenuItem, categoryId?: number) => void;
  onDeleteCategory: (id: number, name: string) => void;
  onDeleteMenuItem: (id: number, name: string) => void;
}

export function MenuTab({
  categories,
  menuItems,
  onOpenCategoryDialog,
  onOpenItemDialog,
  onDeleteCategory,
  onDeleteMenuItem,
}: MenuTabProps) {
  const menuCategories = categories.filter((c) => c.type === "menu");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Menu Categories
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-[10px] font-black uppercase"
          onClick={onOpenCategoryDialog}
        >
          <Plus className="w-3 h-3 mr-1" /> New Category
        </Button>
      </div>

      {menuCategories.length === 0 ? (
        <Card className="p-8 border-border bg-card text-center text-muted-foreground">
          <p className="text-sm font-medium">No menu categories yet</p>
          <p className="text-xs">Add a category to get started</p>
        </Card>
      ) : (
        menuCategories.map((cat) => {
          const items = menuItems.filter((i) => i.category_id === cat.id);
          return (
            <Card key={cat.id} className="p-4 bg-card border-border shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground/30" />
                  <span className="font-black text-sm uppercase">{cat.name}</span>
                  <Badge variant="secondary" className="text-[9px] uppercase">
                    {items.length} items
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteCategory(cat.id, cat.name)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group border border-transparent hover:border-border transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{item.name}</span>
                      <span className="text-xs text-muted-foreground font-black">
                        {item.price} MAD
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenItemDialog(item)}
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteMenuItem(item.id, item.name)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full h-10 border-dashed text-[10px] font-bold uppercase mt-2 opacity-60 hover:opacity-100"
                  onClick={() => onOpenItemDialog(undefined, cat.id)}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add to {cat.name}
                </Button>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}