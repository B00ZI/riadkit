"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  UserPlus,
  Shield,
  Mail,
  Lock,
  Copy,
  Check,
  UserX,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useStaff, type StaffMember } from "@/hooks/useStaff";
import { toast } from "@/lib/toast";

// ─── Type for temporary credentials ──────────────────────────
type NewStaffCredentials = {
  name: string;
  email: string;
  password: string;
};

export default function StaffManagement() {
  const { staff, isLoading, error, createStaff, updateStaff, deleteStaff } =
    useStaff();

  // ─── UI State ──────────────────────────────────────────────
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // ─── Form states ────────────────────────────────────────────
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [editStaff, setEditStaff] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // ─── Temporary credential display ──────────────────────────
  const [tempCredentials, setTempCredentials] =
    useState<NewStaffCredentials | null>(null);
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // ─── Handlers ──────────────────────────────────────────────

  // Create
  const handleCreateSubmit = async () => {
    try {
      const newUser = await createStaff(newStaff);
      toast.success(`${newUser.name} added`, { description: "Temporary credentials shown below." });
      setTempCredentials({
        name: newUser.name,
        email: newUser.email,
        password: newStaff.password,
      });
      setCredentialDialogOpen(true);
      setCreateDialogOpen(false);
      setNewStaff({ name: "", email: "", password: "", password_confirmation: "" });
    } catch {
      toast.error("Failed to create staff");
    }
  };

  // Edit
  const handleEditSubmit = async () => {
    if (!selectedStaff) return;
    try {
      await updateStaff(selectedStaff.id, editStaff);
      toast.success(`${selectedStaff.name} updated`);
      setEditDialogOpen(false);
      setSelectedStaff(null);
      setEditStaff({ name: "", email: "", password: "", password_confirmation: "" });
    } catch {
      toast.error("Failed to update staff");
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!selectedStaff) return;
    const name = selectedStaff.name;
    try {
      await deleteStaff(selectedStaff.id);
      toast.undo(`${name} deleted`, {
        onUndo: () => {},
        description: "Staff member removed",
      });
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
    } catch {
      toast.error("Failed to delete staff");
    }
  };

  // ─── Open edit dialog with pre-filled data ─────────────────
  const openEditDialog = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setEditStaff({
      name: staffMember.name,
      email: staffMember.email,
      password: "",
      password_confirmation: "",
    });
    setEditDialogOpen(true);
  };

  // ─── Copy password to clipboard ────────────────────────────
  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Loading / Error ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase leading-none mb-1 text-foreground">
            Staff Accounts
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Manage team access and reset passwords.
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-black uppercase text-xs px-6 h-11">
              <UserPlus className="w-4 h-4 mr-2" /> Create Staff Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-black uppercase tracking-tight">
                Add Staff Member
              </DialogTitle>
              <DialogDescription>
                Create a login for your receptionist. They will receive their
                credentials via this screen.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Full Name
                </Label>
                <Input
                  placeholder="e.g. Fatima Zahra"
                  className="bg-background h-11 font-bold text-sm"
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="fatima@riadkit.com"
                  className="bg-background h-11 font-bold text-sm"
                  value={newStaff.email}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Set a password"
                  className="bg-background h-11 font-bold text-sm font-mono"
                  value={newStaff.password}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, password: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  className="bg-background h-11 font-bold text-sm font-mono"
                  value={newStaff.password_confirmation}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      password_confirmation: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateSubmit}
                className="w-full font-black uppercase text-xs h-11"
                disabled={
                  !newStaff.name ||
                  !newStaff.email ||
                  !newStaff.password ||
                  newStaff.password !== newStaff.password_confirmation
                }
              >
                Create Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ─── Staff Table ──────────────────────────────────────── */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">
                Staff Member
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">
                Role
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">
                Created
              </TableHead>
              <TableHead className="text-right px-6 font-black uppercase text-[10px] tracking-widest">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-muted-foreground"
                >
                  <p className="text-sm font-medium">No staff members yet</p>
                  <p className="text-xs">Create your first receptionist account.</p>
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member) => (
                <TableRow
                  key={member.id}
                  className="border-border hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground leading-tight">
                        {member.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium flex items-center mt-1">
                        <Mail className="w-3 h-3 mr-1 opacity-50" />{" "}
                        {member.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.role === "receptionist" ? "secondary" : "default"}
                      className="font-black text-[9px] uppercase px-2 py-0.5 rounded-md"
                    >
                      <Shield className="w-3 h-3 mr-1" />{" "}
                      {member.role === "receptionist" ? "Receptionist" : "Owner"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-[11px] text-muted-foreground font-bold uppercase tracking-tight">
                      <Clock className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                      {new Date(member.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border-border w-48"
                      >
                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Options
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          className="text-xs font-bold cursor-pointer"
                          onClick={() => openEditDialog(member)}
                        >
                          <Lock className="w-4 h-4 mr-2 opacity-50" /> Edit / Reset
                          Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs font-bold text-destructive hover:bg-destructive/10 cursor-pointer"
                          onClick={() => {
                            setSelectedStaff(member);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <UserX className="w-4 h-4 mr-2" /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ─── EDIT DIALOG ───────────────────────────────────────── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">
              Edit Staff
            </DialogTitle>
            <DialogDescription>
              Update name, email, or reset password (leave password blank to keep
              current).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Full Name
              </Label>
              <Input
                className="bg-background h-11 font-bold text-sm"
                value={editStaff.name}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Email Address
              </Label>
              <Input
                type="email"
                className="bg-background h-11 font-bold text-sm"
                value={editStaff.email}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                New Password (optional)
              </Label>
              <Input
                type="password"
                placeholder="Leave blank to keep current"
                className="bg-background h-11 font-bold text-sm font-mono"
                value={editStaff.password}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, password: e.target.value })
                }
              />
            </div>
            {editStaff.password && (
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-background h-11 font-bold text-sm font-mono"
                  value={editStaff.password_confirmation}
                  onChange={(e) =>
                    setEditStaff({
                      ...editStaff,
                      password_confirmation: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleEditSubmit}
              className="w-full font-black uppercase text-xs h-11"
              disabled={
                !editStaff.name ||
                !editStaff.email ||
                (!!editStaff.password &&
                  editStaff.password !== editStaff.password_confirmation)
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── DELETE CONFIRMATION ──────────────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tight">
              Delete Staff Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedStaff?.name}</strong> (
              {selectedStaff?.email}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-black uppercase text-xs"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── TEMPORARY CREDENTIAL DIALOG ───────────────────────── */}
      <Dialog
        open={credentialDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCredentialDialogOpen(false);
            setTempCredentials(null);
            setCopied(false);
          }
        }}
      >
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight text-emerald-600 dark:text-emerald-400">
              ✅ Staff Account Created
            </DialogTitle>
            <DialogDescription>
              Please copy these credentials and share them with the staff member.
              This screen will not be shown again.
            </DialogDescription>
          </DialogHeader>
          {tempCredentials && (
            <div className="py-4 space-y-4">
              <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Name
                </p>
                <p className="font-bold text-sm">{tempCredentials.name}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Email
                </p>
                <p className="font-bold text-sm">{tempCredentials.email}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Password
                    </p>
                    <p className="font-bold text-sm font-mono">
                      {tempCredentials.password}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 font-black text-[10px]"
                    onClick={() => copyPassword(tempCredentials.password)}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium text-center italic">
                This dialog will close automatically after you confirm.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                setCredentialDialogOpen(false);
                setTempCredentials(null);
                setCopied(false);
              }}
              className="w-full font-black uppercase text-xs h-11"
            >
              I've Copied the Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}