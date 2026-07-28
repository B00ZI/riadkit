"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, Wifi, Coffee, Bath, Droplets, Snowflake, Bell, Scissors, Dumbbell } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface Service {
  id: string;
  name: string;
  price: number;
  is_available?: boolean;
  icon?: string; // optional icon name if we want to customise
}

interface ServicesTabProps {
  services: Service[];
  isExpired: boolean;
  onRequestItem: (item: Service & { requestType: string }) => void;
}

// Map service names to icons (you can expand this)
const getServiceIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi")) return Wifi;
  if (lower.includes("coffee") || lower.includes("tea")) return Coffee;
  if (lower.includes("bath") || lower.includes("shower")) return Bath;
  if (lower.includes("water") || lower.includes("drink")) return Droplets;
  if (lower.includes("air")) return Snowflake;
  if (lower.includes("bell") || lower.includes("concierge")) return Bell;
  if (lower.includes("hair") || lower.includes("barber")) return Scissors;
  if (lower.includes("gym") || lower.includes("fitness")) return Dumbbell;
  return ShoppingBag; // default
};

export const ServicesTab = ({ services, isExpired, onRequestItem }: ServicesTabProps) => (
  <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300 py-5 px-6 space-y-4">
    <div>
      <h2 className="text-xl font-black uppercase tracking-tight">Room Services</h2>
      <p className="text-xs text-muted-foreground font-medium">Housekeeping, extra amenities, and special requests</p>
    </div>

    {services.length === 0 ? (
      <EmptyState
        icon={Sparkles}
        title="No Services Listed"
        message="Need anything for your room? Chat directly with front desk reception."
      />
    ) : (
      <div className="grid gap-4">
        {services.map((item) => {
          const isAvailable = item.is_available ?? true;
          const Icon = getServiceIcon(item.name);

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
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/5 text-primary rounded-xl border border-primary/10 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-base uppercase tracking-tight text-foreground">
                      {item.name}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                      {item.price > 0 ? `${item.price} MAD` : "Free"}
                    </span>
                  </div>
                </div>

                <Button
                  disabled={!isAvailable || isExpired}
                  onClick={() => onRequestItem({ ...item, requestType: "service" })}
                  variant="outline"
                  className="w-full h-9 text-xs font-medium uppercase tracking-wider rounded-xl border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all"
                >
                  {isAvailable ? "Request" : "Unavailable"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    )}
  </div>
);