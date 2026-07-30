"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Loader2, XCircle } from "lucide-react";

interface RequestDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  quantity: number;
  setQuantity: (q: number) => void;
  isExpired: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
  currency?: string;
}

export const RequestDrawer = ({
  isOpen,
  onOpenChange,
  item,
  quantity,
  setQuantity,
  isExpired,
  isSubmitting,
  onConfirm,
  currency = "MAD",
}: RequestDrawerProps) => {
  if (!item) return null;

  const requiresQty =
    item.requires_quantity || (item.price && parseFloat(item.price) < 100);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="pt-6">
          <DrawerTitle className="font-black uppercase tracking-tight text-center text-lg">
            {item.name}
          </DrawerTitle>
          <DrawerDescription className="text-center font-medium text-xs text-muted-foreground">
            {item.price > 0 ? (
              <span className="text-primary font-black">{item.price} {currency}</span>
            ) : (
              "Complimentary Guest Service"
            )}
          </DrawerDescription>
        </DrawerHeader>

        {requiresQty && (
          <div className="flex flex-col items-center gap-2 py-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Select Quantity
            </span>
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-full h-10 w-10 border-border"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-2xl font-black w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-full h-10 w-10 border-border"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <DrawerFooter className="pt-2 pb-8 px-6 space-y-2">
          {isExpired ? (
            <div className="p-3 bg-destructive/10 text-destructive text-center rounded-xl border border-destructive/20">
              <p className="text-xs font-black uppercase tracking-tight flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Session Expired
              </p>
            </div>
          ) : (
            <Button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="h-12 font-black uppercase tracking-widest text-xs w-full shadow-md rounded-xl"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
              ) : (
                "Send Request to Concierge"
              )}
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="ghost" className="font-bold uppercase text-[10px] text-muted-foreground w-full h-9">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
