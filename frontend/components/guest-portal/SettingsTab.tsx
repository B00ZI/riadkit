// components/guest-portal/SettingsTab.tsx
"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, Wifi, MessageCircle, Globe } from "lucide-react";
import type { Settings } from "@/hooks/useSettings";

interface SettingsTabProps {
  settings: Settings;
  initialSettings: Settings;
  onChange: (settings: Settings) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function SettingsTab({ 
  settings, 
  initialSettings, 
  onChange, 
  onSave, 
  isSaving 
}: SettingsTabProps) {
  // ✅ Detect changes – compare all fields explicitly
  const hasChanges = useMemo(() => {
    const keys: (keyof Settings)[] = [
      'name', 'description', 'wifiName', 'wifiPassword', 
      'whatsappNumber', 'instagramUrl'
    ];
    for (const key of keys) {
      const current = settings[key] ?? '';
      const initial = initialSettings[key] ?? '';
      if (current !== initial) {
        console.log(`� Change detected in "${key}": "${initial}" → "${current}"`);
        return true;
      }
    }
    return false;
  }, [settings, initialSettings]);

  return (
    <div className="space-y-6">
      <Card className="p-6 border-border bg-card shadow-sm space-y-8">
        {/* Riad Brand */}
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
                className="min-h-[100px]"
                placeholder="Welcome to our humble home..."
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Connectivity & Support */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center">
            <Wifi className="w-4 h-4 mr-2" /> Connectivity & Support
          </h3>
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
          </div>
        </div>

        {/* ─── SAVE BUTTON ────────────────────────────────── */}
        <Button
          onClick={onSave}
          disabled={isSaving || !hasChanges}
          className={`w-full h-12 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 ${
            !hasChanges && !isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? (
            <><Loader2 className="animate-spin mr-2" /> Saving...</>
          ) : hasChanges ? (
            <><Save className="w-4 h-4 mr-2" /> Save Changes</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> No Changes</>
          )}
        </Button>
      </Card>
    </div>
  );
}