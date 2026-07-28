"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  message: string;
  icon: LucideIcon;
  title?: string;
}

export const EmptyState = ({
  message,
  icon: Icon,
  title = "Nothing Here Yet",
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 animate-in fade-in duration-500">
    <div className="w-14 h-14 bg-muted/60 rounded-2xl flex items-center justify-center border border-border/50">
      <Icon className="w-7 h-7 text-muted-foreground/60" />
    </div>
    <div className="space-y-1 px-8 max-w-xs">
      <p className="font-black text-xs uppercase tracking-wider text-foreground">{title}</p>
      <p className="text-xs font-medium text-muted-foreground leading-relaxed">{message}</p>
    </div>
  </div>
);
