// app/(auth)/login/page.tsx
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

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || "Invalid email or password. Please try again.");
      setIsSubmitting(false);
    }
    // If success, useAuth handles redirect based on role
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-black text-2xl">R</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="font-medium mt-1">
              Sign in to manage your Riad
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-bold text-xs uppercase tracking-wider">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Email Address
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="contact@riad.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background h-11 font-bold text-sm" 
                required 
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background h-11 font-bold text-sm font-mono" 
                required 
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-6 pb-6">
          <p className="text-xs text-muted-foreground font-medium">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Create one here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}