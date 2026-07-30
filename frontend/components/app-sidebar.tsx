"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Bell,
  History,
  Globe,
  Edit,
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
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Front Desk", url: "/dashboard/front-desk", icon: Bell },
  { title: "Order History", url: "/dashboard/history", icon: History },
  { title: "Manage Riad", url: "/dashboard/portal", icon: Edit },
  { title: "Rooms & QR", url: "/dashboard/rooms", icon: DoorOpen },
  { title: "Staff", url: "/dashboard/staff", icon: Users },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border" {...props}>
      <SidebarHeader className="py-4">
        <div className="flex items-center gap-3 px-2">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
            <Image src="/riadkitlogo.png" alt="RiadKit" fill className="object-cover" />
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-heading font-semibold text-foreground text-lg tracking-tight">RiadKit</span>
            {user && (
              <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[120px]">
                {user.user_name}
              </span>
            )}
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
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Account"
              isActive={pathname === "/dashboard/account"}
              className="h-10 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
            >
              <Link href="/dashboard/account">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              className="text-muted-foreground hover:text-destructive transition-colors h-10"
            >
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