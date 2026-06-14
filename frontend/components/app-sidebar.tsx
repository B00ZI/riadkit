"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Bell,
  History,
  Globe,
  DoorOpen,
  Settings,
  Users,
  ChevronRight,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Front Desk", url: "/dashboard/front-desk", icon: Bell },
  { title: "Order History", url: "/dashboard/history", icon: History },
  { title: "Guest Portal", url: "/dashboard/portal", icon: Globe },
  { title: "Rooms & QR", url: "/dashboard/rooms", icon: DoorOpen },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Staff", url: "/dashboard/staff", icon: Users },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border" {...props}>
      <SidebarHeader className="py-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-black text-lg">R</span>
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-foreground">RiadKit</span>
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Owner Pro</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2 gap-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={pathname === item.url}
                className="h-10 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                <Link href={item.url}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}