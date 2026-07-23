// app/dashboard/history/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Calendar as CalendarIcon,
  Filter,
  RotateCcw,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import { useRequests } from "@/hooks/useRequests";
import { useRooms } from "@/hooks/useRooms";

// ─── Helpers ──────────────────────────────────────────────────
const statusMap: Record<string, string> = {
  pending: "Pending",
  in_progress: "Preparing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusVariantMap: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500",
  in_progress: "bg-blue-500/10 text-blue-500",
  completed: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-destructive/10 text-destructive",
};

const typeMap: Record<string, string> = {
  menu: "Menu",
  service: "Service",
  excursion: "Excursion",
};

// Format date without seconds: "Jun 21, 2025, 14:30"
const formatDate = (isoString: string) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};



export default function OrderHistory() {
  const searchParams = useSearchParams();
  const { requests, isLoading, error, refresh } = useRequests({
    status: "all",
  });
  const { rooms } = useRooms(); // only take rooms, ignore loading/error if you want
  // ─── State ──────────────────────────────────────────────────
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [statusFilters, setStatusFilters] = useState<string[]>([
    "Completed",
    "Cancelled",
  ]);
  const [typeFilters, setTypeFilters] = useState<string[]>([
    "Menu",
    "Service",
    "Excursion",
  ]);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      // Automatically set the filters to that specific day
      setFromDate(dateParam);
      setToDate(dateParam);

      setStatusFilters(["Pending", "Preparing", "Completed", "Cancelled"]);
    }
  }, [searchParams]);

  // ─── Unique room numbers from data ─────────────────────────
  const roomOptions = useMemo(() => {
    const uniqueRooms = Array.from(new Set(rooms.map((room) => room.room_number)));
    return uniqueRooms.sort();
  }, [rooms]);

  // ─── Filtered Data ─────────────────────────────────────────
  const filteredRequests = useMemo(() => {
    return requests.filter((order) => {
      // Room filter
      if (selectedRoom !== "all" && order.room_number !== selectedRoom) return false;

      // Date range
      if (fromDate && order.created_at_raw) {
        const orderDate = new Date(order.created_at_raw).toISOString().split("T")[0];
        if (orderDate < fromDate) return false;
      }
      if (toDate && order.created_at_raw) {
        const orderDate = new Date(order.created_at_raw).toISOString().split("T")[0];
        if (orderDate > toDate) return false;
      }

      // Status
      const displayStatus = statusMap[order.status] || order.status;
      if (!statusFilters.includes(displayStatus)) return false;

      // Type
      const displayType = typeMap[order.type] || order.type;
      if (!typeFilters.includes(displayType)) return false;

      return true;
    });
  }, [requests, selectedRoom, fromDate, toDate, statusFilters, typeFilters]);

  // ─── Toggle Handlers ──────────────────────────────────────
  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleTypeFilter = (type: string) => {
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedRoom("all");
    setStatusFilters(["Completed", "Cancelled"]);
    setTypeFilters(["Menu", "Service", "Excursion"]);
  };

  const clearDates = () => {
    setFromDate("");
    setToDate("");
  };

  // ─── Export ────────────────────────────────────────────────
  const handleExport = () => {
    alert("Export CSV functionality will be added soon.");
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
        <Button variant="outline" onClick={() => refresh()}>
          Retry
        </Button>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Order History</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Full audit trail of all guest transactions.
          </p>
        </div>
        <Button
          variant="outline"
          className="font-bold border-border h-10"
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* ─── Control Bar ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-card p-3 rounded-xl border border-border shadow-sm">
        {/* Date Range + Room Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-muted-foreground">
              From
            </span>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 w-36 bg-background border-border text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-muted-foreground">
              To
            </span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 w-36 bg-background border-border text-xs"
            />
          </div>
          {(fromDate || toDate) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              onClick={clearDates}
              title="Clear date filters"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          <Separator orientation="vertical" className="h-8 hidden md:block" />

          {/* Room Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-muted-foreground">
              Room
            </span>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="h-9 w-36 bg-background border-border text-xs font-bold">
                <SelectValue placeholder="All rooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All rooms</SelectItem>
                {roomOptions.map((room, index) => (
                  <SelectItem key={`${room}-${index}`} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Popover */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 border-border font-bold text-xs uppercase px-4 bg-background relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {statusFilters.length + typeFilters.length > 0 && (
                  <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px]">
                    {statusFilters.length + typeFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 bg-card border-border shadow-xl rounded-xl overflow-hidden"
              align="end"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                    Refine List
                  </h4>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 text-[10px] font-bold uppercase text-primary hover:bg-transparent"
                    onClick={resetFilters}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                  </Button>
                </div>

                {/* Status Filters */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-foreground">Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Pending", "Preparing", "Completed", "Cancelled"].map(
                      (status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={status}
                            checked={statusFilters.includes(status)}
                            onCheckedChange={() => toggleStatusFilter(status)}
                            className="border-border data-[state=checked]:bg-primary"
                          />
                          <Label
                            htmlFor={status}
                            className="text-xs font-medium cursor-pointer"
                          >
                            {status}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Separator className="bg-border" />

                {/* Category Filters */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-foreground">Category</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Menu", "Service", "Excursion"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={typeFilters.includes(type)}
                          onCheckedChange={() => toggleTypeFilter(type)}
                          className="border-border data-[state=checked]:bg-primary"
                        />
                        <Label
                          htmlFor={type}
                          className="text-xs font-medium cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* ─── Data Table ──────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">
                ID
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">
                Date
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">
                Room
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">
                Items
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-right">
                Total
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  <p className="text-sm font-medium">No orders found</p>
                  <p className="text-xs">Try adjusting your filters.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((order) => {
                const displayStatus = statusMap[order.status] || order.status;
                const displayType = typeMap[order.type] || order.type;
                const formattedDate = order.created_at_raw
                  ? formatDate(order.created_at_raw)
                  : order.created_at || "N/A";
                return (
                  <TableRow
                    key={order.id}
                    className="border-border hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-bold text-[13px]">
                      #{order.id}
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground font-semibold">
                      {formattedDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-tight"
                      >
                        {order.room_number}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-foreground tracking-tight py-4">
                      {order.quantity}x {order.item_name}
                    </TableCell>
                    <TableCell className="text-right font-black text-sm">
                      {order.total_price} MAD
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={`font-black uppercase text-[9px] px-2 py-0.5 rounded-full border-none shadow-none ${statusVariantMap[order.status]}`}
                      >
                        {displayStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}