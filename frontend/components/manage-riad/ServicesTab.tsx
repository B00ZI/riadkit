"use client";

import { Service } from "@/hooks/useCatalog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface ServicesTabProps {
  services: Service[];
  onOpenDialog: (service?: Service) => void;
  onDelete: (id: number, name: string) => void;
  onToggleAvailability?: (id: number, currentStatus: boolean) => Promise<void>;
}

export function ServicesTab({
  services,
  onOpenDialog,
  onDelete,
  onToggleAvailability,
}: ServicesTabProps) {
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggleVisibility = async (svc: Service) => {
    if (!onToggleAvailability) return;
    setTogglingId(svc.id);
    try {
      await onToggleAvailability(svc.id, !svc.is_available);
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
            Room Services
          </h3>
          <p className="text-xs text-muted-foreground">
            In-room amenities, housekeeping, and special requests
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 text-xs font-black uppercase tracking-wide px-4"
          onClick={() => onOpenDialog()}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="p-12 border-dashed bg-card/50 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
          <Sparkles className="w-10 h-10 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-bold text-foreground">No services configured</p>
            <p className="text-xs">
              Add services for your guests (e.g., Extra Towels, Room Cleaning, Airport Shuttle).
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenDialog()}
            className="mt-2 text-xs font-black uppercase"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Service
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((svc) => {
            const isVisible = svc.is_available ?? true;
            const isToggling = togglingId === svc.id;

            return (
              <Card
                key={svc.id}
                className={`p-4 bg-card border transition-all animate-in fade-in duration-300 ${
                  isVisible
                    ? "border-border/80 hover:border-primary/40 shadow-2xs"
                    : "border-border/40 bg-muted/20 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm uppercase tracking-tight text-foreground truncate">
                        {svc.name}
                      </span>
                      {!isVisible && (
                        <Badge variant="destructive" className="text-[9px] font-black uppercase px-1.5 py-0">
                          Hidden
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[9px] font-extrabold uppercase px-2 py-0">
                        {svc.requires_quantity ? "Qty Selector" : "Single Request"}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold">
                      {svc.price ? (
                        <span className="text-primary">{svc.price} MAD</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">Complimentary</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant={isVisible ? "outline" : "secondary"}
                      disabled={isToggling}
                      onClick={() => handleToggleVisibility(svc)}
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
                      onClick={() => onOpenDialog(svc)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Edit Service"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(svc.id, svc.name)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
