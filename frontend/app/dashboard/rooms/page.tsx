"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, QrCode } from "lucide-react";

interface Room {
  id: number;
  room_number: string;
  type: string;
  qr_token: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    room_number: "",
    type: "",
  });

  // 1. Fetch Rooms from API
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
      console.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 2. Add a new Room
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    const token = Cookies.get("riadkit_token");

    try {
      const res = await fetch("http://192.168.100.53:8000/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add room");
      }

      // Append new room and reset form
      setRooms([...rooms, data.room]);
      setFormData({ room_number: "", type: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  // 3. Delete a Room
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    const token = Cookies.get("riadkit_token");
    try {
      const res = await fetch(`http://192.168.100.53:8000/api/rooms/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setRooms(rooms.filter((room) => room.id !== id));
      }
    } catch (err) {
      alert("Failed to delete room");
    }
  };

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Rooms & QR Codes</h2>
        <p className="text-muted-foreground">Manage physical rooms and generate scannable QR Codes for guest access.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Form to Add Room */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Add New Room</CardTitle>
            <CardDescription>Create a room to instantly generate its secure QR token.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number / Name</Label>
                <Input id="room_number" placeholder="Room 101, Suite Royale..." required value={formData.room_number} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Room Type</Label>
                <Input id="type" placeholder="Double Room, Suite, Single..." required value={formData.type} onChange={handleChange} />
              </div>

              <Button type="submit" className="w-full flex gap-2" disabled={adding}>
                <Plus className="w-4 h-4" />
                {adding ? "Adding..." : "Add Room"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Rooms List with QR Code previews */}
        <div className="md:col-span-2">
          {rooms.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <QrCode className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              No rooms created yet. Add your first room on the left!
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {rooms.map((room) => {
                // The URL the guest will actually visit when they scan the QR code!
                const guestPortalUrl = `http://192.168.100.53:3000/room/${room.qr_token}`;
                // Direct free QR Code generation API
                const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(guestPortalUrl)}`;

                return (
                  <Card key={room.id} className="flex flex-col justify-between">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold">{room.room_number}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1 capitalize">{room.type}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(room.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center pt-2 space-y-4">
                      {/* Interactive QR Code preview */}
                      <div className="p-3 border rounded-lg bg-white shadow-sm">
                        <img 
                          src={qrCodeImageUrl} 
                          alt={`QR for ${room.room_number}`} 
                          className="w-32 h-32"
                        />
                      </div>
                      
                      <div className="text-center w-full">
                        <Label className="text-xs text-muted-foreground block mb-1">Token: <code className="bg-muted px-1 py-0.5 rounded text-gray-700">{room.qr_token}</code></Label>
                        <a 
                          href={guestPortalUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline font-medium block truncate mt-1"
                        >
                          Open Guest Portal Link
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}