import { toast as sonnerToast } from "sonner";
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Undo2,
  ClipboardList,
  DoorOpen,
  RefreshCw,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  description?: string;
  duration?: number;
  action?: ToastAction;
};

function baseToast(icon: ReactNode, title: string, opts?: ToastOptions) {
  return sonnerToast.custom(
    (t) => (
      <div className="relative p-3 pt-2.5 w-full max-w-sm animate-in fade-in slide-in-from-right-2 duration-300">
        <button
          onClick={() => sonnerToast.dismiss(t)}
          className="absolute top-1.5 right-2 p-0.5 rounded-full hover:bg-[#E9D8C5] transition-colors"
        >
          <X className="w-3.5 h-3.5 text-[#999999] hover:text-[#666666]" strokeWidth={2.5} />
        </button>
        <div className="flex items-start gap-3 pr-5">
          <div className="mt-0.5 shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2B2B2B] leading-tight">
              {title}
            </p>
            {opts?.description && (
              <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">
                {opts.description}
              </p>
            )}
          </div>
        </div>
        {opts?.action && (
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                opts.action!.onClick();
                sonnerToast.dismiss(t);
              }}
              className="text-xs font-semibold text-[#A63D40] hover:text-[#943236] px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#E9D8C5] transition-all whitespace-nowrap"
            >
              {opts.action.label}
            </button>
          </div>
        )}
      </div>
    ),
    {
      duration: opts?.duration ?? 5000,
    }
  );
}

export const toast = {
  success: (title: string, opts?: ToastOptions) =>
    baseToast(
      <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={2} />,
      title,
      opts
    ),

  error: (title: string, opts?: ToastOptions) =>
    baseToast(
      <XCircle className="w-5 h-5 text-red-500" strokeWidth={2} />,
      title,
      opts
    ),

  info: (title: string, opts?: ToastOptions) =>
    baseToast(
      <Bell className="w-5 h-5 text-[#A63D40]" strokeWidth={2} />,
      title,
      opts
    ),

  warning: (title: string, opts?: ToastOptions) =>
    baseToast(
      <AlertTriangle className="w-5 h-5 text-amber-500" strokeWidth={2} />,
      title,
      opts
    ),

  undo: (
    title: string,
    opts: Omit<ToastOptions, "action"> & { onUndo: () => void }
  ) =>
    baseToast(
      <Undo2 className="w-5 h-5 text-[#A63D40]" strokeWidth={2} />,
      title,
      { ...opts, action: { label: "Undo", onClick: opts.onUndo } }
    ),

  orderNew: (room: string, item: string, opts?: ToastOptions) =>
    baseToast(
      <ClipboardList className="w-5 h-5 text-[#A63D40]" strokeWidth={2} />,
      `New Order — ${room}`,
      { ...opts, description: item }
    ),

  statusChanged: (
    room: string,
    item: string,
    status: string,
    opts?: ToastOptions
  ) =>
    baseToast(
      <RefreshCw className="w-5 h-5 text-[#A63D40]" strokeWidth={2} />,
      `${room} — ${item}`,
      { ...opts, description: `Status updated to ${status}` }
    ),

  checkedIn: (room: string, opts?: ToastOptions) =>
    baseToast(
      <DoorOpen className="w-5 h-5 text-emerald-500" strokeWidth={2} />,
      room,
      { ...opts, description: "Guest checked in" }
    ),

  checkedOut: (room: string, opts?: ToastOptions) =>
    baseToast(
      <DoorOpen className="w-5 h-5 text-[#A63D40]" strokeWidth={2} />,
      room,
      { ...opts, description: "Guest checked out" }
    ),
};
