"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    wifiName: "",
    wifiPassword: "",
    whatsappNumber: "",
    instagramUrl: "",
  });

  // 1. Fetch current settings when the page loads
  useEffect(() => {
    const fetchSettings = async () => {
      const token = Cookies.get("riadkit_token");
      
      try {
        const res = await fetch("http://192.168.100.53:8000/api/settings", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}` // This tells Laravel who we are!
          }
        });

        const data = await res.json();
        
        if (res.ok && data.riad) {
          // Fill the form with the data from the database (handling nulls)
          setFormData({
            name: data.riad.name || "",
            description: data.riad.description || "",
            wifiName: data.riad.wifiName || "",
            wifiPassword: data.riad.wifiPassword || "",
            whatsappNumber: data.riad.whatsappNumber || "",
            instagramUrl: data.riad.instagramUrl || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 2. Save settings back to the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const token = Cookies.get("riadkit_token");

    try {
      const res = await fetch("http://192.168.100.53:8000/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` // Must include token again!
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update settings");
      }

      setMessage({ type: "success", text: "Settings saved successfully!" });
      
      // Hide success message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Riad Settings</h2>
        <p className="text-muted-foreground">Manage your Riad's profile and guest information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>This information will be visible to your guests on their portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {message.text && (
              <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Riad Name <span className="text-red-500">*</span></Label>
              <Input id="name" required value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Welcome Message)</Label>
              <Textarea 
                id="description" 
                placeholder="Welcome to our beautiful Riad..." 
                value={formData.description} 
                onChange={handleChange} 
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number <span className="text-red-500">*</span></Label>
                <Input id="whatsappNumber" required value={formData.whatsappNumber} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input id="instagramUrl" type="url" placeholder="https://instagram.com/..." value={formData.instagramUrl} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg mt-4">
              <div className="space-y-2">
                <Label htmlFor="wifiName">WiFi Name (SSID)</Label>
                <Input id="wifiName" value={formData.wifiName} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wifiPassword">WiFi Password</Label>
                <Input id="wifiPassword" value={formData.wifiPassword} onChange={handleChange} />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}