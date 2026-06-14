"use client";

import { useState, useEffect } from "react";
import { 
  Home, 
  Utensils, 
  Sparkles, 
  History, 
  Wifi, 
  MapPin, 
  ChevronRight, 
  Clock,
  Info,
  ShoppingBag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- SUB-COMPONENTS ---

// 1. HOME VIEW
const HomeView = ({ riadName }: { riadName: string }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Welcome Card */}
    <div className="space-y-1">
      <h2 className="text-2xl font-black tracking-tight text-foreground">Marhaba,</h2>
      <p className="text-muted-foreground font-medium">Welcome to {riadName}. Everything you need is at your fingertips.</p>
    </div>

    {/* WiFi Access (High Priority) */}
    <Card className="p-4 bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20 relative overflow-hidden">
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 opacity-80" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Guest WiFi</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-lg font-black leading-none mb-1">Riad_Guest_2G</p>
            <p className="text-xs font-bold opacity-70">Pass: marrakech2024</p>
          </div>
          <Button size="sm" variant="secondary" className="h-8 font-bold text-[10px] uppercase">Copy</Button>
        </div>
      </div>
      <Wifi className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
    </Card>

    {/* Quick Recommendations */}
    <div className="space-y-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Local Favorites</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {["Le Jardin Secret", "Cafe des Epices", "Nomad"].map((place) => (
          <Card key={place} className="min-w-[160px] p-3 bg-card border-border shadow-sm">
            <div className="aspect-square bg-muted rounded-xl mb-3" />
            <p className="font-bold text-sm leading-tight">{place}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-1">4 mins walk</p>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// 2. MENU VIEW (Simplified for now)
const MenuView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-black tracking-tight">Food & Drinks</h2>
      <Badge variant="outline" className="font-bold border-emerald-500/20 text-emerald-500">Kitchen Open</Badge>
    </div>

    <div className="space-y-3">
      {["Mint Tea", "Moroccan Breakfast", "Tagine Kefta"].map((item) => (
        <Card key={item} className="p-3 bg-card border-border flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-xl shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sm">{item}</p>
            <p className="text-xs text-muted-foreground font-medium">Traditional style</p>
            <p className="text-sm font-black mt-1">25 MAD</p>
          </div>
          <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </Card>
      ))}
    </div>
  </div>
);

// --- MAIN PORTAL ---

export default function GuestPortal({ params }: { params: { token: string } }) {
  const [activeTab, setActiveTab] = useState<"home" | "menu" | "services" | "history">("home");
  const [isExpired, setIsExpired] = useState(false); // Toggle to simulate "Checked Out"

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden max-w-md mx-auto border-x border-border/50">
      
      {/* 1. TOP BRANDING HEADER (Sticky) */}
      <header className="px-6 pt-8 pb-4 bg-background z-20 flex justify-between items-start">
        <div className="flex flex-col">
          <div className="w-10 h-10 bg-primary rounded-xl mb-3 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-black text-xl">R</span>
          </div>
          <h1 className="font-black text-xs uppercase tracking-[0.2em] opacity-50">Riad Al Jazirah</h1>
        </div>
        {isExpired ? (
          <Badge variant="destructive" className="font-bold text-[10px] uppercase">Session Expired</Badge>
        ) : (
          <Badge variant="secondary" className="font-bold text-[10px] uppercase bg-emerald-500/10 text-emerald-500 border-none">Room 3 • Active</Badge>
        )}
      </header>

      {/* 2. SCROLLABLE CONTENT AREA */}
      <ScrollArea className="flex-1 px-6 pb-32">
        {activeTab === "home" && <HomeView riadName="Al Jazirah" />}
        {activeTab === "menu" && <MenuView />}
        {activeTab === "services" && (
           <div className="py-20 text-center text-muted-foreground font-medium">Services view coming soon...</div>
        )}
        {activeTab === "history" && (
           <div className="py-20 text-center text-muted-foreground font-medium">Your activity history...</div>
        )}
      </ScrollArea>

      {/* 3. FLOATING CART NOTIFICATION (Only if items in cart) */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-30 pointer-events-none">
        <Button className="w-full h-12 rounded-full shadow-2xl bg-foreground text-background font-black uppercase text-xs tracking-widest pointer-events-auto">
          View My Order (2) • 140 MAD
        </Button>
      </div>

      {/* 4. STICKY BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-xl border-t border-border flex items-center justify-around px-6 z-40 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-primary scale-110' : 'text-muted-foreground'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        
        <button 
          onClick={() => setActiveTab("menu")}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'menu' ? 'text-primary scale-110' : 'text-muted-foreground'}`}
        >
          <Utensils className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
        </button>

        <button 
          onClick={() => setActiveTab("services")}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'services' ? 'text-primary scale-110' : 'text-muted-foreground'}`}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Spa</span>
        </button>

        <button 
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-primary scale-110' : 'text-muted-foreground'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Activity</span>
        </button>
      </nav>

    </div>
  );
}