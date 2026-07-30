'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { getEcho } from '@/lib/echo';

export type OrderStatus = {
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
};

export type MonthlyRevenue = {
  month: string;
  menu: number;
  services: number;
  excursions: number;
  total: number;
};

export type DailyRevenue = {
  dateLabel: string;
  rawDate: string;
  total: number;
  orders: number;
  menu: number;
  services: number;
  excursions: number;
};

export type UnavailableItem = {
  id: number;
  name: string;
  type: 'menu' | 'service' | 'excursion';
};

export type RecentNotification = {
  id: number;
  type: string;
  title: string;
  description: string;
  is_read: boolean;
  data: Record<string, any> | null;
  created_at: string;
};

export type DashboardData = {
  todayRevenue: number;
  yesterdayRevenue: number;
  growth: number;
  activeRooms: number;
  totalRooms: number;
  occupancy: number;
  orderStatus: OrderStatus;
  monthlyRevenue: MonthlyRevenue[];
  dailyRevenue: DailyRevenue[];
  unavailableItems: UnavailableItem[];
  recentNotifications: RecentNotification[];
};

function getTodayRaw(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getTodayLabel(): string {
  const d = new Date();
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getCurrentMonth(): string {
  const d = new Date();
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function findOrCreateDaily(daily: DailyRevenue[], rawDate: string, label: string): [DailyRevenue[], number] {
  const idx = daily.findIndex((d) => d.rawDate === rawDate);
  if (idx >= 0) return [daily, idx];
  const entry: DailyRevenue = { dateLabel: label, rawDate, total: 0, orders: 0, menu: 0, services: 0, excursions: 0 };
  return [[...daily, entry], daily.length];
}

function findOrCreateMonthly(monthly: MonthlyRevenue[], month: string): [MonthlyRevenue[], number] {
  const idx = monthly.findIndex((m) => m.month === month);
  if (idx >= 0) return [monthly, idx];
  const entry: MonthlyRevenue = { month, menu: 0, services: 0, excursions: 0, total: 0 };
  return [[...monthly, entry], monthly.length];
}

export function useDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestocking, setIsRestocking] = useState<string | null>(null);
  const riadId = user?.riad_id;

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi<DashboardData>('/api/dashboard');
      setData(res);
    } catch (error: any) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && user) {
      fetchDashboard();
    }
  }, [fetchDashboard, isAuthLoading, user]);

  // ─── WebSocket real-time updates ────────────────────────────
  useEffect(() => {
    if (isAuthLoading || !user || !riadId) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`riad.${riadId}.reception`);

    channel.listen('.request.created', (e: any) => {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          orderStatus: { ...prev.orderStatus, pending: prev.orderStatus.pending + 1 },
        };
      });
    });

    channel.listen('.request.updated', (e: any) => {
      const newStatus = e.status as string;
      const oldStatus = e.old_status as string | null;
      const totalPrice = parseFloat(e.total_price ?? '0');
      const itemType = e.type as string;

      setData((prev) => {
        if (!prev) return prev;

        const os = { ...prev.orderStatus };

        if (oldStatus && oldStatus !== newStatus) {
          if (os[oldStatus as keyof OrderStatus] > 0) os[oldStatus as keyof OrderStatus]--;
          os[newStatus as keyof OrderStatus]++;
        }

        let updated = { ...prev, orderStatus: os };

        if (newStatus === 'completed' && totalPrice > 0) {
          updated.todayRevenue += totalPrice;
          updated.growth = updated.yesterdayRevenue > 0
            ? ((updated.todayRevenue - updated.yesterdayRevenue) / updated.yesterdayRevenue) * 100
            : updated.todayRevenue > 0 ? 100 : 0;

          const todayRaw = getTodayRaw();
          const todayLabel = getTodayLabel();
          let daily = [...updated.dailyRevenue];
          let [dailyArr, dailyIdx] = findOrCreateDaily(daily, todayRaw, todayLabel);
          if (dailyIdx === daily.length) daily = dailyArr;
          daily = [...daily];
          daily[dailyIdx] = {
            ...daily[dailyIdx],
            total: daily[dailyIdx].total + totalPrice,
            orders: daily[dailyIdx].orders + 1,
            menu: daily[dailyIdx].menu + (itemType === 'menu' ? totalPrice : 0),
            services: daily[dailyIdx].services + (itemType === 'service' ? totalPrice : 0),
            excursions: daily[dailyIdx].excursions + (itemType === 'excursion' ? totalPrice : 0),
          };
          updated.dailyRevenue = daily;

          const currentMonth = getCurrentMonth();
          let monthly = [...updated.monthlyRevenue];
          let [mArr, mIdx] = findOrCreateMonthly(monthly, currentMonth);
          if (mIdx === monthly.length) monthly = mArr;
          monthly = [...monthly];
          monthly[mIdx] = {
            ...monthly[mIdx],
            total: monthly[mIdx].total + totalPrice,
            menu: monthly[mIdx].menu + (itemType === 'menu' ? totalPrice : 0),
            services: monthly[mIdx].services + (itemType === 'service' ? totalPrice : 0),
            excursions: monthly[mIdx].excursions + (itemType === 'excursion' ? totalPrice : 0),
          };
          updated.monthlyRevenue = monthly;
        }

        return updated;
      });
    });

    channel.listen('.room.status.updated', (e: any) => {
      const sessionStatus = e.session_status as string;
      setData((prev) => {
        if (!prev) return prev;
        let activeRooms = prev.activeRooms;
        if (sessionStatus === 'active') {
          activeRooms = Math.min(prev.totalRooms, activeRooms + 1);
        } else {
          activeRooms = Math.max(0, activeRooms - 1);
        }
        const occupancy = prev.totalRooms > 0 ? Math.round((activeRooms / prev.totalRooms) * 100) : 0;
        return { ...prev, activeRooms, occupancy };
      });
    });

    channel.listen('.item.availability.changed', (e: any) => {
      const item: UnavailableItem = { id: e.item_id, name: e.item_name, type: e.item_type };
      setData((prev) => {
        if (!prev) return prev;
        if (!e.is_available) {
          if (prev.unavailableItems.some((i) => i.id === item.id && i.type === item.type)) return prev;
          return { ...prev, unavailableItems: [...prev.unavailableItems, item] };
        }
        return {
          ...prev,
          unavailableItems: prev.unavailableItems.filter((i) => !(i.id === item.id && i.type === item.type)),
        };
      });
    });

    return () => {
      channel.stopListening('.request.created');
      channel.stopListening('.request.updated');
      channel.stopListening('.room.status.updated');
      channel.stopListening('.item.availability.changed');
    };
  }, [riadId, isAuthLoading, user]);

  const restockItem = useCallback(async (item: UnavailableItem) => {
    const key = `${item.type}-${item.id}`;
    setIsRestocking(key);
    try {
      await fetchApi(`/api/${item.type === 'menu' ? 'menu-items' : item.type === 'service' ? 'services' : 'excursions'}/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_available: true }),
      });
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          unavailableItems: prev.unavailableItems.filter(
            (i) => !(i.id === item.id && i.type === item.type)
          ),
        };
      });
    } catch (e) {
      // Ignore
    } finally {
      setIsRestocking(null);
    }
  }, []);

  return {
    data,
    isLoading,
    isRestocking,
    restockItem,
    refresh: fetchDashboard,
  };
}
