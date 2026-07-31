// app/dashboard/reception/page.tsx
"use client";

import { useState } from "react";
import { ClipboardList, BedDouble, PackageOpen, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrdersTab } from "./orders-tab";
import { RoomsTab } from "./rooms-tab";
import { StockTab } from "./stock-tab";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { useRooms } from "@/hooks/useRooms";
import { useCatalog } from "@/hooks/useCatalog";
import { useSettings } from "@/hooks/useSettings";

export default function ReceptionDashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  // ─── Header Data ─────────────────────────────────────────────
  const { user, logout } = useAuth();
  const { settings, isLoading: isLoadingSettings } = useSettings();

  const initials = user?.user_name
    ? user.user_name
        .split(" ")
        .map((word) => word.charAt(0))
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "Rk";

  // ─── Hooks ──────────────────────────────────────────────────
  const { requests } = useRequests(); // fetches pending/in_progress
  const { rooms } = useRooms();
  const { menuItems, services, excursions } = useCatalog();

  // ─── Dynamic Badge Counts ─────────────────────────────────
  const pendingOrders = requests.filter((r) => r.status === "pending").length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const totalRooms = rooms.length;

  // Count items that are not available (emergency toggles)
  const unavailableItems = [
    ...menuItems.filter((i) => !i.is_available),
    ...services.filter((s) => !s.is_available),
    ...excursions.filter((e) => !e.is_available),
  ].length;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Top Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between gap-3 px-4 py-3.5">
          {/* Brand block */}
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Front Desk
            </span>
            {isLoadingSettings ? (
              <Skeleton className="mt-0.5 h-7 w-44" />
            ) : (
              <h1 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight leading-tight truncate">
                {settings.name || "Front Desk"}
              </h1>
            )}
          </div>

          {/* Staff */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-bold truncate max-w-[180px]">
                {user?.user_name}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {user?.role}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Account menu"
                  className="size-10 rounded-full bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                >
                  <span className="text-xs font-black">{initials}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-foreground">
                      {user?.user_name}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "rooms" && <RoomsTab />}
        {activeTab === "stock" && <StockTab />}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
          <div className="mx-auto flex max-w-md items-center justify-around rounded-2xl border border-border/80 bg-card/95 px-2 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md">
            {[
              {
                id: "orders" as const,
                label: "Orders",
                icon: ClipboardList,
                badge:
                  pendingOrders > 0 ? (
                    <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 items-center justify-center rounded-full border-none bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {pendingOrders}
                    </Badge>
                  ) : null,
              },
              {
                id: "rooms" as const,
                label: "Rooms",
                icon: BedDouble,
                badge:
                  totalRooms > 0 ? (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1.5 -right-1.5 h-5 min-w-5 items-center justify-center rounded-full border-border px-1 text-[10px] font-bold"
                    >
                      {occupiedRooms}/{totalRooms}
                    </Badge>
                  ) : null,
              },
              {
                id: "stock" as const,
                label: "Stock",
                icon: PackageOpen,
                badge:
                  unavailableItems > 0 ? (
                    <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 items-center justify-center rounded-full border-none bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {unavailableItems}
                    </Badge>
                  ) : null,
              },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1 transition-transform duration-150 active:scale-[0.94]"
                >
                  <div
                    className={`relative flex h-9 w-16 items-center justify-center rounded-2xl transition-all duration-300 ease-out ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon
                      className={`w-6 h-6 transition-all duration-300 ${
                        isActive ? "scale-105" : "scale-100"
                      }`}
                      strokeWidth={isActive ? 2.25 : 2}
                    />
                    {item.badge}
                  </div>
                  <span
                    className={`text-[10px] font-semibold leading-none transition-colors duration-300 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}