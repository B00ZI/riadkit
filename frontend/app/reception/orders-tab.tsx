"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, CheckCircle2 } from "lucide-react";

// Simplified mock data: Just string arrays for items (no icons/categories)
const mockOrders = [
  {
    id: "1",
    room: "Room 3",
    status: "pending",
    time: "5 min ago",
    items: ["2x Mint Tea", "1x Msemen + Honey"],
  },
  {
    id: "2",
    room: "Suite Majorelle",
    status: "preparing",
    time: "12 min ago",
    items: ["1x 60min Hammam"],
  },
  {
    id: "3",
    room: "Room 1",
    status: "done",
    time: "1 hour ago",
    items: ["2x Black Coffee", "1x Orange Juice"],
  },
];

export function OrdersTab() {
  const [filter, setFilter] = useState<"pending" | "preparing" | "done">("pending");

  const filteredOrders = mockOrders.filter((order) => order.status === filter);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Button
          variant={filter === "pending" ? "default" : "secondary"}
          className="rounded-full px-5 h-10"
          onClick={() => setFilter("pending")}
        >
          <Clock className="w-4 h-4 mr-2" /> Pending
        </Button>
        <Button
          variant={filter === "preparing" ? "default" : "secondary"}
          className="rounded-full px-5 h-10"
          onClick={() => setFilter("preparing")}
        >
          <ChefHat className="w-4 h-4 mr-2" /> Preparing
        </Button>
        <Button
          variant={filter === "done" ? "default" : "secondary"}
          className="rounded-full px-5 h-10"
          onClick={() => setFilter("done")}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" /> Done
        </Button>
      </div>

      {/* Orders List */}
      <div className="flex-col space-y-3 pb-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 mt-4 border border-dashed border-border rounded-xl bg-card/50">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No {filter} orders right now.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="w-full bg-card border-border shadow-sm overflow-hidden">
              {/* Custom tight padding (p-3.5) instead of large default Shadcn spacing */}
              <div className="p-3.5 flex flex-col">
                
                {/* Top Row: Room Tag & Time */}
                <div className="flex items-start justify-between mb-3">
                  <Badge 
                    variant="secondary" 
                    className="rounded-md px-2.5 py-1 text-xs font-bold bg-secondary text-secondary-foreground border-none"
                  >
                    {order.room}
                  </Badge>
                  <span className="text-[11px] font-semibold text-muted-foreground mt-1">
                    {order.time}
                  </span>
                </div>
                
                {/* Body: Clean Request Display */}
                <div className="flex flex-col space-y-1.5 mb-4 px-1">
                  {order.items.map((item, index) => (
                    <span key={index} className="text-[15px] font-semibold text-foreground leading-tight">
                      {item}
                    </span>
                  ))}
                </div>

                {/* Bottom Row: Action Buttons */}
                {order.status === "pending" && (
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-10 text-sm font-bold border-border text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      className="flex-1 h-10 text-sm font-bold"
                    >
                      Accept
                    </Button>
                  </div>
                )}

                {order.status === "preparing" && (
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-10 text-sm font-bold border-border text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      className="flex-1 h-10 text-sm font-bold"
                    >
                      Delivered
                    </Button>
                  </div>
                )}
                
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}