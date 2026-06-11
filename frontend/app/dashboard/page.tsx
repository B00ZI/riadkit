"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, RefreshCw } from "lucide-react";

interface RoomStatus {
  id: number;
  room_number: string;
  type: string;
  is_active: boolean;
}

export default function ReceptionDesk() {
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    const token = Cookies.get("riadkit_token");
    try {
      const res = await fetch("http://192.168.100.53:8000/api/rooms", {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error("Failed to load desk status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleToggleStatus = async (roomId: number, isActive: boolean) => {
    const token = Cookies.get("riadkit_token");
    const endpoint = isActive ? "checkout" : "checkin";

    try {
      const res = await fetch(`http://192.168.100.53:8000/api/rooms/${roomId}/${endpoint}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Refresh the local UI state
        fetchRooms();
      }
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) {
    return <div className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Loading desk...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Reception Desk</h2>
          <p className="text-muted-foreground">Monitor occupancy and manage daily check-ins and check-outs.</p>
        </div>
        <Button onClick={fetchRooms} variant="outline" size="icon">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className={`border-t-4 ${room.is_active ? 'border-t-emerald-500' : 'border-t-gray-300'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{room.room_number}</CardTitle>
                  <CardDescription className="capitalize">{room.type}</CardDescription>
                </div>
                <Badge variant={room.is_active ? "default" : "secondary"}>
                  {room.is_active ? "Occupied" : "Vacant"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex justify-end">
              {room.is_active ? (
                <Button 
                  onClick={() => handleToggleStatus(room.id, true)} 
                  variant="destructive" 
                  className="w-full flex gap-2 justify-center items-center"
                >
                  <LogOut className="w-4 h-4" />
                  Check Out
                </Button>
              ) : (
                <Button 
                  onClick={() => handleToggleStatus(room.id, false)} 
                  variant="default"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 flex gap-2 justify-center items-center"
                >
                  <LogIn className="w-4 h-4" />
                  Check In
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}