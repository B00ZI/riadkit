"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  ArrowUpRight,
  History
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

// Mock Data for the Revenue Chart
const chartData = [
  { month: "Jan", total: 4500 },
  { month: "Feb", total: 5200 },
  { month: "Mar", total: 4800 },
  { month: "Apr", total: 6100 },
  { month: "May", total: 5900 },
  { month: "Jun", total: 7200 },
];

// Mock Out of Stock items
const outOfStockItems = [
  { id: "1", name: "Mint Tea", category: "Menu" },
  { id: "2", name: "Argan Oil Massage", category: "Services" },
];

export default function OwnerDashboard() {
  return (
    <div className="space-y-8">
      {/* 1. TOP STATS ROW */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Revenue Card */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              Today's Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">1,450.00 MAD</div>
            <p className="text-xs text-emerald-500 font-bold flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12.5% vs yesterday
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              Today's Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">24</div>
            <p className="text-xs text-muted-foreground font-bold mt-1">
              18 Completed • 6 Pending
            </p>
          </CardContent>
        </Card>

        {/* Occupancy Card */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              Active Guests
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">8 Guests</div>
            <p className="text-xs text-muted-foreground font-bold mt-1">
              4 / 6 Rooms Occupied
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. MIDDLE ROW: REVENUE CHART & ALERTS */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Revenue Chart (Desktop takes 4/7 columns) */}
        <Card className="md:col-span-4 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trends for the current year</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--muted) / 0.4)'}}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === chartData.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Out of Stock Alerts (Desktop takes 3/7 columns) */}
        <Card className="md:col-span-3 bg-card border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg font-bold">Inventory Alerts</CardTitle>
            </div>
            <CardDescription>Items currently hidden from guests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {outOfStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/[0.02]">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">{item.name}</span>
                  <span className="text-[10px] uppercase font-black text-muted-foreground">{item.category}</span>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-border">
                  Restock
                </Button>
              </div>
            ))}
            {outOfStockItems.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm font-medium">
                All items are currently in stock.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. BOTTOM ROW: TOP ITEMS & ACTIVITY */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Most Ordered Items */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Most Ordered Items</CardTitle>
            <CardDescription>Top performers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Mint Tea", count: 142, revenue: "2,840 MAD" },
                { name: "Tagine Kefta", count: 86, revenue: "7,740 MAD" },
                { name: "Orange Juice", count: 64, revenue: "1,280 MAD" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black">
                      #{i + 1}
                    </div>
                    <span className="font-bold text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black">{item.count} orders</div>
                    <div className="text-[10px] text-muted-foreground font-bold">{item.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { event: "Check-In", desc: "Room 3 (Youssef A.)", time: "10 mins ago" },
                { event: "Order", desc: "Room 1 ordered 2x Mint Tea", time: "25 mins ago" },
                { event: "Check-Out", desc: "Suite Majorelle", time: "1 hour ago" },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      {act.event}: <span className="font-medium text-muted-foreground">{act.desc}</span>
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}