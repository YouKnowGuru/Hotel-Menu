"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Palette,
  Download,
  Printer,
  LayoutTemplate,
  Zap,
  ArrowRight,
  Star,
  Menu,
  X,
  Check,
  Layers,
  QrCode,
  Sliders,
  ShieldCheck,
  Eye,
  Coffee,
  Wine,
  CheckCircle2,
  MoveRight,
  Award,
  Building2,
  UtensilsCrossed,
} from "lucide-react";
import React, { useState } from "react";
import { AnimatedBackground } from "@/components/glass/animated-background";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { TiltCard } from "@/components/glass/tilt-card";
import { Float3D } from "@/components/glass/parallax-3d";

// Navigation Links
const navLinks = [
  { href: "#templates", label: "Hotel & Cafe Templates" },
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "How It Works" },
  { href: "#reviews", label: "Reviews" },
  { href: "#comparison", label: "Why Us" },
  { href: "/pricing", label: "Pricing" },
];

// Interactive Bhutanese Dining Concepts
type BhutanCuisine = "druk-heritage" | "paro-resort" | "thimphu-cafe" | "himalayan-momo" | "pine-lounge";

interface BhutanMenuData {
  id: BhutanCuisine;
  label: string;
  badge: string;
  icon: typeof UtensilsCrossed;
  restaurantName: string;
  tagline: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  fontHeading: string;
  footerNote: string;
  items: {
    category: string;
    dishes: {
      name: string;
      desc: string;
      price: string;
      badge?: string;
      badgeColor?: string;
    }[];
  }[];
}

const bhutanMenus: Record<BhutanCuisine, BhutanMenuData> = {
  "druk-heritage": {
    id: "druk-heritage",
    label: "Heritage Restaurant",
    badge: "Traditional Bhutanese",
    icon: UtensilsCrossed,
    restaurantName: "DRUK HERITAGE KITCHEN",
    tagline: "Authentic Bhutanese Specialties · Paro Valley Organic Produce",
    accentColor: "#d4a017",
    borderColor: "border-[#d4a017]/40",
    bgGradient: "from-[#1a0f0f] via-[#120a0a] to-[#0a0505]",
    fontHeading: "font-serif",
    footerNote: "Kuzuzangpo la · Organic Paro Red Rice included · 10% BST & 10% Service Charge Applicable",
    items: [
      {
        category: "TRADITIONAL DATSHI SPECIALTIES",
        dishes: [
          {
            name: "Ema Datshi (Chilli & Yak Cheese)",
            desc: "Local green & red hot chilies simmered in rich Himalayan cow & yak cheese",
            price: "Nu. 220",
            badge: "CHEF'S PRIDE 🌶️🌶️",
            badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
          },
          {
            name: "Shamu & Kewa Datshi",
            desc: "Wild Bhutanese forest mushrooms & tender valley potatoes in melted datshi gravy",
            price: "Nu. 240",
            badge: "VEG",
            badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          },
        ],
      },
      {
        category: "ROYAL MAINS & HIMALAYAN CURRIES",
        dishes: [
          {
            name: "Phaksha Paa (Pork with Radish)",
            desc: "Slow-braised pork belly, dried mountain red chillies, daikon radish & mountain spinach",
            price: "Nu. 380",
            badge: "BEST SELLER",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          },
          {
            name: "Jasha Maroo (Spiced Chicken)",
            desc: "Finely minced chicken simmered with fresh ginger, garlic, coriander & green onions",
            price: "Nu. 320",
          },
        ],
      },
    ],
  },
  "paro-resort": {
    id: "paro-resort",
    label: "Hotel Resort & Spa",
    badge: "5-Star Multi-Cuisine",
    icon: Building2,
    restaurantName: "THE VALLEY LODGE & SPA",
    tagline: "Fine Dining Restaurant · Continental, Indian & Bhutanese Fusion",
    accentColor: "#e8c878",
    borderColor: "border-[#e8c878]/30",
    bgGradient: "from-[#0e1626] via-[#090f1a] to-[#040810]",
    fontHeading: "font-serif",
    footerNote: "Complimentary Himalayan Spring Water · All prices in Bhutanese Ngultrum (Nu.)",
    items: [
      {
        category: "STARTERS & APPETIZERS",
        dishes: [
          {
            name: "Pan-Seared Himalayan River Trout",
            desc: "Punakha fresh river catch, garlic butter almond crust, steamed river fern (Nakay)",
            price: "Nu. 650",
            badge: "SIGNATURE",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          },
          {
            name: "Warm Hoentay Dumplings (Haa Valley)",
            desc: "Buckwheat pastry pockets filled with turnip greens, dried datshi cheese & wild caraway",
            price: "Nu. 320",
            badge: "LOCAL SPECIALTY",
            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          },
        ],
      },
      {
        category: "ENTRÉES & CONTINENTAL SELECTIONS",
        dishes: [
          {
            name: "Grilled Beef Tenderloin with Morel Jus",
            desc: "Charred root vegetables, potato gratin, Bumthang black morel reduction sauce",
            price: "Nu. 850",
            badge: "CHEF SELECTION",
            badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          },
          {
            name: "Wild Saffron Risotto with Forest Nakay",
            desc: "Arborio rice, Himalayan saffron, aged yak parmesan cheese crisps",
            price: "Nu. 520",
            badge: "VEG",
            badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          },
        ],
      },
    ],
  },
  "thimphu-cafe": {
    id: "thimphu-cafe",
    label: "Thimphu Cafe & Bakery",
    badge: "Specialty Coffee & Brunch",
    icon: Coffee,
    restaurantName: "NORZIN ROASTERS & BAKERY",
    tagline: "Artisan Coffee, Sourdough Brunch & Himalayan Teas · Thimphu City",
    accentColor: "#f59e0b",
    borderColor: "border-[#f59e0b]/30",
    bgGradient: "from-[#21150c] via-[#160d07] to-[#0c0704]",
    fontHeading: "font-sans",
    footerNote: "Free High-Speed Wi-Fi for Hotel Guests & Visitors · Norzin Lam, Thimphu",
    items: [
      {
        category: "SPECIALTY BREWS & SUJA",
        dishes: [
          {
            name: "Himalayan Spiced Suja Latte",
            desc: "Organic black tea churned with fresh local butter, pink salt & steamed velvety oat milk",
            price: "Nu. 180",
            badge: "POPULAR",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          },
          {
            name: "Double Shot Arabica Pour-Over",
            desc: "Single origin medium roast with floral notes of citrus & Himalayan honey",
            price: "Nu. 160",
          },
        ],
      },
      {
        category: "FRESH BAKES & ALL-DAY BRUNCH",
        dishes: [
          {
            name: "Yak Cheese & Sourdough Toast",
            desc: "Artisan multigrain sourdough, melted Bumthang gouda, chili flakes & micro-herbs",
            price: "Nu. 280",
            badge: "FRESH BAKE",
            badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
          },
          {
            name: "Cardamom Apple Cinnamon Roll",
            desc: "Warm flaky pastry made with fresh organic apples from Thimphu orchards",
            price: "Nu. 150",
          },
        ],
      },
    ],
  },
  "himalayan-momo": {
    id: "himalayan-momo",
    label: "Teahouse & Momo Bar",
    badge: "Himalayan Comfort",
    icon: Sparkles,
    restaurantName: "HAA VALLEY TEAHOUSE",
    tagline: "Fresh Handmade Momos, Steaming Thukpa & Traditional Snacks",
    accentColor: "#ef4444",
    borderColor: "border-[#ef4444]/30",
    bgGradient: "from-[#221010] via-[#160808] to-[#0b0404]",
    fontHeading: "font-sans",
    footerNote: "All momos served with signature fiery Ezay chilli paste & hot broth",
    items: [
      {
        category: "STEAMED & FRIED MOMOS (10 PCS)",
        dishes: [
          {
            name: "Juicy Beef & Spring Onion Momos",
            desc: "Handmade dough filled with seasoned local beef, ginger & fresh chives",
            price: "Nu. 190",
            badge: "FAVORITE",
            badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
          },
          {
            name: "Spinach, Paneer & Datshi Momos",
            desc: "Fresh garden greens, cottage cheese and traditional creamy datshi mix",
            price: "Nu. 170",
            badge: "VEG",
            badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          },
        ],
      },
      {
        category: "SOUPS & SIDES",
        dishes: [
          {
            name: "Himalayan Beef Thukpa Noodle Soup",
            desc: "Hearty bone broth, hand-pulled noodles, braised meat, bok choy & chili oil",
            price: "Nu. 220",
            badge: "WARM & SPICY",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          },
          {
            name: "Kewa Phing (Potato & Glass Noodles)",
            desc: "Thin bean vermicelli stewed with soft potatoes, garlic and mild green chili",
            price: "Nu. 180",
          },
        ],
      },
    ],
  },
  "pine-lounge": {
    id: "pine-lounge",
    label: "Hotel Bar & Lounge",
    badge: "Cocktails & Spirits",
    icon: Wine,
    restaurantName: "PINE & DRAGON LOUNGE",
    tagline: "Handcrafted Himalayan Cocktails, Local Ara & Evening Platters",
    accentColor: "#38bdf8",
    borderColor: "border-[#38bdf8]/30",
    bgGradient: "from-[#0c1924] via-[#071017] to-[#03080c]",
    fontHeading: "font-sans",
    footerNote: "Alcohol not served to individuals under 18 · Tuesday Dry Day regulations observed",
    items: [
      {
        category: "SIGNATURE HIMALAYAN ELIXIRS",
        dishes: [
          {
            name: "Warm Honey & Buttered Ara",
            desc: "Distilled local rice wine, infused with wild forest honey, egg blossom & Himalayan butter",
            price: "Nu. 280",
            badge: "LOCAL CLASSIC",
            badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          },
          {
            name: "Dragon Smokey Gin & Tonic",
            desc: "Bhutanese grain gin, muddled juniper berries, rosemary sprig, premium tonic",
            price: "Nu. 420",
          },
        ],
      },
      {
        category: "LOUNGE BITES & DRY MEAT PLATTERS",
        dishes: [
          {
            name: "Shakam Shukam Paa Bites (Dry Beef)",
            desc: "Sun-dried Himalayan beef strips wok-tossed with spicy dry red chilies and Sichuan pepper",
            price: "Nu. 380",
            badge: "SPICY BAR BITE 🌶️",
            badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
          },
          {
            name: "Crispy Fried Bhutanese Momo Basket",
            desc: "Golden-crisped momos with sweet chili dip and home-crushed Ezay salsa",
            price: "Nu. 240",
          },
        ],
      },
    ],
  },
};

// Features List
const coreFeatures = [
  {
    icon: Printer,
    title: "Press-Ready for Local Printers",
    badge: "Thimphu & Paro Ready",
    color: "from-amber-600 to-yellow-600",
    description:
      "Exact 300 DPI exports with 3mm bleed lines and crop marks calibrated for local commercial printing presses (Kuensel, KMT, and local digital print shops).",
  },
  {
    icon: LayoutTemplate,
    title: "Bhutanese & Hotel Templates",
    badge: "Heritage & Modern",
    color: "from-red-600 to-rose-700",
    description:
      "Handcrafted designs with authentic Himalayan borders, Dzongkha-inspired motifs, and refined layouts for Resorts, Teahouses, and Cafes.",
  },
  {
    icon: Palette,
    title: "Nu. (Ngultrum) & Multi-Currency",
    badge: "Auto Format",
    color: "from-blue-600 to-indigo-600",
    description:
      "Native support for Ngultrum (Nu.), Indian Rupee (₹), and US Dollar ($) for tourist-facing luxury resort menus, with automatic price alignment.",
  },
  {
    icon: QrCode,
    title: "Contactless QR Menus",
    badge: "Room & Table Sync",
    color: "from-emerald-600 to-teal-700",
    description:
      "Instant scannable QR codes for hotel guestrooms, restaurant tables, and poolside service. Update prices and specials in seconds without reprinting.",
  },
  {
    icon: ShieldCheck,
    title: "Dietary & Spice Badges",
    badge: "Bhutan Standards",
    color: "from-purple-600 to-indigo-700",
    description:
      "Pre-built labels for Vegetarian (Green Dot), Non-Veg, Mild/Hot Chilli scales (🌶️), Chef's Signature, and Organic Paro Produce.",
  },
  {
    icon: Layers,
    title: "Hotel Brand Kit & Logo Sync",
    badge: "Bespoke Branding",
    color: "from-orange-600 to-amber-700",
    description:
      "Upload your hotel or resort emblem, set your signature color scheme, and instantly apply it across breakfast, dinner, and bar menus.",
  },
];

// Curated Templates Showcase for Bhutan
const showcaseTemplates = [
  {
    name: "Druk Palace Heritage Menu",
    cuisine: "Traditional Bhutanese Fine Dining",
    paper: "A4 / 300 DPI Print Ready",
    tag: "Royal Heritage",
    cardBg: "from-amber-500/15 via-amber-500/5 to-red-500/10 dark:from-amber-950/40 dark:via-stone-900/40 dark:to-red-950/30",
    border: "border-amber-500/30 dark:border-amber-500/40",
    tagStyle: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    accentColor: "text-amber-600 dark:text-amber-400",
    dividerColor: "bg-amber-500/40",
    headline: "DRUK PALACE",
    subline: "AUTHENTIC BHUTANESE",
    sampleDish: "Ema Datshi & Paro Red Rice",
    samplePrice: "Nu. 220",
  },
  {
    name: "Paro Mountain Resort & Spa",
    cuisine: "Hotel Multi-Cuisine & Western",
    paper: "A4 / 2-Column Booklet",
    tag: "5-Star Luxury",
    cardBg: "from-sky-500/15 via-blue-500/5 to-indigo-500/10 dark:from-slate-900/60 dark:via-blue-950/40 dark:to-indigo-950/30",
    border: "border-sky-500/30 dark:border-sky-500/40",
    tagStyle: "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30",
    accentColor: "text-sky-600 dark:text-sky-400",
    dividerColor: "bg-sky-500/40",
    headline: "THE VALLEY LODGE",
    subline: "PARO RESORT & SPA",
    sampleDish: "Himalayan Trout Almondine",
    samplePrice: "Nu. 650",
  },
  {
    name: "Norzin Street Cafe & Bakery",
    cuisine: "Thimphu Specialty Coffee & Brunch",
    paper: "A5 / Table Stand",
    tag: "Urban Modern",
    cardBg: "from-orange-500/15 via-amber-500/5 to-yellow-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-stone-900/40",
    border: "border-amber-500/30 dark:border-amber-500/40",
    tagStyle: "bg-orange-500/15 text-orange-800 dark:text-amber-300 border-orange-500/30",
    accentColor: "text-orange-600 dark:text-amber-400",
    dividerColor: "bg-orange-500/40",
    headline: "NORZIN ROASTERS",
    subline: "THIMPHU SPECIALTY CAFE",
    sampleDish: "Artisan Suja Latte & Toast",
    samplePrice: "Nu. 180",
  },
  {
    name: "Himalayan Teahouse & Momo Bar",
    cuisine: "Handmade Momos & Noodle Soups",
    paper: "A4 / Single Page",
    tag: "Cultural Classic",
    cardBg: "from-rose-500/15 via-red-500/5 to-orange-500/10 dark:from-red-950/40 dark:via-rose-950/30 dark:to-stone-900/40",
    border: "border-red-500/30 dark:border-red-500/40",
    tagStyle: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30",
    accentColor: "text-rose-600 dark:text-red-400",
    dividerColor: "bg-rose-500/40",
    headline: "HAA TEAHOUSE",
    subline: "MOMOS & HOT SOUPS",
    sampleDish: "Beef Momos with Fiery Ezay",
    samplePrice: "Nu. 190",
  },
  {
    name: "Punakha Riverfront Dining",
    cuisine: "Buffet & Banquet Menus",
    paper: "A3 / Landscape Fold",
    tag: "Resort Banquet",
    cardBg: "from-emerald-500/15 via-teal-500/5 to-cyan-500/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-stone-900/40",
    border: "border-emerald-500/30 dark:border-emerald-500/40",
    tagStyle: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    dividerColor: "bg-emerald-500/40",
    headline: "PUNAKHA RESORT",
    subline: "RIVERFRONT BANQUETS",
    sampleDish: "Shakam Paa & Local Dishes",
    samplePrice: "Nu. 450",
  },
  {
    name: "Dragon Pine Bar & Cocktails",
    cuisine: "Hotel Evening Spirits & Snacks",
    paper: "A5 / Tall Card",
    tag: "Lounge Bar",
    cardBg: "from-indigo-500/15 via-purple-500/5 to-blue-500/10 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-stone-900/40",
    border: "border-indigo-500/30 dark:border-indigo-500/40",
    tagStyle: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30",
    accentColor: "text-indigo-600 dark:text-blue-400",
    dividerColor: "bg-indigo-500/40",
    headline: "PINE & DRAGON",
    subline: "HOTEL EVENING LOUNGE",
    sampleDish: "Infused Ara & Shakam Bites",
    samplePrice: "Nu. 280",
  },
];

// Workflow Steps
const workflowSteps = [
  {
    step: "01",
    title: "Choose a Bhutanese or Hotel Layout",
    description:
      "Select from verified templates created for Bhutanese heritage restaurants, Thimphu cafes, and luxury valley resorts, or start with a clean canvas.",
    icon: LayoutTemplate,
    gradient: "from-amber-600 to-yellow-600",
  },
  {
    step: "02",
    title: "Add Dishes, Prices (Nu.) & Logo",
    description:
      "Fill in your items, set prices in Ngultrum (Nu.) or USD ($), add chili spice ratings (🌶️), and upload your hotel or restaurant emblem.",
    icon: Sliders,
    gradient: "from-red-600 to-amber-600",
  },
  {
    step: "03",
    title: "Download Print PDF or Publish QR Code",
    description:
      "Export 300 DPI print-ready PDFs with standard bleed margins for local printers, or generate an instant QR code for hotel tables and room service.",
    icon: Download,
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    step: "04",
    title: "Update Anytime Without Re-Printing",
    description:
      "Seasonal ingredients changed or adding daily specials? Update prices and availability in your digital menu in real-time.",
    icon: Zap,
    gradient: "from-blue-600 to-indigo-600",
  },
];

// Comparison Matrix
const comparisonData = [
  {
    feature: "Bhutanese Ngultrum (Nu.) Auto-Formatting & Alignment",
    menuStudio: true,
    canva: "Manual Typing Only",
    word: false,
  },
  {
    feature: "Authentic Bhutanese & Himalayan Heritage Borders",
    menuStudio: true,
    canva: false,
    word: false,
  },
  {
    feature: "300 DPI CMYK Print Output with 3mm Bleed Margins",
    menuStudio: true,
    canva: "Requires Pro ($130/yr)",
    word: "Low Res / Distorts Layout",
  },
  {
    feature: "Himalayan Chilli (🌶️) & Dietary Rating Badges",
    menuStudio: true,
    canva: false,
    word: false,
  },
  {
    feature: "Dual Physical Print + Room Service Mobile QR Menu",
    menuStudio: true,
    canva: false,
    word: false,
  },
  {
    feature: "Pre-Built Traditional & Multi-Cuisine Dishes Library",
    menuStudio: true,
    canva: false,
    word: false,
  },
];

// Testimonials for the Marquee
const testimonials = [
  {
    name: "Karma Tshering",
    role: "F&B Manager",
    business: "Boutique Heritage Resort · Paro Valley",
    rating: 5,
    text: "MenuStudio is exactly what Bhutanese hotels needed. Our dining menu has both traditional Ema Datshi sets and Continental options. Printing in Thimphu was effortless because the bleed margins and 300 DPI resolution were 100% compliant.",
  },
  {
    name: "Dechen Wangmo",
    role: "Founder & Head Barista",
    business: "Mountain View Specialty Roasters · Norzin Lam, Thimphu",
    rating: 5,
    text: "We used to struggle aligning prices in Ngultrum on MS Word. With MenuStudio, we designed our seasonal coffee and brunch menu in 20 minutes. The QR code on our cafe tables lets tourists scan our menu instantly.",
  },
  {
    name: "Tashi Dorji",
    role: "General Manager",
    business: "Riverfront Resort & Banquet Hall · Punakha",
    rating: 5,
    text: "Managing breakfast, à la carte, and banquet menus across our resort was time-consuming. The Brand Kit stores our lodge logo and colors, so our team creates new menus with consistent luxury presentation every time.",
  },
  {
    name: "Sonam Pelden",
    role: "Executive Head Chef",
    business: "Pine & Dragon Hotel Lounge · Thimphu",
    rating: 5,
    text: "The ability to export press-ready PDFs with crop marks and simultaneously sync with table QR codes saved us thousands of Ngultrums in design agency fees this season alone.",
  },
  {
    name: "Pema Rinzin",
    role: "Operations Director",
    business: "Bumthang Alpine Lodge & Brewery · Jakar",
    rating: 5,
    text: "Our guests love scanning the clean mobile digital menu on their smartphones for room service. Changing seasonal beer and cheese specials takes only 10 seconds in the editor.",
  },
  {
    name: "Kinley Wangchuk",
    role: "Hospitality Lead",
    business: "Himalayan Gateway Hotel · Phuntsholing",
    rating: 5,
    text: "We operate 3 dining outlets including a banquet hall. The Multi-Cuisine Bhutan templates are stunning, authentic, and perfectly formatted for local print houses.",
  },
];

// FAQ Items
const faqs = [
  {
    question: "Can I print these menus with local printing presses in Bhutan?",
    answer:
      "Yes, absolutely. MenuStudio exports 300 DPI vector PDFs with standard 3mm bleed margins, crop marks, and safe zone guidelines compatible with commercial print houses in Thimphu, Phuntsholing, Paro, or any desktop color printer.",
  },
  {
    question: "Is Bhutanese Ngultrum (Nu.) and Indian Rupee (₹) supported?",
    answer:
      "Yes. MenuStudio natively supports Nu. (Ngultrum), ₹ (INR), and $ (USD), along with automated price column alignment and dot leader styling.",
  },
  {
    question: "How does the QR Code feature work for hotel rooms and restaurants?",
    answer:
      "Whenever you build a menu, MenuStudio generates a crisp vector QR code. You can place it on table stands or hotel room key cards. Guests can scan it with their phone to view the live mobile menu without having to download any app.",
  },
  {
    question: "Can I create menus for both Traditional Bhutanese and Western dishes?",
    answer:
      "Yes. We offer dedicated templates for traditional Druk dining (Ema Datshi, Phaksha Paa, Suja), modern cafes, buffet spreads, multi-cuisine resort dining, and hotel bars.",
  },
  {
    question: "Do I need graphic design skills or Photoshop?",
    answer:
      "No. MenuStudio is designed for hotel general managers, chefs, and restaurant owners. Everything works with intuitive visual controls and pre-formatted typography pairings.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<BhutanCuisine>("druk-heritage");
  const [showBleedGuides, setShowBleedGuides] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedCurrency, setSelectedCurrency] = useState("Nu.");
  const [marqueePaused, setMarqueePaused] = useState(false);

  const currentMenu = bhutanMenus[selectedCuisine];

  return (
    <div className="relative min-h-screen text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Atmosphere */}
      <AnimatedBackground />

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6">
        <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3 shadow-xl">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-red-600 shadow-md shadow-amber-500/20 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                MenuStudio
                <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                  BHUTAN
                </span>
              </span>
              <span className="text-[10px] text-white/60 tracking-wider font-medium">HOTEL & RESTAURANT MENU CREATOR</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/70 transition-colors hover:text-amber-400"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle variant="icon" />
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:shadow-amber-500/35 active:scale-[0.98]"
            >
              <span>Create Free Menu</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle variant="icon" />
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-strong mx-auto mt-2 max-w-7xl rounded-2xl p-6 shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <MoveRight className="h-4 w-4 text-white/30" />
                  </Link>
                ))}
                <div className="mt-2 border-t border-white/10 pt-4 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-white/70">Interface Theme</span>
                    <ThemeToggle variant="pill" />
                  </div>
                  <Link
                    href="/login"
                    className="w-full rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-white hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-red-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-amber-500/25"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Free Menu
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ===================== HERO SECTION WITH 3D FLOATING ELEMENTS ===================== */}
      <section className="relative z-10 overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        {/* === FLOATING 3D DECORATIVE ELEMENTS (always animated) === */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Floating QR Code icon */}
          <Float3D className="absolute top-[15%] left-[8%] hidden lg:block" delay={0} duration={7} floatRange={25} rotateRange={12}>
            <div className="glass rounded-2xl p-4 shadow-xl border border-white/10">
              <QrCode className="h-8 w-8 text-amber-400/70" />
            </div>
          </Float3D>

          {/* Floating Printer icon */}
          <Float3D className="absolute top-[25%] right-[6%] hidden lg:block" delay={1.5} duration={8} floatRange={30} rotateRange={10}>
            <div className="glass rounded-2xl p-4 shadow-xl border border-emerald-500/20">
              <Printer className="h-7 w-7 text-emerald-400/70" />
            </div>
          </Float3D>

          {/* Floating Sparkles */}
          <Float3D className="absolute top-[45%] left-[4%] hidden xl:block" delay={2} duration={9} floatRange={18} rotateRange={15}>
            <div className="glass rounded-full p-3 shadow-lg border border-amber-500/20">
              <Sparkles className="h-5 w-5 text-amber-300/60" />
            </div>
          </Float3D>

          {/* Floating Star */}
          <Float3D className="absolute top-[60%] right-[5%] hidden xl:block" delay={3} duration={6} floatRange={22} rotateRange={8}>
            <div className="glass rounded-full p-3 shadow-lg border border-red-500/20">
              <Star className="h-5 w-5 fill-red-400/40 text-red-400/60" />
            </div>
          </Float3D>

          {/* Floating Layout icon */}
          <Float3D className="absolute bottom-[20%] left-[10%] hidden lg:block" delay={0.5} duration={10} floatRange={20} rotateRange={10}>
            <div className="glass rounded-2xl p-3 shadow-xl border border-blue-500/20">
              <LayoutTemplate className="h-6 w-6 text-blue-400/60" />
            </div>
          </Float3D>

          {/* Floating small golden orbs */}
          <Float3D className="absolute top-[20%] left-[30%] hidden md:block" delay={1} duration={5} floatRange={35} rotateRange={20}>
            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-amber-400 to-red-500 shadow-lg shadow-amber-500/30" />
          </Float3D>
          <Float3D className="absolute top-[30%] right-[25%] hidden md:block" delay={2.5} duration={6} floatRange={28} rotateRange={25}>
            <div className="h-2 w-2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30" />
          </Float3D>
          <Float3D className="absolute bottom-[25%] right-[20%] hidden md:block" delay={4} duration={7} floatRange={20} rotateRange={15}>
            <div className="h-4 w-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/20" />
          </Float3D>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Top Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium text-amber-300 shadow-sm border border-amber-500/20">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bhutan Hospitality Suite</span>
              <span className="text-white/30">•</span>
              <span className="text-white/70">Hotels, Resorts & Cafes</span>
            </div>
          </motion.div>

          {/* Clean Professional Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-center"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl sm:leading-[1.15]">
              Menu Design Studio for{" "}
              <span className="gradient-text-gold font-extrabold">
                Bhutanese Hospitality
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base lg:text-lg text-white/70 font-normal leading-relaxed">
              Create print-ready dining menus and digital QR menus in minutes.
              Engineered with native <strong className="text-white font-medium">Ngultrum (Nu.)</strong> pricing,
              curated Himalayan typography, and calibrated <strong className="text-white font-medium">300 DPI CMYK</strong> export presets for Bhutanese printers.
            </p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/register"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:shadow-amber-500/35 sm:w-auto"
              >
                <span>Start Designing — Free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/templates"
                className="glass inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white/90 transition-all hover:border-amber-400/40 hover:text-white sm:w-auto"
              >
                <Eye className="h-4 w-4 text-amber-400" />
                <span>Browse Menu Templates</span>
              </Link>
            </motion.div>

            {/* Social Trust Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-7 flex flex-wrap items-center justify-center gap-5 text-xs text-white/60"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Nu. (Ngultrum) Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                <span>300 DPI CMYK Print Calibrated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Instant QR Mobile Sync</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ===================== HERO 3D ANIMATED CANVAS PREVIEW ===================== */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="mt-14"
            style={{ perspective: 1200 }}
          >
            {/* Cuisine Selector Bar */}
            <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-xl p-2 shadow-2xl">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/80 dark:border-white/10 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70 flex items-center gap-2">
                  <Sliders className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                  Live 3D Studio Preview • Select Hospitality Concept:
                </span>
                <div className="hidden sm:flex items-center gap-3">
                  <button
                    onClick={() => setShowBleedGuides(!showBleedGuides)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${showBleedGuides
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                      : "text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                  >
                    Print Bleed (3mm): {showBleedGuides ? "ON" : "OFF"}
                  </button>
                  <div className="flex rounded-lg border border-slate-300 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 p-0.5 text-xs">
                    {["Nu.", "₹", "$"].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setSelectedCurrency(curr)}
                        className={`px-2 py-0.5 rounded font-semibold ${selectedCurrency === curr
                          ? "bg-amber-500 text-white"
                          : "text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                          }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Concept Selector Buttons */}
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                {(Object.keys(bhutanMenus) as BhutanCuisine[]).map((key) => {
                  const item = bhutanMenus[key];
                  const Icon = item.icon;
                  const isActive = selectedCuisine === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCuisine(key)}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${isActive
                        ? "bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-lg shadow-amber-500/20 scale-[1.02]"
                        : "text-slate-700 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* === 3D AUTO-FLOATING MENU CANVAS with continuous gentle rotation === */}
            <div className="relative mx-auto mt-8 max-w-4xl" style={{ perspective: 1200 }}>
              {/* Outer Pulsing 3D Ambient Glow */}
              <motion.div
                className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-r from-amber-500/25 via-red-500/20 to-blue-500/15 blur-3xl"
                animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* The card auto-floats and gently rotates in 3D space continuously */}
              <motion.div
                animate={{
                  rotateX: [0, 2, 0, -2, 0],
                  rotateY: [0, 3, 0, -3, 0],
                  y: [0, -8, 0, -4, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="rounded-3xl p-4 sm:p-7 shadow-2xl will-change-transform border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-white/5 backdrop-blur-xl"
              >
                {/* Studio Top Toolbar Bar elevated in 3D */}
                <motion.div
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
                  className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4 text-xs text-slate-600 dark:text-white/60"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                      <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                      <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
                    </div>
                    <span className="ml-2 font-mono text-[11px] font-bold text-slate-700 dark:text-white/50">
                      MenuStudio / 3D Canvas / {currentMenu.restaurantName.toLowerCase().replace(/\s+/g, "-")}.pdf
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-medium">
                    <motion.span
                      animate={{ boxShadow: ["0 0 0px rgba(212,160,23,0)", "0 0 12px rgba(212,160,23,0.4)", "0 0 0px rgba(212,160,23,0)"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1"
                    >
                      <Printer className="h-3 w-3" />
                      300 DPI PRINT READY
                    </motion.span>
                    <motion.span
                      animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 12px rgba(16,185,129,0.4)", "0 0 0px rgba(16,185,129,0)"] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                      className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1"
                    >
                      <QrCode className="h-3 w-3" />
                      TABLE QR SYNCED
                    </motion.span>
                  </div>
                </motion.div>

                {/* The Rendered Bhutanese Menu Sheet with 3D Depth Layers */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCuisine}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
                    className={`relative overflow-hidden rounded-2xl border ${showBleedGuides ? "border-dashed border-amber-500/40" : "border-slate-200/60 dark:border-white/10"
                      } bg-gradient-to-b ${currentMenu.bgGradient} p-6 sm:p-10 shadow-inner menu-dark-card-inner`}
                  >
                    {showBleedGuides && (
                      <motion.div
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-amber-400/25 p-2"
                      >
                        <span className="absolute top-1 left-2 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(251,191,36,0.7)" }}>
                          Safe Zone Area (3mm Bleed Margin)
                        </span>
                      </motion.div>
                    )}

                    {/* Menu Header with 3D Pop */}
                    <motion.div
                      style={{ transformStyle: "preserve-3d", transform: "translateZ(35px)" }}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="text-center"
                    >
                      <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[11px] uppercase tracking-widest shadow-md" style={{ color: "rgba(255,255,255,0.9)" }}>
                        <Award className="h-3 w-3" style={{ color: currentMenu.accentColor }} />
                        {currentMenu.badge}
                      </div>

                      <h2
                        className={`text-2xl sm:text-4xl font-extrabold tracking-widest ${currentMenu.fontHeading}`}
                        style={{ color: currentMenu.accentColor }}
                      >
                        {currentMenu.restaurantName}
                      </h2>
                      <p className="mt-1 text-xs uppercase tracking-wider font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                        {currentMenu.tagline}
                      </p>

                      {/* Himalayan Motif Divider */}
                      <div className="mx-auto my-5 flex max-w-xs items-center gap-3 opacity-50">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent" />
                        <Sparkles className="h-3 w-3 text-amber-400" />
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent" />
                      </div>
                    </motion.div>

                    {/* Menu Items Grid — use inline styles throughout so no CSS class override can touch them */}
                    <div style={{ transform: "translateZ(20px)" }} className="mt-6 grid gap-8 md:grid-cols-2">
                      {currentMenu.items.map((sec, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                          <h3
                            className="border-b pb-1.5 text-xs font-extrabold uppercase tracking-wider"
                            style={{ borderColor: `${currentMenu.accentColor}60`, color: "#ffffff" }}
                          >
                            {sec.category}
                          </h3>

                          <div className="flex flex-col gap-3.5">
                            {sec.dishes.map((dish, dIdx) => (
                              <div key={dIdx} className="group relative">
                                <div className="flex items-baseline justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold transition-colors" style={{ color: "#ffffff" }}>
                                      {dish.name}
                                    </span>
                                    {dish.badge && (
                                      <span
                                        className={`rounded border px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${dish.badgeColor || "bg-white/20 border-white/30"}`}
                                        style={{ color: "#ffffff" }}
                                      >
                                        {dish.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className="font-mono text-sm font-bold shrink-0"
                                    style={{ color: currentMenu.accentColor }}
                                  >
                                    {dish.price.replace("Nu.", selectedCurrency)}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-xs leading-relaxed font-light" style={{ color: "rgba(255,255,255,0.65)" }}>
                                  {dish.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Menu Bottom Footer Note */}
                    <div style={{ transform: "translateZ(15px)", color: "rgba(255,255,255,0.5)" }} className="mt-8 flex flex-wrap items-center justify-between border-t border-white/20 pt-4 text-[11px]">
                      <span>{currentMenu.footerNote}</span>
                      <span>Print Ready • 300 DPI</span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Studio Canvas Action Bar */}
                <div
                  style={{ transform: "translateZ(25px)" }}
                  className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-white/50">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Auto-saved • Press Ready in Thimphu / Paro</span>
                  </div>

                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-amber-500/20 transition-transform hover:scale-105"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Customize This Bhutanese Menu
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== TEMPLATES SHOWCASE SECTION WITH 3D TILT ===================== */}
      <section id="templates" className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Palette className="h-3.5 w-3.5" />
                Hotel & Dining Catalog
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Ready-to-Use <span className="gradient-text-gold">Bhutan Templates</span>
              </h2>
              <p className="mt-3 max-w-xl text-base text-white/60">
                Pre-formatted layouts for traditional Druk dining, 5-star valley resorts, Thimphu cafes, and hotel lounge bars.
              </p>
            </div>

            <Link
              href="/templates"
              className="glass inline-flex items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-amber-400/40"
            >
              <span>View All Templates</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseTemplates.map((tpl, i) => (
              <TiltCard key={tpl.name} maxTilt={10} depth={20} className="h-full">
                <div
                  className={`group relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border ${tpl.border} bg-gradient-to-br ${tpl.cardBg} p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold border ${tpl.tagStyle}`}>
                        {tpl.tag}
                      </span>
                      <span className="font-mono text-slate-500 dark:text-white/60 text-[11px] font-medium">{tpl.paper}</span>
                    </div>

                    {/* Inner Mini Menu Preview Sheet */}
                    <div className="mt-5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-black/40 p-5 text-center shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:scale-[1.02]">
                      <div className="mx-auto mb-1 text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/50 font-semibold">
                        {tpl.subline}
                      </div>
                      <h4 className="text-xl font-bold tracking-wider text-slate-900 dark:text-white font-serif">
                        {tpl.headline}
                      </h4>
                      <div className={`mx-auto my-3 h-[1px] w-16 ${tpl.dividerColor}`} />
                      <div className="flex flex-col gap-2 text-left text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-800 dark:text-white/90 font-medium">• {tpl.sampleDish}</span>
                          <span className={`font-mono font-bold ${tpl.accentColor}`}>{tpl.samplePrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-white/70">• Himalayan Specialties</span>
                          <span className="font-mono text-slate-700 dark:text-white/80 font-medium">Nu. 280</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-white/70">• Teahouse Beverages</span>
                          <span className="font-mono text-slate-700 dark:text-white/80 font-medium">Nu. 60</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{tpl.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-white/50">{tpl.cuisine}</p>
                    </div>

                    <Link
                      href="/register"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES GRID SECTION WITH 3D TILT ===================== */}
      <section id="features" className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Zap className="h-3.5 w-3.5" />
              Tailored for Bhutanese Hospitality
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Purpose-Built for <span className="gradient-text-gold">Hotels, Resorts & Cafes</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 sm:text-lg">
              Designed from the ground up to solve the real everyday design and printing needs of Bhutanese restaurateurs.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <TiltCard key={feat.title} maxTilt={8} depth={15} className="h-full">
                  <div className="glass-card group relative h-full flex flex-col justify-between p-7 hover:border-amber-500/40 shadow-lg">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feat.color} shadow-md`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="glass-light rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white/80">
                          {feat.badge}
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-white/60 leading-relaxed font-light">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== 4-STEP WORKFLOW SECTION ===================== */}
      <section id="workflow" className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Zap className="h-3.5 w-3.5" />
              Simple 4-Step Process
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              From Concept to <span className="gradient-text-gold">Printed Menu</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 sm:text-lg">
              No complicated graphic software needed. Everything operates smoothly in your browser with cloud autosave.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <TiltCard key={step.step} maxTilt={8} depth={15} className="h-full">
                  <div className="glass-card relative h-full flex flex-col p-7">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-black text-amber-500/60">
                        {step.step}
                      </span>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient} shadow-md`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-2.5 text-xs text-white/60 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== INFINITE MOVING MARQUEE REVIEWS ===================== */}
      <section id="reviews" className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5 overflow-hidden">
        <div className="mx-auto max-w-7xl text-center">
          <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            Verified Hospitality Reviews
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Trusted Across <span className="gradient-text-gold">Bhutan Hospitality</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/60">
            From Paro valley boutique lodges to Thimphu coffee houses and Punakha river resorts.
          </p>
        </div>

        {/* Marquee Carousel Track */}
        <div
          className="relative mt-14 overflow-hidden py-4 cursor-grab"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
        >
          <motion.div
            className="flex gap-6 w-max"
            animate={marqueePaused ? {} : { x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 32,
                ease: "linear",
              },
            }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="glass-card flex w-[350px] sm:w-[400px] shrink-0 flex-col justify-between p-7 shadow-xl transition-transform hover:scale-[1.02]"
              >
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-red-600 text-sm font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-white/50">{t.role}</p>
                    <p className="text-[11px] text-amber-400 font-medium">{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== COMPARISON TABLE SECTION ===================== */}
      <section id="comparison" className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Specialized vs Generic
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Why Generic Tools Fail for <span className="gradient-text-gold">Bhutan Hospitality</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/60">
              See the difference between general graphic design tools and our dedicated menu studio.
            </p>
          </div>

          <div className="glass-card mt-14 overflow-hidden p-0 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="py-4 px-6 font-semibold text-white/80">Menu & Print Feature</th>
                    <th className="py-4 px-6 font-bold text-amber-400 bg-amber-500/10">MenuStudio (Bhutan)</th>
                    <th className="py-4 px-6 font-medium text-white/60">Canva</th>
                    <th className="py-4 px-6 font-medium text-white/60">MS Word</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 font-medium text-white/90">{row.feature}</td>
                      <td className="py-4 px-6 bg-amber-500/5">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Included Natively</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white/60">
                        {typeof row.canva === "boolean" ? (
                          row.canva ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <X className="h-4 w-4 text-red-400" />
                          )
                        ) : (
                          <span>{row.canva}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-white/60">
                        {typeof row.word === "boolean" ? (
                          row.word ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <X className="h-4 w-4 text-red-400" />
                          )
                        ) : (
                          <span>{row.word}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ACCORDION SECTION ===================== */}
      <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Frequently Asked <span className="gradient-text-gold">Questions</span>
            </h2>
          </div>

          <div className="mt-14 flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-card overflow-hidden p-0 transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="text-base font-bold text-white">{faq.question}</span>
                    <span className="text-amber-400 text-xl font-bold">{isOpen ? "−" : "+"}</span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/5 px-6 pb-6 pt-2"
                      >
                        <p className="text-sm text-white/60 leading-relaxed font-light">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== CALL TO ACTION ===================== */}
      <section className="relative z-10 px-4 py-28 sm:px-6 lg:px-8">
        <TiltCard maxTilt={6} depth={20} className="mx-auto max-w-5xl">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center shadow-2xl border border-white/20">
            <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Designed for Bhutan&apos;s Hospitality Community
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Upgrade Your Hotel & Restaurant Menu <br />
              <span className="gradient-text-gold">Today — For Free</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base text-white/60 sm:text-lg">
              Create your first restaurant menu in minutes.
              Export 300 DPI print-ready PDFs and generate your scannable QR code immediately.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 px-9 py-4 text-lg font-semibold text-white shadow-xl shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-amber-500/40 sm:w-auto"
              >
                <span>Create Your Menu Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/templates"
                className="glass inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-medium text-white transition-all hover:border-amber-400/40 sm:w-auto"
              >
                <span>Explore Bhutan Templates</span>
              </Link>
            </div>
          </div>
        </TiltCard>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="glass relative z-10 border-t px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-red-600 shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">MenuStudio</span>
              </Link>
              <p className="mt-4 text-xs text-white/60 leading-relaxed">
                Dedicated menu creation studio for Bhutanese hotels, heritage resorts, cafes, and dining establishments across the Kingdom of Bhutan.
              </p>
              <div className="mt-5 flex items-center gap-2 text-[11px] text-amber-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Bhutan Edition • Press Ready</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Product</h4>
              <ul className="mt-4 flex flex-col gap-2.5 text-xs text-white/60">
                <li>
                  <Link href="/templates" className="hover:text-amber-400 transition-colors">
                    Bhutanese Templates
                  </Link>
                </li>
                <li>
                  <Link href="/editor/new" className="hover:text-amber-400 transition-colors">
                    Visual Canvas Editor
                  </Link>
                </li>
                <li>
                  <Link href="/brand-kit" className="hover:text-amber-400 transition-colors">
                    Hotel Brand Kit
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-amber-400 transition-colors">
                    Pricing Plans
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Cuisine Styles</h4>
              <ul className="mt-4 flex flex-col gap-2.5 text-xs text-white/60">
                <li>
                  <Link href="/templates" className="hover:text-amber-400 transition-colors">
                    Traditional Druk Dining
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-amber-400 transition-colors">
                    Valley Resort & Spa
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-amber-400 transition-colors">
                    Thimphu City Cafes
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-amber-400 transition-colors">
                    Himalayan Teahouses & Momos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Account & Company</h4>
              <ul className="mt-4 flex flex-col gap-2.5 text-xs text-white/60">
                <li>
                  <Link href="/login" className="hover:text-amber-400 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-amber-400 transition-colors">
                    Create Free Account
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-amber-400 transition-colors">
                    About MenuStudio
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-amber-400 transition-colors">
                    Contact & Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
            <p>© {new Date().getFullYear()} MenuStudio Bhutan. Crafted for hotels, resorts & restaurants across the Kingdom.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
