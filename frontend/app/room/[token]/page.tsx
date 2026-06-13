"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, Phone, Copy, Check, AlertTriangle, Menu, Sparkles, 
  Navigation, ArrowLeft, Plus, Minus, Bell, HeartHandshake 
} from "lucide-react";

interface RiadDetails {
  name: string;
  description: string;
  whatsappNumber: string;
  wifiName: string;
  wifiPassword: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: string;
}

interface Category {
  id: number;
  name: string;
  menu_items?: MenuItem[];
}

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: string | null;
  requires_quantity: boolean;
}

interface Excursion {
  id: number;
  name: string;
  description: string | null;
  price: string;
  duration: string | null;
}

export default function GuestPortal() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Navigation State: "home" | "menu" | "services" | "excursions"
  const [currentView, setCurrentView] = useState<"home" | "menu" | "services" | "excursions">("home");

  // Portal State
  const [roomNumber, setRoomNumber] = useState("");
  const [sessionStatus, setSessionStatus] = useState<"active" | "expired">("expired");
  const [riad, setRiad] = useState<RiadDetails | null>(null);

  // Database Data States
  const [menu, setMenu] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);

  // Simple quantity tracking helper for in-room services
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    const bootstrapPortal = async () => {
      try {
        const storedSessionId = Cookies.get("riadkit_session_id") || "";
        const url = `http://192.168.100.53:8000/api/guest/portal/${token}?session_id=${encodeURIComponent(storedSessionId)}`;
        
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Could not load portal.");
        }

        if (data.session_id && data.session_status === "active") {
          Cookies.set("riadkit_session_id", data.session_id, { expires: 7 });
        }

        setRoomNumber(data.room_number);
        setSessionStatus(data.session_status);
        setRiad(data.riad);
        
        setMenu(data.menu || []);
        setServices(data.services || []);
        setExcursions(data.excursions || []);

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

  const copyWifiPassword = () => {
    if (riad?.wifiPassword) {
      navigator.clipboard.writeText(riad.wifiPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQtyChange = (serviceId: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[serviceId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [serviceId]: next };
    });
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
      <div className="w-full max-w-md bg-white shadow-xl min-h-screen flex flex-col">
        
        {/* Header (Adapts dynamically if we are in a sub-view) */}
        <div className="bg-emerald-950 text-white p-6 rounded-b-3xl relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>

          {currentView !== "home" ? (
            <div>
              <Button 
                onClick={() => setCurrentView("home")} 
                variant="ghost" 
                className="text-emerald-200 hover:text-white p-0 h-auto flex gap-2 items-center hover:bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              <h1 className="text-2xl font-bold mt-3 capitalize">{currentView === 'menu' ? 'Food & Drinks' : currentView === 'services' ? 'Room Services' : 'Local Tours'}</h1>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-emerald-300 font-semibold tracking-wider uppercase">Welcome to</p>
                <h1 className="text-2xl font-bold mt-1">{riad.name}</h1>
              </div>
              <Badge variant="secondary" className="bg-emerald-800 text-emerald-100 hover:bg-emerald-800 border-none px-3 py-1 text-sm font-semibold">
                {roomNumber}
              </Badge>
            </div>
          )}
          {currentView === "home" && (
            <p className="text-sm text-emerald-200/90 mt-4 leading-relaxed line-clamp-3">
              {riad.description || "Enjoy your premium stay with us. Browse our offerings or connect with reception below."}
            </p>
          )}
        </div>

        {/* Guest Portal Dynamic View Container */}
        <div className="flex-1 p-5 space-y-6">

          {/* Sticky Token Defense checkout banner */}
          {sessionStatus === "expired" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800">Checkout Completed</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Your digital requests are now disabled. You can still browse the menus or contact reception directly on WhatsApp below.
                </p>
              </div>
            </div>
          )}

          {/* ================= HOME VIEW ================= */}
          {currentView === "home" && (
            <>
              {/* WiFi Card */}
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

              {/* Grid of Browse Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Browse Offerings</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  
                  {/* Food Menu Card */}
                  <Card onClick={() => setCurrentView("menu")} className="hover:shadow-md transition-all cursor-pointer border-emerald-50 flex items-center p-4">
                    <div className="bg-amber-100 text-amber-800 p-3 rounded-xl mr-4">
                      <Menu className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-base">Food & Drinks</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Explore local tagines, beverages, and appetizers.</p>
                    </div>
                    <Badge variant="secondary">{menu.length} sections</Badge>
                  </Card>

                  {/* Room Services Card */}
                  <Card onClick={() => setCurrentView("services")} className="hover:shadow-md transition-all cursor-pointer border-indigo-50 flex items-center p-4">
                    <div className="bg-indigo-100 text-indigo-800 p-3 rounded-xl mr-4">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-base">Room Services</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Request towels, cleaning, or general amenities.</p>
                    </div>
                    <Badge variant="secondary">{services.length} services</Badge>
                  </Card>

                  {/* Excursions Card */}
                  <Card onClick={() => setCurrentView("excursions")} className="hover:shadow-md transition-all cursor-pointer border-purple-50 flex items-center p-4">
                    <div className="bg-purple-100 text-purple-800 p-3 rounded-xl mr-4">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-base">Local Excursions</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Book quad tours, desert trips, and cooking classes.</p>
                    </div>
                    <Badge variant="secondary">{excursions.length} tours</Badge>
                  </Card>

                </div>
              </div>
            </>
          )}

          {/* ================= FOOD MENU VIEW ================= */}
          {currentView === "menu" && (
            <div className="space-y-6">
              {menu.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No menu items loaded yet.</div>
              ) : (
                menu.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <h3 className="text-sm font-bold text-emerald-800 border-b pb-1 uppercase tracking-wider">{category.name}</h3>
                    <div className="space-y-3">
                      {category.menu_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                            {item.description && <p className="text-xs text-gray-500 leading-normal">{item.description}</p>}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-emerald-700">{item.price} MAD</span>
                            {sessionStatus === "active" && (
                              <Button size="sm" variant="outline" className="h-7 text-[11px] block mt-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ================= ROOM SERVICES VIEW ================= */}
          {currentView === "services" && (
            <div className="space-y-4">
              {services.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No services loaded yet.</div>
              ) : (
                services.map((srv) => (
                  <Card key={srv.id} className="border-gray-100">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="space-y-1 pr-2">
                        <h4 className="font-bold text-gray-800 text-sm">{srv.name}</h4>
                        {srv.description && <p className="text-xs text-gray-500 leading-relaxed">{srv.description}</p>}
                        {srv.price && <Badge variant="secondary" className="text-[10px] mt-1">{srv.price} MAD</Badge>}
                      </div>

                      {sessionStatus === "active" && (
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {srv.requires_quantity ? (
                            <div className="flex items-center gap-2 border rounded-lg p-1 bg-gray-50">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="w-6 h-6 rounded-md hover:bg-white"
                                onClick={() => handleQtyChange(srv.id, -1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-xs font-bold w-4 text-center">{quantities[srv.id] || 1}</span>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="w-6 h-6 rounded-md hover:bg-white"
                                onClick={() => handleQtyChange(srv.id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : null}
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white flex gap-1 items-center h-8 text-xs">
                            <Bell className="w-3 h-3" />
                            Request
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* ================= EXCURSIONS VIEW ================= */}
          {currentView === "excursions" && (
            <div className="space-y-4">
              {excursions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No excursions loaded yet.</div>
              ) : (
                excursions.map((exc) => (
                  <Card key={exc.id} className="overflow-hidden border-gray-100">
                    <CardContent className="p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800 text-base">{exc.name}</h4>
                          <span className="text-sm font-bold text-indigo-700 shrink-0">{exc.price} MAD</span>
                        </div>
                        {exc.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{exc.description}</p>}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-dashed">
                        {exc.duration ? (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            {exc.duration}
                          </Badge>
                        ) : <div />}

                        {sessionStatus === "active" && (
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs">
                            Book Tour
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Support / Help Section (Always visible) */}
          <div className="pt-4 border-t space-y-3">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-800">Need immediate help?</h4>
              <p className="text-xs text-gray-500 mt-1">Our staff is available 24/7. Connect on WhatsApp instantly.</p>
            </div>
            
            <a 
              href={`https://wa.me/${riad.whatsappNumber}?text=Hello,%20I'm%20staying%20in%20room%20${encodeURIComponent(roomNumber)}.`} 
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