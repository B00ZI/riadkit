"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, CreditCard, DoorClosed, Clock,
  PackageX, CheckCircle2, Bell, ArrowUpRight, Calendar,
  Utensils, Compass, Sparkles, ChevronRight, RefreshCw,
  ShoppingBag, XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboard, type MonthlyRevenue } from "@/hooks/useDashboard";
import { useNotificationDrawer } from "@/hooks/useNotificationDrawer";
import { NotificationList } from "@/components/notifications/NotificationList";
import { useNotifications } from "@/hooks/useNotifications";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    filter: "pending",
  },
  in_progress: {
    label: "In Progress",
    icon: RefreshCw,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    filter: "in_progress",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    filter: "completed",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    filter: "cancelled",
  },
} as const;

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-popover p-4 shadow-xl min-w-[200px] animate-in fade-in zoom-in-95">
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3 border-b border-border pb-2">
          {label} Revenue
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Utensils className="w-3.5 h-3.5" /> Menu
            </span>
            <span>{data.menu.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Compass className="w-3.5 h-3.5" /> Excursions
            </span>
            <span>{data.excursions.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5" /> Services
            </span>
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
  const { data, isLoading, isRestocking, restockItem, refresh } = useDashboard();
  const {
    notifications,
    isLoading: notifLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const { openDrawer } = useNotificationDrawer();

  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  if (isLoading || !data) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="animate-spin h-6 w-6 text-primary" />
      </div>
    );
  }

  const {
    todayRevenue,
    growth,
    activeRooms,
    totalRooms,
    occupancy,
    orderStatus,
    monthlyRevenue,
    dailyRevenue,
    unavailableItems,
  } = data;

  const isGrowing = growth >= 0;

  return (
    <div className="space-y-6 pb-10 pt-2">
      {/* ─── TOP STATS ROW ─── */}
      <div className="grid gap-4 md:grid-cols-4">

        {/* Today's Revenue */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-bold text-muted-foreground">Today&apos;s Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              {todayRevenue.toLocaleString()} <span className="text-base font-bold text-muted-foreground">MAD</span>
            </div>
            <p className={`text-[11px] font-semibold flex items-center gap-1 mt-1 ${isGrowing ? "text-emerald-600" : "text-destructive"}`}>
              {isGrowing ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isGrowing ? "+" : ""}{growth}% vs yesterday
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
              {activeRooms} <span className="text-base text-muted-foreground font-normal">/ {totalRooms}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-1">{occupancy}% occupancy</p>
          </CardContent>
        </Card>

        {/* Today's Orders (4 cards) */}
        <Card className="md:col-span-2 bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground">Today&apos;s Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(statusConfig) as [string, typeof statusConfig[keyof typeof statusConfig]][]).map(
                ([key, config]) => {
                  const count = orderStatus[key as keyof typeof orderStatus];
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => router.push(`/dashboard/history?status=${config.filter}`)}
                      className={`p-2.5 rounded-lg ${config.bg} ${config.border} border text-left hover:opacity-80 transition-opacity cursor-pointer`}
                    >
                      <Icon className={`w-4 h-4 ${config.color} mb-1`} />
                      <span className={`text-lg font-black ${config.color} block leading-none`}>{count}</span>
                      <span className={`text-[9px] font-bold uppercase mt-1 block ${config.color}`}>{config.label}</span>
                    </button>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── REVENUE CHART & UNAVAILABLE ITEMS ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Revenue Overview Chart */}
        <Card className="lg:col-span-8 bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Revenue Overview</CardTitle>
              <CardDescription className="text-xs">Monthly earnings breakdown</CardDescription>
            </div>
            <Badge variant="outline" className="font-semibold text-[10px] uppercase tracking-wider">6-Month View</Badge>
          </CardHeader>
          <CardContent className="w-full">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={false} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {monthlyRevenue.map((_: MonthlyRevenue, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === monthlyRevenue.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary)/0.3)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Unavailable Items */}
        <Card className="lg:col-span-4 bg-card border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground">
                <PackageX className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-bold">Unavailable Items</CardTitle>
              </div>
              <Badge variant="secondary" className="h-5 text-[10px] font-bold">
                {unavailableItems.length}
              </Badge>
            </div>
            <CardDescription className="text-xs">Items hidden from guest catalog</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[280px]">
            {unavailableItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground flex flex-col items-center justify-center h-full">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mb-2" />
                All catalog items are currently available!
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {unavailableItems.map((item) => {
                  const key = `${item.type}-${item.id}`;
                  return (
                    <div key={key} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-xs font-bold text-foreground truncate">{item.name}</span>
                        <span className="text-[10px] font-medium text-muted-foreground capitalize">{item.type}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isRestocking === key}
                        onClick={() => restockItem(item)}
                        className="h-7 text-xs font-semibold px-3 shrink-0"
                      >
                        {isRestocking === key ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Show"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── RECENT ACTIVITY & DAILY REVENUE ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Activity */}
        <Card className="lg:col-span-6 bg-card border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-bold">Recent Activity</CardTitle>
              </div>
              <button onClick={openDrawer} className="text-xs font-semibold text-primary flex items-center hover:underline">
                View All <ArrowUpRight className="ml-1 w-3 h-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[360px]">
            <NotificationList
              notifications={notifications}
              isLoading={notifLoading}
              onMarkAsRead={markAsRead}
              compact
            />
          </CardContent>
        </Card>

        {/* Daily Revenue */}
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
              {dailyRevenue.map((day, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/dashboard/history?date=${day.rawDate}`)}
                  onMouseEnter={() => setHoveredDay(day.rawDate)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="px-5 py-3.5 hover:bg-muted/30 cursor-pointer transition-colors flex items-center justify-between group relative"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {day.dateLabel}
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                        {day.orders} Orders
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right relative">
                      <span className="text-xs font-bold text-foreground block">
                        {day.total.toLocaleString()} MAD
                      </span>
                      {hoveredDay === day.rawDate && (
                        <div className="absolute right-0 top-full mt-2 z-50 rounded-xl border border-border bg-popover p-4 shadow-xl min-w-[200px] animate-in fade-in zoom-in-95">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3 border-b border-border pb-2">
                            {day.dateLabel}
                          </p>
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-center text-[11px] font-bold">
                              <span className="flex items-center gap-2 text-muted-foreground">
                                <Utensils className="w-3.5 h-3.5" /> Menu
                              </span>
                              <span>{day.menu.toLocaleString()} MAD</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold">
                              <span className="flex items-center gap-2 text-muted-foreground">
                                <Compass className="w-3.5 h-3.5" /> Excursions
                              </span>
                              <span>{day.excursions.toLocaleString()} MAD</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold">
                              <span className="flex items-center gap-2 text-muted-foreground">
                                <Sparkles className="w-3.5 h-3.5" /> Services
                              </span>
                              <span>{day.services.toLocaleString()} MAD</span>
                            </div>
                            <div className="pt-2 border-t border-border flex justify-between items-center">
                              <span className="text-xs font-black uppercase tracking-tight">Total</span>
                              <span className="text-sm font-black text-primary">{day.total.toLocaleString()} MAD</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
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
