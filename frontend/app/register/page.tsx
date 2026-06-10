"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Cookies from "js-cookie";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        user_name: "",
        email: "",
        password: "",
        riad_name: "",
        whatsapp_number: "", // Added to match your controller
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://192.168.100.53:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle Laravel validation errors nicely
                throw new Error(data.message || "Something went wrong");
            }

            // Success! Save token and redirect
            Cookies.set("riadkit_token", data.access_token, {
                expires: 7,
                
                sameSite: "lax",
                path: "/"
            });
            router.push("/dashboard");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create your Riad</CardTitle>
                    <CardDescription>
                        Enter your details to set up your RiadKit dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Display Errors */}
                        {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

                        <div className="space-y-2">
                            <Label htmlFor="riad_name">Riad Name</Label>
                            <Input id="riad_name" placeholder="Riad Dar L'Oussia" required onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                            <Input id="whatsapp_number" placeholder="+212 600 000 000" required onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user_name">Your Name</Label>
                            <Input id="user_name" placeholder="Youssef" required onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="youssef@example.com" required onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required onChange={handleChange} />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Setting up..." : "Create Account"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground mt-4">
                            Already have an account? <Link href="/login" className="text-primary hover:underline">Login here</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
