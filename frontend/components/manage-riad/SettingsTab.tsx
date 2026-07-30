"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, Wifi, MessageCircle, Globe, Camera } from "lucide-react";
import type { Settings } from "@/hooks/useSettings";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface SettingsTabProps {
  settings: Settings;
  initialSettings: Settings;
  onChange: (settings: Settings) => void;
  onSave: () => void;
  isSaving: boolean;
}

function fieldChanged(current: string | undefined, initial: string | undefined) {
  return (current ?? '') !== (initial ?? '');
}

export function SettingsTab({
  settings,
  initialSettings,
  onChange,
  onSave,
  isSaving
}: SettingsTabProps) {
  const brandChanged = useMemo(
    () => fieldChanged(settings.name, initialSettings.name) ||
         fieldChanged(settings.description, initialSettings.description),
    [settings.name, settings.description, initialSettings.name, initialSettings.description]
  );

  const imagesChanged = useMemo(
    () => fieldChanged(settings.logo_url, initialSettings.logo_url) ||
         fieldChanged(settings.cover_image_url, initialSettings.cover_image_url),
    [settings.logo_url, settings.cover_image_url, initialSettings.logo_url, initialSettings.cover_image_url]
  );

  const connectivityChanged = useMemo(
    () => fieldChanged(settings.wifiName, initialSettings.wifiName) ||
         fieldChanged(settings.wifiPassword, initialSettings.wifiPassword) ||
         fieldChanged(settings.whatsappNumber, initialSettings.whatsappNumber) ||
         fieldChanged(settings.instagramUrl, initialSettings.instagramUrl),
    [settings.wifiName, settings.wifiPassword, settings.whatsappNumber, settings.instagramUrl,
     initialSettings.wifiName, initialSettings.wifiPassword, initialSettings.whatsappNumber, initialSettings.instagramUrl]
  );

  return (
    <div className="space-y-6">
      {/* Riad Brand */}
      <Card className="p-6 border-border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center">
            <Globe className="w-4 h-4 mr-2" /> Riad Brand
          </h3>
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving || !brandChanged}
            className="h-8 text-[10px] font-black uppercase px-3"
          >
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
            Save
          </Button>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60">
              Public Riad Name
            </Label>
            <Input
              value={settings.name ?? ""}
              onChange={(e) => onChange({ ...settings, name: e.target.value })}
              className="h-11 font-bold"
              placeholder="e.g. Riad Al Nour"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60">
              Guest Welcome Message
            </Label>
            <Textarea
              value={settings.description ?? ""}
              onChange={(e) => onChange({ ...settings, description: e.target.value })}
              className="min-h-25"
              placeholder="Welcome to our humble home..."
            />
          </div>
        </div>
      </Card>

      {/* Images */}
      <Card className="p-6 border-border bg-card shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center">
          <Camera className="w-4 h-4 mr-2" /> Images
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60">Riad Logo</Label>
            <ImageUploader
              currentUrl={settings.logo_url}
              folder="riads/logos"
              onUploadComplete={(url, publicId) => {
                onChange({ ...settings, logo_url: url, logo_public_id: publicId });
                setTimeout(() => onSave(), 0);
              }}
              onRemove={() => {
                onChange({ ...settings, logo_url: '', logo_public_id: '' });
                setTimeout(() => onSave(), 0);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60">Cover Image</Label>
            <ImageUploader
              currentUrl={settings.cover_image_url}
              folder="riads/covers"
              onUploadComplete={(url, publicId) => {
                onChange({ ...settings, cover_image_url: url, cover_image_public_id: publicId });
                setTimeout(() => onSave(), 0);
              }}
              onRemove={() => {
                onChange({ ...settings, cover_image_url: '', cover_image_public_id: '' });
                setTimeout(() => onSave(), 0);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Connectivity & Support */}
      <Card className="p-6 border-border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center">
            <Wifi className="w-4 h-4 mr-2" /> Connectivity & Support
          </h3>
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving || !connectivityChanged}
            className="h-8 text-[10px] font-black uppercase px-3"
          >
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
            Save
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60">WiFi Name</Label>
            <Input
              value={settings.wifiName ?? ""}
              onChange={(e) => onChange({ ...settings, wifiName: e.target.value })}
              className="font-bold"
              placeholder="Riad_Guest_WiFi"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60">WiFi Password</Label>
            <Input
              value={settings.wifiPassword ?? ""}
              onChange={(e) => onChange({ ...settings, wifiPassword: e.target.value })}
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
                value={settings.whatsappNumber ?? ""}
                onChange={(e) => onChange({ ...settings, whatsappNumber: e.target.value })}
                className="pl-10 font-bold"
                placeholder="+212 600 000 000"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[10px] font-black uppercase opacity-60">
              Instagram URL
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                value={settings.instagramUrl ?? ""}
                onChange={(e) => onChange({ ...settings, instagramUrl: e.target.value })}
                className="pl-10 font-bold"
                placeholder="https://instagram.com/yourriad"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
