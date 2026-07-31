// app/dashboard/reception/rooms-tab.tsx
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
import { LogIn, LogOut, AlertTriangle, RefreshCw, BedDouble, UserRound, Clock } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";

export function RoomsTab() {
  const { rooms, isLoading, error, checkIn, checkOut, refresh } = useRooms();

  // ─── Confirmation Dialog State ─────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<"checkin" | "checkout" | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<{ id: number; number: string } | null>(null);

  const openDialog = (action: "checkin" | "checkout", roomId: number, roomNumber: string) => {
    setAction(action);
    setSelectedRoom({ id: roomId, number: roomNumber });
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedRoom) return;
    try {
      if (action === "checkin") await checkIn(selectedRoom.id);
      else await checkOut(selectedRoom.id);
    } catch {
      // Error is handled in the hook
    } finally {
      setDialogOpen(false);
      setSelectedRoom(null);
      setAction(null);
    }
  };

  // ─── Loading / Error ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col h-full space-y-4 pb-6">
        <div className="flex justify-between items-center px-1 mb-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="px-4 py-3 gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
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

  const occupiedCount = rooms.filter((r) => r.status === "occupied").length;

  return (
    <div className="flex flex-col h-full space-y-4 pb-6">
      {/* Overview Header */}
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg font-semibold text-foreground">Occupancy</h2>
        <span className="text-sm font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-md">
          {occupiedCount} / {rooms.length} Occupied
        </span>
      </div>

      {/* Rooms List */}
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-1.5 py-12 border border-dashed border-border rounded-xl bg-card/50 px-6">
          <BedDouble className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No rooms yet</p>
          <p className="text-xs text-muted-foreground max-w-[240px]">
            Rooms will appear here once they are added to this riad.
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-2.5">
        {rooms.map((room) => {
          const checkInTime = room.active_session?.check_in_at
            ? new Date(room.active_session.check_in_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;

          return (
            <Card key={room.id} className="w-full bg-card border-border shadow-sm overflow-hidden px-4 py-3 gap-3">
              {/* Top Row: Room Identity + Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="text-lg font-black tracking-tight text-foreground leading-none">
                    {room.room_number}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1.5">
                    {room.type || "Room"}
                  </span>
                </div>
                {room.status === "occupied" ? (
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-transparent gap-1 h-6 rounded-md px-2.5 text-[10px] font-black uppercase tracking-widest shrink-0">
                    <UserRound className="w-3.5 h-3.5" />
                    Occupied
                  </Badge>
                ) : (
                  <Badge className="bg-muted text-muted-foreground border-transparent gap-1 h-6 rounded-md px-2.5 text-[10px] font-black uppercase tracking-widest shrink-0">
                    <BedDouble className="w-3.5 h-3.5" />
                    Vacant
                  </Badge>
                )}
              </div>

              {/* Guest Session (when available) */}
              {room.status === "occupied" && checkInTime && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  Since {checkInTime}
                </div>
              )}

              {/* Primary Action */}
              {room.status === "vacant" ? (
                <Button
                  variant="default"
                  className="w-full h-12 text-sm font-bold"
                  onClick={() => openDialog("checkin", room.id, room.room_number)}
                >
                  <LogIn className="w-4 h-4 mr-2" /> Check In
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-12 text-sm font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => openDialog("checkout", room.id, room.room_number)}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Check Out
                </Button>
              )}
            </Card>
          );
        })}
      </div>
      )}

      {/* ─── CONFIRMATION DIALOG ──────────────────────────────── */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-card border-border w-[90%] max-w-sm rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {action === "checkin" ? "Check In" : "Check Out"} {selectedRoom?.number}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === "checkin"
                ? "This will generate a new session and QR code for the guest."
                : "This will instantly end the session and lock the mobile portal for this room."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
            <AlertDialogCancel className="h-10 border-border text-foreground w-full mt-2 sm:mt-0 font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={`h-10 w-full font-bold ${
                action === "checkin"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }`}
            >
              {action === "checkin" ? "Confirm Check-In" : "Confirm Check-Out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}