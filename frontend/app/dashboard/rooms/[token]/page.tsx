"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Phone, Copy, Check, AlertTriangle, Menu, Sparkles, Navigation } from "lucide-react";

interface RiadDetails {
  name: string;
  description: string;
  whatsappNumber: string;
  wifiName: string;
  wifiPassword: string;
}

export default function GuestPortal() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Portal State
  const [roomNumber, setRoomNumber] = useState("");
  const [sessionStatus, setSessionStatus] = useState<"active" | "expired">("expired");
  const [riad, setRiad] = useState<RiadDetails | null>(null);

 useEffect(() => {
    const bootstrapPortal = async () => {
      try {
        // 1. Read the sticky session cookie (if it exists)
        const storedSessionId = Cookies.get("riadkit_session_id");

        const res = await fetch("http://192.168.100.53:8000/api/guest/bootstrap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          // 2. Pass the sticky session ID to the backend
          body: JSON.stringify({ 
            qr_token: token,
            session_id: storedSessionId ? parseInt(storedSessionId) : null
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Could not load portal.");
        }

        // 3. Save session id to cookie (Only if we got a new active one)
        if (data.session_id && data.session_status === "active") {
          Cookies.set("riadkit_session_id", data.session_id, { expires: 7 });
        }

        setRoomNumber(data.room_number);
        setSessionStatus(data.session_status);
        setRiad(data.riad);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      bootstrapPortal();
    }
  }, [token]);

  // Copy WiFi Password Helper
  const copyWifiPassword = () => {
    if (riad?.wifiPassword) {
      navigator.clipboard.writeText(riad.wifiPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-48 bg-gray-200 rounded-lg w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !riad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center p-6 border-red-200">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
          <CardDescription className="mt-2">
            {error || "We could not verify your room access. Please ask reception for assistance."}
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pb-12">
      {/* Centered Mobile Shell (Simulates native PWA container) */}
      <div className="w-full max-w-md bg-white shadow-xl min-h-screen flex flex-col">
        
        {/* Header / Brand Cover */}
        <div className="bg-emerald-950 text-white p-6 rounded-b-3xl relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-emerald-300 font-semibold tracking-wider uppercase">Welcome to</p>
              <h1 className="text-2xl font-bold mt-1">{riad.name}</h1>
            </div>
            <Badge variant="secondary" className="bg-emerald-800 text-emerald-100 hover:bg-emerald-800 border-none px-3 py-1 text-sm font-semibold">
              {roomNumber}
            </Badge>
          </div>
          <p className="text-sm text-emerald-200/90 mt-4 leading-relaxed line-clamp-3">
            {riad.description || "Enjoy your premium stay with us. Browse our services or connect with reception below."}
          </p>
        </div>

        {/* Guest Portal Content */}
        <div className="flex-1 p-5 space-y-6">

          {/* �️ Session status Banner (Visual Trap Defense) */}
          {sessionStatus === "expired" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800">Checkout Completed</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Your digital portal requests are now disabled. Feel free to use the WiFi or contact reception directly on WhatsApp below.
                </p>
              </div>
            </div>
          )}

          {/* WiFi Section */}
          {(riad.wifiName || riad.wifiPassword) && (
            <Card className="border-emerald-100 bg-emerald-50/30 overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2.5 rounded-full text-emerald-700">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">WiFi Network</h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{riad.wifiName || "Riad_Guest"}</p>
                  </div>
                </div>
                {riad.wifiPassword && (
                  <Button 
                    onClick={copyWifiPassword} 
                    variant="outline" 
                    size="sm" 
                    className="flex gap-1.5 items-center border-emerald-200 text-emerald-800 hover:bg-emerald-100/50"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Menu Services Layout */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Browse Services</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${sessionStatus === 'expired' ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <div className="bg-amber-100 text-amber-800 p-3 rounded-full">
                    <Menu className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Food Menu</span>
                </CardContent>
              </Card>

              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${sessionStatus === 'expired' ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <div className="bg-indigo-100 text-indigo-800 p-3 rounded-full">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Local Guide</span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Support / Help Section */}
          <div className="pt-4 border-t space-y-3">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-800">Need immediate help?</h4>
              <p className="text-xs text-gray-500 mt-1">Our staff is available 24/7. Connect on WhatsApp instantly.</p>
            </div>
            
            <a 
              href={`https://wa.me/${riad.whatsappNumber}?text=Hello,%20I'm%20staying%20in%20${encodeURIComponent(roomNumber)}.`} 
              target="_blank" 
              rel="noreferrer"
              className="block w-full"
            >
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2 justify-center items-center py-6 text-base rounded-xl font-bold shadow-md shadow-emerald-600/10">
                <Phone className="w-5 h-5" />
                Contact Reception
              </Button>
            </a>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 text-center border-t text-xs text-gray-400 font-medium">
          Powered by RiadKit
        </div>

      </div>
    </div>
  );
}