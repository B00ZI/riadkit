"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationDrawer } from "@/hooks/useNotificationDrawer";
import { NotificationDrawer } from "./NotificationDrawer";

export function NotificationBell() {
  const { open, openDrawer, closeDrawer } = useNotificationDrawer();
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <>
      <button
        onClick={openDrawer}
        className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-primary text-[9px] font-black text-primary-foreground flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      <NotificationDrawer
        open={open}
        onClose={closeDrawer}
        notifications={notifications}
        isLoading={isLoading}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </>
  );
}
