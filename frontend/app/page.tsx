"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  House,
  Check,
  Clock,
  Shield,
  QrCode,
  ClipboardList,
  Mountain,
  ChartColumn,
  UserPlus,
  Smartphone,
  Bell,
  Star,
  Wifi,
  Utensils,
  MapPinned,
  MessageCircle,
  Settings,
  ChevronRight,
  Globe,
  Camera,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

const riadImages = [
  "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200&q=85",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85",
  "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=1200&q=85",
  "https://images.unsplash.com/photo-1590496799619-e1f9e1f7f6f1?w=1200&q=85",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85",
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=85",
  "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200&q=85",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=85",
  "https://images.unsplash.com/photo-1611892440504-42b792e24e2f?w=1200&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85",
];

const pricingPlans = [
  {
    name: "Starter",
    price: "149",
    desc: "Perfect for small riads getting started.",
    features: ["Up to 8 rooms", "Basic guest portal", "Request management", "Email support"],
  },
  {
    name: "Professional",
    price: "299",
    desc: "For growing riads that need more power.",
    features: ["Up to 25 rooms", "Full guest portal", "Revenue analytics", "Staff accounts", "WhatsApp integration", "Priority support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "599",
    desc: "For large properties and multi-riad groups.",
    features: ["Unlimited rooms", "White-label branding", "API access", "Dedicated manager", "Custom integrations", "24/7 phone support"],
  },
];

const testimonials = [
  {
    name: "Youssef O.",
    riad: "Riad Jardin Secret",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    quote: "RiadKit transformed our guest experience. Orders went up 40% in the first month and our staff saves hours every day.",
  },
  {
    name: "Amina K.",
    riad: "Riad Dar Zaynab",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    quote: "The QR code system is genius. Guests love the convenience and we love the real-time dashboard. A must-have for any riad.",
  },
  {
    name: "Hassan M.",
    riad: "Riad Atlas Chic",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    quote: "Setup took less than a day. Our reception team was up and running immediately. The analytics alone are worth it.",
  },
];

const benefits = [
  { icon: Wifi, title: "WiFi Management", desc: "Share credentials automatically at check-in." },
  { icon: Utensils, title: "Menu & Dining", desc: "Digital menus with real-time availability." },
  { icon: MapPinned, title: "Local Excursions", desc: "Curated tours and activities guests can book." },
  { icon: MessageCircle, title: "Guest Messaging", desc: "Two-way chat for requests and questions." },
  { icon: ChartColumn, title: "Revenue Analytics", desc: "Track performance with beautiful dashboards." },
  { icon: Globe, title: "Multi-language", desc: "French, Arabic, and English interfaces." },
  { icon: Settings, title: "Smart Automation", desc: "Auto-checkout, reminders, and follow-ups." },
  { icon: Star, title: "Guest Reviews", desc: "Collect and manage reviews effortlessly." },
];

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">
      {/* ──────── NAVBAR ──────── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[1280px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#EEE6DD] h-[72px] md:h-[88px] px-6 md:px-10">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-7 h-7">
              <Image src="/riadkitlogo.png" alt="RiadKit" fill className="object-contain" />
            </div>
            <span className="font-heading text-xl font-semibold text-[#2B2B2B]">RiadKit</span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {["Features", "How It Works", "Pricing", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={item === "Features" ? "#features" : item === "How It Works" ? "#how-it-works" : item === "Pricing" ? "#pricing" : `#${item.toLowerCase()}`}
                className="text-sm text-[#666666] hover:text-[#A63D40] transition-colors font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-[#666666] hover:text-[#A63D40] transition-colors px-4 py-2">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-[#A63D40] hover:bg-[#943236] px-6 py-2.5 rounded-full transition-all active:scale-[0.97]"
            >
              Start Free Trial
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#666666]">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#EEE6DD] pb-6 pt-4 space-y-3 px-2 rounded-b-2xl">
            {["Features", "How It Works", "Pricing", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className="block text-sm text-[#666666] py-1.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <hr className="border-[#EEE6DD] my-2" />
            <Link href="/login" className="block text-sm font-semibold text-[#A63D40] py-1.5" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link href="/register" className="block text-center text-sm font-semibold text-white bg-[#A63D40] px-6 py-2.5 rounded-full" onClick={() => setMobileMenuOpen(false)}>Start Free Trial</Link>
          </div>
        )}
      </nav>

      {/* ──────── HERO ──────── */}
      <section className="min-h-[850px] pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-[45%_55%] gap-8 md:gap-16 items-center">
            {/* Left */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#E9D8C5]/60 text-[#A63D40] text-xs font-semibold px-4 py-2 rounded-full border border-[#EEE6DD]">
                <House className="w-3.5 h-3.5" strokeWidth={2.5} />
                Digital platform for Moroccan Riads
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-[72px] font-semibold leading-[1.1] lg:leading-[80px] text-[#2B2B2B] tracking-tight">
                Transform every stay into an{" "}
                <span className="text-[#A63D40]">unforgettable</span>{" "}
                experience.
              </h1>

              <p className="text-[18px] text-[#666666] leading-relaxed max-w-lg">
                The all-in-one platform for Moroccan riads. Let guests order, explore, and connect from their phone — while you manage everything from a powerful dashboard.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-[#A63D40] hover:bg-[#943236] text-white font-semibold text-base px-7 py-3.5 rounded-full transition-all active:scale-[1.03] shadow-lg shadow-[#A63D40]/20"
                >
                  Start Free Trial
                  <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 border-2 border-[#EEE6DD] hover:border-[#A63D40]/30 text-[#2B2B2B] font-semibold text-base px-7 py-3.5 rounded-full transition-all"
                >
                  Book a Demo
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { icon: Check, text: "Setup in 5 minutes" },
                  { icon: Clock, text: "No credit card" },
                  { icon: Shield, text: "Cancel anytime" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#666666]">
                    <item.icon className="w-4 h-4 text-[#A63D40]" strokeWidth={2} />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Device mockups */}
            <div className="relative mt-8 md:mt-0">
              <div className="relative">
                {/* Background riad courtyard blur */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <img src={riadImages[5]} alt="" className="w-full h-full object-cover opacity-20 scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5]/40 to-[#FAF8F5]/10" />
                </div>

                {/* MacBook */}
                <div className="relative z-10 animate-float">
                  <div className="bg-[#1C1C1C] rounded-t-2xl pt-3 px-3 pb-0 shadow-2xl max-w-[560px] mx-auto">
                    <div className="flex items-center gap-1.5 mb-3 px-1">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="bg-white rounded-lg overflow-hidden">
                      <img src={riadImages[6]} alt="RiadKit Dashboard" className="w-full h-auto" />
                    </div>
                  </div>
                  <div className="bg-[#D4D4D4] h-4 rounded-b-2xl mx-auto max-w-[560px] shadow-2xl" />
                </div>

                {/* Phone 1 - Guest portal */}
                <div className="absolute -right-2 md:-right-8 top-12 z-20 animate-float-delayed">
                  <div className="w-[160px] md:w-[200px] bg-white rounded-[24px] p-2 shadow-2xl border border-[#EEE6DD]">
                    <div className="bg-gradient-to-b from-[#A63D40]/10 to-white rounded-[18px] overflow-hidden">
                      <img src={riadImages[3]} alt="Guest Portal" className="w-full h-20 md:h-24 object-cover" />
                      <div className="p-2 space-y-1.5">
                        {["Menu", "Services", "Excursions", "Contact"].map((label, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-[#FAF8F5] rounded-lg px-2 py-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-[#A63D40]" : "bg-[#E9D8C5]"}`} />
                            <span className="text-[9px] md:text-[10px] text-[#666666] font-medium">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone 2 - Excursions */}
                <div className="absolute -left-2 md:-left-8 bottom-0 z-20">
                  <div className="w-[140px] md:w-[180px] bg-white rounded-[24px] p-2 shadow-2xl border border-[#EEE6DD]">
                    <div className="rounded-[18px] overflow-hidden space-y-2">
                      <div className="relative">
                        <img src={riadImages[8]} alt="Excursions" className="w-full h-16 md:h-20 object-cover rounded-lg" />
                        <div className="absolute bottom-1 left-1 bg-white/90 rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-[#2B2B2B] flex items-center gap-0.5">
                          <Star className="w-2 h-2 text-[#A63D40]" fill="#A63D40" /> 4.8
                        </div>
                      </div>
                      <div className="px-1 pb-1">
                        <p className="text-[9px] font-semibold text-[#2B2B2B]">Atlas Mountains</p>
                        <p className="text-[8px] text-[#666666]">from 450 MAD</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR code stand card */}
                <div className="absolute -right-4 md:right-0 bottom-4 z-30">
                  <div className="w-[100px] md:w-[120px] bg-white rounded-xl p-3 shadow-xl border border-[#EEE6DD] rotate-6">
                    <div className="bg-white border-2 border-[#EEE6DD] rounded-lg p-2 flex flex-col items-center gap-1">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2B2B2B] rounded-lg flex items-center justify-center">
                        <QrCode className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="text-[7px] text-[#666666] font-medium text-center leading-tight">Scan to discover services</span>
                    </div>
                  </div>
                </div>

                {/* Soft shadow under everything */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-gradient-to-r from-transparent via-[#A63D40]/10 to-transparent blur-2xl rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── TRUST SECTION ──────── */}
      <FadeInSection>
        <section className="py-16 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <p className="text-center text-sm font-semibold text-[#666666] uppercase tracking-widest mb-10">
              Trusted by Riads across Morocco
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-[#999999]">
              {["Riad Jardin Secret", "Riad Atlas Chic", "Riad Dar Zaynab", "Riad L'Orient", "Riad Bahia", "Riad El Fenn"].map((name, i) => (
                <div key={i} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                  <House className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm font-medium tracking-wide whitespace-nowrap">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ──────── FEATURES ──────── */}
      <FadeInSection>
        <section id="features" className="py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-[48px] font-semibold text-[#2B2B2B] mb-4 leading-tight">
                Everything you need to run your riad
              </h2>
              <p className="text-[18px] text-[#666666] leading-relaxed">
                From guest check-in to checkout — one platform handles it all.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: QrCode, title: "QR Code Access", desc: "Guests scan to access the full portal instantly. No app download needed." },
                { icon: ClipboardList, title: "Smart Requests", desc: "Food, service, or excursion requests — all organized in one real-time feed." },
                { icon: Mountain, title: "Excursions & Tours", desc: "Curate and offer local experiences. Guests book with one tap." },
                { icon: ChartColumn, title: "Revenue Analytics", desc: "Beautiful dashboards with daily revenue, trends, and exportable reports." },
              ].map((f, i) => (
                <div key={i} className="group bg-white rounded-3xl border border-[#EEE6DD] p-8 hover:shadow-lg hover:shadow-[#A63D40]/5 hover:border-[#A63D40]/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-[#FAF8F5] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#A63D40]/5 transition-colors">
                    <f.icon className="w-7 h-7 text-[#A63D40]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2B2B2B] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ──────── HOW IT WORKS ──────── */}
      <FadeInSection>
        <section id="how-it-works" className="py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-[48px] font-semibold text-[#2B2B2B] mb-4 leading-tight">
                Get started in minutes
              </h2>
              <p className="text-[18px] text-[#666666] leading-relaxed">
                Four simple steps to transform your riad experience.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 md:gap-12 relative">
              {[
                { icon: UserPlus, title: "Create Account", desc: "Sign up and set up your riad profile in under 2 minutes." },
                { icon: QrCode, title: "Generate QR Codes", desc: "Create unique QR codes for each room. Print and place them." },
                { icon: Smartphone, title: "Guests Scan", desc: "Guests scan with their phone camera. No app installation needed." },
                { icon: Bell, title: "Receive Requests", desc: "Orders and requests appear instantly on your dashboard." },
              ].map((s, i) => (
                <div key={i} className="relative text-center">
                  <div className="relative mb-6 inline-block">
                    <div className="w-20 h-20 bg-white rounded-2xl border border-[#EEE6DD] shadow-sm flex items-center justify-center mx-auto">
                      <s.icon className="w-8 h-8 text-[#A63D40]" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#A63D40] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-[#2B2B2B] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed max-w-[220px] mx-auto">{s.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[calc(100%+1.5rem)] h-px border-t-2 border-dashed border-[#E9D8C5]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ──────── BENEFITS ──────── */}
      <FadeInSection>
        <section className="py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-[48px] font-semibold text-[#2B2B2B] mb-4 leading-tight">
                  Everything your riad needs
                </h2>
                <p className="text-[18px] text-[#666666] leading-relaxed mb-10">
                  Powerful features designed specifically for Moroccan hospitality.
                </p>
                <div className="space-y-6">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-[#FAF8F5] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#A63D40]/5 transition-colors">
                        <b.icon className="w-4.5 h-4.5 text-[#A63D40]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#2B2B2B]">{b.title}</h4>
                        <p className="text-sm text-[#666666]">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#A63D40]/10">
                  <img src={riadImages[4]} alt="Luxury riad entrance" className="w-full h-[500px] md:h-[600px] object-cover hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/20 to-transparent" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#E9D8C5]/50 rounded-full blur-3xl -z-10" />
                <div className="absolute -top-4 -right-4 w-40 h-40 bg-[#A63D40]/10 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ──────── TESTIMONIALS ──────── */}
      <FadeInSection>
        <section className="py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-[48px] font-semibold text-[#2B2B2B] mb-4 leading-tight">
                Trusted by riad owners
              </h2>
              <p className="text-[18px] text-[#666666] leading-relaxed">
                See what our customers have to say.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className={`bg-white rounded-3xl border border-[#EEE6DD] p-8 hover:shadow-lg hover:shadow-[#A63D40]/5 hover:border-[#A63D40]/20 transition-all duration-300 hover:-translate-y-1 ${i === 1 ? "md:scale-105 shadow-md" : ""}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-[#2B2B2B]">{t.name}</p>
                      <p className="text-xs text-[#666666]">{t.riad}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-[#A63D40]" fill="#A63D40" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="text-sm text-[#666666] leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ──────── PRICING ──────── */}
      <FadeInSection>
        <section id="pricing" className="py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-[48px] font-semibold text-[#2B2B2B] mb-4 leading-tight">
                Simple, transparent pricing
              </h2>
              <p className="text-[18px] text-[#666666] leading-relaxed">
                No hidden fees. No surprises.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    plan.popular
                      ? "border-[#A63D40] shadow-lg shadow-[#A63D40]/10 relative"
                      : "border-[#EEE6DD] hover:border-[#A63D40]/20"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A63D40] text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-[#2B2B2B] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[#666666] mb-5">{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-[#2B2B2B]">{plan.price}</span>
                    <span className="text-sm text-[#666666]">MAD / month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-[#666666]">
                        <Check className="w-4 h-4 text-[#A63D40] mt-0.5 shrink-0" strokeWidth={2.5} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block text-center font-semibold text-sm px-6 py-3 rounded-full transition-all active:scale-[0.98] ${
                      plan.popular
                        ? "bg-[#A63D40] hover:bg-[#943236] text-white shadow-md"
                        : "bg-[#FAF8F5] hover:bg-[#E9D8C5] text-[#2B2B2B] border border-[#EEE6DD]"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ──────── FINAL CTA ──────── */}
      <FadeInSection>
        <section className="py-16 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="relative h-auto md:h-[320px] bg-gradient-to-br from-[#A63D40] via-[#943236] to-[#A63D40] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-12 md:py-0">
              {/* Geometric pattern overlay */}
              <div className="absolute inset-0 opacity-[0.04]">
                <div className="w-full h-full" style={{
                  backgroundImage: "radial-gradient(circle at 25% 50%, #FFFFFF 1px, transparent 1px), radial-gradient(circle at 75% 50%, #FFFFFF 1px, transparent 1px)",
                  backgroundSize: "40px 40px"
                }} />
              </div>

              <div className="relative z-10 text-center md:text-left max-w-xl">
                <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white mb-3 leading-tight">
                  Ready to modernize your riad?
                </h2>
                <p className="text-[#E9D8C5] text-[18px] leading-relaxed">
                  Join riads across Morocco and transform your guest experience today.
                </p>
              </div>

              <div className="relative z-10 text-center md:text-right mt-6 md:mt-0">
                <Link
                  href="/register"
                  className="inline-block bg-white text-[#A63D40] font-semibold text-base px-8 py-3.5 rounded-full hover:bg-[#FAF8F5] transition-all active:scale-[1.03] shadow-lg"
                >
                  Start Free Trial
                </Link>
                <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-4">
                  {["No credit card", "14-day free trial", "Cancel anytime"].map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs text-[#E9D8C5]">
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ──────── FOOTER ──────── */}
      <footer className="bg-white border-t border-[#EEE6DD] pt-16 pb-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-6 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="relative w-6 h-6">
                  <Image src="/riadkitlogo.png" alt="RiadKit" fill className="object-contain" />
                </div>
                <span className="font-heading text-lg font-semibold text-[#2B2B2B]">RiadKit</span>
              </Link>
              <p className="text-sm text-[#666666] leading-relaxed mb-5 max-w-xs">
                The guest experience platform for Moroccan riads. Transform every stay into an unforgettable experience.
              </p>
              <div className="flex items-center gap-3">
                {[
                { icon: Camera },
                { icon: Globe },
                { icon: ExternalLink },
              ].map(({ icon: Icon }, i) => (
                  <a key={i} href="#" className="w-9 h-9 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[#666666] hover:bg-[#A63D40] hover:text-white transition-all">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Product", links: ["Features", "Pricing", "Roadmap"] },
              { title: "Resources", links: ["Blog", "Help Center", "Documentation"] },
              { title: "Company", links: ["About", "Contact", "Partners"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-[#2B2B2B] mb-4">{col.title}</h4>
                <div className="space-y-3">
                  {col.links.map((link, j) => (
                    <a key={j} href="#" className="block text-sm text-[#666666] hover:text-[#A63D40] transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EEE6DD] pt-6 text-center text-sm text-[#999999]">
            &copy; {new Date().getFullYear()} RiadKit. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
