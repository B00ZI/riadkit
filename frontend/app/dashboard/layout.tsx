"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, BedDouble, Utensils, Bell, LogOut } from "lucide-react";
import Cookies from "js-cookie"; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // 1. Simple Protected Route Logic
  useEffect(() => {
      const token = Cookies.get("riadkit_token");
    if (!token) {
      router.push("/login"); // Kick them out if not logged in
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("riadkit_token");
    router.push("/login");
  };



  // Navigation Links
  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Requests", href: "/dashboard/requests", icon: Bell },
    { name: "Rooms & QRs", href: "/dashboard/rooms", icon: BedDouble },
    { name: "Menu & Services", href: "/dashboard/menu", icon: Utensils },
    { name: "Riad Settings", href: "/dashboard/settings", icon: Settings },
  ];
  
if (isLoading) {
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Verifying session...</div>;
}
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className="text-xl font-bold text-primary">RiadKit</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-8">
          <h1 className="text-lg font-medium text-gray-800">
             Dashboard
          </h1>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>

    </div>
  );
}