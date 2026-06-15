"use client";

import { useState } from "react";
import { 
  Home as HomeIcon, Utensils, Compass, Sparkles, Wifi, Copy, 
  MessageCircle, MapPin, Clock, Plus, Minus, CheckCircle2, 
  XCircle, ExternalLink, ShoppingBag, Droplets, Wind
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer, DrawerClose, DrawerContent, DrawerDescription, 
  DrawerFooter, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";

type RequestType = 'order' | 'interested';
type RequestItem = { name: string, type: RequestType, price: string };

// --- EXPANDED MOCK DATA ---
const RIAD_DATA = {
  name: "Riad Al Jazirah",
  wifi: { ssid: "Riad_Guest_WiFi", pass: "marrakech2024" },
  whatsapp: "+212600000000",
  rules: [
    { label: "Check-in", value: "14:00" }, 
    { label: "Check-out", value: "11:00" }, 
    { label: "Breakfast", value: "08:30 - 10:30" },
  ]
};

const MENU_ITEMS = [
  { id: 1, name: "Moroccan Breakfast", category: "Breakfast", price: "75 MAD", type: "interested", desc: "Fresh msemen, eggs, olives, and mint tea.", emoji: "�" },
  { id: 2, name: "Mint Tea", category: "Drinks", price: "25 MAD", type: "order", desc: "Traditional sweet green tea with fresh mint.", emoji: "�" },
  { id: 3, name: "Orange Juice", category: "Drinks", price: "30 MAD", type: "order", desc: "Freshly squeezed local oranges.", emoji: "�" },
  { id: 4, name: "Tagine Kefta", category: "Lunch", price: "120 MAD", type: "interested", desc: "Meatballs in rich tomato sauce with eggs.", emoji: "�" },
  { id: 5, name: "Chicken Pastilla", category: "Dinner", price: "150 MAD", type: "interested", desc: "Sweet and savory chicken pie dusted with cinnamon.", emoji: "�" },
  { id: 6, name: "Seasonal Fruits", category: "Desserts", price: "45 MAD", type: "order", desc: "Fresh local fruits with orange blossom water.", emoji: "�" },
];

const EXPLORE_ITEMS = [
  { id: 1, name: "Agafay Desert Dinner", category: "Tours", price: "650 MAD", duration: "5 Hours", type: "interested", desc: "Camel ride & traditional dinner under the stars.", img: "�" },
  { id: 2, name: "Royal Hammam", category: "Spa", price: "450 MAD", duration: "1.5 Hours", type: "interested", desc: "Traditional scrub and relaxing argan oil massage.", img: "�" },
  { id: 3, name: "Atlas Mountains Trip", category: "Trips", price: "800 MAD", duration: "Full Day", type: "interested", desc: "Visit Berber villages and stunning waterfalls.", img: "⛰️" },
];

const SERVICE_ITEMS = [
  { id: 1, name: "Large Water Bottle", category: "Room", price: "20 MAD", type: "order", icon: <Droplets className="w-5 h-5 text-blue-500" /> },
  { id: 2, name: "Fresh Towels", category: "Room", price: "Free", type: "order", icon: <Wind className="w-5 h-5 text-emerald-500" /> },
  { id: 3, name: "Room Cleaning", category: "Room", price: "Free", type: "interested", icon: <Sparkles className="w-5 h-5 text-amber-500" /> },
  { id: 4, name: "Laundry Service", category: "Laundry", price: "Varies", type: "interested", icon: <ShoppingBag className="w-5 h-5 text-purple-500" /> },
];

export default function GuestPortal() {
  const [activeTab, setActiveTab] = useState("home");
  const [sessionActive] = useState(true); 
  
  const [requestItem, setRequestItem] = useState<RequestItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [menuFilter, setMenuFilter] = useState("All");
  const [exploreFilter, setExploreFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");

  const handleRequest = () => {
    if (!sessionActive) return;
    setShowSuccess(true);
    setRequestItem(null);
  };

  return (
    <div className="relative flex flex-col w-full h-[100dvh] max-w-md mx-auto bg-background text-foreground overflow-hidden sm:border-x sm:border-border/50 sm:shadow-2xl">
      
      {/* 1. BRANDING HEADER */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start shrink-0 w-full bg-background z-10">
        <div className="space-y-1">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-black text-xl">R</span>
          </div>
          <h1 className="font-black text-[10px] uppercase tracking-widest opacity-50">{RIAD_DATA.name}</h1>
        </div>
        {!sessionActive && (
          <Badge variant="destructive" className="font-black text-[10px] uppercase tracking-widest">View Only</Badge>
        )}
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT (Native scrolling, strict width) */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <div className="w-full pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 space-y-1 mb-8">
              <h2 className="text-3xl font-black tracking-tighter">Welcome.</h2>
              <p className="text-muted-foreground font-medium text-sm">Your digital concierge in the heart of the Medina.</p>
            </div>

            <div className="px-6 space-y-6">
              {/* WiFi Card */}
              <Card className="w-full p-5 bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 opacity-80">
                    <Wifi className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Guest WiFi</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="min-w-0">
                      <p className="text-lg font-black leading-none mb-1 truncate">{RIAD_DATA.wifi.ssid}</p>
                      <p className="text-xs font-bold opacity-80 truncate">{RIAD_DATA.wifi.pass}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="font-bold text-[10px] uppercase h-8 px-4 text-foreground shrink-0">Copy</Button>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <Button onClick={() => setActiveTab("menu")} variant="outline" className="flex-col h-20 gap-2 font-black text-[10px] uppercase border-border">
                  <Utensils className="w-5 h-5 text-muted-foreground" /> Menu
                </Button>
                <Button onClick={() => setActiveTab("explore")} variant="outline" className="flex-col h-20 gap-2 font-black text-[10px] uppercase border-border">
                  <Compass className="w-5 h-5 text-muted-foreground" /> Explore
                </Button>
                <Button variant="outline" className="flex-col h-20 gap-2 font-black text-[10px] uppercase border-border">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" /> Chat
                </Button>
              </div>

              {/* Riad Info */}
              <div className="space-y-3 w-full">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Information</h3>
                <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
                  {RIAD_DATA.rules.map((rule) => (
                    <div key={rule.label} className="flex justify-between p-4 items-center w-full">
                      <span className="text-sm font-semibold truncate pr-4">{rule.label}</span>
                      <span className="text-sm font-black text-primary shrink-0">{rule.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Local Tips (Horizontal Scroll bleeds to edges safely) */}
            <div className="mt-8 space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-6">Local Tips</h3>
              <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex gap-4 px-6 w-max pb-4">
                  {["Le Jardin Secret", "Bahia Palace", "Cafe des Epices"].map((place) => (
                    <Card key={place} className="w-[200px] p-4 bg-card border-border shrink-0 flex flex-col justify-between">
                      <div className="space-y-1 mb-4">
                        <p className="font-bold text-sm truncate">{place}</p>
                        <p className="text-xs text-muted-foreground leading-tight line-clamp-2">A beautiful landmark located just a short walk from the Riad.</p>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full font-bold text-[10px] uppercase h-8"><MapPin className="w-3 h-3 mr-1" /> View Map</Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU */}
        {activeTab === "menu" && (
          <div className="w-full pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 space-y-1 mb-6">
              <h2 className="text-2xl font-black tracking-tight">Food & Drink</h2>
            </div>
            
            {/* Filter Pills */}
            <div className="w-full overflow-x-auto mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               <div className="flex gap-2 px-6 w-max pb-1">
                 {['All', 'Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Desserts'].map(cat => (
                   <Badge 
                      key={cat} 
                      onClick={() => setMenuFilter(cat)}
                      variant={menuFilter === cat ? 'default' : 'secondary'} 
                      className="px-4 py-1.5 font-bold uppercase text-[10px] rounded-md cursor-pointer transition-colors"
                   >
                      {cat}
                   </Badge>
                 ))}
               </div>
            </div>

            {/* Items */}
            <div className="px-6 space-y-3">
               {MENU_ITEMS.filter(item => menuFilter === "All" || item.category === menuFilter).map(item => (
                 <Card key={item.id} className="p-3 bg-card border-border flex items-center gap-4 w-full overflow-hidden">
                    <div className="w-16 h-16 bg-muted/50 rounded-xl shrink-0 flex items-center justify-center text-3xl shadow-inner">
                      {item.emoji}
                    </div>
                    {/* min-w-0 ensures truncation works and doesn't push the flex parent wide */}
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <p className="font-black text-[13px] leading-tight truncate">{item.name}</p>
                      <p className="text-xs font-black text-primary">{item.price}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                    </div>
                    <Button 
                      onClick={() => { setRequestItem({name: item.name, type: item.type as RequestType, price: item.price}); setQuantity(1); }}
                      variant={item.type === 'order' ? 'default' : 'outline'}
                      className={`shrink-0 font-black text-[9px] uppercase h-8 px-3 ${item.type === 'interested' ? 'border-border' : ''}`}
                    >
                      {item.type === 'order' ? 'Order' : 'Interested'}
                    </Button>
                 </Card>
               ))}
            </div>
          </div>
        )}

        {/* TAB 3: EXPLORE */}
        {activeTab === "explore" && (
          <div className="w-full pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 space-y-1 mb-6">
              <h2 className="text-2xl font-black tracking-tight">Experiences</h2>
            </div>
            
            <div className="w-full overflow-x-auto mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               <div className="flex gap-2 px-6 w-max pb-1">
                 {['All', 'Tours', 'Spa', 'Trips', 'Guide'].map(cat => (
                   <Badge 
                      key={cat} onClick={() => setExploreFilter(cat)}
                      variant={exploreFilter === cat ? 'default' : 'secondary'} 
                      className="px-4 py-1.5 font-bold uppercase text-[10px] rounded-md cursor-pointer"
                   >
                      {cat}
                   </Badge>
                 ))}
               </div>
            </div>

            <div className="px-6 space-y-4">
               {EXPLORE_ITEMS.filter(item => exploreFilter === "All" || item.category === exploreFilter).map(item => (
                 <Card key={item.id} className="overflow-hidden border-border bg-card w-full flex flex-col">
                    <div className="aspect-video bg-muted/50 flex items-center justify-center text-6xl">
                      {item.img}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <p className="font-black text-[15px] uppercase tracking-tight leading-tight">{item.name}</p>
                        <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {item.duration} • <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">{item.price}</Badge>
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                      <Button 
                        onClick={() => { setRequestItem({name: item.name, type: 'interested', price: item.price}); }}
                        variant="outline" className="w-full h-10 font-black uppercase text-[10px] border-border"
                      >
                        I'm Interested
                      </Button>
                    </div>
                 </Card>
               ))}
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES */}
        {activeTab === "services" && (
          <div className="w-full pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 space-y-1 mb-6">
              <h2 className="text-2xl font-black tracking-tight">Room Services</h2>
            </div>
            
            <div className="w-full overflow-x-auto mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               <div className="flex gap-2 px-6 w-max pb-1">
                 {['All', 'Room', 'Laundry', 'Other'].map(cat => (
                   <Badge 
                      key={cat} onClick={() => setServiceFilter(cat)}
                      variant={serviceFilter === cat ? 'default' : 'secondary'} 
                      className="px-4 py-1.5 font-bold uppercase text-[10px] rounded-md cursor-pointer"
                   >
                      {cat}
                   </Badge>
                 ))}
               </div>
            </div>

            <div className="px-6 space-y-3">
               {SERVICE_ITEMS.filter(item => serviceFilter === "All" || item.category === serviceFilter).map(item => (
                 <Card key={item.id} className="p-3 bg-card border-border flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-muted/30 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <p className="font-bold text-[13px] truncate">{item.name}</p>
                      <p className={`text-[10px] font-black uppercase ${item.price === 'Free' ? 'text-emerald-500' : 'text-muted-foreground'}`}>{item.price}</p>
                    </div>
                    <Button 
                      onClick={() => { setRequestItem({name: item.name, type: item.type as RequestType, price: item.price}); setQuantity(1); }}
                      variant={item.type === 'order' ? 'default' : 'outline'}
                      className={`shrink-0 font-black text-[9px] uppercase h-8 px-4 ${item.type === 'interested' ? 'border-border' : ''}`}
                    >
                      {item.type === 'order' ? 'Order' : 'Request'}
                    </Button>
                 </Card>
               ))}
            </div>
          </div>
        )}
      </main>

      {/* 3. STICKY BOTTOM NAV (Absolute to bottom of container) */}
      <nav className="absolute bottom-0 w-full h-[84px] pb-safe bg-card/90 backdrop-blur-xl border-t border-border flex items-center justify-around px-6 z-50">
        {[
          { id: 'home', icon: HomeIcon, label: 'Home' },
          { id: 'menu', icon: Utensils, label: 'Menu' },
          { id: 'explore', icon: Compass, label: 'Explore' },
          { id: 'services', icon: Sparkles, label: 'Services' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`flex flex-col items-center gap-1.5 transition-all w-16 pt-3 pb-3 ${activeTab === tab.id ? 'text-primary scale-110' : 'text-muted-foreground opacity-60'}`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* --- REQUEST DRAWER --- */}
      <Drawer open={!!requestItem} onOpenChange={(open) => !open && setRequestItem(null)}>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle className="font-black uppercase tracking-tight text-center">{requestItem?.name}</DrawerTitle>
            <DrawerDescription className="text-center font-medium text-xs">
              {requestItem?.type === 'order' ? 'Select quantity.' : 'We will coordinate with you shortly.'}
            </DrawerDescription>
          </DrawerHeader>

          {requestItem?.type === 'order' && (
            <div className="flex items-center justify-center gap-8 py-6">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-full h-12 w-12 border-border"><Minus className="w-5 h-5" /></Button>
              <span className="text-4xl font-black w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} className="rounded-full h-12 w-12 border-border"><Plus className="w-5 h-5" /></Button>
            </div>
          )}

          <DrawerFooter className="pt-4 pb-8">
            {!sessionActive ? (
              <div className="p-4 bg-destructive/10 text-destructive text-center rounded-xl border border-destructive/20">
                 <p className="text-xs font-black uppercase tracking-tight flex items-center justify-center gap-2"><XCircle className="w-4 h-4" /> Session Expired</p>
                 <p className="text-[10px] font-bold mt-1 opacity-80">Please contact reception directly.</p>
              </div>
            ) : (
              <Button onClick={handleRequest} className="h-12 font-black uppercase tracking-widest text-xs">
                Confirm {requestItem?.type === 'order' ? 'Order' : 'Request'}
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="ghost" className="font-bold uppercase text-[10px] text-muted-foreground">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* --- SUCCESS MODAL --- */}
      <Drawer open={showSuccess} onOpenChange={setShowSuccess}>
         <DrawerContent className="max-w-md mx-auto pb-8">
            <div className="p-8 flex flex-col items-center text-center space-y-5">
               <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 text-white" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase tracking-tight">Request Sent!</h3>
                  <p className="text-xs font-bold text-muted-foreground">Reception will update your status shortly.</p>
               </div>
               <Button variant="outline" className="w-full h-12 border-border font-bold flex items-center gap-2 text-xs uppercase">
                  <MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp Concierge
               </Button>
               <Button onClick={() => setShowSuccess(false)} variant="ghost" className="font-bold text-[10px] uppercase text-muted-foreground">Close</Button>
            </div>
         </DrawerContent>
      </Drawer>
    </div>
  );
}