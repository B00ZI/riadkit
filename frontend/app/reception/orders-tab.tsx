"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  ChefHat,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  DoorOpen,
  Utensils,
  Sparkles,
  Map,
  Package,
  PackageCheck,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { useRequests, type GuestRequest } from "@/hooks/useRequests";
import { AnimatedOrderList } from "@/components/AnimatedOrderList";

type FilterStatus = "pending" | "in_progress" | "completed";

const TYPE_CONFIG: Record<
  GuestRequest["type"],
  { label: string; icon: LucideIcon; className: string }
> = {
  menu: { label: "Menu", icon: Utensils, className: "bg-amber-500/10 text-amber-700" },
  service: { label: "Service", icon: Sparkles, className: "bg-sky-500/10 text-sky-700" },
  excursion: { label: "Excursion", icon: Map, className: "bg-teal-500/10 text-teal-700" },
};

const STATUS_CONFIG: Record<
  GuestRequest["status"],
  { label: string; icon: LucideIcon; className: string }
> = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-500/10 text-amber-700" },
  in_progress: {
    label: "Preparing",
    icon: ChefHat,
    className: "bg-primary/10 text-primary",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
  },
};

function OrderCard({
  order,
  onStatusChange,
}: {
  order: GuestRequest;
  onStatusChange: (id: number, newStatus: string) => void;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const typeInfo = TYPE_CONFIG[order.type];
  const statusInfo = STATUS_CONFIG[order.status];
  const TypeIcon = typeInfo.icon;
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <Card className="w-full bg-card border border-border  overflow-hidden px-4 py-3 gap-3">
        {/* Header: type · room | status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Badge
              className={`${typeInfo.className} border-transparent gap-1.5 rounded-md h-6 px-2.5 text-[10px] font-black uppercase tracking-widest shrink-0`}
            >
              <TypeIcon className="w-3.5 h-3.5" />
              {typeInfo.label}
            </Badge>
            <Badge
              variant="secondary"
              className="border-transparent gap-1.5 rounded-md h-6 px-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground shrink-0"
            >
              <DoorOpen className="w-3.5 h-3.5" />
              {order.room_number}
            </Badge>
          </div>
          <Badge
            className={`${statusInfo.className} border-transparent gap-1.5 rounded-md h-6 px-2.5 text-[10px] font-black uppercase tracking-widest shrink-0`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {statusInfo.label}
          </Badge>
        </div>

        {/* Item */}
        <div className="space-y-0.5">
          <p className="text-lg font-bold tracking-tight text-foreground leading-tight">
            {order.item_name}
          </p>
          {order.notes && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {order.notes}
            </p>
          )}
        </div>

        {/* Meta: qty · time | price */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              ×{order.quantity}
            </span>
            <span className="w-px h-3.5 bg-border shrink-0" />
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {order.created_at}
            </span>
          </div>
          <span className="text-base font-black tracking-tight text-foreground shrink-0">
            {order.total_price}
            <span className="text-[10px] font-black uppercase text-muted-foreground ml-1">
              MAD
            </span>
          </span>
        </div>

        {/* Actions / status confirmation */}
        {order.status === "pending" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-12 text-sm font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 h-12 text-sm font-bold"
              onClick={() => onStatusChange(order.id, "in_progress")}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Accept
            </Button>
          </div>
        )}

        {order.status === "in_progress" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-12 text-sm font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 h-12 text-sm font-bold"
              onClick={() => onStatusChange(order.id, "completed")}
            >
              <PackageCheck className="w-4 h-4 mr-2" /> Delivered
            </Button>
          </div>
        )}

        {order.status === "completed" && (
          <div className="flex items-center justify-center gap-1.5 h-12 rounded-lg bg-emerald-500/10 text-emerald-700 text-sm font-bold animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            Completed
          </div>
        )}
      </Card>

      {/* ─── CANCEL CONFIRMATION ──────────────────────────────── */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="bg-card border-border w-[90%] max-w-sm rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Cancel this order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {order.quantity}x {order.item_name} for Room {order.room_number} will be
              marked as cancelled and removed from this list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
            <AlertDialogCancel className="h-10 border-border text-foreground w-full mt-2 sm:mt-0 font-bold">
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setCancelOpen(false);
                onStatusChange(order.id, "cancelled");
              }}
              className="h-10 w-full font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function OrdersTab() {
  const { requests, isLoading, error, updateStatus, refresh } = useRequests({
    status: 'pending,in_progress,completed',
    days: 1,
  });

  const [filter, setFilter] = useState<FilterStatus>("pending");

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="px-4 py-3 gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-14 rounded-md" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
              <Skeleton className="h-5 w-3/5" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-12 flex-1 rounded-lg" />
                <Skeleton className="h-12 flex-1 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground text-center max-w-xs">{error}</p>
        <Button variant="outline" onClick={() => refresh()} className="font-bold">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 pb-6">
      {/* Sticky filter bar */}
      <div className="sticky  z-10 -mx-4 -mt-4 border-b border-border bg-card/95 shadow-sm px-4 pt-2 pb-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
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
      </div>

      <AnimatedOrderList
        orders={requests}
        filterStatus={filter}
        onStatusChange={(id, status) => updateStatus(id, status as GuestRequest["status"])}
        emptyMessage={`No ${filter.replace("_", " ")} orders right now.`}
        emptyIcon={<CheckCircle2 className="w-10 h-10 text-muted-foreground/40" />}
        renderCard={(order, handleStatusChange) => (
          <OrderCard order={order} onStatusChange={handleStatusChange} />
        )}
      />
    </div>
  );
}
