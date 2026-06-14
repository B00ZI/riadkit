"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Banknote,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Owner sees prices!
const mockOrders = [
  {
    id: "1",
    room: "Room 3",
    status: "pending",
    time: "5 min ago",
    items: ["2x Mint Tea", "1x Msemen + Honey"],
    total: "85.00 MAD"
  },
  {
    id: "2",
    room: "Suite Majorelle",
    status: "preparing",
    time: "12 min ago",
    items: ["1x 60min Hammam"],
    total: "450.00 MAD"
  }
];

const mockRooms = [
  { id: "1", name: "Room 1", status: "occupied", guest: "Youssef A." },
  { id: "2", name: "Room 2", status: "vacant", guest: null },
  { id: "3", name: "Room 3", status: "occupied", guest: "Karim B." },
  { id: "4", name: "Suite Majorelle", status: "occupied", guest: "Sarah J." },
];

export default function OwnerFrontDesk() {
  const [filter, setFilter] = useState<"pending" | "preparing" | "done">("pending");

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Header with quick stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Live Front Desk</h1>
          <p className="text-muted-foreground text-sm font-medium">Real-time management of guests and requests.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="h-8 px-3 border-emerald-500/20 text-emerald-500 bg-emerald-500/5 font-bold">
             3 Active Sessions
           </Badge>
           <Badge variant="outline" className="h-8 px-3 border-primary/20 text-primary bg-primary/5 font-bold">
             2 Pending Orders
           </Badge>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: LIVE ORDERS (Takes 7/12) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Active Requests</h2>
            
            <div className="flex gap-1.5 p-1 bg-secondary rounded-lg">
              {(["pending", "preparing", "done"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
                    filter === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {mockOrders.filter(o => o.status === filter).map((order) => (
              <Card key={order.id} className="bg-card border-border overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                       <Badge className="w-fit font-black rounded-md">{order.room}</Badge>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center">
                         <Clock className="w-3 h-3 mr-1" /> {order.time}
                       </span>
                    </div>
                    {/* Owner-only: Total Price */}
                    <div className="text-right">
                      <span className="text-sm font-black text-foreground">{order.total}</span>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Billable Amount</p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-5">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-[15px] font-semibold text-foreground tracking-tight">{item}</p>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 font-bold h-9 text-xs border-border">Cancel</Button>
                    <Button className="flex-1 font-bold h-9 text-xs">
                      {order.status === 'pending' ? 'Accept Order' : 'Mark Delivered'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {mockOrders.filter(o => o.status === filter).length === 0 && (
               <div className="py-20 text-center border border-dashed border-border rounded-xl text-muted-foreground font-medium text-sm">
                 No {filter} orders.
               </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: ROOM GRID (Takes 5/12) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Room Occupancy</h2>
            <div className="relative w-32">
              <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
              <Input placeholder="Search..." className="h-7 pl-7 text-[10px] bg-secondary border-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockRooms.map((room) => (
              <Card key={room.id} className={`border-border ${room.status === 'occupied' ? 'bg-emerald-500/[0.02]' : 'bg-card'}`}>
                <div className="p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-foreground leading-tight">{room.name}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {room.status === 'occupied' ? room.guest : 'Vacant'}
                      </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${room.status === 'occupied' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground/30'}`} />
                  </div>

                  {room.status === 'vacant' ? (
                    <Button variant="outline" className="w-full h-8 text-[10px] font-black uppercase border-border bg-background">
                      <LogIn className="w-3 h-3 mr-1" /> Check In
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full h-8 text-[10px] font-black uppercase border-border hover:bg-destructive hover:text-destructive-foreground">
                      <LogOut className="w-3 h-3 mr-1" /> Check Out
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}