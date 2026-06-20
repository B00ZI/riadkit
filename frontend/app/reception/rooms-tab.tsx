// app/dashboard/reception/rooms-tab.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { LogIn, LogOut, Loader2, AlertTriangle } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";

export function RoomsTab() {
  const { rooms, isLoading, error, checkIn, checkOut } = useRooms();

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
      <div className="grid grid-cols-1 gap-2.5">
        {rooms.map((room) => {
          const checkInTime = room.active_session?.check_in_at
            ? new Date(room.active_session.check_in_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;

          return (
            <Card key={room.id} className="w-full bg-card border-border shadow-sm overflow-hidden">
              <div className="p-3.5 flex flex-col gap-3">
                {/* Top Row: Status Dot, Room Name, and Time */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        room.status === "occupied" ? "bg-emerald-500" : "bg-muted-foreground/30"
                      }`}
                    />
                    <span className="font-bold text-base text-foreground leading-none">
                      {room.room_number}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {room.status === "occupied" && checkInTime
                      ? `Since ${checkInTime}`
                      : "Ready"}
                  </span>
                </div>

                {/* Bottom Row: 1-Tap Action Button */}
                {room.status === "vacant" ? (
                  <Button
                    variant="default"
                    className="w-full h-10 text-sm font-bold"
                    onClick={() => openDialog("checkin", room.id, room.room_number)}
                  >
                    <LogIn className="w-4 h-4 mr-2" /> Check In
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full h-10 text-sm font-bold text-foreground border border-border shadow-sm"
                    onClick={() => openDialog("checkout", room.id, room.room_number)}
                  >
                    <LogOut className="w-4 h-4 mr-2 text-muted-foreground" /> Check Out
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

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