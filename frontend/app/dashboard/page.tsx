// app/(dashboard)/dashboard/page.tsx (with error handling)
"use client";

import { useRooms } from "@/hooks/useRooms";
import { useRequests } from "@/hooks/useRequests";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  CreditCard, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  History,
  Loader2
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

export default function OwnerDashboard() {
  const { rooms, isLoading: roomsLoading, error: roomsError } = useRooms();
  const { requests, isLoading: requestsLoading, error: requestsError } = useRequests();

  // --- REAL-TIME CALCULATIONS ---
  const todayRevenue = requests
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + parseFloat(r.total_price || "0"), 0);

  const totalOrders = requests.length;
  const pendingOrders = requests.filter(r => r.status === 'pending').length;
  const completedOrders = requests.filter(r => r.status === 'completed').length;
  const occupiedRoomsCount = rooms.filter(r => r.status === 'occupied').length;
  const recentActivity = [...requests].reverse().slice(0, 5);

  // ✅ Handle loading state
  if (roomsLoading || requestsLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ✅ Handle error state
  if (roomsError || requestsError) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">Failed to load dashboard data</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

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
            <div className="text-2xl font-black text-foreground">
              {todayRevenue.toLocaleString()} MAD
            </div>
            <p className="text-xs text-emerald-500 font-bold flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Live from requests
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
            <div className="text-2xl font-black text-foreground">{totalOrders}</div>
            <p className="text-xs text-muted-foreground font-bold mt-1">
              {completedOrders} Completed • {pendingOrders} Pending
            </p>
          </CardContent>
        </Card>

        {/* Occupancy Card */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              Active Occupancy
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {occupiedRoomsCount} Rooms
            </div>
            <p className="text-xs text-muted-foreground font-bold mt-1">
              Out of {rooms.length} total rooms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. MIDDLE ROW: REVENUE CHART & ALERTS */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
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

        <Card className="md:col-span-3 bg-card border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg font-bold">Priority Alerts</CardTitle>
            </div>
            <CardDescription>Immediate attention required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingOrders > 0 ? (
              <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/[0.02]">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">
                    {pendingOrders} Pending Orders
                  </span>
                  <span className="text-[10px] uppercase font-black text-muted-foreground">
                    Action required at Front Desk
                  </span>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-border">
                  View
                </Button>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm font-medium">
                No critical alerts at this time.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. BOTTOM ROW: ACTIVITY */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2 bg-card border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg font-bold">Live Request Stream</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((req) => (
                <div key={req.id} className="flex gap-4 items-start border-b border-border/50 pb-3 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    req.status === 'pending' ? 'bg-destructive' : 
                    req.status === 'in_progress' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {req.room_number}: <span className="font-medium text-muted-foreground">{req.quantity}x {req.item_name}</span>
                      </span>
                      <Badge variant="outline" className="text-[9px] uppercase">
                        {req.status}
                      </Badge>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
                      {new Date(req.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">
                  No activity yet today.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}