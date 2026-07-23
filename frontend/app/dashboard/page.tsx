"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
import { useRequests } from "@/hooks/useRequests";
import { useCatalog } from "@/hooks/useCatalog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, CreditCard, ShoppingBag, DoorClosed, Clock,
  PackageX, PackageCheck, ChevronRight, Calendar, Utensils,
  Compass, Sparkles, ArrowUpRight, CheckCircle2, Bell, RefreshCw, AlertCircle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import Link from "next/link";

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
  const router = useRouter();
  const { rooms, isLoading: roomsLoading } = useRooms();
  const { requests, isLoading: requestsLoading } = useRequests();
  const {
    menuItems,
    services,
    excursions,
    toggleMenuItemAvailability,
    toggleServiceAvailability,
    toggleExcursionAvailability,
    isLoading: catalogLoading,
  } = useCatalog();

  const [restockingId, setRestockingId] = useState<string | null>(null);

  // ─── 1. REAL METRICS COMPUTATIONS ─────────────────────────────────
  
  // Active Rooms
  const totalRooms = rooms?.length || 0;
  const occupiedRooms = rooms?.filter((r) => r.status === "occupied").length || 0;

  // Order Counts
  const pendingRequests = requests?.filter((r) => r.status === "pending") || [];
  const inProgressRequests = requests?.filter((r) => r.status === "in_progress") || [];
  const completedRequests = requests?.filter((r) => r.status === "completed") || [];

  // Out of Stock Items combined from Menu, Services & Excursions
  const outOfStockItems = useMemo(() => {
    const unavailMenu = (menuItems || [])
      .filter((i) => !i.is_available)
      .map((i) => ({ ...i, item_type: "menu" as const, cat_name: "Menu" }));
    const unavailServices = (services || [])
      .filter((s) => !s.is_available)
      .map((s) => ({ ...s, item_type: "service" as const, cat_name: "Service" }));
    const unavailExcursions = (excursions || [])
      .filter((e) => !e.is_available)
      .map((e) => ({ ...e, item_type: "excursion" as const, cat_name: "Excursion" }));

    return [...unavailMenu, ...unavailServices, ...unavailExcursions];
  }, [menuItems, services, excursions]);

  // Restock Handler
  const handleRestock = async (item: typeof outOfStockItems[0]) => {
    const key = `${item.item_type}-${item.id}`;
    setRestockingId(key);
    try {
      if (item.item_type === "menu") await toggleMenuItemAvailability(item.id, true);
      else if (item.item_type === "service") await toggleServiceAvailability(item.id, true);
      else if (item.item_type === "excursion") await toggleExcursionAvailability(item.id, true);
    } catch (e) {
      console.error("Restock failed", e);
    } finally {
      setRestockingId(null);
    }
  };

  // Today's & Yesterday's Revenue Calculation
  const { todayTotal, growthPercent } = useMemo(() => {
    if (!requests || requests.length === 0) return { todayTotal: 0, growthPercent: 0 };

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let todaySum = 0;
    let yesterdaySum = 0;

    requests.forEach((req) => {
      if (req.status === "cancelled" || !req.created_at_raw) return;
      const reqDateStr = req.created_at_raw.split("T")[0];
      const amount = parseFloat(req.total_price) || 0;

      if (reqDateStr === todayStr) todaySum += amount;
      if (reqDateStr === yesterdayStr) yesterdaySum += amount;
    });

    let growth = 0;
    if (yesterdaySum > 0) {
      growth = ((todaySum - yesterdaySum) / yesterdaySum) * 100;
    } else if (todaySum > 0) {
      growth = 100;
    }

    return { todayTotal: todaySum, growthPercent: Math.round(growth * 10) / 10 };
  }, [requests]);

  // 7-Day Revenue History Log
  const yieldHistory = useMemo(() => {
    const historyMap: Record<string, { dateLabel: string; rawDate: string; total: number; orders: number; menu: number; excursions: number; services: number }> = {};

    // Build last 7 days entries
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const rawDate = d.toISOString().split("T")[0];
      const dateLabel = i === 0 ? "Today" : i === 1 ? "Yesterday" : d.toLocaleDateString("en-US", { day: "numeric", month: "short" });

      historyMap[rawDate] = { dateLabel, rawDate, total: 0, orders: 0, menu: 0, excursions: 0, services: 0 };
    }

    (requests || []).forEach((req) => {
      if (req.status === "cancelled" || !req.created_at_raw) return;
      const rawDate = req.created_at_raw.split("T")[0];

      if (historyMap[rawDate]) {
        const amt = parseFloat(req.total_price) || 0;
        historyMap[rawDate].total += amt;
        historyMap[rawDate].orders += 1;

        if (req.type === "menu") historyMap[rawDate].menu += amt;
        else if (req.type === "excursion") historyMap[rawDate].excursions += amt;
        else if (req.type === "service") historyMap[rawDate].services += amt;
      }
    });

    return Object.values(historyMap);
  }, [requests]);

  // Monthly Revenue Chart Data (Last 6 Months)
  const chartData = useMemo(() => {
    const monthsMap: Record<string, { month: string; total: number; menu: number; excursions: number; services: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const monthLabel = monthNames[d.getMonth()];
      monthsMap[key] = { month: monthLabel, total: 0, menu: 0, excursions: 0, services: 0 };
    }

    (requests || []).forEach((req) => {
      if (req.status === "cancelled" || !req.created_at_raw) return;
      const d = new Date(req.created_at_raw);
      const key = `${d.getFullYear()}-${d.getMonth()}`;

      if (monthsMap[key]) {
        const amt = parseFloat(req.total_price) || 0;
        monthsMap[key].total += amt;
        if (req.type === "menu") monthsMap[key].menu += amt;
        else if (req.type === "excursion") monthsMap[key].excursions += amt;
        else if (req.type === "service") monthsMap[key].services += amt;
      }
    });

    return Object.values(monthsMap);
  }, [requests]);

  // Combined Activity & Notification Feed
  const activityNotifications = useMemo(() => {
    const list: Array<{ id: string; title: string; description: string; time: string; type: "order" | "stock_out" | "completed" }> = [];

    // Recent Requests
    (requests || []).slice(0, 6).forEach((req) => {
      if (req.status === "pending") {
        list.push({
          id: `req-${req.id}`,
          title: `New Order (${req.room_number})`,
          description: `${req.quantity}x ${req.item_name} - ${req.total_price} MAD`,
          time: req.created_at || "Recently",
          type: "order",
        });
      } else if (req.status === "completed") {
        list.push({
          id: `req-${req.id}`,
          title: `Order Fulfilled`,
          description: `${req.room_number} - ${req.item_name}`,
          time: req.created_at || "Recently",
          type: "completed",
        });
      }
    });

    // Out of Stock Notifications
    outOfStockItems.forEach((item) => {
      list.push({
        id: `stock-${item.item_type}-${item.id}`,
        title: "Item Out of Stock",
        description: `${item.name} (${item.cat_name}) is currently unavailable`,
        time: "Active alert",
        type: "stock_out",
      });
    });

    return list.slice(0, 7);
  }, [requests, outOfStockItems]);

  if (roomsLoading || requestsLoading || catalogLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="animate-spin h-6 w-6 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 pt-2">
      {/* ─── 1. TOP STATS ROW (3 COLUMNS WITH EXPANDED ORDER STATUS) ─── */}
      <div className="grid gap-4 md:grid-cols-4 text-card-foreground">
        
        {/* Card 1: Today's Revenue */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-bold text-muted-foreground">Today's Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{todayTotal.toLocaleString()} MAD</div>
            <p className={`text-[11px] font-semibold flex items-center gap-1 mt-1 ${growthPercent >= 0 ? "text-emerald-600" : "text-destructive"}`}>
              <TrendingUp className="w-3.5 h-3.5" />
              {growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`} vs Yesterday
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Active Rooms */}
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

        {/* Card 3: Expanded & Cleaner Order Status (Spans 2 columns) */}
        <Card className="md:col-span-2 bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground">Order Status Overview</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 flex flex-col">
                <span className="text-[10px] font-bold uppercase text-destructive tracking-wider">Pending</span>
                <span className="text-xl font-black text-destructive mt-0.5">{pendingRequests.length}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col">
                <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">In Progress</span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{inProgressRequests.length}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col">
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Completed</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{completedRequests.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── 2. REVENUE CHART & OUT OF STOCK ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Revenue Overview Chart */}
        <Card className="lg:col-span-8 bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Revenue Overview</CardTitle>
              <CardDescription className="text-xs">Monthly earnings breakdown</CardDescription>
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
                {outOfStockItems.length}
              </Badge>
            </div>
            <CardDescription className="text-xs">Items hidden from guest catalog</CardDescription>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[280px]">
            {outOfStockItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground flex flex-col items-center justify-center h-full">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mb-2" />
                All catalog items are currently available!
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {outOfStockItems.map((item) => {
                  const key = `${item.item_type}-${item.id}`;
                  const isRestocking = restockingId === key;

                  return (
                    <div key={key} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-xs font-bold text-foreground truncate">{item.name}</span>
                        <span className="text-[10px] font-medium text-muted-foreground">{item.cat_name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isRestocking}
                        onClick={() => handleRestock(item)}
                        className="h-7 text-xs font-semibold px-3 shrink-0"
                      >
                        {isRestocking ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Restock"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── 3. RECENT ACTIVITY & DAILY REVENUE ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Unified Activity & Notifications Feed */}
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
            {activityNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No recent activity found.</div>
            ) : (
              <div className="divide-y divide-border/60">
                {activityNotifications.map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                    <div className="p-2 rounded-lg bg-muted/50 text-foreground shrink-0 mt-0.5">
                      {notif.type === "order" && <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />}
                      {notif.type === "stock_out" && <PackageX className="w-3.5 h-3.5 text-amber-500" />}
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
            )}
          </CardContent>
        </Card>

        {/* Daily Revenue Log */}
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
                        {day.dateLabel}
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

          {/* Direct Navigation to History Page */}
          <CardFooter className="p-2.5 border-t border-border/60 bg-muted/20">
            <Button asChild variant="ghost" className="w-full text-xs font-semibold hover:bg-muted h-8">
              <Link href="/dashboard/history" className="flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground">
                View Full History <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 