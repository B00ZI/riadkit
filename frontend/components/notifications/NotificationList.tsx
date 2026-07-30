"use client";

import type { NotificationItem as NotificationItemType } from "@/lib/notificationConfig";
import { groupNotifications, TIME_GROUP_LABELS } from "@/lib/notificationConfig";
import { NotificationItem } from "./NotificationItem";
import { Bell, RefreshCw } from "lucide-react";

interface NotificationListProps {
  notifications: NotificationItemType[];
  isLoading: boolean;
  onMarkAsRead: (id: number) => void;
  compact?: boolean;
}

export function NotificationList({
  notifications,
  isLoading,
  onMarkAsRead,
  compact,
}: NotificationListProps) {
  const groups = groupNotifications(notifications);
  const displayNotifs = compact ? notifications.slice(0, 7) : notifications;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
        <p className="text-xs font-bold text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/60">
      {compact ? (
        displayNotifs.map((notif) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onMarkAsRead={onMarkAsRead}
          />
        ))
      ) : (
        groups.map(([group, items]) => (
          <div key={group}>
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm px-5 py-2 border-b border-border/40">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {TIME_GROUP_LABELS[group]}
              </span>
            </div>
            <div className="divide-y divide-border/40">
              {items.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
