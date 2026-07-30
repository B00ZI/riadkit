"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, Clock } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface Excursion {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: string;
  is_available?: boolean;
  image_url?: string;
}

interface ExploreTabProps {
  excursions: Excursion[];
  isExpired: boolean;
  onRequestItem: (item: Excursion & { requestType: string }) => void;
  currency?: string;
}

export const ExploreTab = ({ excursions, isExpired, onRequestItem, currency = "MAD" }: ExploreTabProps) => (
  <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300 py-5 px-6 space-y-4">
    <div>
      <h2 className="text-xl font-black uppercase tracking-tight">Tours & Experiences</h2>
      <p className="text-xs text-muted-foreground font-medium">Handpicked excursions and local activities</p>
    </div>

    {excursions.length === 0 ? (
      <EmptyState
        icon={Compass}
        title="No Trips Available"
        message="We are putting together exciting new excursions. Ask reception for custom tour arrangements!"
      />
    ) : (
      <div className="space-y-4">
        {excursions.map((item) => {
          const isAvailable = item.is_available ?? true;

          return (
            <Card
              key={item.id}
              className={`overflow-hidden bg-card border-border/80 rounded-2xl shadow-2xs transition-all space-y-0 ${
                !isAvailable ? "opacity-60" : "hover:border-primary/40"
              }`}
            >
              {item.image_url && (
                <div className="w-full h-36 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <span className="font-black text-sm uppercase tracking-tight text-foreground block">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <span className="text-primary font-black bg-primary/10 px-2 py-0.5 rounded-md">
                      {item.price} {currency}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
                {!isAvailable && (
                  <Badge variant="destructive" className="text-[8px] font-black uppercase px-2">
                    Fully Booked
                  </Badge>
                )}
              </div>

              {item.description && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              )}

              <Button
                disabled={!isAvailable || isExpired}
                onClick={() => onRequestItem({ ...item, requestType: "excursion" })}
                variant={isAvailable ? "outline" : "secondary"}
                className="w-full h-10 font-black uppercase text-[10px] tracking-wider border-border/80 rounded-xl"
              >
                {isAvailable ? "Inquire / Book" : "Unavailable"}
              </Button>
            </div>
            </Card>
          );
        })}
      </div>
    )}
  </div>
);
