"use client";

import { useRouter } from "next/navigation";
import type { NotificationItem as NotificationItemType } from "@/lib/notificationConfig";
import { getNotificationIcon, getNotificationUrl, getRelativeTime } from "@/lib/notificationConfig";

interface NotificationItemProps {
  notification: NotificationItemType;
  onMarkAsRead: (id: number) => void;
  onClose?: () => void;
}

export function NotificationItem({ notification, onMarkAsRead, onClose }: NotificationItemProps) {
  const router = useRouter();
  const Icon = getNotificationIcon(notification.type);

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    onClose?.();
    router.push(getNotificationUrl(notification));
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/20 ${
        !notification.is_read ? "bg-primary/[0.02]" : ""
      }`}
    >
      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
        !notification.is_read ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
      }`}>
        <Icon className="w-3.5 h-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className={`text-xs truncate ${
              !notification.is_read ? "font-black text-foreground" : "font-bold text-muted-foreground"
            }`}>
              {notification.title}
            </p>
            {!notification.is_read && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            )}
          </div>
          <span className="text-[10px] font-medium text-muted-foreground shrink-0">
            {getRelativeTime(notification.created_at)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2 whitespace-pre-line">
          {notification.description}
        </p>
      </div>
    </button>
  );
}
