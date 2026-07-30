"use client";

import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useCatalog } from "@/hooks/useCatalog";
import type { Category, MenuItem, Service, Excursion, HouseRule } from "@/hooks/useCatalog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

// Tab components
import { SettingsTab } from "@/components/manage-riad/SettingsTab";
import { MenuTab } from "@/components/manage-riad/MenuTab";
import { ExcursionsTab } from "@/components/manage-riad/ExcursionsTab";
import { ServicesTab } from "@/components/manage-riad/ServicesTab";
import { HouseRulesTab } from "@/components/manage-riad/HouseRulesTab";
import { IconPicker } from "@/components/manage-riad/IconPicker";
import { GuestPortalPreview } from "@/components/manage-riad/GuestPortalPreview";
import { ImageUploader } from "@/components/ui/ImageUploader";

// Dialogs
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Info,
  Utensils,
  Sparkles,
  Globe,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

export default function GuestPortalManagement() {
  // ─── Hooks ──────────────────────────────────────────────────
  const {
    settings,
    isLoading: settingsLoading,
    updateSettings,
    isUpdating,
  } = useSettings();

  const catalog = useCatalog();
  const {
    categories,
    menuItems,
    excursions,
    services,
    houseRules,
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
    addHouseRule,
    updateHouseRule,
    deleteHouseRule,
    toggleHouseRule,
  } = catalog;

  // ─── State ──────────────────────────────────────────────────
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("info");

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [excursionDialogOpen, setExcursionDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [houseRuleDialogOpen, setHouseRuleDialogOpen] = useState(false);
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
    image_url: "",
    image_public_id: "",
  });

  const [excursionForm, setExcursionForm] = useState({
    id: null as number | null,
    name: "",
    price: "",
    duration: "",
    description: "",
    image_url: "",
    image_public_id: "",
  });

  const [serviceForm, setServiceForm] = useState({
    id: null as number | null,
    name: "",
    price: "",
    requires_quantity: false,
  });

  const [houseRuleForm, setHouseRuleForm] = useState({
    id: null as number | null,
    title: "",
    description: "",
    value: "",
    icon: "Info",
  });

  // ─── Sync Settings ──────────────────────────────────────────
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        name: settings.name || "",
        description: settings.description || "",
        wifiName: settings.wifiName || "",
        wifiPassword: settings.wifiPassword || "",
        whatsappNumber: settings.whatsappNumber || "",
        instagramUrl: settings.instagramUrl || "",
        logo_url: settings.logo_url || "",
        logo_public_id: settings.logo_public_id || "",
        cover_image_url: settings.cover_image_url || "",
        cover_image_public_id: settings.cover_image_public_id || "",
      });
    }
  }, [settings]);

  // ─── Out Of Stock / Availability Handlers ───────────────────
  
  const handleToggleMenuItemAvailability = useCallback(
    async (id: number, isAvailable: boolean) => {
      if ((catalog as any).toggleMenuItemAvailability) {
        await (catalog as any).toggleMenuItemAvailability(id, isAvailable);
      } else {
        await updateMenuItem(id, { is_available: isAvailable });
      }
    },
    [catalog, updateMenuItem]
  );

  const handleToggleExcursionAvailability = useCallback(
    async (id: number, isAvailable: boolean) => {
      if ((catalog as any).toggleExcursionAvailability) {
        await (catalog as any).toggleExcursionAvailability(id, isAvailable);
      } else {
        await updateExcursion(id, { is_available: isAvailable });
      }
    },
    [catalog, updateExcursion]
  );

  const handleToggleServiceAvailability = useCallback(
    async (id: number, isAvailable: boolean) => {
      if ((catalog as any).toggleServiceAvailability) {
        await (catalog as any).toggleServiceAvailability(id, isAvailable);
      } else {
        await updateService(id, { is_available: isAvailable });
      }
    },
    [catalog, updateService]
  );

  const handleToggleHouseRule = useCallback(
    async (id: number, isActive: boolean) => {
      if ((catalog as any).toggleHouseRule) {
        await (catalog as any).toggleHouseRule(id, isActive);
      } else {
        await updateHouseRule(id, { is_active: isActive });
      }
    },
    [catalog, updateHouseRule]
  );

  // ─── Handlers ─────────────────────────────────────────────────

  // Category
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

  // Menu Item
  const openItemDialog = (item: MenuItem | null = null, categoryId: number = 0) => {
    if (item) {
      setIsEditMode(true);
      setItemForm({
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        description: item.description || "",
        category_id: item.category_id,
        image_url: item.image_url || "",
        image_public_id: item.image_public_id || "",
      });
    } else {
      setIsEditMode(false);
      setItemForm({
        id: null,
        name: "",
        price: "",
        description: "",
        category_id: categoryId,
        image_url: "",
        image_public_id: "",
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
      image_url: itemForm.image_url,
      image_public_id: itemForm.image_public_id,
    };
    if (isEditMode && itemForm.id) {
      await updateMenuItem(itemForm.id, payload);
    } else {
      await addMenuItem(payload);
    }
    setItemDialogOpen(false);
  };

  // Excursion
  const openExcursionDialog = (excursion: Excursion | null = null) => {
    if (excursion) {
      setIsEditMode(true);
      setExcursionForm({
        id: excursion.id,
        name: excursion.name,
        price: excursion.price.toString(),
        duration: excursion.duration,
        description: excursion.description || "",
        image_url: excursion.image_url || "",
        image_public_id: excursion.image_public_id || "",
      });
    } else {
      setIsEditMode(false);
      setExcursionForm({
        id: null,
        name: "",
        price: "",
        duration: "",
        description: "",
        image_url: "",
        image_public_id: "",
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
      image_url: excursionForm.image_url,
      image_public_id: excursionForm.image_public_id,
    };
    if (isEditMode && excursionForm.id) {
      await updateExcursion(excursionForm.id, payload);
    } else {
      await addExcursion(payload);
    }
    setExcursionDialogOpen(false);
  };

  // Service
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

  // House Rule
  const openHouseRuleDialog = (rule: HouseRule | null = null) => {
    if (rule) {
      setIsEditMode(true);
      setHouseRuleForm({
        id: rule.id,
        title: rule.title,
        description: rule.description || "",
        value: rule.value,
        icon: rule.icon,
      });
    } else {
      setIsEditMode(false);
      setHouseRuleForm({
        id: null,
        title: "",
        description: "",
        value: "",
        icon: "Info",
      });
    }
    setHouseRuleDialogOpen(true);
  };

  const handleHouseRuleSubmit = async () => {
    if (!houseRuleForm.title.trim() || !houseRuleForm.value.trim()) return;
    const payload = {
      title: houseRuleForm.title,
      description: houseRuleForm.description || undefined,
      value: houseRuleForm.value,
      icon: houseRuleForm.icon,
      is_active: true,
    };
    if (isEditMode && houseRuleForm.id) {
      await updateHouseRule(houseRuleForm.id, payload);
    } else {
      await addHouseRule(payload);
    }
    setHouseRuleDialogOpen(false);
  };

  // Delete
  const confirmDelete = (type: string, id: number, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const targetName = deleteTarget.name;
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
        case "houseRule":
          await deleteHouseRule(deleteTarget.id);
          break;
      }
      toast.success(`${targetName} deleted`);
    } catch (error) {
      toast.error("Failed to delete", { description: "Something went wrong. Please try again." });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  // Settings
  const handleSaveSettings = async () => {
    if (!localSettings) return;
    const payload = {
      name: localSettings.name,
      description: localSettings.description,
      wifiName: localSettings.wifiName,
      wifiPassword: localSettings.wifiPassword,
      whatsappNumber: localSettings.whatsappNumber,
      instagramUrl: localSettings.instagramUrl,
      logo_url: localSettings.logo_url,
      logo_public_id: localSettings.logo_public_id,
      cover_image_url: localSettings.cover_image_url,
      cover_image_public_id: localSettings.cover_image_public_id,
    };
    await updateSettings(payload);
    toast.success("Settings saved");
  };

  // ─── Loading ──────────────────────────────────────────────────
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

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight uppercase">Guest Portal CMS</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage everything your guests see on their mobile phones.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start pb-20">
        {/* ─── LEFT: EDITOR ───────────────────────────────────── */}
        <div className="xl:col-span-7">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full h-12 bg-muted/50 p-1 rounded-xl mb-6">
              <TabsTrigger value="info" className="text-[10px] font-black uppercase flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Identity
              </TabsTrigger>
              <TabsTrigger value="menu" className="text-[10px] font-black uppercase flex items-center gap-1.5">
                <Utensils className="w-4 h-4" /> Menu
              </TabsTrigger>
              <TabsTrigger value="explore" className="text-[10px] font-black uppercase flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Excursions
              </TabsTrigger>
              <TabsTrigger value="services" className="text-[10px] font-black uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Services
              </TabsTrigger>
              <TabsTrigger value="rules" className="text-[10px] font-black uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Rules
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 animate-in fade-in-50">
              <SettingsTab
                settings={localSettings}
                initialSettings={settings}
                onChange={setLocalSettings}
                onSave={handleSaveSettings}
                isSaving={isUpdating}
              />
            </TabsContent>

            <TabsContent value="menu" className="space-y-4">
              <MenuTab
                categories={categories}
                menuItems={menuItems}
                onOpenCategoryDialog={openCategoryDialog}
                onOpenItemDialog={openItemDialog}
                onDeleteCategory={(id, name) => confirmDelete('category', id, name)}
                onDeleteMenuItem={(id, name) => confirmDelete('menuItem', id, name)}
                onToggleAvailability={handleToggleMenuItemAvailability}
              />
            </TabsContent>

            <TabsContent value="explore" className="space-y-4">
              <ExcursionsTab
                excursions={excursions}
                onOpenDialog={openExcursionDialog}
                onDelete={(id, name) => confirmDelete('excursion', id, name)}
                onToggleAvailability={handleToggleExcursionAvailability}
              />
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <ServicesTab
                services={services}
                onOpenDialog={openServiceDialog}
                onDelete={(id, name) => confirmDelete('service', id, name)}
                onToggleAvailability={handleToggleServiceAvailability}
              />
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <HouseRulesTab
                houseRules={houseRules}
                onOpenDialog={openHouseRuleDialog}
                onDelete={(id, name) => confirmDelete('houseRule', id, name)}
                onToggleActive={handleToggleHouseRule}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* ─── RIGHT: PREVIEW ────────────────────────────────── */}
        <div className="xl:col-span-5 hidden xl:block sticky top-24 self-start">
          <GuestPortalPreview
            activeCmsTab={activeTab}
            settings={localSettings}
            categories={categories}
            menuItems={menuItems}
            services={services}
            excursions={excursions}
            houseRules={houseRules}
          />
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
                  Menu
                </Button>
                <Button
                  type="button"
                  variant={categoryForm.type === "service" ? "default" : "outline"}
                  className="flex-1 font-black uppercase text-xs"
                  onClick={() => setCategoryForm({ ...categoryForm, type: "service" })}
                >
                  Service
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
              <Label className="text-[10px] font-black uppercase tracking-widest">Image</Label>
              <ImageUploader
                currentUrl={itemForm.image_url}
                folder="menu-items"
                onUploadComplete={(url, publicId) =>
                  setItemForm({ ...itemForm, image_url: url, image_public_id: publicId })
                }
                onRemove={() =>
                  setItemForm({ ...itemForm, image_url: '', image_public_id: '' })
                }
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
                className="min-h-20"
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
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Image</Label>
              <ImageUploader
                currentUrl={excursionForm.image_url}
                folder="excursions"
                onUploadComplete={(url, publicId) =>
                  setExcursionForm({ ...excursionForm, image_url: url, image_public_id: publicId })
                }
                onRemove={() =>
                  setExcursionForm({ ...excursionForm, image_url: '', image_public_id: '' })
                }
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
                className="min-h-20"
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

      {/* House Rule Dialog */}
      <Dialog open={houseRuleDialogOpen} onOpenChange={setHouseRuleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">
              {isEditMode ? "Edit" : "New"} House Rule
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of this house rule."
                : "Add a new rule or info for your guests to see."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Title</Label>
              <Input
                value={houseRuleForm.title}
                onChange={(e) => setHouseRuleForm({ ...houseRuleForm, title: e.target.value })}
                placeholder="e.g. Quiet Hours"
                className="h-11 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Description</Label>
              <Textarea
                value={houseRuleForm.description}
                onChange={(e) => setHouseRuleForm({ ...houseRuleForm, description: e.target.value })}
                placeholder="e.g. Please respect other guests"
                className="min-h-20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Value</Label>
              <Input
                value={houseRuleForm.value}
                onChange={(e) => setHouseRuleForm({ ...houseRuleForm, value: e.target.value })}
                placeholder="e.g. 10:00 PM — 08:00 AM"
                className="h-11 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Icon</Label>
              <IconPicker
                value={houseRuleForm.icon}
                onChange={(icon) => setHouseRuleForm({ ...houseRuleForm, icon })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleHouseRuleSubmit}
              className="w-full font-black uppercase text-xs"
              disabled={!houseRuleForm.title.trim() || !houseRuleForm.value.trim()}
            >
              {isEditMode ? "Save Changes" : "Add Rule"}
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