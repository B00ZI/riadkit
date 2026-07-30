"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface DrawerContext {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const DrawerCtx = createContext<DrawerContext>({
  open: false,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function NotificationDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  return (
    <DrawerCtx.Provider value={{ open, openDrawer, closeDrawer }}>
      {children}
    </DrawerCtx.Provider>
  );
}

export function useNotificationDrawer() {
  return useContext(DrawerCtx);
}
