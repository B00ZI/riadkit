// components/guest-portal/ExcursionsTab.tsx
"use client";

import { Excursion } from "@/hooks/useCatalog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Pencil, Trash2 } from "lucide-react";

interface ExcursionsTabProps {
  excursions: Excursion[];
  onOpenDialog: (excursion?: Excursion) => void;
  onDelete: (id: number, name: string) => void;
}

export function ExcursionsTab({ excursions, onOpenDialog, onDelete }: ExcursionsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Tours & Experiences
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-[10px] font-black uppercase"
          onClick={() => onOpenDialog()}
        >
          <Plus className="w-3 h-3 mr-1" /> New Trip
        </Button>
      </div>

      {excursions.length === 0 ? (
        <Card className="p-8 border-border bg-card text-center text-muted-foreground">
          <p className="text-sm font-medium">No excursions yet</p>
          <p className="text-xs">Add an experience for your guests</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {excursions.map((ex) => (
            <Card
              key={ex.id}
              className="p-4 bg-card border-border flex justify-between items-center group"
            >
              <div className="space-y-1">
                <p className="font-black text-sm uppercase">{ex.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold">
                  <span>{ex.price} MAD</span>
                  <span className="w-px h-3 bg-muted-foreground/30" />
                  <Clock className="w-3 h-3" />
                  <span>{ex.duration}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenDialog(ex)}
                  className="text-muted-foreground"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(ex.id, ex.name)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}