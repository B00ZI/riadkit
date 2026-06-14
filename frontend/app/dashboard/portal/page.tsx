"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Info, 
  Plus, 
  Trash2,
  Smartphone,
  Wifi,
  MapPin,
  Compass,
  Clock,
  ExternalLink,
  GripVertical,
  Utensils,
  Sparkles
} from "lucide-react";

export default function GuestPortalManagement() {
  const [riadName, setRiadName] = useState("Riad Al Jazirah");

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Guest Portal</h1>
          <p className="text-muted-foreground text-sm font-medium">Everything your guests see on their mobile phones.</p>
        </div>
        <Button className="font-black uppercase text-xs px-8 h-11">Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE EDITOR */}
        <div className="xl:col-span-7">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-12 bg-muted/50 p-1 rounded-xl mb-6">
              <TabsTrigger value="info" className="text-xs font-black uppercase tracking-tighter">� Info</TabsTrigger>
              <TabsTrigger value="menu" className="text-xs font-black uppercase tracking-tighter">�️ Menu</TabsTrigger>
              <TabsTrigger value="explore" className="text-xs font-black uppercase tracking-tighter">� Explore</TabsTrigger>
              <TabsTrigger value="tips" className="text-xs font-black uppercase tracking-tighter">� Tips</TabsTrigger>
            </TabsList>

            {/* TAB 1: RIAD INFO */}
            <TabsContent value="info" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card className="p-6 border-border bg-card shadow-sm space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center">
                    <Info className="w-4 h-4 mr-2" /> Basic Identity
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-muted-foreground">Riad Name</Label>
                      <Input value={riadName} onChange={(e) => setRiadName(e.target.value)} className="bg-background font-semibold h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-muted-foreground">Welcome Message</Label>
                      <Textarea placeholder="Welcome to our humble home..." className="bg-background font-medium min-h-[100px]" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center">
                    <Wifi className="w-4 h-4 mr-2" /> Guest Essentials
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-muted-foreground">WiFi Name</Label>
                      <Input placeholder="Riad_Guest_WiFi" className="bg-background h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-muted-foreground">WiFi Password</Label>
                      <Input placeholder="marrakech2024" className="bg-background h-11" />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 2: MENU (Food & Drinks) */}
            <TabsContent value="menu" className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Catalog Categories</h3>
                <Button size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase border-border">
                  <Plus className="w-3 h-3 mr-1" /> Add Category
                </Button>
              </div>
              <Card className="p-4 border-border bg-card">
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground/30" />
                    <span className="font-black text-sm uppercase">Breakfast</span>
                  </div>
                  <Switch checked />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group">
                    <span className="text-sm font-semibold">Moroccan Breakfast Spread</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black">75 MAD</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-10 border-dashed text-[10px] font-bold uppercase">Add Food Item</Button>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 3: EXPLORE (Tours & Spa) */}
            <TabsContent value="explore" className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Tours & Experiences</h3>
                <Button size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase">
                  <Plus className="w-3 h-3 mr-1" /> Add Experience
                </Button>
              </div>

              {/* Example Experience Item */}
              <Card className="p-5 border-border bg-card shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                     <h4 className="font-black text-base uppercase">Agafay Desert Dinner</h4>
                     <p className="text-xs text-muted-foreground font-medium">Evening camel ride followed by traditional dinner under the stars.</p>
                   </div>
                   <Switch checked />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <Label className="text-[10px] font-bold uppercase opacity-60">Price (MAD)</Label>
                     <Input defaultValue="650" className="bg-background h-9 text-sm font-bold" />
                   </div>
                   <div className="space-y-1.5">
                     <Label className="text-[10px] font-bold uppercase opacity-60 flex items-center"><Clock className="w-3 h-3 mr-1" /> Duration</Label>
                     <Input defaultValue="5 Hours" className="bg-background h-9 text-sm font-bold" />
                   </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                   <Button variant="ghost" size="sm" className="text-xs font-bold text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                   <Button variant="secondary" size="sm" className="text-xs font-bold">Edit Details</Button>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 4: TIPS (Local Recommendations) */}
            <TabsContent value="tips" className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Local Hidden Gems</h3>
                <Button size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase">
                  <Plus className="w-3 h-3 mr-1" /> Add Tip
                </Button>
              </div>

              {/* Example Tip Item */}
              <Card className="p-4 border-border bg-card shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">Le Jardin Secret</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="w-4 h-4 text-muted-foreground" /></Button>
                </div>
                <p className="text-xs text-muted-foreground font-medium px-6">A stunning restored palace and garden in the heart of the Medina. Very peaceful for afternoon tea.</p>
                <div className="px-6">
                   <Input placeholder="Google Maps Link" className="bg-muted/30 border-none h-8 text-[11px]" defaultValue="https://maps.google.com/..." />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN: LIVE PHONE PREVIEW */}
        <div className="xl:col-span-5 hidden xl:block sticky top-24">
          <div className="flex flex-col items-center">
            <div className="relative w-[310px] h-[630px] bg-zinc-950 rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl overflow-hidden ring-1 ring-zinc-800">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-900 rounded-b-2xl z-20" />
              <div className="w-full h-full bg-background overflow-hidden flex flex-col pt-8">
                {/* Preview Header */}
                <div className="px-6 py-4">
                  <div className="w-7 h-7 rounded-lg bg-primary mb-3 shadow-lg shadow-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h4 className="font-black text-xl text-foreground leading-none">{riadName}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1 tracking-tight">Medina, Marrakesh</p>
                </div>

                {/* Preview Content Area */}
                <div className="px-6 flex-1 space-y-6 overflow-y-auto no-scrollbar">
                  {/* WiFi Quick Access */}
                  <div className="bg-muted/40 p-3.5 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3">
                       <Wifi className="w-4 h-4 text-primary" />
                       <div className="flex flex-col">
                         <span className="text-[8px] font-black uppercase text-muted-foreground leading-none mb-1">Guest WiFi</span>
                         <span className="text-xs font-bold leading-none tracking-tight">Riad_Guest_WiFi</span>
                       </div>
                    </div>
                  </div>

                  {/* Dynamic Section: Menu Preview */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest">Local Gems</span>
                      <span className="text-[9px] font-bold text-primary">View All</span>
                    </div>
                    <div className="space-y-2">
                       <div className="bg-card border border-border p-3 rounded-xl shadow-sm flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold">Le Jardin Secret</span>
                            <span className="text-[9px] text-muted-foreground font-medium">4 mins walk</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Explore Preview */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest">Experiences</span>
                    <div className="bg-zinc-900 rounded-2xl aspect-[4/3] relative overflow-hidden flex flex-col justify-end p-4">
                       <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                       <span className="relative z-10 text-xs font-black text-white uppercase">Agafay Desert Dinner</span>
                       <span className="relative z-10 text-[9px] font-bold text-white/70">650 MAD • 5 Hours</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Nav Simulation */}
                <div className="h-16 border-t border-border bg-card/80 backdrop-blur-md flex items-center justify-around px-4">
                  <div className="w-8 h-1 rounded-full bg-primary" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground tracking-widest opacity-60">Mobile Preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}