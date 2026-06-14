"use client";

import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, MoreHorizontal, UserPlus, Shield, Mail, Lock, Eye, EyeOff, Copy, Check, UserX, Clock 
} from "lucide-react";

// Updated Mock Data: Includes the raw password for retrieval
const mockStaff = [
  { id: "1", name: "Ahmed Mansour", email: "ahmed@riadkit.com", password: "Owner_Secret_123", role: "Owner", lastLogin: "2 mins ago" },
  { id: "2", name: "Fatima Zahra", email: "fatima@riadkit.com", password: "fatima_riad_2024", role: "Receptionist", lastLogin: "1 hour ago" },
  { id: "3", name: "Yassine Bakari", email: "yassine@riadkit.com", password: "yassine_reception", role: "Receptionist", lastLogin: "Yesterday" },
];

export default function StaffManagement() {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase leading-none mb-1 text-foreground">Staff Accounts</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage team access and retrieve forgotten passwords.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-black uppercase text-xs px-6 h-11">
              <UserPlus className="w-4 h-4 mr-2" /> Create Staff Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-black uppercase tracking-tight">Add Staff Member</DialogTitle>
              <DialogDescription>Create a login for your receptionist.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Full Name</Label>
                <Input placeholder="e.g. Fatima Zahra" className="bg-background h-11 font-bold text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Email Address</Label>
                <Input type="email" placeholder="fatima@riadkit.com" className="bg-background h-11 font-bold text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Login Password</Label>
                <Input placeholder="Set a password" className="bg-background h-11 font-bold text-sm font-mono" />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full font-black uppercase text-xs h-11">Save Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Table */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Staff Member</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Role</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Access Password</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Last Activity</TableHead>
              <TableHead className="text-right px-6 font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStaff.map((member) => (
              <TableRow key={member.id} className="border-border hover:bg-muted/20 transition-colors">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-foreground leading-tight">{member.name}</span>
                    <span className="text-[11px] text-muted-foreground font-medium flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1 opacity-50" /> {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={member.role === 'Owner' ? 'default' : 'secondary'} 
                    className={`font-black text-[9px] uppercase px-2 py-0.5 rounded-md ${
                      member.role === 'Owner' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Shield className="w-3 h-3 mr-1" /> {member.role}
                  </Badge>
                </TableCell>
                
                {/* PASSWORD RETRIEVAL COLUMN */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted/50 px-2 py-1 rounded border border-border/50 min-w-[140px] flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-foreground">
                        {visiblePasswords[member.id] ? member.password : "••••••••••••"}
                      </span>
                      <button 
                        onClick={() => togglePassword(member.id)}
                        className="text-muted-foreground hover:text-primary transition-colors ml-2"
                      >
                        {visiblePasswords[member.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => copyPassword(member.id, member.password)}
                    >
                      {copiedId === member.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center text-[11px] text-muted-foreground font-bold uppercase tracking-tight">
                    <Clock className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                    {member.lastLogin}
                  </div>
                </TableCell>

                <TableCell className="text-right px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border w-48">
                      <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Options</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem className="text-xs font-bold cursor-pointer">
                         <Lock className="w-4 h-4 mr-2 opacity-50" /> Change Password
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        disabled={member.role === 'Owner'}
                        className="text-xs font-bold text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                         <UserX className="w-4 h-4 mr-2" /> Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}