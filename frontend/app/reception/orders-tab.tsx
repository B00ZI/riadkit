"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { useRequests } from "@/hooks/useRequests";
import { AnimatedOrderList } from "@/components/AnimatedOrderList";

type FilterStatus = "pending" | "in_progress" | "completed";

export function OrdersTab() {
  const { requests, isLoading, error, updateStatus } = useRequests({
    status: 'pending,in_progress,completed',
    days: 1,
  });

  const [filter, setFilter] = useState<FilterStatus>("pending");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Button
          variant={filter === "pending" ? "default" : "secondary"}
          className="rounded-full px-5 h-10"
          onClick={() => setFilter("pending")}
        >
          <Clock className="w-4 h-4 mr-2" /> Pending
        </Button>
        <Button
          variant={filter === "in_progress" ? "default" : "secondary"}
          className="rounded-full px-5 h-10"
          onClick={() => setFilter("in_progress")}
        >
          <ChefHat className="w-4 h-4 mr-2" /> Preparing
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "secondary"}
          className="rounded-full px-5 h-10"
          onClick={() => setFilter("completed")}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" /> Done
        </Button>
      </div>

      <AnimatedOrderList
        orders={requests}
        filterStatus={filter}
        onStatusChange={(id, status) => updateStatus(id, status as any)}
        emptyMessage={`No ${filter.replace("_", " ")} orders right now.`}
        emptyIcon={<CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />}
        renderCard={(order, handleStatusChange) => (
          <Card className="w-full bg-card border-border shadow-sm overflow-hidden">
            <div className="p-3.5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <Badge
                  variant="secondary"
                  className="rounded-md px-2.5 py-1 text-xs font-bold bg-secondary text-secondary-foreground border-none"
                >
                  {order.room_number}
                </Badge>
                <span className="text-[11px] font-semibold text-muted-foreground mt-1">
                  {order.created_at}
                </span>
              </div>

              <div className="flex flex-col space-y-1.5 mb-4 px-1">
                <span className="text-[15px] font-semibold text-foreground leading-tight">
                  {order.quantity}x {order.item_name}
                </span>
                {order.notes && (
                  <span className="text-xs text-muted-foreground italic">Note: {order.notes}</span>
                )}
              </div>

              <div key={order.status}>
                {order.status === "pending" && (
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      className="flex-1 h-10 text-sm font-bold border-border text-muted-foreground hover:text-foreground"
                      onClick={() => handleStatusChange(order.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 h-10 text-sm font-bold"
                      onClick={() => handleStatusChange(order.id, "in_progress")}
                    >
                      Accept
                    </Button>
                  </div>
                )}

                {order.status === "in_progress" && (
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      className="flex-1 h-10 text-sm font-bold border-border text-muted-foreground hover:text-foreground"
                      onClick={() => handleStatusChange(order.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 h-10 text-sm font-bold"
                      onClick={() => handleStatusChange(order.id, "completed")}
                    >
                      Delivered
                    </Button>
                  </div>
                )}

                {order.status === "completed" && (
                  <div className="text-sm font-bold text-emerald-600 text-center py-1 animate-in fade-in zoom-in-95 duration-300">
                    ✅ Completed
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      />
    </div>
  );
}
