"use client";

import {
  useState,
  useCallback,
  useLayoutEffect,
  type ReactElement,
} from "react";

interface OrderItem {
  id: number;
  status: string;
}

interface AnimatedOrderListProps<T extends OrderItem> {
  orders: T[];
  filterStatus: string;
  renderCard: (order: T, handleStatusChange: (id: number, newStatus: string) => void) => ReactElement;
  onStatusChange: (id: number, newStatus: string) => void;
  emptyMessage?: string;
  emptyIcon?: ReactElement;
}

export function AnimatedOrderList<T extends OrderItem>({
  orders,
  filterStatus,
  renderCard,
  onStatusChange,
  emptyMessage = "No orders",
  emptyIcon,
}: AnimatedOrderListProps<T>) {
  const [leavingIds, setLeavingIds] = useState<Set<number>>(new Set());
  const [collapsingIds, setCollapsingIds] = useState<Set<number>>(new Set());
  const [heights, setHeights] = useState<Map<number, number>>(new Map());

  const filtered = orders.filter((o) => o.status === filterStatus);

  const handleStatusChange = useCallback(
    (id: number, newStatus: string) => {
      setLeavingIds((prev) => new Set(prev).add(id));

      setTimeout(() => {
        setLeavingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setCollapsingIds((prev) => new Set(prev).add(id));
      }, 280);

      setTimeout(() => {
        setCollapsingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setHeights((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
        onStatusChange(id, newStatus);
      }, 550);
    },
    [onStatusChange]
  );

  // Measure heights of cards that haven't been measured yet
  useLayoutEffect(() => {
    filtered.forEach((order) => {
      const el = document.querySelector<HTMLElement>(
        `[data-order-id="${order.id}"]`
      );
      if (el) {
        setHeights((prev) => {
          if (prev.has(order.id)) return prev;
          const next = new Map(prev);
          next.set(order.id, el.offsetHeight);
          return next;
        });
      }
    });
  }, [filtered]);

  // Display: items matching filter + items still animating out
  const filteredIds = new Set(filtered.map((o) => o.id));
  const activeIds = new Set([...filteredIds, ...leavingIds, ...collapsingIds]);
  const displayOrders = orders.filter((o) => activeIds.has(o.id));

  return (
    <div className="flex flex-col">
      {displayOrders.map((order) => {
        const isLeaving = leavingIds.has(order.id);
        const isCollapsing = collapsingIds.has(order.id);
        const h = heights.get(order.id);

        return (
          <div
            key={order.id}
            data-order-id={order.id}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsing ? "mb-0" : "mb-3"
            } ${
              !isLeaving && !isCollapsing ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""
            }`}
            style={{
              maxHeight: isCollapsing ? "0px" : h ? `${h}px` : undefined,
              opacity: isLeaving ? 0 : isCollapsing ? 0 : 1,
              transform: isLeaving
                ? "scale(0.95)"
                : isCollapsing
                  ? "scale(0.95)"
                  : "scale(1)",
              pointerEvents: isLeaving || isCollapsing ? "none" : "auto",
            }}
          >
            {renderCard(order, handleStatusChange)}
          </div>
        );
      })}

      {displayOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center gap-1.5 py-12 border border-dashed border-border rounded-xl bg-card/50 px-6">
          {emptyIcon}
          <p className="text-sm font-semibold text-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
