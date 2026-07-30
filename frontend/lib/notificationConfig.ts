import {
  Bell, ClipboardList, ShoppingBag, Utensils, Bed, DoorOpen,
  Hotel, Mountain, CircleCheck, Clock3, AlertCircle,
  UserRound, CreditCard, Settings, Trash2, Pencil, Sparkles,
  Ban, PackageX, PackageCheck, BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NotificationItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  is_read: boolean;
  data: Record<string, any> | null;
  created_at: string;
};

const iconMap: Record<string, LucideIcon> = {
  new_order: ClipboardList,
  new_menu_order: Utensils,
  new_service_order: Sparkles,
  new_excursion_order: Mountain,
  order_in_progress: Clock3,
  order_completed: CircleCheck,
  order_cancelled: Ban,
  room_created: Bed,
  room_updated: Pencil,
  room_deleted: Trash2,
  guest_checked_in: DoorOpen,
  guest_checked_out: DoorOpen,
  service_created: Sparkles,
  service_updated: Pencil,
  service_deleted: Trash2,
  service_out_of_stock: PackageX,
  service_restocked: PackageCheck,
  menu_item_created: Utensils,
  menu_item_updated: Pencil,
  menu_item_deleted: Trash2,
  menu_item_out_of_stock: PackageX,
  menu_item_restocked: PackageCheck,
  excursion_created: Mountain,
  excursion_updated: Pencil,
  excursion_deleted: Trash2,
  excursion_out_of_stock: PackageX,
  excursion_restocked: PackageCheck,
  house_rule_created: BookOpen,
  house_rule_updated: Pencil,
  house_rule_deleted: Trash2,
  staff_created: UserRound,
  staff_updated: Pencil,
  staff_deleted: Trash2,
  settings_updated: Settings,
};

export function getNotificationIcon(type: string): LucideIcon {
  return iconMap[type] ?? Bell;
}

export function getNotificationUrl(notif: NotificationItem): string {
  const type = notif.type;

  if (type.startsWith("order_")) {
    return type === "order_completed" ? "/dashboard/history" : "/dashboard/front-desk";
  }
  if (type.startsWith("new_")) {
    return "/dashboard/front-desk";
  }
  if (type.startsWith("room_") || type.startsWith("guest_")) {
    return "/dashboard/rooms";
  }
  if (type.startsWith("service_") || type.startsWith("menu_item_") || type.startsWith("excursion_")) {
    return "/dashboard/portal";
  }
  if (type.startsWith("house_rule_")) {
    return "/dashboard/portal";
  }
  if (type.startsWith("staff_")) {
    return "/dashboard/staff";
  }
  if (type === "settings_updated") {
    return "/dashboard/settings";
  }
  return "/dashboard";
}

export function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type TimeGroup = "today" | "yesterday" | "this_week" | "earlier";

export function getTimeGroup(dateStr: string): TimeGroup {
  const now = new Date();
  const date = new Date(dateStr);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - now.getDay());

  if (date >= todayStart) return "today";
  if (date >= yesterdayStart) return "yesterday";
  if (date >= weekStart) return "this_week";
  return "earlier";
}

export const TIME_GROUP_LABELS: Record<TimeGroup, string> = {
  today: "Today",
  yesterday: "Yesterday",
  this_week: "This Week",
  earlier: "Earlier",
};

export function groupNotifications(notifications: NotificationItem[]): [TimeGroup, NotificationItem[]][] {
  const groups: Map<TimeGroup, NotificationItem[]> = new Map();
  for (const n of notifications) {
    const group = getTimeGroup(n.created_at);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(n);
  }
  const order: TimeGroup[] = ["today", "yesterday", "this_week", "earlier"];
  return order
    .filter((g) => (groups.get(g)?.length ?? 0) > 0)
    .map((g) => [g, groups.get(g)!]);
}
