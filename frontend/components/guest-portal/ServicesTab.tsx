// components/guest-portal/ServicesTab.tsx
"use client";

import { Service } from "@/hooks/useCatalog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface ServicesTabProps {
  services: Service[];
  onOpenDialog: (service?: Service) => void;
  onDelete: (id: number, name: string) => void;
}

export function ServicesTab({ services, onOpenDialog, onDelete }: ServicesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Room Services
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-[10px] font-black uppercase"
          onClick={() => onOpenDialog()}
        >
          <Plus className="w-3 h-3 mr-1" /> New Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="p-8 border-border bg-card text-center text-muted-foreground">
          <p className="text-sm font-medium">No services yet</p>
          <p className="text-xs">Add services for your guests</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {services.map((svc) => (
            <Card
              key={svc.id}
              className="p-4 bg-card border-border flex justify-between items-center group"
            >
              <div className="space-y-1">
                <p className="font-black text-sm uppercase">{svc.name}</p>
                <p className="text-xs font-bold text-muted-foreground">
                  {svc.price ? `${svc.price} MAD` : "Complimentary"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-[9px] uppercase">
                  {svc.requires_quantity ? "Qty Required" : "Request Only"}
                </Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenDialog(svc)}
                    className="text-muted-foreground"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(svc.id, svc.name)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}