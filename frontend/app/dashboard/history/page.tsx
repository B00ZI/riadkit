"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Search, 
  Download, 
  Calendar as CalendarIcon, 
  Filter,
  X,
  RotateCcw
} from "lucide-react";

// Mock Data
const mockHistory = [
  { id: "ORD-7421", date: "2024-05-20 14:30", room: "Room 3", items: "2x Mint Tea, 1x Msemen", total: "85.00 MAD", status: "completed", type: "Menu" },
  { id: "ORD-7420", date: "2024-05-20 11:15", room: "Suite Majorelle", items: "1x 60min Hammam", total: "450.00 MAD", status: "completed", type: "Service" },
  { id: "ORD-7419", date: "2024-05-19 21:05", room: "Room 1", items: "1x Tagine Kefta, 1x Water", total: "140.00 MAD", status: "cancelled", type: "Menu" },
];

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Order History</h1>
          <p className="text-muted-foreground text-sm font-medium">Full audit trail of all guest transactions.</p>
        </div>
        <Button variant="outline" className="font-bold border-border h-10">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card p-2 rounded-xl border border-border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Order ID or Room..." 
            className="pl-9 h-10 bg-background border-none focus-visible:ring-1 focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-border font-bold text-xs uppercase px-4 bg-background">
            <CalendarIcon className="w-4 h-4 mr-2" /> Last 30 Days
          </Button>

          {/* THE FILTER POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 border-border font-bold text-xs uppercase px-4 bg-background relative">
                <Filter className="w-4 h-4 mr-2" /> 
                Filters
                <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px]">2</Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-card border-border shadow-xl rounded-xl overflow-hidden" align="end">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Refine List</h4>
                  <Button variant="ghost" className="h-auto p-0 text-[10px] font-bold uppercase text-primary hover:bg-transparent">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                  </Button>
                </div>

                {/* Filter Group: Status */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-foreground">Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Completed', 'Cancelled', 'Preparing', 'Pending'].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox id={status} className="border-border data-[state=checked]:bg-primary" />
                        <Label htmlFor={status} className="text-xs font-medium cursor-pointer">{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-border" />

                {/* Filter Group: Category */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-foreground">Category</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Menu', 'Service', 'Excursion', 'Spa'].map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox id={cat} className="border-border data-[state=checked]:bg-primary" />
                        <Label htmlFor={cat} className="text-xs font-medium cursor-pointer">{cat}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 border-t border-border flex justify-end">
                <Button className="h-8 text-[10px] font-black uppercase px-6">Apply Filters</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">ID</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Date</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Room</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Items</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-right">Total</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHistory.map((order) => (
              <TableRow key={order.id} className="border-border hover:bg-muted/20 transition-colors">
                <TableCell className="font-bold text-[13px]">{order.id}</TableCell>
                <TableCell className="text-[11px] text-muted-foreground font-semibold">{order.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-tight">
                    {order.room}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-semibold text-foreground tracking-tight py-4">
                  {order.items}
                </TableCell>
                <TableCell className="text-right font-black text-sm">
                  {order.total}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    className={`font-black uppercase text-[9px] px-2 py-0.5 rounded-full border-none shadow-none ${
                      order.status === 'completed' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}