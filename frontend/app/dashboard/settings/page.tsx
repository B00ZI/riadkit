"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ShieldCheck, 
  Globe, 
  CreditCard, 
  Trash2, 
  Lock,
  Globe2
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight uppercase">System Settings</h1>
        <p className="text-muted-foreground text-sm font-medium">Manage your Riad's technical configuration and account security.</p>
      </div>

      {/* 1. RIAD IDENTITY */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold">Riad Identity</CardTitle>
          </div>
          <CardDescription>Configure how your Riad appears in the URL and system.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">URL Slug</Label>
              <div className="flex items-center">
                <div className="bg-muted px-3 h-10 flex items-center border border-r-0 border-border rounded-l-md text-[11px] font-bold text-muted-foreground">
                  riadkit.com/
                </div>
                <Input defaultValue="al-jazirah" className="rounded-l-none h-10 font-mono text-sm bg-background" />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">This is your unique web address.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Currency</Label>
              <Select defaultValue="mad">
                <SelectTrigger className="h-10 bg-background font-semibold">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mad" className="font-bold">MAD (Moroccan Dirham)</SelectItem>
                  <SelectItem value="eur" className="font-bold">EUR (Euro)</SelectItem>
                  <SelectItem value="usd" className="font-bold">USD (US Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. ACCOUNT SECURITY */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold">Account Security</CardTitle>
          </div>
          <CardDescription>Update your login credentials and owner email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Email Address</Label>
                <Input defaultValue="owner@riad-aljazirah.com" className="h-10 bg-background font-semibold" />
              </div>
              <div className="flex items-end">
                 <Button variant="outline" className="h-10 font-black uppercase text-xs w-full border-border">Change Password</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. BILLING (PLACEHOLDER) */}
      <Card className="border-border bg-card shadow-sm opacity-60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg font-bold">Plan & Billing</CardTitle>
          </div>
          <CardDescription>Manage your RiadKit subscription.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border border-dashed">
              <div className="flex flex-col">
                 <span className="text-sm font-black uppercase">Professional Plan</span>
                 <span className="text-xs text-muted-foreground font-medium">Next billing date: Jan 15, 2025</span>
              </div>
              <Badge variant="secondary" className="font-bold text-[10px] uppercase">Coming Soon</Badge>
           </div>
        </CardContent>
      </Card>

      <Separator className="my-10" />

      {/* 4. DANGER ZONE */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-destructive px-1">Danger Zone</h3>
        <Card className="border-destructive/20 bg-destructive/[0.02] shadow-none">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-foreground">Delete this Riad</h4>
                <p className="text-xs text-muted-foreground font-medium max-w-[400px]">
                  Permanently remove all data, rooms, menu items, and order history. This action cannot be undone.
                </p>
              </div>
              <Button variant="destructive" className="font-black uppercase text-xs h-11 px-8">
                <Trash2 className="w-4 h-4 mr-2" /> Delete Riad
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button Floating Placeholder (Optional) */}
      <div className="flex justify-end pt-4">
         <Button className="h-12 px-10 font-black uppercase text-xs tracking-widest shadow-xl">Update Settings</Button>
      </div>
    </div>
  );
}