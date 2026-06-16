// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    riad_name: "",
    whatsapp_number: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await register(formData);
    
    if (!result.success) {
      setError(result.error || "Failed to create account. Please try again.");
      setIsSubmitting(false);
    }
    // If success, useAuth handles redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <Card className="w-full max-w-lg bg-card border-border shadow-2xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-black text-2xl">R</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Onboard Your Riad</CardTitle>
            <CardDescription className="font-medium mt-1">
              Create your SaaS account to digitize your guest experience.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-bold text-xs uppercase tracking-wider">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="riad_name" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Riad Name
                </Label>
                <Input 
                  id="riad_name" 
                  placeholder="Riad Al Nour" 
                  value={formData.riad_name} 
                  onChange={handleChange}
                  className="bg-background h-11 font-bold text-sm" 
                  required 
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_name" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Your Full Name
                </Label>
                <Input 
                  id="user_name" 
                  placeholder="Karim Alaoui" 
                  value={formData.user_name} 
                  onChange={handleChange}
                  className="bg-background h-11 font-bold text-sm" 
                  required 
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="contact@riad.com" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="bg-background h-11 font-bold text-sm" 
                  required 
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_number" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  WhatsApp Number
                </Label>
                <Input 
                  id="whatsapp_number" 
                  placeholder="+212 600 000 000" 
                  value={formData.whatsapp_number} 
                  onChange={handleChange}
                  className="bg-background h-11 font-bold text-sm" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Secure Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange}
                className="bg-background h-11 font-bold text-sm font-mono" 
                required 
                disabled={isSubmitting}
                minLength={8}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-6 pb-6">
          <p className="text-xs text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Log in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}