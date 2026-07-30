"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface HeaderProps {
  riadName: string;
  roomNumber: string;
  isExpired: boolean;
  whatsappNumber?: string;
  logoUrl?: string;
  onWhatsAppClick: () => void;
}

export const Header = ({
  riadName,
  roomNumber,
  isExpired,
  whatsappNumber,
  logoUrl,
  onWhatsAppClick,
}: HeaderProps) => (
  <header className="px-6 pt-6 pb-4 flex justify-between items-center shrink-0 w-full bg-background/80 backdrop-blur-md border-b border-border/40 z-20">
    <div className="flex items-center gap-3">
      {logoUrl ? (
        <img src={logoUrl} alt={riadName} className="w-9 h-9 rounded-xl object-cover shadow-md" />
      ) : (
        <div className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-black text-lg italic shadow-md shadow-primary/20">
          {riadName?.charAt(0) || "R"}
        </div>
      )}
      <div>
        <h1 className="font-black text-xs uppercase tracking-wider text-foreground line-clamp-1">
          {riadName}
        </h1>
        <p className="text-[10px] font-bold text-muted-foreground">Room {roomNumber}</p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      {whatsappNumber && (
        <Button
          size="icon"
          variant="outline"
          onClick={onWhatsAppClick}
          className="h-8 w-8 rounded-full border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          title="Contact Reception"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-500/10" />
        </Button>
      )}

      {isExpired ? (
        <Badge variant="destructive" className="font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5">
          Expired
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="font-black text-[9px] uppercase tracking-wider border-emerald-500/40 text-emerald-600 bg-emerald-500/5 px-2.5 py-0.5"
        >
          Live
        </Badge>
      )}
    </div>
  </header>
);
