// app/dashboard/guest-portal/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useCatalog } from "@/hooks/useCatalog";
import type {
  Category,
  MenuItem,
  Service,
  Excursion
} from "@/hooks/useCatalog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Info,
  Plus,
  Trash2,
  Wifi,
  Clock,
  GripVertical,
  Utensils,
  Sparkles,
  Loader2,
  Save,
  MessageCircle,
  Pencil,
  Globe,
  AlertTriangle,
} from "lucide-react";

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function GuestPortalManagement() {
  const {
    settings,
    isLoading: settingsLoading,
    updateSettings,
    isUpdating,
  } = useSettings();

  const {
    categories,
    menuItems,
    excursions,
    services,
    isLoading: catalogLoading,
    addCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addExcursion,
    updateExcursion,
    deleteExcursion,
    addService,
    updateService,
    deleteService,
  } = useCatalog();

  // ─── STATE ──────────────────────────────────────────────────
  const [localSettings, setLocalSettings] = useState<any>(null);

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [excursionDialogOpen, setExcursionDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number; name: string } | null>(null);

  // Form states
  const [isEditMode, setIsEditMode] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    id: null as number | null,
    name: "",
    type: "menu" as "menu" | "service",
  });

  const [itemForm, setItemForm] = useState({
    id: null as number | null,
    name: "",
    price: "",
    description: "",
    category_id: 0,
  });

  const [excursionForm, setExcursionForm] = useState({
    id: null as number | null,
    name: "",
    price: "",
    duration: "",
    description: "",
  });

  const [serviceForm, setServiceForm] = useState({
    id: null as number | null,
    name: "",
    price: "",
    requires_quantity: false,
  });

  // ─── EFFECTS ──────────────────────────────────────────────────
  useEffect(() => {
    if (settings) {
      // Map backend fields to frontend expectations (fallback support)
      setLocalSettings({
        name: settings.name || "",
        description: settings.description || "",
        wifiName: settings.wifiName || "",
        wifiPassword: settings.wifiPassword || "",
        whatsappNumber: settings.whatsappNumber || "",
        instagramUrl: settings.instagramUrl || "",
      });
    }
  }, [settings]);

  // ─── HANDLERS ─────────────────────────────────────────────────

  // ── Category ──
  const openCategoryDialog = () => {
    setIsEditMode(false);
    setCategoryForm({ id: null, name: "", type: "menu" });
    setCategoryDialogOpen(true);
  };

  const handleCategorySubmit = async () => {
    if (!categoryForm.name.trim()) return;
    await addCategory(categoryForm.name, categoryForm.type);
    setCategoryDialogOpen(false);
    setCategoryForm({ id: null, name: "", type: "menu" });
  };

  // ── Menu Item ──
  const openItemDialog = (item: MenuItem | null = null, categoryId: number = 0) => {
    if (item) {
      setIsEditMode(true);
      setItemForm({
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        description: item.description || "",
        category_id: item.category_id,
      });
    } else {
      setIsEditMode(false);
      setItemForm({
        id: null,
        name: "",
        price: "",
        description: "",
        category_id: categoryId,
      });
    }
    setItemDialogOpen(true);
  };

  const handleItemSubmit = async () => {
    if (!itemForm.name.trim() || !itemForm.category_id) return;
    const payload = {
      name: itemForm.name,
      price: parseFloat(itemForm.price) || 0,
      description: itemForm.description,
      category_id: itemForm.category_id,
      is_available: true,
    };
    if (isEditMode && itemForm.id) {
      await updateMenuItem(itemForm.id, payload);
    } else {
      await addMenuItem(payload);
    }
    setItemDialogOpen(false);
  };

  // ── Excursion ──
  const openExcursionDialog = (excursion: Excursion | null = null) => {
    if (excursion) {
      setIsEditMode(true);
      setExcursionForm({
        id: excursion.id,
        name: excursion.name,
        price: excursion.price.toString(),
        duration: excursion.duration,
        description: excursion.description || "",
      });
    } else {
      setIsEditMode(false);
      setExcursionForm({
        id: null,
        name: "",
        price: "",
        duration: "",
        description: "",
      });
    }
    setExcursionDialogOpen(true);
  };

  const handleExcursionSubmit = async () => {
    if (!excursionForm.name.trim()) return;
    const payload = {
      name: excursionForm.name,
      price: parseFloat(excursionForm.price) || 0,
      duration: excursionForm.duration,
      description: excursionForm.description,
    };
    if (isEditMode && excursionForm.id) {
      await updateExcursion(excursionForm.id, payload);
    } else {
      await addExcursion(payload);
    }
    setExcursionDialogOpen(false);
  };

  // ── Service ──
  const openServiceDialog = (service: Service | null = null) => {
    if (service) {
      setIsEditMode(true);
      setServiceForm({
        id: service.id,
        name: service.name,
        price: service.price?.toString() || "",
        requires_quantity: service.requires_quantity,
      });
    } else {
      setIsEditMode(false);
      setServiceForm({
        id: null,
        name: "",
        price: "",
        requires_quantity: false,
      });
    }
    setServiceDialogOpen(true);
  };

  const handleServiceSubmit = async () => {
    if (!serviceForm.name.trim()) return;
    const payload = {
      name: serviceForm.name,
      price: serviceForm.price ? parseFloat(serviceForm.price) : undefined,
      requires_quantity: serviceForm.requires_quantity,
    };
    if (isEditMode && serviceForm.id) {
      await updateService(serviceForm.id, payload);
    } else {
      await addService(payload);
    }
    setServiceDialogOpen(false);
  };

  // ── Delete ──
  const confirmDelete = (type: string, id: number, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      switch (deleteTarget.type) {
        case "category":
          await deleteCategory(deleteTarget.id);
          break;
        case "menuItem":
          await deleteMenuItem(deleteTarget.id);
          break;
        case "excursion":
          await deleteExcursion(deleteTarget.id);
          break;
        case "service":
          await deleteService(deleteTarget.id);
          break;
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  // ── Settings ──
  const handleSaveSettings = async () => {
    if (!localSettings) return;
    // Map frontend field names back to backend expected names (if different)
    const payload = {
      name: localSettings.name,
      description: localSettings.description,
      wifiName: localSettings.wifiName,
      wifiPassword: localSettings.wifiPassword,
      whatsappNumber: localSettings.whatsappNumber,
    };
    await updateSettings(payload);
  };

  // ─── HELPERS ──────────────────────────────────────────────────
  const menuCategories = categories.filter((c) => c.type === "menu");

  // ─── LOADING / ERROR ─────────────────────────────────────────
  if (settingsLoading || catalogLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Loading guest portal...
        </p>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header - No Save button here anymore */}
      <div>
        <h1 className="text-2xl font-black tracking-tight uppercase">Guest Portal CMS</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage everything your guests see on their mobile phones.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start pb-20">
        {/* ─── LEFT: EDITOR ───────────────────────────────────── */}
        <div className="xl:col-span-7">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-12 bg-muted/50 p-1 rounded-xl mb-6">
              <TabsTrigger value="info" className="text-[10px] font-black uppercase">
                <Info className="w-4 h-4 mr-1" /> Identity
              </TabsTrigger>
              <TabsTrigger value="menu" className="text-[10px] font-black uppercase">
                <Utensils className="w-4 h-4 mr-1" /> Menu
              </TabsTrigger>
              <TabsTrigger value="explore" className="text-[10px] font-black uppercase">
                <Globe className="w-4 h-4 mr-1" /> Excursions
              </TabsTrigger>
              <TabsTrigger value="services" className="text-[10px] font-black uppercase">
                <Sparkles className="w-4 h-4 mr-1" /> Services
              </TabsTrigger>
            </TabsList>

            {/* ─── TAB 1: IDENTITY ───────────────────────────── */}
            <TabsContent value="info" className="space-y-6 animate-in fade-in-50">
              <Card className="p-6 border-border bg-card shadow-sm space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center">
                    <Globe className="w-4 h-4 mr-2" /> Riad Brand
                  </h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase opacity-60">
                        Public Riad Name
                      </Label>
                      <Input
                        value={localSettings?.name || ""}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, name: e.target.value })
                        }
                        className="h-11 font-bold"
                        placeholder="e.g. Riad Al Nour"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase opacity-60">
                        Guest Welcome Message
                      </Label>
                      <Textarea
                        value={localSettings?.description || ""}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, description: e.target.value })
                        }
                        className="min-h-[100px]"
                        placeholder="Welcome to our humble home..."
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center">
                    <Wifi className="w-4 h-4 mr-2" /> Connectivity & Support
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase opacity-60">
                        WiFi Name
                      </Label>
                      <Input
                        value={localSettings?.wifiName || ""}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, wifiName: e.target.value })
                        }
                        className="font-bold"
                        placeholder="Riad_Guest_WiFi"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase opacity-60">
                        WiFi Password
                      </Label>
                      <Input
                        value={localSettings?.wifiPassword || ""}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, wifiPassword: e.target.value })
                        }
                        className="font-bold"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] font-black uppercase opacity-60">
                        Reception WhatsApp Number
                      </Label>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={localSettings?.whatsappNumber || ""}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })
                          }
                          className="pl-10 font-bold"
                          placeholder="+212 600 000 000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── SAVE BUTTON (ONLY HERE) ─────────────── */}
                <Button
                  onClick={handleSaveSettings}
                  disabled={isUpdating}
                  className="w-full h-12 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
                >
                  {isUpdating ? (
                    <><Loader2 className="animate-spin mr-2" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save All Info</>
                  )}
                </Button>
              </Card>
            </TabsContent>

            {/* ─── TAB 2: MENU ────────────────────────────────── */}
            <TabsContent value="menu" className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Menu Categories
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[10px] font-black uppercase"
                  onClick={openCategoryDialog}
                >
                  <Plus className="w-3 h-3 mr-1" /> New Category
                </Button>
              </div>

              {menuCategories.length === 0 ? (
                <Card className="p-8 border-border bg-card text-center text-muted-foreground">
                  <p className="text-sm font-medium">No menu categories yet</p>
                  <p className="text-xs">Add a category to get started</p>
                </Card>
              ) : (
                menuCategories.map((cat) => (
                  <Card key={cat.id} className="p-4 bg-card border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground/30" />
                        <span className="font-black text-sm uppercase">{cat.name}</span>
                        <Badge variant="secondary" className="text-[9px] uppercase">
                          {menuItems.filter((i) => i.category_id === cat.id).length} items
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete("category", cat.id, cat.name)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {menuItems
                        .filter((i) => i.category_id === cat.id)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group border border-transparent hover:border-border transition-all"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{item.name}</span>
                              <span className="text-xs text-muted-foreground font-black">
                                {item.price} MAD
                              </span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openItemDialog(item)}
                                className="h-8 w-8 text-muted-foreground"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete("menuItem", item.id, item.name)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      <Button
                        variant="outline"
                        className="w-full h-10 border-dashed text-[10px] font-bold uppercase mt-2 opacity-60 hover:opacity-100"
                        onClick={() => openItemDialog(null, cat.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add to {cat.name}
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* ─── TAB 3: EXCURSIONS ──────────────────────────── */}
            <TabsContent value="explore" className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Tours & Experiences
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[10px] font-black uppercase"
                  onClick={() => openExcursionDialog()}
                >
                  <Plus className="w-3 h-3 mr-1" /> New Trip
                </Button>
              </div>

              {excursions.length === 0 ? (
                <Card className="p-8 border-border bg-card text-center text-muted-foreground">
                  <p className="text-sm font-medium">No excursions yet</p>
                  <p className="text-xs">Add an experience for your guests</p>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {excursions.map((ex) => (
                    <Card
                      key={ex.id}
                      className="p-4 bg-card border-border flex justify-between items-center group"
                    >
                      <div className="space-y-1">
                        <p className="font-black text-sm uppercase">{ex.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold">
                          <span>{ex.price} MAD</span>
                          <span className="w-px h-3 bg-muted-foreground/30" />
                          <Clock className="w-3 h-3" />
                          <span>{ex.duration}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openExcursionDialog(ex)}
                          className="text-muted-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete("excursion", ex.id, ex.name)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ─── TAB 4: SERVICES ────────────────────────────── */}
            <TabsContent value="services" className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Room Services
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[10px] font-black uppercase"
                  onClick={() => openServiceDialog()}
                >
                  <Plus className="w-3 h-3 mr-1" /> New Service
                </Button>
              </div>

              {services.length === 0 ? (
                <Card className="p-8 border-border bg-card text-center text-muted-foreground">
                  <p className="text-sm font-medium">No services yet</p>
                  <p className="text-xs">Add services for your guests</p>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {services.map((svc) => (
                    <Card
                      key={svc.id}
                      className="p-4 bg-card border-border flex justify-between items-center group"
                    >
                      <div className="space-y-1">
                        <p className="font-black text-sm uppercase">{svc.name}</p>
                        <p className="text-xs font-bold text-muted-foreground">
                          {svc.price ? `${svc.price} MAD` : "Complimentary"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-[9px] uppercase">
                          {svc.requires_quantity ? "Qty Required" : "Request Only"}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openServiceDialog(svc)}
                            className="text-muted-foreground"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete("service", svc.id, svc.name)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* ─── RIGHT: PREVIEW ────────────────────────────────── */}
        <div className="xl:col-span-5 hidden xl:block sticky top-24">
          <div className="flex flex-col items-center">
            <div className="relative w-[310px] h-[630px] bg-zinc-950 rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl overflow-hidden ring-1 ring-zinc-800">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-900 rounded-b-2xl z-20" />
              <div className="w-full h-full bg-background overflow-hidden flex flex-col pt-8">
                {/* Preview Header */}
                <div className="px-6 py-4">
                  <div className="w-7 h-7 rounded-lg bg-primary mb-3 shadow-lg shadow-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h4 className="font-black text-xl text-foreground leading-none">
                    {localSettings?.name || "Your Riad"}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1 tracking-tight">
                    Marrakech, Morocco
                  </p>
                </div>

                {/* Preview Content */}
                <div className="px-6 flex-1 space-y-6 overflow-y-auto no-scrollbar">
                  {/* WiFi Quick Access */}
                  <div className="bg-muted/40 p-3.5 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase text-muted-foreground leading-none mb-1">
                          Guest WiFi
                        </span>
                        <span className="text-xs font-bold leading-none tracking-tight">
                          {localSettings?.wifiName || "Riad_Guest_WiFi"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Preview */}
                  {menuItems.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
                      </div>
                      <div className="space-y-2">
                        {menuItems.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="bg-card border border-border p-3 rounded-xl shadow-sm flex items-center gap-3"
                          >
                            <div className="w-10 h-10 bg-muted rounded-lg shrink-0 flex items-center justify-center text-xs font-black uppercase">
                              {item.name?.charAt(0)}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-[11px] font-bold truncate">{item.name}</span>
                              <span className="text-[9px] text-muted-foreground font-medium">
                                {item.price} MAD
                              </span>
                            </div>
                          </div>
                        ))}
                        {menuItems.length > 3 && (
                          <span className="text-[9px] text-muted-foreground font-bold block text-center">
                            +{menuItems.length - 3} more items
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Excursions Preview */}
                  {excursions.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Experiences
                      </span>
                      {excursions.slice(0, 1).map((ex) => (
                        <div
                          key={ex.id}
                          className="bg-zinc-900 rounded-2xl aspect-[4/3] relative overflow-hidden flex flex-col justify-end p-4"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                          <span className="relative z-10 text-xs font-black text-white uppercase">
                            {ex.name}
                          </span>
                          <span className="relative z-10 text-[9px] font-bold text-white/70">
                            {ex.price} MAD • {ex.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Nav Simulation */}
                <div className="h-16 border-t border-border bg-card/80 backdrop-blur-md flex items-center justify-around px-4">
                  <div className="w-8 h-1 rounded-full bg-primary" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground tracking-widest opacity-60">
              Mobile Preview
            </p>
          </div>
        </div>
      </div>

      {/* ─── DIALOGS ───────────────────────────────────────────── */}

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your menu items or services.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Category Name
              </Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g. Breakfast, Drinks, Spa"
                className="h-11 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Type
              </Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={categoryForm.type === "menu" ? "default" : "outline"}
                  className="flex-1 font-black uppercase text-xs"
                  onClick={() => setCategoryForm({ ...categoryForm, type: "menu" })}
                >
                  <Utensils className="w-4 h-4 mr-2" /> Menu
                </Button>
                <Button
                  type="button"
                  variant={categoryForm.type === "service" ? "default" : "outline"}
                  className="flex-1 font-black uppercase text-xs"
                  onClick={() => setCategoryForm({ ...categoryForm, type: "service" })}
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Service
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCategorySubmit}
              className="w-full font-black uppercase text-xs"
              disabled={!categoryForm.name.trim()}
            >
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">
              {isEditMode ? "Edit" : "New"} Menu Item
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of this menu item."
                : "Add a new item to the menu."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Item Name
              </Label>
              <Input
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                placeholder="e.g. Mint Tea"
                className="h-11 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Price (MAD)
              </Label>
              <Input
                type="number"
                step="0.01"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                placeholder="25"
                className="h-11 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Description
              </Label>
              <Textarea
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Traditional Moroccan tea with fresh mint"
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleItemSubmit}
              className="w-full font-black uppercase text-xs"
              disabled={!itemForm.name.trim() || !itemForm.price}
            >
              {isEditMode ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Excursion Dialog */}
      <Dialog open={excursionDialogOpen} onOpenChange={setExcursionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">
              {isEditMode ? "Edit" : "New"} Excursion
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of this excursion."
                : "Add a new tour or experience for your guests."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Title
              </Label>
              <Input
                value={excursionForm.name}
                onChange={(e) => setExcursionForm({ ...excursionForm, name: e.target.value })}
                placeholder="e.g. Agafay Desert Dinner"
                className="h-11 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest">
                  Price (MAD)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={excursionForm.price}
                  onChange={(e) => setExcursionForm({ ...excursionForm, price: e.target.value })}
                  placeholder="650"
                  className="h-11 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest">
                  Duration
                </Label>
                <Input
                  value={excursionForm.duration}
                  onChange={(e) => setExcursionForm({ ...excursionForm, duration: e.target.value })}
                  placeholder="5 Hours"
                  className="h-11 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Description
              </Label>
              <Textarea
                value={excursionForm.description}
                onChange={(e) => setExcursionForm({ ...excursionForm, description: e.target.value })}
                placeholder="Evening camel ride followed by traditional dinner..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleExcursionSubmit}
              className="w-full font-black uppercase text-xs"
              disabled={!excursionForm.name.trim() || !excursionForm.price || !excursionForm.duration}
            >
              {isEditMode ? "Save Changes" : "Add Excursion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">
              {isEditMode ? "Edit" : "New"} Service
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of this service."
                : "Add a new service for guests to request."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Service Name
              </Label>
              <Input
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="e.g. Extra Towels"
                className="h-11 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">
                Price (MAD) - Leave blank for complimentary
              </Label>
              <Input
                type="number"
                step="0.01"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                placeholder="0"
                className="h-11 font-bold"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold">Quantity Selector</Label>
                <p className="text-[10px] text-muted-foreground">
                  Allow guests to specify quantity
                </p>
              </div>
              <Switch
                checked={serviceForm.requires_quantity}
                onCheckedChange={(val) =>
                  setServiceForm({ ...serviceForm, requires_quantity: val })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleServiceSubmit}
              className="w-full font-black uppercase text-xs"
              disabled={!serviceForm.name.trim()}
            >
              {isEditMode ? "Save Changes" : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── DELETE CONFIRMATION ──────────────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-bold text-foreground">"{deleteTarget?.name}"</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-black uppercase text-xs"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}