"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, RefreshCw, BellRing, Check, Clock } from "lucide-react";

interface RoomStatus {
  id: number;
  room_number: string;
  type: string;
  is_active: boolean;
}

interface GuestRequestData {
  id: number;
  room_number: string;
  type: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  status: string;
  created_at: string;
}

export default function ReceptionDesk() {
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [requests, setRequests] = useState<GuestRequestData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const token = Cookies.get("riadkit_token");
    const headers = {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    try {
      // Fetch Rooms
      const roomsRes = await fetch("http://192.168.100.53:8000/api/rooms", { headers });
      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData.rooms);
      }

      // Fetch Live Requests
      const requestsRes = await fetch("http://192.168.100.53:8000/api/requests", { headers });
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        console.log("Fetched Requests:", requestsData);
        setRequests(requestsData);
      }
    } catch (err) {
      console.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Initial load + 10-second polling for live requests
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleRoomStatus = async (roomId: number, isActive: boolean) => {
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
        fetchDashboardData();
      }
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleCompleteRequest = async (requestId: number) => {
    const token = Cookies.get("riadkit_token");
    try {
      const res = await fetch(`http://192.168.100.53:8000/api/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      if (res.ok) {
        // Remove it from the local list immediately for snappy UI
        setRequests(requests.filter((req) => req.id !== requestId));
      }
    } catch (err) {
      alert("Failed to update request");
    }
  };

  if (loading) {
    return <div className="flex items-center gap-2 text-muted-foreground"><RefreshCw className="animate-spin" /> Loading Live Desk...</div>;
  }

  return (
    <div className="space-y-10">
      
      {/* SECTION 1: LIVE GUEST REQUESTS */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Live Orders & Requests</h2>
            {requests.length > 0 && (
              <Badge className="bg-red-500 animate-pulse">{requests.length} Pending</Badge>
            )}
          </div>
          <Button onClick={fetchDashboardData} variant="outline" size="sm" className="gap-2 text-xs">
            <RefreshCw className="w-3 h-3" /> Refresh Feed
          </Button>
        </div>

        {requests.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-gray-400">
              <BellRing className="w-10 h-10 mb-3 opacity-20" />
              <p>No pending guest requests. Everything is quiet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {requests.map((req) => (
              <Card key={req.id} className="border-l-4 border-l-amber-500 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-amber-100 text-amber-800 p-3 rounded-lg flex shrink-0 items-center justify-center">
                    <span className="font-bold text-lg">Rm {req.room_number}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lg text-gray-800">
                        {req.quantity}x {req.item_name}
                      </h4>
                      <Badge variant="outline" className="capitalize text-[10px] h-5">{req.type}</Badge>
                    </div>
                    {req.notes && <p className="text-sm text-gray-600 mt-1 italic">"{req.notes}"</p>}
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Ordered {req.created_at}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleCompleteRequest(req.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 sm:w-auto w-full gap-2"
                >
                  <Check className="w-4 h-4" /> Mark Completed
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <hr className="border-gray-200" />

      {/* SECTION 2: ROOM OCCUPANCY */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Room Status</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage daily check-ins and check-outs.</p>
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
                    onClick={() => handleToggleRoomStatus(room.id, true)} 
                    variant="destructive" 
                    className="w-full flex gap-2 justify-center items-center"
                  >
                    <LogOut className="w-4 h-4" />
                    Check Out
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleToggleRoomStatus(room.id, false)} 
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
      </section>

    </div>
  );
}