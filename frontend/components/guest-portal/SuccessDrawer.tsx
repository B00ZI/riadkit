"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";

interface SuccessDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  whatsappNumber?: string;
  onWhatsAppClick: () => void;
}

export const SuccessDrawer = ({
  isOpen,
  onOpenChange,
  whatsappNumber,
  onWhatsAppClick,
}: SuccessDrawerProps) => (
  <Drawer open={isOpen} onOpenChange={onOpenChange}>
    <DrawerContent className="max-w-md mx-auto pb-8">
      <div className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <DrawerHeader className="space-y-1 p-0">
          <DrawerTitle className="text-lg font-black uppercase tracking-tight">
            Request Sent!
          </DrawerTitle>
          <DrawerDescription className="text-xs font-medium text-muted-foreground max-w-xs">
            Our front desk team has received your request and is processing it now.
          </DrawerDescription>
        </DrawerHeader>

        <div className="w-full space-y-2 pt-2">
          {whatsappNumber && (
            <Button
              variant="outline"
              className="w-full h-11 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl"
              onClick={onWhatsAppClick}
            >
              <MessageCircle className="w-4 h-4 fill-emerald-500/20" /> Chat via WhatsApp
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full h-10 font-bold text-[10px] uppercase text-muted-foreground">
              Done
            </Button>
          </DrawerClose>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
);
