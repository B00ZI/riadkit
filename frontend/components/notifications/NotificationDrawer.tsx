"use client";

import { useEffect, useRef } from "react";
import { X, CheckCheck, RefreshCw, Bell } from "lucide-react";
import type { NotificationItem as NotificationItemType } from "@/lib/notificationConfig";
import { groupNotifications, TIME_GROUP_LABELS } from "@/lib/notificationConfig";
import { NotificationItem } from "./NotificationItem";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItemType[];
  isLoading: boolean;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationDrawer({
  open,
  onClose,
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const groups = groupNotifications(notifications);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-card border-l border-border z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-bold">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline px-2 py-1 rounded hover:bg-primary/5"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Bell className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-bold text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Notifications will appear here when something happens.
              </p>
            </div>
          ) : (
            <div>
              {groups.map(([group, items]) => (
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
                        onClose={onClose}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
