"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, User, Shield, Info, Trash2, Calendar, CreditCard, Package } from "lucide-react";
import { useAccount } from "@/hooks/useAccount";
import { toast } from "@/lib/toast";
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

export default function AccountPage() {
  const {
    data,
    isLoading,
    isUpdatingProfile,
    isUpdatingPassword,
    isDeleting,
    updateProfile,
    updatePassword,
    deleteAccount,
  } = useAccount();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [initialized, setInitialized] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  if (!initialized && data) {
    setName(data.user.name);
    setEmail(data.user.email);
    setPhone(data.user.phone ?? "");
    setInitialized(true);
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Account</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage your personal account settings.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const hasProfileChanges =
    data && (name !== data.user.name || email !== data.user.email || phone !== (data.user.phone ?? ""));

  const handleSaveProfile = async () => {
    await updateProfile({ name, email, phone });
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    await updatePassword({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) {
      window.location.href = "/login";
    }
    setShowDeleteDialog(false);
    setDeleteConfirmText("");
  };

  const memberSince = data?.user.created_at
    ? new Date(data.user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight uppercase">Account</h1>
        <p className="text-muted-foreground text-sm font-medium">Manage your personal account settings.</p>
      </div>

      {/* 1. Personal Information */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
          </div>
          <CardDescription>Update your name, email, and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 bg-background font-semibold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 bg-background font-semibold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Phone Number <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 890"
              className="h-10 bg-background font-semibold"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-border px-6 py-4">
          <Button
            onClick={handleSaveProfile}
            disabled={!hasProfileChanges || isUpdatingProfile}
            className="ml-auto h-10 font-black uppercase text-xs tracking-widest shadow-md"
          >
            {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* 2. Security */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold">Security</CardTitle>
          </div>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-10 bg-background font-semibold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-[10px] font-black uppercase tracking-widest opacity-70">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-10 bg-background font-semibold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 bg-background font-semibold"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-border px-6 py-4">
          <Button
            onClick={handleUpdatePassword}
            disabled={isUpdatingPassword || (!currentPassword && !newPassword && !confirmPassword)}
            className="ml-auto h-10 font-black uppercase text-xs tracking-widest shadow-md"
          >
            {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Update Password
          </Button>
        </CardFooter>
      </Card>

      {/* 3. Account Details */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold">Account Details</CardTitle>
          </div>
          <CardDescription>Your account information at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Member Since</span>
            </div>
            <span className="text-sm font-bold">{memberSince}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Current Plan</span>
            </div>
            <span className="text-sm font-bold text-primary">Free</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Application Version</span>
            </div>
            <span className="text-sm font-bold">v1.0</span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-destructive px-1">Danger Zone</h3>
        <Card className="border-destructive/20 bg-destructive/2 shadow-none">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-foreground">Delete Account</h4>
                <p className="text-xs text-muted-foreground font-medium max-w-100">
                  Permanently delete your account, your riad, and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                className="font-black uppercase text-xs h-11 px-8 shrink-0"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tight text-destructive">
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-xs font-medium leading-relaxed space-y-2">
                <span>
                  This will permanently delete your account, your riad <strong className="text-foreground">{data?.riad.name}</strong>, and all associated data including rooms, menu items, orders, and staff.
                </span>
                <span className="font-bold text-foreground block">
                  This action cannot be undone.
                </span>
                <span className="pt-2 block">
                  Type <strong className="text-destructive">DELETE</strong> to confirm.
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-6">
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="h-10 bg-background font-semibold text-center"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold uppercase text-xs h-10" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="font-black uppercase text-xs h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteConfirmText !== "DELETE" || isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
