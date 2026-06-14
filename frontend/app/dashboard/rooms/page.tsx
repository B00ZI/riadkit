"use client";

import { useState } from "react";
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
  QrCode, 
  Download, 
  Printer, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Copy,
  Check
} from "lucide-react";

// Mock Rooms Data
const mockRooms = [
  { id: "1", name: "Room 1", token: "rk_7x29_p92m_lq1z", status: "vacant" },
  { id: "2", name: "Room 2", token: "rk_1a88_z09p_ww42", status: "occupied" },
  { id: "3", name: "Suite Majorelle", token: "rk_9921_bb02_mno9", status: "occupied" },
  { id: "4", name: "Room 4", token: "rk_4410_pp11_xy77", status: "vacant" },
];

export default function RoomsManagement() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase leading-none mb-1">Rooms & QR Codes</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage your physical rooms and generate guest access tokens.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-black uppercase text-xs px-6 h-11">
              <Plus className="w-4 h-4 mr-2" /> Add New Room
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-black uppercase tracking-tight">Create Room</DialogTitle>
              <DialogDescription>
                Add a new physical room. The system will automatically generate a unique QR token.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Room Name or Number</Label>
                <Input placeholder="e.g. Suite Atlas" className="bg-background h-11 font-bold" />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full font-black uppercase text-xs">Generate Room & Token</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rooms Table */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Room Name</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Unique Token</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRooms.map((room) => (
              <TableRow key={room.id} className="border-border hover:bg-muted/20 transition-colors">
                <TableCell className="font-black text-sm uppercase tracking-tight py-4">
                  {room.name}
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
                  <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground bg-muted/30 w-fit px-2 py-1 rounded-md border border-border/50">
                    {room.token}
                    <button 
                      onClick={() => copyToClipboard(room.token)}
                      className="hover:text-primary transition-colors"
                    >
                      {copied === room.token ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex items-center justify-end gap-2">
                    {/* PRINT PREVIEW DIALOG */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase border-border">
                          <QrCode className="w-3.5 h-3.5 mr-1.5 text-primary" /> View QR
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white text-zinc-950 sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
                         {/* THE PRINTABLE CARD UI */}
                         <div className="p-8 flex flex-col items-center text-center space-y-6">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Welcome to</p>
                               <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Riad Al Jazirah</h2>
                            </div>
                            
                            {/* Visual QR Placeholder (Replace with real QR library later) */}
                            <div className="relative p-4 bg-zinc-50 border-2 border-zinc-100 rounded-3xl">
                               <div className="w-48 h-48 bg-zinc-900 rounded-xl flex items-center justify-center p-4">
                                  <QrCode className="w-full h-full text-white opacity-20" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="bg-white p-2 rounded-lg shadow-xl">
                                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-black text-xl">R</div>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-2">
                               <Badge className="bg-zinc-900 text-white font-black rounded-md">{room.name}</Badge>
                               <p className="text-xs font-medium text-zinc-500 max-w-[240px]">
                                 Scan this code to access our digital concierge, order food, and book excursions.
                               </p>
                            </div>
                         </div>
                         <div className="bg-zinc-100 p-4 flex gap-2">
                            <Button className="flex-1 bg-zinc-900 text-white font-bold h-11">
                               <Download className="w-4 h-4 mr-2" /> Download Image
                            </Button>
                            <Button variant="outline" className="flex-1 border-zinc-300 text-zinc-900 font-bold h-11 bg-white">
                               <Printer className="w-4 h-4 mr-2" /> Print PDF
                            </Button>
                         </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Info Card */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-4 items-start">
        <div className="bg-primary/20 p-2 rounded-lg shrink-0 text-primary">
          <ExternalLink className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black uppercase text-primary tracking-tight">QR Security Tip</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            These QR codes point to a static URL. However, the access is secured via your <strong>Sticky Token</strong> system. When a room is vacant, the QR code will only show a "View-Only" version of your Riad. Guests can only order once you click <strong>Check In</strong> from the Front Desk.
          </p>
        </div>
      </div>
    </div>
  );
}

// Minimalist Label component for the dialog
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={`block leading-none ${className}`}>{children}</label>;
}