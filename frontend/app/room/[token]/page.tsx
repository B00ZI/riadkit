"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGuestPortal } from "@/hooks/useGuestPortal";
import { useGuestRequest } from "@/hooks/useGuestRequest";
import { XCircle } from "lucide-react";

// Import all guest‑portal components
import { Header } from "@/components/guest-portal/Header";
import { BottomNav, TabId } from "@/components/guest-portal/BottomNav";
import { HomeTab } from "@/components/guest-portal/HomeTab";
import { MenuTab } from "@/components/guest-portal/MenuTab";
import { ExploreTab } from "@/components/guest-portal/ExploreTab";
import { ServicesTab } from "@/components/guest-portal/ServicesTab";
import { RequestDrawer } from "@/components/guest-portal/RequestDrawer";
import { SuccessDrawer } from "@/components/guest-portal/SuccessDrawer";
import { EmptyState } from "@/components/guest-portal/EmptyState";

export default function GuestPortalPage() {
  const { token } = useParams();
  const qrToken = token as string;

  // Data & hooks
  const { data, isLoading, isExpired } = useGuestPortal(qrToken);
  const { sendRequest, isSubmitting } = useGuestRequest(qrToken);

  // UI state
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [requestItem, setRequestItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Derived data (safe before guards)
  const menuCategories = data?.menu ?? [];
  const excursions = data?.excursions ?? [];
  const services = data?.services ?? [];

  // ─── HANDLERS ──────────────────────────────────────────────

  const handleRequestItem = (item: any) => {
    setRequestItem(item);
    setQuantity(1);
  };

  const handleConfirmRequest = async () => {
    if (isExpired || !requestItem) return;

    const requiresQty =
      requestItem.requires_quantity ||
      (requestItem.price && parseFloat(requestItem.price) < 100);

    const result = await sendRequest({
      type: requestItem.requestType,
      item_id: requestItem.id,
      quantity: requiresQty ? quantity : 1,
    });

    if (result.success) {
      setShowSuccess(true);
      setRequestItem(null);
    } else {
      alert(result.error || "Failed to submit request.");
    }
  };

  // ─── LOADING & ERROR STATES ──────────────────────────────

  if (isLoading) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-4 bg-background">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <span className="absolute text-xs font-black italic">R</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">
          Loading Guest Portal...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-background">
        <EmptyState
          icon={XCircle}
          title="Invalid Room Key"
          message="We couldn't locate your room reservation. Please scan the QR code in your room again."
        />
      </div>
    );
  }

  // Data is guaranteed non-null from here
  const riad = data.riad;
  const currency = riad.currency ?? "MAD";
  const houseRules = data.house_rules ?? [];

  const openWhatsApp = () => {
    const number = riad.whatsappNumber?.replace(/[^0-9]/g, "");
    if (number) {
      window.open(`https://wa.me/${number}`, "_blank");
    }
  };

  // ─── RENDER ────────────────────────────────────────────────

  return (
    <div className="relative flex flex-col w-full h-dvh max-w-md mx-auto bg-background text-foreground overflow-hidden sm:border-x sm:border-border/60 shadow-2xl">
      <Header
        riadName={riad.name}
        roomNumber={data.room_number ?? "?"}
        isExpired={isExpired}
        whatsappNumber={riad.whatsappNumber}
        onWhatsAppClick={openWhatsApp}
        logoUrl={riad.logo_url}
      />

      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden pb-28 no-scrollbar">
        {activeTab === "home" && (
          <HomeTab
            riad={riad}
            roomNumber={data.room_number ?? "?"}
            onNavigate={(tab) => setActiveTab(tab)}
            onWhatsAppClick={openWhatsApp}
            houseRules={houseRules}
          />
        )}

        {activeTab === "menu" && (
          <MenuTab
            categories={menuCategories}
            isExpired={isExpired}
            onRequestItem={handleRequestItem}
            currency={currency}
          />
        )}

        {activeTab === "explore" && (
          <ExploreTab
            excursions={excursions}
            isExpired={isExpired}
            onRequestItem={handleRequestItem}
            currency={currency}
          />
        )}

        {activeTab === "services" && (
          <ServicesTab
            services={services}
            isExpired={isExpired}
            onRequestItem={handleRequestItem}
            currency={currency}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <RequestDrawer
        isOpen={!!requestItem}
        onOpenChange={(open) => !open && setRequestItem(null)}
        item={requestItem}
        quantity={quantity}
        setQuantity={setQuantity}
        isExpired={isExpired}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmRequest}
        currency={currency}
      />

      <SuccessDrawer
        isOpen={showSuccess}
        onOpenChange={setShowSuccess}
        whatsappNumber={riad.whatsappNumber}
        onWhatsAppClick={openWhatsApp}
      />
    </div>
  );
}