"use client";

import { useState } from "react";
import { ClipboardList, BedDouble, PackageOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrdersTab } from "./orders-tab";  
import { RoomsTab } from "./rooms-tab"; 
import { StockTab } from "./stock-tab";

export default function ReceptionDashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Top Header */}
      <header className="px-4 py-4 border-b border-border bg-card">
        <h1 className="text-xl font-bold tracking-tight">Front Desk</h1>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === "orders" && (
          <OrdersTab />
        )}
        {activeTab === "rooms" && (
          <RoomsTab />
        )}
        {activeTab === "stock" && (
           <StockTab />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 z-50">
        
        {/* Tab 1: Orders */}
        <button
          onClick={() => setActiveTab("orders")}
          className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === "orders" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <ClipboardList className="w-6 h-6" />
            {/* Badge for Pending Orders */}
            <Badge className="absolute -top-2 -right-3 h-5 min-w-5 flex items-center justify-center px-1 text-[10px] rounded-full bg-destructive text-destructive-foreground border-none">
              2
            </Badge>
          </div>
          <span className="text-[10px] font-medium">Orders</span>
        </button>

        {/* Tab 2: Rooms */}
        <button
          onClick={() => setActiveTab("rooms")}
          className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === "rooms" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <BedDouble className="w-6 h-6" />
            {/* Badge for Occupancy Ratio */}
            <Badge variant="secondary" className="absolute -top-2 -right-4 h-5 px-1 text-[10px] rounded-full border-border">
              2/4
            </Badge>
          </div>
          <span className="text-[10px] font-medium">Rooms</span>
        </button>

        {/* Tab 3: Stock */}
        <button
          onClick={() => setActiveTab("stock")}
          className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === "stock" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <PackageOpen className="w-6 h-6" />
            {/* Badge for Emergency Out-of-Stock items */}
            <Badge className="absolute -top-2 -right-3 h-5 min-w-5 flex items-center justify-center px-1 text-[10px] rounded-full bg-destructive text-destructive-foreground border-none">
              3
            </Badge>
          </div>
          <span className="text-[10px] font-medium">Stock</span>
        </button>

      </nav>
    </div>
  );
}