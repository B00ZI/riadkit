"use client";

import { useMemo, useState, useEffect } from "react";
import type { Settings } from "@/hooks/useSettings";
import type { Category, MenuItem, Service, Excursion, HouseRule } from "@/hooks/useCatalog";
import { Header } from "@/components/guest-portal/Header";
import { BottomNav, type TabId } from "@/components/guest-portal/BottomNav";
import { HomeTab } from "@/components/guest-portal/HomeTab";
import { MenuTab } from "@/components/guest-portal/MenuTab";
import { ExploreTab } from "@/components/guest-portal/ExploreTab";
import { ServicesTab } from "@/components/guest-portal/ServicesTab";

interface GuestPortalPreviewProps {
  activeCmsTab: string;
  settings: Settings | null;
  categories: Category[];
  menuItems: MenuItem[];
  services: Service[];
  excursions: Excursion[];
  houseRules: HouseRule[];
}

function cmsTabToPortalTab(cmsTab: string): TabId {
  switch (cmsTab) {
    case "menu": return "menu";
    case "explore": return "explore";
    case "services": return "services";
    default: return "home";
  }
}

export function GuestPortalPreview({
  activeCmsTab,
  settings,
  categories,
  menuItems,
  services,
  excursions,
  houseRules,
}: GuestPortalPreviewProps) {
  const [previewTab, setPreviewTab] = useState<TabId>(() => cmsTabToPortalTab(activeCmsTab));

  useEffect(() => {
    setPreviewTab(cmsTabToPortalTab(activeCmsTab));
  }, [activeCmsTab]);

  const riad = useMemo(() => ({
    name: settings?.name || "Your Riad",
    description: settings?.description || "",
    wifiName: settings?.wifiName || "",
    wifiPassword: settings?.wifiPassword || "",
    whatsappNumber: settings?.whatsappNumber || "",
    instagramUrl: settings?.instagramUrl || "",
    logo_url: settings?.logo_url || "",
    cover_image_url: settings?.cover_image_url || "",
  }), [settings]);

  const menuCategories = useMemo(() => {
    return categories
      .filter(c => c.type === "menu")
      .map(cat => ({
        id: String(cat.id),
        name: cat.name,
        menu_items: menuItems
          .filter(item => item.category_id === cat.id)
          .map(item => ({
            id: String(item.id),
            name: item.name,
            description: item.description,
            price: item.price,
            is_available: item.is_available,
            image_url: item.image_url,
          })),
      }))
      .filter(cat => cat.menu_items.length > 0);
  }, [categories, menuItems]);

  const previewServices = useMemo(() => {
    return services.map(s => ({
      id: String(s.id),
      name: s.name,
      price: s.price ?? 0,
      is_available: s.is_available,
    }));
  }, [services]);

  const previewExcursions = useMemo(() => {
    return excursions.map(e => ({
      id: String(e.id),
      name: e.name,
      description: e.description,
      price: e.price,
      duration: e.duration,
      is_available: e.is_available,
      image_url: e.image_url,
    }));
  }, [excursions]);

  const previewHouseRules = useMemo(() => {
    return houseRules
      .filter(r => r.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(r => ({
        title: r.title,
        description: r.description,
        value: r.value,
        icon: r.icon,
        sort_order: r.sort_order,
      }));
  }, [houseRules]);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative w-[340px] h-[680px] bg-zinc-950 rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-zinc-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-900 rounded-b-2xl z-30" />

        <div className="w-full h-full bg-background overflow-hidden flex flex-col pt-8">
          <div className="relative flex flex-col w-full h-full bg-background text-foreground overflow-hidden">
            <Header
              riadName={riad.name}
              roomNumber="42"
              isExpired={false}
              whatsappNumber={riad.whatsappNumber}
              onWhatsAppClick={() => {}}
              logoUrl={riad.logo_url}
            />

            <main className="flex-1 w-full overflow-y-auto overflow-x-hidden pb-16 no-scrollbar">
              {previewTab === "home" && (
                <HomeTab
                  riad={{ ...riad, cover_image_url: riad.cover_image_url }}
                  roomNumber="42"
                  onNavigate={(tab) => setPreviewTab(tab)}
                  onWhatsAppClick={() => {}}
                  houseRules={previewHouseRules}
                />
              )}
              {previewTab === "menu" && (
                <MenuTab
                  categories={menuCategories}
                  isExpired={false}
                  onRequestItem={() => {}}
                />
              )}
              {previewTab === "explore" && (
                <ExploreTab
                  excursions={previewExcursions}
                  isExpired={false}
                  onRequestItem={() => {}}
                />
              )}
              {previewTab === "services" && (
                <ServicesTab
                  services={previewServices}
                  isExpired={false}
                  onRequestItem={() => {}}
                />
              )}
            </main>

            <BottomNav activeTab={previewTab} onTabChange={setPreviewTab} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground tracking-widest opacity-60">
        Mobile Preview
      </p>
    </div>
  );
}
