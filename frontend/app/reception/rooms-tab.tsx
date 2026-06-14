"use client";

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogIn, LogOut } from "lucide-react";

// Simplified mock data
const mockRooms = [
  {
    id: "1",
    name: "Room 1",
    status: "occupied",
    checkInTime: "14:30",
  },
  {
    id: "2",
    name: "Room 2",
    status: "vacant",
  },
  {
    id: "3",
    name: "Suite Majorelle",
    status: "occupied",
    checkInTime: "11:15",
  },
  {
    id: "4",
    name: "Room 4",
    status: "vacant",
  },
];

export function RoomsTab() {
  return (
    <div className="flex flex-col h-full space-y-4 pb-6">
      
      {/* Overview Header */}
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg font-semibold text-foreground">Occupancy</h2>
        <span className="text-sm font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-md">
          2 / 4 Occupied
        </span>
      </div>

      {/* Rooms List */}
      <div className="grid grid-cols-1 gap-2.5">
        {mockRooms.map((room) => (
          <Card key={room.id} className="w-full bg-card border-border shadow-sm overflow-hidden">
            {/* Custom tight padding and flex layout instead of bulky Shadcn wrappers */}
            <div className="p-3.5 flex flex-col gap-3">
              
              {/* Top Row: Status Dot, Room Name, and Time text side-by-side */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-2.5 h-2.5 rounded-full ${
                      room.status === "occupied" ? "bg-emerald-500" : "bg-muted-foreground/30"
                    }`} 
                  />
                  <span className="font-bold text-base text-foreground leading-none">
                    {room.name}
                  </span>
                </div>
                
                {/* Secondary Info text on the right */}
                <span className="text-xs font-semibold text-muted-foreground">
                  {room.status === "occupied" ? `Since ${room.checkInTime}` : "Ready"}
                </span>
              </div>

              {/* Bottom Row: 1-Tap Action Button */}
              {room.status === "vacant" ? (
                <Button variant="default" className="w-full h-10 text-sm font-bold">
                  <LogIn className="w-4 h-4 mr-2" /> Check In
                </Button>
              ) : (
                /* CHECK-OUT ALERT DIALOG */
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary" className="w-full h-10 text-sm font-bold text-foreground border border-border shadow-sm">
                      <LogOut className="w-4 h-4 mr-2 text-muted-foreground" /> Check Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border w-[90%] max-w-sm rounded-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">Check Out {room.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will instantly end the session and lock the mobile portal for this room.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
                      <AlertDialogCancel className="h-10 border-border text-foreground w-full mt-2 sm:mt-0 font-bold">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction className="h-10 w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold">
                        Confirm Check-Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}