"use client";

import { useRouter } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
import { useRequests } from "@/hooks/useRequests";
import { useCatalog } from "@/hooks/useCatalog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, CreditCard, ShoppingBag, Users, AlertTriangle,
  History, Loader2, Clock, ArrowRight, Zap, PackageX,
  ChevronRight, Calendar, Utensils, Compass, Sparkles, ArrowUpRight, CheckCircle2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import Link from "next/link";

// --- � MOCK DATA ---
const chartData = [
  { month: "Jan", total: 4500, menu: 2000, excursions: 1500, services: 1000, orders: 42 },
  { month: "Feb", total: 5200, menu: 2500, excursions: 1200, services: 1500, orders: 48 },
  { month: "Mar", total: 4800, menu: 2100, excursions: 1800, services: 900, orders: 45 },
  { month: "Apr", total: 6100, menu: 3000, excursions: 2000, services: 1100, orders: 58 },
  { month: "May", total: 5900, menu: 2800, excursions: 1900, services: 1200, orders: 55 },
  { month: "Jun", total: 7200, menu: 3500, excursions: 2500, services: 1200, orders: 68 },
  { month: "Jul", total: 8400, menu: 4200, excursions: 3000, services: 1200, orders: 82 },
];

const yieldHistory = [
  { date: "Yesterday", rawDate: "2026-07-19", total: 2450, orders: 14, menu: 1200, excursions: 1100, services: 150 },
  { date: "18 July", rawDate: "2026-07-18", total: 1800, orders: 9, menu: 900, excursions: 800, services: 100 },
  { date: "17 July", rawDate: "2026-07-17", total: 3100, orders: 18, menu: 1500, excursions: 1400, services: 200 },
  { date: "16 July", rawDate: "2026-07-16", total: 1200, orders: 6, menu: 800, excursions: 300, services: 100 },
  { date: "15 July", rawDate: "2026-07-15", total: 2700, orders: 15, menu: 1100, excursions: 1400, services: 200 },
];


const fakeOutofStock = [
  { id: 1, name: "Mint Tea", category_name: "Menu" },
  { id: 2, name: "Agafay Trip", category_name: "Excursion" },
];
const fakeActivity = [
  { id: 101, room: "Room 3", item: "2x Mint Tea", price: "50", status: "pending", time: "10:45 AM", type: "menu" },
  { id: 102, room: "Suite Majorelle", item: "1x Argan Massage", price: "450", status: "in_progress", time: "10:30 AM", type: "service" },
  { id: 103, room: "Room 1", item: "1x Moroccan Breakfast", price: "85", status: "completed", time: "09:15 AM", type: "menu" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-popover p-4 shadow-xl min-w-[200px] animate-in fade-in zoom-in-95">
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3 border-b border-border pb-2">{label} Revenue</p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="flex items-center gap-2 text-muted-foreground"><Utensils className="w-3.5 h-3.5" /> Menu</span>
            <span>{data.menu.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="flex items-center gap-2 text-muted-foreground"><Compass className="w-3.5 h-3.5" /> Excursions</span>
            <span>{data.excursions.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="flex items-center gap-2 text-muted-foreground"><Sparkles className="w-3.5 h-3.5" /> Services</span>
            <span>{data.services.toLocaleString()} MAD</span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-tight">Total Yield</span>
            <span className="text-sm font-black text-primary">{data.total.toLocaleString()} MAD</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function OwnerDashboard() {
  const { rooms, isLoading: roomsLoading } = useRooms();
  const { requests, isLoading: requestsLoading } = useRequests();
  const { menuItems, updateMenuItem, isLoading: catalogLoading } = useCatalog();

  const router = useRouter();

  const outOfStockItems = menuItems.filter(item => !item.is_available);

  if (roomsLoading || requestsLoading || catalogLoading) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Command Center</h1>
          <p className="text-muted-foreground text-sm font-medium italic">Riad operational analytics</p>
        </div>
        <Button asChild className="font-black uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg shadow-primary/10">
          <Link href="/dashboard/front-desk">Go Live <ArrowRight className="ml-2 w-3 h-3" /></Link>
        </Button>
      </div>

      {/* ─── 1. TOP STATS ─── */}
      <div className="grid gap-4 md:grid-cols-4 text-card-foreground">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's Yield</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground opacity-40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic">1,450 MAD</div>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12.5% vs Yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground opacity-40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic">{rooms.filter(r => r.status === 'occupied').length || 5}</div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mt-1">In-house sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-destructive">Attention</CardTitle>
            <Zap className="h-4 w-4 text-destructive animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-destructive italic">{requests.filter(r => r.status === 'pending').length || 2} Orders</div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mt-1">Pending Fulfillment</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Speed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground opacity-40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic">14 min</div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mt-1">Avg Request fulfillment</p>
          </CardContent>
        </Card>
      </div>

      {/* ─── 2. REVENUE CHART ─── */}
      <div className="grid gap-6 lg:grid-cols-12">

        <Card className="lg:col-span-8 bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Revenue Overview</CardTitle>
            <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-widest">MTD Analysis</Badge>
          </CardHeader>
          <CardContent className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />

                {/* Rich Tooltip with NO background column highlight */}
                <Tooltip content={<CustomTooltip />} cursor={false} />

                <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={70}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === chartData.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary)/0.3)"}
                      className="transition-opacity duration-150"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ─── INVENTORY ALERTS (RESTORED) ─── */}
        <Card className="lg:col-span-4 bg-card border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/30 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <PackageX className="h-4 w-4" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">Inventory Leaks</CardTitle>
              </div>
              <Badge variant="destructive" className="h-5 text-[9px] font-black">{outOfStockItems.length || "2"}</Badge>
            </div>
            <CardDescription className="text-[10px] font-bold uppercase tracking-tight opacity-70">Hidden from guests</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[300px] no-scrollbar">
            <div className="divide-y divide-border">
              {(outOfStockItems.length > 0 ? outOfStockItems : fakeOutofStock).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-4 hover:bg-muted/20 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-[11px] font-black text-foreground truncate uppercase">{item.name}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-tighter">{item.category_name || "Catalog"}</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-[9px] font-black uppercase border-primary/30 text-primary px-3">Restock</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* ─── 3. LIVE STREAM ─── */}
        <Card className="lg:col-span-6 bg-card border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-foreground/80">
              <History className="h-4 w-4" />
              <CardTitle className="text-sm font-black uppercase tracking-widest">Live Activity</CardTitle>
            </div>
            <Link href="/dashboard/history" className="text-[9px] font-black uppercase text-primary flex items-center hover:underline">Full Feed <ArrowUpRight className="ml-1 w-3 h-3" /></Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
            <div className="flex flex-col">
              {(requests.length > 0 ? requests.slice(0, 6) : fakeActivity).map((req: any) => (
                <div key={req.id} className="flex items-center px-6 py-4 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
                  <div className="w-16 shrink-0 text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{req.time || "Now"}</div>
                  <div className={`w-1 h-6 rounded-full mr-5 ${req.status === 'pending' ? 'bg-destructive' : req.status === 'in_progress' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-0.5">{req.room_number || req.room}</p>
                    <p className="text-[13px] font-bold truncate leading-none text-foreground">{req.item_name || req.item}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-foreground italic">{req.total_price || req.price} MAD</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* �️ 4. YIELD LOG (REDESIGNED: PROFESSIONAL & CLEAN) ─── */}
        <Card className="lg:col-span-6 bg-card border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="h-4 w-4" />
              <CardTitle className="text-sm font-black uppercase tracking-widest">Daily Yield Log</CardTitle>
            </div>
            <Badge variant="secondary" className="text-[9px] font-black uppercase opacity-60">7-Day History</Badge>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
            <div className="divide-y divide-border">
              {yieldHistory.map((day, i) => (
                <div
                  key={i}
                  // 🔥 Redirect logic with URL parameters
                  onClick={() => router.push(`/dashboard/history?date=${day.rawDate}`)}
                  className="px-6 py-4 hover:bg-primary/[0.03] cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {day.date}
                      </p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-muted rounded text-muted-foreground uppercase">
                        {day.orders} Orders
                      </span>
                    </div>

                    {/* Professional Breakdown Row */}
                    <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/70 tracking-tighter">
                      <div className="flex items-center gap-1">
                        <Utensils className="w-2.5 h-2.5 opacity-50" /> {day.menu}
                      </div>
                      <div className="flex items-center gap-1">
                        <Compass className="w-2.5 h-2.5 opacity-50" /> {day.excursions}
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 opacity-50" /> {day.services}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                        <CreditCard className="w-2.5 h-2.5" /> Total
                      </div>
                      <p className="text-sm font-black text-foreground italic">
                        {day.total.toLocaleString()} MAD
                      </p>
                    </div>
                    {/* Animated Chevron for better click affordance */}
                    <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="p-3 border-t border-border bg-muted/10">
            <Button variant="ghost" className="w-full text-[9px] font-black uppercase tracking-widest opacity-50 h-8">
              Generate Weekly Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}