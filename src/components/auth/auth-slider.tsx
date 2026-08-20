"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Printer,
  QrCode,
  Palette,
  LayoutTemplate,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  ShieldCheck,
  Building2,
  Coffee,
  Wine,
} from "lucide-react";

interface SlideData {
  id: number;
  tag: string;
  tagIcon: typeof Award;
  title: string;
  subtitle: string;
  badge: string;
  quote: string;
  author: string;
  location: string;
  gradient: string;
  accentColor: string;
  preview: {
    restaurant: string;
    concept: string;
    items: { name: string; price: string; badge?: string }[];
    footerNote: string;
  };
}

const slides: SlideData[] = [
  {
    id: 0,
    tag: "Bhutan Hospitality Suite",
    tagIcon: Building2,
    title: "Press-Ready Menus for Bhutan's Premier Hotels & Resorts",
    subtitle:
      "Design luxury dining cards with 300 DPI CMYK vector exports and native Ngultrum (Nu.) currency alignment.",
    badge: "300 DPI CMYK Ready",
    quote:
      "MenuStudio transformed how we update our seasonal tasting menus across our resort dining rooms.",
    author: "Karma Tshering",
    location: "Heritage Boutique Resort · Paro Valley",
    gradient: "from-amber-500/20 via-red-500/10 to-transparent",
    accentColor: "#d4a017",
    preview: {
      restaurant: "DRUK HERITAGE KITCHEN",
      concept: "Paro Valley Organic Produce · Heritage Dining",
      items: [
        { name: "Ema Datshi (Yak Cheese & Chili)", price: "Nu. 220", badge: "🌶️🌶️ SIGNATURE" },
        { name: "Phaksha Paa (Slow-Braised Pork)", price: "Nu. 380", badge: "BEST SELLER" },
        { name: "Pan-Seared Himalayan River Trout", price: "Nu. 650" },
      ],
      footerNote: "Organic Paro Red Rice included · 10% BST Applicable",
    },
  },
  {
    id: 1,
    tag: "Guest Experience",
    tagIcon: QrCode,
    title: "Instant Contactless QR Menus for Hotel Rooms & Tables",
    subtitle:
      "Generate high-resolution vector QR codes synced directly to responsive mobile menus for in-room service.",
    badge: "Room Service Sync",
    quote:
      "Our hotel guests love scanning the clean digital menu on their phones for poolside ordering.",
    author: "Tashi Dorji",
    location: "Riverfront Resort & Banquet Hall · Punakha",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    accentColor: "#10b981",
    preview: {
      restaurant: "PUNAKHA RESORT & SPA",
      concept: "Contactless In-Room Dining & Poolside Bar",
      items: [
        { name: "Himalayan Herbal Tea & Honey", price: "Nu. 120", badge: "WELLNESS" },
        { name: "Handmade Beef & Chive Momos (10)", price: "Nu. 190", badge: "HOT" },
        { name: "Yak Cheese & Sourdough Club", price: "Nu. 280" },
      ],
      footerNote: "Room Service Dial Ext. 104 · 24/7 Service",
    },
  },
  {
    id: 2,
    tag: "Design Library",
    tagIcon: LayoutTemplate,
    title: "45+ Handcrafted Templates for Every Dining Concept",
    subtitle:
      "From traditional Himalayan teahouses to Thimphu specialty cafes and evening cocktail lounges.",
    badge: "45+ Curated Layouts",
    quote:
      "We designed our entire specialty coffee, brunch, and bakery menu in under 20 minutes.",
    author: "Dechen Wangmo",
    location: "Mountain View Specialty Roasters · Thimphu",
    gradient: "from-amber-600/20 via-orange-500/10 to-transparent",
    accentColor: "#f59e0b",
    preview: {
      restaurant: "NORZIN ROASTERS & BAKERY",
      concept: "Single Origin Brews · Sourdough Brunch · Thimphu",
      items: [
        { name: "Himalayan Spiced Suja Latte", price: "Nu. 180", badge: "POPULAR" },
        { name: "Double Shot Arabica Pour-Over", price: "Nu. 160" },
        { name: "Cardamom & Apple Morning Bun", price: "Nu. 150", badge: "FRESH BAKE" },
      ],
      footerNote: "Norzin Lam, Thimphu · Free Guest Wi-Fi",
    },
  },
  {
    id: 3,
    tag: "Brand Identity",
    tagIcon: Palette,
    title: "Hotel Brand Kit with Custom Crest & Color Sync",
    subtitle:
      "Save your resort logo, heritage borders, and custom fonts to apply your signature aesthetic in 1 click.",
    badge: "1-Click Brand Apply",
    quote:
      "Maintaining brand consistency across breakfast, dinner, and bar cards is completely seamless.",
    author: "Sonam Pelden",
    location: "Pine & Dragon Hotel Lounge · Thimphu",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    accentColor: "#38bdf8",
    preview: {
      restaurant: "PINE & DRAGON LOUNGE",
      concept: "Artisanal Cocktails & Dry Meat Platters",
      items: [
        { name: "Warm Honey & Buttered Ara", price: "Nu. 280", badge: "LOCAL CLASSIC" },
        { name: "Dragon Smokey Gin & Tonic", price: "Nu. 420" },
        { name: "Shakam Shukam Paa (Dry Beef)", price: "Nu. 380", badge: "🌶️ SPICY" },
      ],
      footerNote: "Evening Lounge · Tuesdays Dry Day Observed",
    },
  },
];

export function AuthSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = slides[current];
  const TagIcon = slide.tagIcon;

  return (
    <div
      className="relative hidden h-full w-full flex-col justify-between overflow-hidden p-10 lg:flex"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Glow Gradient */}
      <motion.div
        key={`bg-${slide.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 -z-10 bg-gradient-to-br ${slide.gradient}`}
      />

      {/* Top Header Badge */}
      <div className="flex items-center justify-between">
        <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
          <TagIcon className="h-3.5 w-3.5" style={{ color: slide.accentColor }} />
          <span>{slide.tag}</span>
        </div>

        <div className="glass-light rounded-full px-3 py-1 text-[11px] font-medium text-white/60">
          <span className="text-amber-400 font-bold">0{slide.id + 1}</span> / 0{slides.length}
        </div>
      </div>

      {/* Main Slide Content Showcase */}
      <div className="my-auto py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            {/* Headline and Subhead */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white xl:text-3xl leading-snug">
                {slide.title}
              </h2>
              <p className="mt-2 text-sm text-white/60 leading-relaxed font-light">
                {slide.subtitle}
              </p>
            </div>

            {/* Menu Mockup Card */}
            <div className="glass-strong relative overflow-hidden rounded-2xl p-6 shadow-2xl border border-white/15">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" style={{ color: slide.accentColor }} />
                  <span className="font-bold tracking-wide text-white">
                    {slide.preview.restaurant}
                  </span>
                </div>
                <span
                  className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    borderColor: `${slide.accentColor}50`,
                    backgroundColor: `${slide.accentColor}15`,
                    color: slide.accentColor,
                  }}
                >
                  {slide.badge}
                </span>
              </div>

              <p className="mt-2 text-[11px] uppercase tracking-wider text-white/50">
                {slide.preview.concept}
              </p>

              {/* Items List */}
              <div className="mt-4 flex flex-col gap-2.5">
                {slide.preview.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white/90">{item.name}</span>
                      {item.badge && (
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-white shrink-0" style={{ color: slide.accentColor }}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/40 font-mono">
                <span>{slide.preview.footerNote}</span>
                <span>Press Ready • 300 DPI</span>
              </div>
            </div>

            {/* Hotelier Testimonial Quote */}
            <div className="glass rounded-xl p-4 border-l-4 border-amber-400">
              <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-white/80 italic leading-relaxed">
                &ldquo;{slide.quote}&rdquo;
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-white">{slide.author}</span>
                <span className="text-white/50">{slide.location}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls (Pagination Dots + Navigation Arrows) */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        {/* Interactive Dots */}
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx
                  ? "w-7 bg-amber-400 shadow-md shadow-amber-400/40"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            aria-label="Next slide"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
