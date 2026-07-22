"use client";

import { useRouter } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
import { useRequests } from "@/hooks/useRequests";
import { useCatalog } from "@/hooks/useCatalog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, CreditCard, ShoppingBag, Users, Clock, ArrowRight,
  PackageX, PackageCheck, ChevronRight, Calendar, Utensils,
  Compass, Sparkles, ArrowUpRight, CheckCircle2, DoorClosed,
  Bell, AlertCircle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import Link from "next/link";

// --- MOCK DATA ---
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
  { id: 2, name: "Agafay Trip", category_name: "Excursions" },
];

const fakeNotifications = [
  {
    id: 101,
    title: "New Order",
    description: "Room 3 ordered 2x Mint Tea",
    time: "10:45 AM",
    type: "order",
  },
  {
    id: 102,
    title: "Item Out of Stock",
    description: "Agafay Trip was marked as out of stock",
    time: "10:30 AM",
    type: "stock_out",
  },
  {
    id: 103,
    title: "Order Completed",
    description: "Room 1 - Moroccan Breakfast fulfilled",
    time: "09:15 AM",
    type: "completed",
  },
  {
    id: 104,
    title: "Item Restocked",
    description: "Fresh Orange Juice is back in stock",
    time: "08:45 AM",
    type: "stock_in",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-popover p-4 shadow-xl min-w-[200px] animate-in fade-in zoom-in-95">
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3 border-b border-border pb-2">
          {label} Revenue
        </p>
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
            <span className="text-xs font-black uppercase tracking-tight">Total</span>
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
  const { menuItems, isLoading: catalogLoading } = useCatalog();

  const router = useRouter();

  const occupiedRooms = rooms?.filter((r) => r.status === "occupied").length || 2;
  const totalRooms = rooms?.length || 5;

  const pendingRequests = requests?.filter((r) => r.status === "pending").length || 2;
  const inProgressRequests = requests?.filter((r) => r.status === "in_progress").length || 1;
  const completedRequests = requests?.filter((r) => r.status === "completed").length || 5;

  const outOfStockItems = menuItems?.filter((item) => !item.is_available) || [];

  if (roomsLoading || requestsLoading || catalogLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 pt-2">
      {/* ─── 1. TOP STATS ─── */}
      <div className="grid gap-4 md:grid-cols-4 text-card-foreground">
        {/* Today's Revenue */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-bold text-muted-foreground">Today's Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">1,450 MAD</div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.5% vs Yesterday
            </p>
          </CardContent>
        </Card>

        {/* Active Rooms */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-bold text-muted-foreground">Active Rooms</CardTitle>
            <DoorClosed className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              {occupiedRooms} <span className="text-base text-muted-foreground font-normal">/ {totalRooms}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-1">Currently occupied</p>
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-bold text-muted-foreground">Order Status</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="destructive" className="text-xs font-bold px-2 py-0.5">
                {pendingRequests} Pending
              </Badge>
              <Badge variant="outline" className="text-xs font-bold border-amber-500 text-amber-600 dark:text-amber-400 px-2 py-0.5">
                {inProgressRequests} Active
              </Badge>
              <Badge variant="secondary" className="text-xs font-bold text-muted-foreground px-2 py-0.5">
                {completedRequests} Done
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-2">Active fulfillment status</p>
          </CardContent>
        </Card>

        {/* Fulfillment Speed */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-bold text-muted-foreground">Avg Speed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">14 min</div>
            <p className="text-[11px] text-muted-foreground font-medium mt-1">Avg request completion</p>
          </CardContent>
        </Card>
      </div>

      {/* ─── 2. REVENUE CHART & OUT OF STOCK ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Revenue Overview */}
        <Card className="lg:col-span-8 bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Revenue Overview</CardTitle>
              <CardDescription className="text-xs">Monthly earnings by category</CardDescription>
            </div>
            <Badge variant="outline" className="font-semibold text-[10px] uppercase tracking-wider">MTD Analysis</Badge>
          </CardHeader>
          <CardContent className="w-full">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={60}>
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

        {/* Out of Stock Section */}
        <Card className="lg:col-span-4 bg-card border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground">
                <PackageX className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-bold">Out of Stock</CardTitle>
              </div>
              <Badge variant="secondary" className="h-5 text-[10px] font-bold">
                {outOfStockItems.length || "2"}
              </Badge>
            </div>
            <CardDescription className="text-xs">Items hidden from guest catalog</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[280px]">
            <div className="divide-y divide-border/60">
              {(outOfStockItems.length > 0 ? outOfStockItems : fakeOutofStock).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-foreground truncate">{item.name}</span>
                    <span className="text-[10px] font-medium text-muted-foreground">{item.category_name || "Catalog"}</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs font-semibold px-3">
                    Restock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── 3. ACTIVITY FEED & DAILY REVENUE ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Activity & Notifications Feed */}
        <Card className="lg:col-span-6 bg-card border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/60 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-bold">Recent Activity</CardTitle>
            </div>
            <Link href="/dashboard/history" className="text-xs font-semibold text-primary flex items-center hover:underline">
              Full Feed <ArrowUpRight className="ml-1 w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[360px]">
            <div className="divide-y divide-border/60">
              {fakeNotifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                  {/* Clean contextual icons instead of solid green vertical bars */}
                  <div className="p-2 rounded-lg bg-muted/50 text-foreground shrink-0 mt-0.5">
                    {notif.type === "order" && <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />}
                    {notif.type === "stock_out" && <PackageX className="w-3.5 h-3.5 text-amber-500" />}
                    {notif.type === "stock_in" && <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />}
                    {notif.type === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-foreground">{notif.title}</p>
                      <span className="text-[10px] font-medium text-muted-foreground">{notif.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{notif.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Revenue Breakdown */}
        <Card className="lg:col-span-6 bg-card border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/60 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-bold">Daily Revenue</CardTitle>
            </div>
            <Badge variant="secondary" className="text-[10px] font-semibold">7-Day History</Badge>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[360px]">
            <div className="divide-y divide-border/60">
              {yieldHistory.map((day, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/dashboard/history?date=${day.rawDate}`)}
                  className="px-5 py-3.5 hover:bg-muted/30 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {day.date}
                      </p>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                        {day.orders} Orders
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Utensils className="w-3 h-3 opacity-60" /> {day.menu} MAD
                      </div>
                      <div className="flex items-center gap-1">
                        <Compass className="w-3 h-3 opacity-60" /> {day.excursions} MAD
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 opacity-60" /> {day.services} MAD
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-medium text-muted-foreground">Total</span>
                      <p className="text-xs font-bold text-foreground">
                        {day.total.toLocaleString()} MAD
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Clean Navigation link to History page */}
          <CardFooter className="p-2.5 border-t border-border/60 bg-muted/20">
            <Button asChild variant="ghost" className="w-full text-xs font-semibold hover:bg-muted h-8">
              <Link href="/dashboard/history" className="flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground">
                View Full History <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}