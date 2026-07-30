"use client";

import { Excursion } from "@/hooks/useCatalog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Compass,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface ExcursionsTabProps {
  excursions: Excursion[];
  onOpenDialog: (excursion?: Excursion) => void;
  onDelete: (id: number, name: string) => void;
  onToggleAvailability?: (id: number, currentStatus: boolean) => Promise<void>;
}

export function ExcursionsTab({
  excursions,
  onOpenDialog,
  onDelete,
  onToggleAvailability,
}: ExcursionsTabProps) {
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggleVisibility = async (excursion: Excursion) => {
    if (!onToggleAvailability) return;
    setTogglingId(excursion.id);
    try {
      const currentStatus = excursion.is_available ?? true;
      await onToggleAvailability(excursion.id, !currentStatus);
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
            Tours & Experiences
          </h3>
          <p className="text-xs text-muted-foreground">
            Local day trips, desert tours, and guest activities
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 text-xs font-black uppercase tracking-wide px-4"
          onClick={() => onOpenDialog()}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Excursion
        </Button>
      </div>

      {excursions.length === 0 ? (
        <Card className="p-12 border-dashed bg-card/50 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
          <Compass className="w-10 h-10 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-bold text-foreground">No excursions listed</p>
            <p className="text-xs">
              Offer experiences like desert dinners, city walking tours, or quad biking.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenDialog()}
            className="mt-2 text-xs font-black uppercase"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Experience
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {excursions.map((ex) => {
            const isVisible = ex.is_available ?? true;
            const isToggling = togglingId === ex.id;

            return (
              <Card
                key={ex.id}
                className={`overflow-hidden bg-card border transition-all animate-in fade-in duration-300 ${
                  isVisible
                    ? "border-border/80 hover:border-primary/40 shadow-2xs"
                    : "border-border/40 bg-muted/20 opacity-60"
                }`}
              >
                {ex.image_url && (
                  <div className="w-full h-28 overflow-hidden">
                    <img
                      src={ex.image_url}
                      alt={ex.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm uppercase tracking-tight text-foreground truncate">
                          {ex.name}
                        </span>
                        {!isVisible && (
                          <Badge variant="destructive" className="text-[9px] font-black uppercase px-1.5 py-0">
                            Hidden
                          </Badge>
                        )}
                      </div>
                      {ex.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {ex.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs font-bold pt-0.5">
                        <span className="text-primary font-black">{ex.price} MAD</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{ex.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant={isVisible ? "outline" : "secondary"}
                        disabled={isToggling}
                        onClick={() => handleToggleVisibility(ex)}
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
                        onClick={() => onOpenDialog(ex)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit Experience"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(ex.id, ex.name)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
