"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  Copy,
  Check,
  Utensils,
  Compass,
  Sparkles,
  ConciergeBell,
  ArrowRight,
  Coffee,
  Clock,
  Moon,
  CigaretteOff,
} from "lucide-react";
import { useState } from "react";

interface RiadInfo {
  name: string;
  description: string;
  wifiName: string;
  wifiPassword: string;
  whatsappNumber: string;
}

interface HomeTabProps {
  riad: RiadInfo;
  roomNumber: string;
  onNavigate: (tab: "menu" | "explore" | "services") => void;
  onWhatsAppClick: () => void;
}

export const HomeTab = ({ riad, onNavigate, onWhatsAppClick }: HomeTabProps) => {
  const [copiedWifi, setCopiedWifi] = useState(false);

  const copyWifiPassword = () => {
    if (riad.wifiPassword) {
      navigator.clipboard.writeText(riad.wifiPassword);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300 px-6 py-5 space-y-7">
      {/* Welcome Banner */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
          Marhaba • Welcome
        </span>
        <h2 className="text-2xl font-black tracking-tight uppercase">Enjoy Your Stay</h2>
        {riad.description && (
          <p className="text-xs text-muted-foreground font-medium leading-relaxed pt-1">
            {riad.description}
          </p>
        )}
      </div>

      {/* WiFi Card */}
      <Card className="w-full p-5 bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground border-none shadow-lg shadow-primary/15 relative overflow-hidden rounded-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Wifi className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">High-Speed Guest WiFi</span>
          </div>
          <div className="flex justify-between items-end gap-2">
            <div className="min-w-0">
              <p className="text-sm font-black truncate text-primary-foreground/90">
                Network: <span className="text-base text-white">{riad.wifiName || "Riad_Guest"}</span>
              </p>
              <p className="text-xs font-bold text-primary-foreground/75 truncate mt-0.5">
                Password: {riad.wifiPassword || "Available at reception"}
              </p>
            </div>
            {riad.wifiPassword && (
              <Button
                variant="secondary"
                size="sm"
                className="font-black text-[10px] uppercase h-8 px-3 shrink-0 bg-white text-primary hover:bg-white/90 shadow-sm"
                onClick={copyWifiPassword}
              >
                {copiedWifi ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        <Wifi className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12 pointer-events-none" />
      </Card>

      {/* What We Offer (Quick Links) */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">What We Offer</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickLink
            icon={Utensils}
            label="In-Room Menu"
            sub="Food, tea & drinks"
            onClick={() => onNavigate("menu")}
            color="emerald"
          />
          <QuickLink
            icon={Compass}
            label="Tours & Trips"
            sub="Desert & city tours"
            onClick={() => onNavigate("explore")}
            color="emerald"
          />
          <QuickLink
            icon={Sparkles}
            label="Room Services"
            sub="Towels, spa & requests"
            onClick={() => onNavigate("services")}
            color="emerald"
          />
          <QuickLink
            icon={ConciergeBell}
            label="Concierge"
            sub="WhatsApp reception"
            onClick={onWhatsAppClick}
            color="emerald"
          />
        </div>
      </div>

      {/* House Rules */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Guest Info & House Rules
        </h3>
        <div className="bg-card rounded-2xl border border-border/80 divide-y divide-border/60 overflow-hidden shadow-2xs">
          <RuleItem icon={Coffee} label="Breakfast Served" detail="Courtyard & Terrace" value="08:30 — 10:30 AM" color="amber" />
          <RuleItem icon={Clock} label="Check-Out Time" detail="Late check-out upon request" value="11:00 AM" color="blue" />
          <RuleItem icon={Moon} label="Quiet Hours" detail="Please respect other guests" value="10:00 PM — 08:00 AM" color="purple" />
          <RuleItem icon={CigaretteOff} label="Smoking Policy" detail="Allowed only on rooftop terrace" value="Terrace Only" color="rose" valueIsBadge />
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for HomeTab ---

const QuickLink = ({
  icon: Icon,
  label,
  sub,
  onClick,
  color = "primary",
}: {
  icon: any;
  label: string;
  sub: string;
  onClick: () => void;
  color?: "primary" | "emerald";
}) => {
  const colorClasses = color === "emerald" ? "emerald" : "primary";
  return (
    <button
      onClick={onClick}
      className="p-4 bg-card border border-border/80 rounded-2xl text-left hover:border-primary/50 transition-all shadow-2xs group flex flex-col justify-between h-28"
    >
      <div className={`w-8 h-8 rounded-xl bg-${colorClasses}-500/10 text-${colorClasses}-600 flex items-center justify-center`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-foreground">{label}</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </div>
        <p className="text-[10px] text-muted-foreground font-medium">{sub}</p>
      </div>
    </button>
  );
};

const RuleItem = ({
  icon: Icon,
  label,
  detail,
  value,
  color = "amber",
  valueIsBadge = false,
}: {
  icon: any;
  label: string;
  detail: string;
  value: string;
  color?: "amber" | "blue" | "purple" | "rose";
  valueIsBadge?: boolean;
}) => {
  const colorMap = {
    amber: "text-amber-600 bg-amber-500/10",
    blue: "text-blue-600 bg-blue-500/10",
    purple: "text-purple-600 bg-purple-500/10",
    rose: "text-rose-600 bg-rose-500/10",
  };
  return (
    <div className="flex items-center justify-between p-3.5">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${colorMap[color]} rounded-xl`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground">{detail}</p>
        </div>
      </div>
      {valueIsBadge ? (
        <span className={`text-[10px] font-black uppercase ${colorMap[color]} px-2 py-0.5 rounded-full`}>
          {value}
        </span>
      ) : (
        <span className="text-xs font-black text-foreground">{value}</span>
      )}
    </div>
  );
};