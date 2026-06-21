// app/dashboard/front-desk/page.tsx
"use client";

import { useRooms } from "@/hooks/useRooms";
import { useRequests } from "@/hooks/useRequests";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Loader2,
  AlertTriangle,
  PlusCircle,
  LogIn,
  LogOut,
  Clock,
  ChefHat,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FilterStatus = "pending" | "in_progress" | "completed";

export default function OwnerFrontDesk() {
  const router = useRouter();

  const {
    rooms,
    checkIn,
    checkOut,
    isLoading: roomsLoading,
    error: roomsError,
  } = useRooms();

  const {
    requests,
    updateStatus,
    isLoading: reqLoading,
    error: requestsError,
  } = useRequests({
    status: 'pending,in_progress,completed',
    days: 1, // only completed from the last 24 hours
  });

  const [filter, setFilter] = useState<FilterStatus>("pending");

  // ─── Confirmation Dialog State ─────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"checkin" | "checkout" | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>("");

  // ─── Handlers ───────────────────────────────────────────────
  const openConfirmDialog = (
    action: "checkin" | "checkout",
    roomId: number,
    roomNumber: string
  ) => {
    setDialogAction(action);
    setSelectedRoomId(roomId);
    setSelectedRoomNumber(roomNumber);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedRoomId || !dialogAction) return;

    try {
      if (dialogAction === "checkin") {
        await checkIn(selectedRoomId);
      } else {
        await checkOut(selectedRoomId);
      }
    } catch {
      // Error is already handled in the hook
    } finally {
      setDialogOpen(false);
      setDialogAction(null);
      setSelectedRoomId(null);
      setSelectedRoomNumber("");
    }
  };

  // ─── Loading / Error ────────────────────────────────────────
  if (roomsLoading || reqLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (roomsError || requestsError) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-14 h-14 text-destructive" />
        <p className="text-muted-foreground text-center max-w-sm">
          {roomsError || requestsError || "Failed to load front desk data"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Live Front Desk</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Real-time room and request management.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-black uppercase tracking-wider px-3 py-1">
          {rooms.filter((r) => r.status === "occupied").length} / {rooms.length} occupied
        </Badge>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
  {/* LEFT: LIVE REQUESTS */}
  <section className="lg:col-span-7 space-y-4">
  {/* ─── Header – now only the tabs ───────────────────── */}
  <div className="flex items-center justify-between">
    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
      Requests
    </h2>
    <div className="flex gap-1.5 p-1 bg-secondary rounded-lg">
      {(["pending", "in_progress", "completed"] as const).map((s) => (
        <button
          key={s}
          onClick={() => setFilter(s)}
          className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
            filter === s
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/50"
          }`}
        >
          {s === "in_progress" ? "in progress" : s}
        </button>
      ))}
    </div>
  </div>

  {/* ─── Request List ──────────────────────────────────── */}
  <div className="space-y-2">
    {requests
      .filter((r) => r.status === filter)
      .map((order) => (
        <Card
          key={order.id}
          className="px-4 py-3 bg-card border-border shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
        >
          {/* ... card content (unchanged) ... */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-black text-[10px] uppercase px-2 py-0.5">
                {order.room_number}
              </Badge>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                {order.type}
              </span>
            </div>
            <span className="text-sm font-black text-primary">
              {order.total_price} MAD
            </span>
          </div>
          <p className="text-sm font-bold leading-tight">
            {order.quantity}x <span className="font-medium">{order.item_name}</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            {order.status === "pending" && (
              <Button
                onClick={() => updateStatus(order.id, "in_progress")}
                size="sm"
                className="flex-1 h-8 font-black uppercase text-[10px]"
              >
                Accept
              </Button>
            )}
            {order.status === "in_progress" && (
              <Button
                onClick={() => updateStatus(order.id, "completed")}
                size="sm"
                className="flex-1 h-8 font-black uppercase text-[10px] bg-emerald-600 hover:bg-emerald-700"
              >
                Complete
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateStatus(order.id, "cancelled")}
              className="flex-1 h-8 font-black uppercase text-[10px] border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            >
              Cancel
            </Button>
          </div>
        </Card>
      ))}

    {requests.filter((r) => r.status === filter).length === 0 && (
      <div className="text-center py-12 text-muted-foreground">
        <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500/50 mb-2" />
        <p className="text-sm font-medium">No {filter} requests</p>
        <p className="text-xs">All clear at the front desk</p>
      </div>
    )}
  </div>

  {/* ─── "View All History" – now at the bottom (only on completed) ─── */}
  {filter === "completed" && (
    <div className="flex justify-end pt-1">
      <Button
        variant="link"
        size="sm"
        className="text-[10px] font-black uppercase text-primary hover:underline"
        onClick={() => router.push("/dashboard/history")}
      >
        View All History →
      </Button>
    </div>
  )}
</section>

  {/* RIGHT: ROOM GRID */}
  <section className="lg:col-span-5 space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
        Rooms
      </h2>
      <Badge variant="outline" className="text-[10px] font-black">
        {rooms.filter((r) => r.status === "occupied").length} / {rooms.length} occupied
      </Badge>
    </div>

    {rooms.length === 0 ? (
      <Card className="p-10 border-dashed bg-card/50 text-center text-muted-foreground flex flex-col items-center gap-4">
        <PlusCircle className="w-12 h-12 text-muted-foreground/30" />
        <div>
          <p className="text-sm font-medium">No rooms created yet</p>
          <p className="text-xs">Get started by adding your first room</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/rooms")}
          variant="outline"
          className="mt-1 font-black uppercase text-xs"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </Card>
    ) : (
      <div className="grid grid-cols-2 gap-3">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className="p-3 border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="font-black text-sm uppercase tracking-tight">
                {room.room_number}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  room.status === "occupied"
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    : "bg-muted-foreground/30"
                }`}
              />
            </div>
            {room.status === "vacant" ? (
              <Button
                onClick={() =>
                  openConfirmDialog("checkin", room.id, room.room_number)
                }
                variant="outline"
                className="w-full h-8 text-[10px] font-black uppercase group hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
              >
                <LogIn className="w-3 h-3 mr-1.5 transition-transform group-hover:scale-110" />
                Check In
              </Button>
            ) : (
              <Button
                onClick={() =>
                  openConfirmDialog("checkout", room.id, room.room_number)
                }
                variant="outline"
                className="w-full h-8 text-[10px] font-black uppercase border-destructive text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-3 h-3 mr-1.5" />
                Check Out
              </Button>
            )}
          </Card>
        ))}
      </div>
    )}
  </section>
</div>

      {/* ─── CONFIRMATION DIALOG ──────────────────────────────── */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tight">
              {dialogAction === "checkin" ? "Check In Guest" : "Check Out Guest"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "checkin"
                ? `You are about to check in a guest to room "${selectedRoomNumber}". This will generate a new session and QR code for the guest.`
                : `You are about to check out the guest from room "${selectedRoomNumber}". This will end the current session and mark the room as vacant.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                dialogAction === "checkin"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-xs"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90 font-black uppercase text-xs"
              }
            >
              {dialogAction === "checkin" ? "Confirm Check In" : "Confirm Check Out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}