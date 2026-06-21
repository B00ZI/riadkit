// app/room/[token]/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGuestPortal } from "@/hooks/useGuestPortal";
import { useGuestRequest } from "@/hooks/useGuestRequest";
import {
  Home as HomeIcon,
  Utensils,
  Compass,
  Sparkles,
  Wifi,
  MessageCircle,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

// ─── HELPER COMPONENTS ───────────────────────────────────────

const EmptyState = ({ message, icon: Icon }: { message: string; icon: any }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in duration-500">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
      <Icon className="w-8 h-8 text-muted-foreground/40" />
    </div>
    <div className="space-y-1 px-8">
      <p className="font-black text-sm uppercase tracking-tight opacity-40 italic">Empty...</p>
      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{message}</p>
    </div>
  </div>
);

// ─── MAIN PORTAL PAGE ────────────────────────────────────────

export default function GuestPortalPage() {
  const { token } = useParams();
  const qrToken = token as string;

  // Hooks
  const { data, isLoading, isExpired } = useGuestPortal(qrToken);
  const { sendRequest, isSubmitting } = useGuestRequest(qrToken);

  // UI State
  const [activeTab, setActiveTab] = useState("home");
  const [requestItem, setRequestItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [menuFilter, setMenuFilter] = useState("All");

  // ✅ Backend returns 'menu' (categories) with 'menu_items'
  const menuCategories = data?.menu ?? [];
  const excursions = data?.excursions ?? [];
  const services = data?.services ?? [];
  const riad = data?.riad ?? {
    name: "Riad",
    description: "",
    wifiName: "",
    wifiPassword: "",
    whatsappNumber: "",
  };

  // Filter Logic
  const filteredMenuCategories = useMemo(() => {
    if (menuFilter === "All") return menuCategories;
    return menuCategories.filter((cat: any) => cat.name === menuFilter);
  }, [menuCategories, menuFilter]);

  // ─── HANDLERS ──────────────────────────────────────────────

  const handleConfirmRequest = async () => {
    if (isExpired || !requestItem) return;

    const isOrder = requestItem.price && parseFloat(requestItem.price) < 100;

    const result = await sendRequest({
      type: requestItem.requestType,
      item_id: requestItem.id,
      quantity: isOrder ? quantity : 1,
    });

    if (result.success) {
      setShowSuccess(true);
      setRequestItem(null);
    } else {
      alert(result.error);
    }
  };

  const openWhatsApp = () => {
    const number = riad.whatsappNumber?.replace(/[^0-9]/g, "");
    if (number) {
      window.open(`https://wa.me/${number}`, "_blank");
    }
  };

  const copyWifiPassword = () => {
    if (riad.wifiPassword) {
      navigator.clipboard.writeText(riad.wifiPassword);
    }
  };

  // ─── LOADING ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Bootstrapping Portal...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={XCircle}
        message="Riad not found. Please scan the QR code in your room again."
      />
    );
  }

  // ─── RENDER ────────────────────────────────────────────────

  return (
    <div className="relative flex flex-col w-full h-dvh max-w-md mx-auto bg-background text-foreground overflow-hidden sm:border-x sm:border-border/50 shadow-2xl">
      {/* HEADER */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start shrink-0 w-full bg-background z-10">
        <div className="space-y-1">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 text-primary-foreground font-black text-xl italic">
            R
          </div>
          <h1 className="font-black text-[10px] uppercase tracking-widest opacity-50">
            {riad.name}
          </h1>
        </div>
        {isExpired ? (
          <Badge
            variant="destructive"
            className="font-black text-[10px] uppercase tracking-tighter bg-destructive/10 text-destructive border-none px-3 py-1"
          >
            Expired
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="font-black text-[10px] uppercase tracking-tighter bg-emerald-500/10 text-emerald-500 border-none px-3 py-1"
          >
            Room {data.room_number ?? "?"} • Live
          </Badge>
        )}
      </header>

      {/* CONTENT */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden pb-32 no-scrollbar">
        {/* HOME VIEW */}
        {activeTab === "home" && (
          <div className="w-full pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-6 space-y-8 py-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                Ahlan.
              </h2>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                {riad.description}
              </p>
            </div>

            <Card className="w-full p-5 bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 opacity-80">
                  <Wifi className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Guest WiFi
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="min-w-0">
                    <p className="text-lg font-black leading-none mb-1 truncate">
                      {riad.wifiName || "Riad WiFi"}
                    </p>
                    <p className="text-xs font-bold opacity-80 truncate">
                      {riad.wifiPassword || "Contact Reception"}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="font-bold text-[10px] uppercase h-8 px-4 text-foreground shrink-0"
                    onClick={copyWifiPassword}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <Wifi className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
            </Card>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Practicalities
              </h3>
              <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
                <div className="flex justify-between p-4 items-center">
                  <span className="text-sm font-semibold italic">WhatsApp</span>
                  <span className="text-sm font-black text-primary">
                    {riad.whatsappNumber}
                  </span>
                </div>
                <div className="flex justify-between p-4 items-center">
                  <span className="text-sm font-semibold italic">Breakfast</span>
                  <span className="text-sm font-black text-primary">
                    08:30 — 10:30
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MENU VIEW */}
        {activeTab === "menu" && (
          <div className="w-full pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 mb-6">
              <h2 className="text-2xl font-black tracking-tight">Food & Drink</h2>
            </div>

            {menuCategories.length === 0 ? (
              <EmptyState
                icon={Utensils}
                message="The kitchen is currently resting. Please check back later."
              />
            ) : (
              <>
                <div className="w-full overflow-x-auto mb-4 no-scrollbar px-6">
                  <div className="flex gap-2 w-max pb-1">
                    <Badge
                      onClick={() => setMenuFilter("All")}
                      variant={menuFilter === "All" ? "default" : "secondary"}
                      className="px-4 py-1.5 font-bold uppercase text-[10px] rounded-md cursor-pointer"
                    >
                      All
                    </Badge>
                    {menuCategories.map((cat: any) => (
                      <Badge
                        key={cat.id}
                        onClick={() => setMenuFilter(cat.name)}
                        variant={
                          menuFilter === cat.name ? "default" : "secondary"
                        }
                        className="px-4 py-1.5 font-bold uppercase text-[10px] rounded-md cursor-pointer"
                      >
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="px-6 space-y-3">
                  {filteredMenuCategories.map((cat: any) => {
                    // ✅ Use 'menu_items' (as returned by the backend)
                    const items = cat.menu_items ?? [];
                    if (items.length === 0) {
                      // Optionally render a placeholder for empty category
                      return (
                        <div
                          key={cat.id}
                          className="text-center text-muted-foreground text-sm py-2"
                        >
                          No items in {cat.name}
                        </div>
                      );
                    }
                    return items.map((item: any) => (
                      <Card
                        key={item.id}
                        className="p-3 bg-card border-border flex items-center gap-4 w-full overflow-hidden shadow-sm"
                      >
                        <div className="w-16 h-16 bg-muted/50 rounded-xl shrink-0 flex items-center justify-center text-3xl shadow-inner uppercase font-black">
                          {item.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[13px] leading-tight truncate uppercase">
                            {item.name}
                          </p>
                          <p className="text-xs font-black text-primary mb-1">
                            {item.price} MAD
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setRequestItem({ ...item, requestType: "menu" });
                            setQuantity(1);
                          }}
                          variant={
                            parseFloat(item.price) < 100 ? "default" : "outline"
                          }
                          className="shrink-0 font-black text-[9px] uppercase h-8 px-4"
                        >
                          {parseFloat(item.price) < 100 ? "Order" : "Request"}
                        </Button>
                      </Card>
                    ));
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* EXPLORE VIEW */}
        {activeTab === "explore" && (
          <div className="w-full pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 mb-6">
              <h2 className="text-2xl font-black tracking-tight italic">
                Experiences
              </h2>
            </div>
            {excursions.length === 0 ? (
              <EmptyState
                icon={Compass}
                message="New adventures are being prepared. Ask reception for tips!"
              />
            ) : (
              <div className="px-6 space-y-4">
                {excursions.map((item: any) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-border bg-card w-full shadow-md"
                  >
                    <div className="aspect-video bg-muted/50 flex items-center justify-center text-5xl">
                      �️
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <p className="font-black text-[15px] uppercase tracking-tight">
                          {item.name}
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-2 italic">
                          <Clock className="w-3 h-3" /> {item.duration} •{" "}
                          {item.price} MAD
                        </p>
                      </div>
                      <Button
                        onClick={() =>
                          setRequestItem({ ...item, requestType: "excursion" })
                        }
                        variant="outline"
                        className="w-full h-11 font-black uppercase text-[10px] border-border tracking-widest"
                      >
                        I'm Interested
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SERVICES VIEW */}
        {activeTab === "services" && (
          <div className="w-full pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 mb-6">
              <h2 className="text-2xl font-black tracking-tight">Services</h2>
            </div>
            {services.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                message="Our team is here to help. Contact reception for service requests."
              />
            ) : (
              <div className="px-6 space-y-3">
                {services.map((item: any) => (
                  <Card
                    key={item.id}
                    className="p-4 bg-card border-border flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm uppercase">{item.name}</p>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">
                          {item.price > 0 ? `${item.price} MAD` : "Complimentary"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        setRequestItem({ ...item, requestType: "service" })
                      }
                      variant={item.requires_quantity ? "default" : "outline"}
                      className="shrink-0 font-black text-[9px] uppercase h-8 px-4"
                    >
                      {item.requires_quantity ? "Order" : "Request"}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* NAVIGATION */}
      <nav className="absolute bottom-0 w-full h-21 bg-card/90 backdrop-blur-xl border-t border-border flex items-center justify-around px-6 z-50">
        {[
          { id: "home", icon: HomeIcon, label: "Home" },
          { id: "menu", icon: Utensils, label: "Menu" },
          { id: "explore", icon: Compass, label: "Explore" },
          { id: "services", icon: Sparkles, label: "Services" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all w-16 ${activeTab === tab.id
                ? "text-primary scale-110"
                : "text-muted-foreground opacity-60"
              }`}
          >
            <tab.icon
              className={`w-5 h-5 ${activeTab === tab.id ? "stroke-[2.5px]" : ""
                }`}
            />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* REQUEST DRAWER */}
      <Drawer
        open={!!requestItem}
        onOpenChange={(open) => !open && setRequestItem(null)}
      >
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle className="font-black uppercase tracking-tight text-center">
              {requestItem?.name}
            </DrawerTitle>
            <DrawerDescription className="text-center font-medium text-xs">
              {requestItem?.requires_quantity ||
                (requestItem?.price && parseFloat(requestItem.price) < 100)
                ? "Select quantity."
                : "We will coordinate with you shortly."}
            </DrawerDescription>
          </DrawerHeader>

          {(requestItem?.requires_quantity ||
            (requestItem?.price && parseFloat(requestItem.price) < 100)) && (
              <div className="flex items-center justify-center gap-8 py-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full h-12 w-12 border-border"
                >
                  <Minus />
                </Button>
                <span className="text-4xl font-black w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full h-12 w-12 border-border"
                >
                  <Plus />
                </Button>
              </div>
            )}

          <DrawerFooter className="pt-4 pb-8 px-6">
            {isExpired ? (
              <div className="p-4 bg-destructive/10 text-destructive text-center rounded-xl border border-destructive/20">
                <p className="text-xs font-black uppercase tracking-tight flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" /> Session Expired
                </p>
              </div>
            ) : (
              <Button
                onClick={handleConfirmRequest}
                disabled={isSubmitting}
                className="h-14 font-black uppercase tracking-widest text-xs"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  `Confirm Request`
                )}
              </Button>
            )}
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="font-bold uppercase text-[10px] text-muted-foreground"
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* SUCCESS DRAWER */}
      <Drawer open={showSuccess} onOpenChange={setShowSuccess}>
        <DrawerContent className="max-w-md mx-auto pb-8">
          <div className="p-8 flex flex-col items-center text-center space-y-5">
            {/* ✅ Icon */}
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            {/* ✅ Intent: DrawerHeader with Title & Description */}
            <DrawerHeader className="space-y-2 p-0">
              <DrawerTitle className="text-xl font-black uppercase tracking-tight italic">
                Request Sent!
              </DrawerTitle>
              <DrawerDescription className="text-xs font-bold text-muted-foreground">
                We have received your request and will update you shortly.
              </DrawerDescription>
            </DrawerHeader>

            {/* ✅ Actions */}
            <Button
              variant="outline"
              className="w-full h-12 border-border font-bold text-[10px] uppercase flex items-center gap-2"
              onClick={openWhatsApp}
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp
            </Button>
            <Button
              onClick={() => setShowSuccess(false)}
              variant="ghost"
              className="font-bold text-[10px] uppercase text-muted-foreground"
            >
              Close
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}