"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { getEcho } from "@/lib/echo";
import type { NotificationItem } from "@/lib/notificationConfig";

export function useNotifications() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const riadId = user?.riad_id;

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await fetchApi<NotificationItem[]>("/api/notifications");
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await fetchApi<{ count: number }>("/api/notifications/unread-count");
      setUnreadCount(data?.count ?? 0);
    } catch (err) {
      // Ignore
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!isAuthLoading && user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isAuthLoading, user, fetchNotifications, fetchUnreadCount]);

  // WebSocket listener
  useEffect(() => {
    if (isAuthLoading || !user || !riadId) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`riad.${riadId}.reception`);

    const onNotificationCreated = (data: any) => {
      const newNotif: NotificationItem = {
        id: data.id,
        type: data.type,
        title: data.title,
        description: data.description,
        is_read: data.is_read,
        data: data.data,
        created_at: data.created_at,
      };

      setNotifications((prev) => {
        if (prev.some((n) => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });

      setUnreadCount((prev) => prev + 1);
    };

    channel.listen(".notification.created", onNotificationCreated);

    return () => {
      channel.stopListening(".notification.created", onNotificationCreated);
    };
  }, [riadId, isAuthLoading, user]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await fetchApi(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      // Ignore
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetchApi("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      // Ignore
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
