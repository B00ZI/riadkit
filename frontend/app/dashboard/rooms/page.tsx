// app/dashboard/rooms/page.tsx
"use client";

import { useState } from "react";
import { useRooms } from "@/hooks/useRooms";
import { useSettings } from "@/hooks/useSettings";
import { useQRPrint } from "@/hooks/useQRPrint";
import { toast } from "@/lib/toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Download,
  Trash2,
  Copy,
  Check,
  Loader2,
  AlertTriangle
} from "lucide-react";

export default function RoomsManagement() {
  // ─── Hooks ──────────────────────────────────────────────────
  const { rooms, isLoading, error, createRoom, deleteRoom } = useRooms();
  const { settings } = useSettings();
  const { printSingle, printAll } = useQRPrint();

  const riadName = settings.name || 'Riad';

  // ─── State ──────────────────────────────────────────────────
  const [copied, setCopied] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomType, setNewRoomType] = useState("Standard");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [printingRoom, setPrintingRoom] = useState<number | null>(null);
  const [printingAll, setPrintingAll] = useState(false);

  // ─── Copy ──────────────────────────────────────────────────
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  // ─── Print ─────────────────────────────────────────────────
  const handlePrintSingle = async (room: { id: number; room_number: string; qr_token: string }) => {
    setPrintingRoom(room.id);
    try {
      await printSingle(riadName, { room_number: room.room_number, qr_token: room.qr_token });
    } catch (err) {
      toast.error('Failed to generate QR card');
    } finally {
      setPrintingRoom(null);
    }
  };

  const handlePrintAll = async () => {
    setPrintingAll(true);
    try {
      await printAll(riadName, rooms.map(r => ({ room_number: r.room_number, qr_token: r.qr_token })));
    } catch (err) {
      toast.error('Failed to generate QR cards');
    } finally {
      setPrintingAll(false);
    }
  };

  // ─── Room CRUD ─────────────────────────────────────────────
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setIsCreating(true);
    try {
      await createRoom(newRoomNumber, newRoomType);
      toast.success(`Room ${newRoomNumber} created`);
      setNewRoomNumber("");
      setNewRoomType("Standard");
      setCreateDialogOpen(false);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create room");
      toast.error("Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (confirm("Delete this room?")) {
      await deleteRoom(id);
      toast.success("Room deleted");
    }
  };

  // ─── Loading / Error ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ─── HEADER ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase leading-none">
            Rooms & QR Codes
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Manage rooms and view QR codes for guests
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* ─── DOWNLOAD ALL ──────────────────────────────── */}
          <Button
            variant="outline"
            className="font-black uppercase text-xs px-4 h-11 border-border"
            onClick={handlePrintAll}
            disabled={rooms.length === 0 || printingAll}
          >
            {printingAll ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Download className="w-4 h-4 mr-2" /> Download All QR Cards</>
            )}
          </Button>

          {/* ─── CREATE ROOM DIALOG ────────────────────── */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-black uppercase text-xs px-6 h-11">
                <Plus className="w-4 h-4 mr-2" /> Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
              <DialogHeader>
                <DialogTitle className="font-black uppercase tracking-tight">
                  Create Room
                </DialogTitle>
                <DialogDescription>
                  Add a new room. A unique QR token will be generated automatically.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRoom}>
                <div className="py-4 space-y-4">
                  {createError && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium">
                      {createError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Room Name
                    </Label>
                    <Input 
                      placeholder="e.g. Suite Atlas" 
                      className="h-11 font-bold"
                      value={newRoomNumber}
                      onChange={(e) => setNewRoomNumber(e.target.value)}
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Room Type
                    </Label>
                    <select 
                      className="w-full h-11 bg-background border border-input rounded-md px-3 font-bold text-sm"
                      value={newRoomType}
                      onChange={(e) => setNewRoomType(e.target.value)}
                      disabled={isCreating}
                    >
                      <option value="Standard">Standard</option>
                      <option value="Suite">Suite</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Family">Family</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full font-black uppercase text-xs"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                    ) : (
                      "Generate Room & Token"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ─── TABLE ─────────────────────────────────────────── */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">
                Room
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">
                Type
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">
                Status
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">
                Token
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <p className="text-sm font-medium">No rooms yet</p>
                  <p className="text-xs">Click "Add Room" to get started</p>
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="font-black text-sm uppercase tracking-tight py-4">
                    {room.room_number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {room.type}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`font-bold text-[10px] uppercase border-none ${
                        room.status === 'occupied' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border border-border/50 w-fit">
                      {room.qr_token}
                      <button 
                        onClick={() => copyToClipboard(room.qr_token)}
                        className="hover:text-primary transition-colors"
                      >
                        {copied === room.qr_token ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-[10px] font-black uppercase border-border"
                        onClick={() => handlePrintSingle(room)}
                        disabled={printingRoom === room.id}
                      >
                        {printingRoom === room.id ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Download PDF
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ─── INFO ───────────────────────────────────────────── */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-4 items-start">
        <div className="bg-primary/20 p-2 rounded-lg shrink-0 text-primary">
          <Download className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black uppercase text-primary tracking-tight">
            QR Cards
          </p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Click <strong>Download PDF</strong> on any room to open a print-ready QR card. 
            Use <strong>Download All QR Cards</strong> at the top to print cards for all rooms at once.
            Your browser's "Save as PDF" option will produce a high-resolution PDF.
          </p>
        </div>
      </div>
    </div>
  );
}
