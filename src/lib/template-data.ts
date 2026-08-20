export interface TemplatePreviewData {
  bg: string;
  title: string;
  accent: string;
  text: string;
  items: { n: string; p: string }[];
}

export interface TemplateCanvasData {
  [key: string]: {
    name: string;
    description: string;
    category: string;
    style: string;
    orientation: string;
    paperSize: string;
    isPremium: boolean;
    tags: string[];
    gradient: string;
    preview?: TemplatePreviewData;
    canvasData: {
      version: string;
      objects: Record<string, unknown>[];
      background: string;
    };
  };
}

/* ─────────────────────────────────────────────────────────────── */
/*  BASE TEMPLATES — Crisp, Elegant, Non-glowing Typography        */
/* ─────────────────────────────────────────────────────────────── */

const BASE: TemplateCanvasData = {

  /* ============================================================
     1.  MINIMAL ELEGANCE — Deep Midnight Indigo Gradient
     ============================================================ */
  "tpl-minimal": {
    name: "Minimal Elegance",
    description: "Ultra-modern midnight indigo gradient with champagne gold hairlines and platinum typography",
    category: "minimal",
    style: "minimalist",
    orientation: "portrait",
    paperSize: "A4",
    isPremium: false,
    tags: ["clean", "modern", "elegant", "fine-dining", "gradient"],
    gradient: "from-indigo-950 via-slate-900 to-black",
    preview: {
      bg: "#130f26",
      title: "#f8fafc",
      accent: "#d4af37",
      text: "#cbd5e1",
      items: [
        { n: "French Onion Velouté", p: "$14" },
        { n: "Seared Hokkaido Scallops", p: "$22" },
        { n: "Wild Turbot & Champagne", p: "$38" },
        { n: "Prime Filet Mignon 8oz", p: "$48" },
        { n: "Madagascar Vanilla Soufflé", p: "$16" },
      ],
    },
    canvasData: {
      version: "7.0.0",
      background: "#130f26",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 794,
          height: 1123,
          fill: {
            type: "linear",
            coords: { x1: 0, y1: 0, x2: 794, y2: 1123 },
            colorStops: [
              { offset: 0, color: "#221947" },
              { offset: 0.5, color: "#130f26" },
              { offset: 1, color: "#06040e" },
            ],
          },
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        },
        { type: "rect", left: 36, top: 36, width: 722, height: 1051, fill: "transparent", stroke: "#d4af37", strokeWidth: 1.5, strokeUniform: true, originX: "left", originY: "top", selectable: false },
        { type: "rect", left: 44, top: 44, width: 706, height: 1035, fill: "transparent", stroke: "#312659", strokeWidth: 0.75, strokeUniform: true, originX: "left", originY: "top", selectable: false },

        { type: "text", text: "LA MAISON", left: 397, top: 75, fontFamily: "Playfair Display", fontSize: 46, fontWeight: "700", fill: "#f8fafc", textAlign: "center", originX: "center", charSpacing: 180 },
        { type: "text", text: "FINE DINING & SOMMELIER · EST. 2024", left: 397, top: 132, fontFamily: "Inter", fontSize: 11, fontWeight: "500", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 380 },
        { type: "line", x1: 290, y1: 165, x2: 504, y2: 165, stroke: "#d4af37", strokeWidth: 1.5, selectable: false },

        { type: "text", text: "STARTERS & RAW BAR", left: 397, top: 205, fontFamily: "Playfair Display", fontSize: 15, fontWeight: "700", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 250 },
        { type: "text", text: "French Onion Velouté", left: 130, top: 245, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc", originX: "left" },
        { type: "text", text: "caramelized shallots, gruyère foam, aged brioche crouton", left: 130, top: 267, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$14", left: 664, top: 245, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Seared Hokkaido Scallops", left: 130, top: 298, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc", originX: "left" },
        { type: "text", text: "cauliflower mousseline, golden raisin caper emulsion", left: 130, top: 320, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$22", left: 664, top: 298, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Bluefin Tuna Tartare", left: 130, top: 351, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc", originX: "left" },
        { type: "text", text: "avocado purée, ponzu gelée, oscietra caviar cracker", left: 130, top: 373, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$26", left: 664, top: 351, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "line", x1: 130, y1: 410, x2: 664, y2: 410, stroke: "#312659", strokeWidth: 0.75, selectable: false },

        { type: "text", text: "MAIN COURSES", left: 397, top: 438, fontFamily: "Playfair Display", fontSize: 15, fontWeight: "700", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 250 },
        { type: "text", text: "Wild Turbot & Champagne Cream", left: 130, top: 478, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc", originX: "left" },
        { type: "text", text: "braised leeks, saffron potato confit, sea herbs", left: 130, top: 500, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$38", left: 664, top: 478, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Prime Filet Mignon 8oz", left: 130, top: 531, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc", originX: "left" },
        { type: "text", text: "truffle potato purée, glazed baby carrots, périgueux sauce", left: 130, top: 553, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$48", left: 664, top: 531, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Crispy Roasted Duck Breast", left: 130, top: 584, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc", originX: "left" },
        { type: "text", text: "blood orange reduction, parsnip cream, roasted figs", left: 130, top: 606, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$36", left: 664, top: 584, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "line", x1: 130, y1: 645, x2: 664, y2: 645, stroke: "#312659", strokeWidth: 0.75, selectable: false },

        { type: "text", text: "DESSERTS & DIGESTIFS", left: 397, top: 675, fontFamily: "Playfair Display", fontSize: 15, fontWeight: "700", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 250 },
        { type: "text", text: "Madagascar Vanilla Bean Soufflé", left: 130, top: 715, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc", originX: "left" },
        { type: "text", text: "served with warm dark chocolate ganache and clotted cream", left: 130, top: 737, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$16", left: 664, top: 715, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Valrhona Chocolate Sphere", left: 130, top: 768, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc", originX: "left" },
        { type: "text", text: "passion fruit curd, hazelnut praline, salted caramel", left: 130, top: 790, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$18", left: 664, top: 768, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Executive Chef Jean-Luc Dupont · Tasting menu available upon request", left: 397, top: 1060, fontFamily: "Inter", fontSize: 10, fontWeight: "400", fill: "#64748b", textAlign: "center", originX: "center" },
      ],
    },
  },

  /* ============================================================
     2.  RUSTIC CHARM — Deep Smoked Espresso to Ember Gradient
     ============================================================ */
  "tpl-rustic": {
    name: "Rustic Charm",
    description: "Deep artisan espresso and caramel ember gradient with warm amber gold typography",
    category: "rustic",
    style: "classic",
    orientation: "portrait",
    paperSize: "A4",
    isPremium: false,
    tags: ["warm", "cozy", "cafe", "bakery", "artisan", "gradient"],
    gradient: "from-amber-950 via-stone-900 to-black",
    preview: {
      bg: "#1d1007",
      title: "#fef3c7",
      accent: "#d97706",
      text: "#d1a884",
      items: [
        { n: "Single Origin Cortado", p: "$4.50" },
        { n: "Honey Cardamom Latte", p: "$5.50" },
        { n: "Butter Almond Croissant", p: "$4.75" },
        { n: "Heirloom Sourdough Melt", p: "$14.00" },
        { n: "Smoked Salmon Tartine", p: "$16.50" },
      ],
    },
    canvasData: {
      version: "7.0.0",
      background: "#1d1007",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 794,
          height: 1123,
          fill: {
            type: "linear",
            coords: { x1: 0, y1: 0, x2: 794, y2: 1123 },
            colorStops: [
              { offset: 0, color: "#311a0c" },
              { offset: 0.5, color: "#1d1007" },
              { offset: 1, color: "#0a0502" },
            ],
          },
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        },
        { type: "rect", left: 36, top: 36, width: 722, height: 1051, fill: "transparent", stroke: "#d97706", strokeWidth: 1.5, strokeUniform: true, originX: "left", originY: "top", selectable: false },
        { type: "rect", left: 44, top: 44, width: 706, height: 1035, fill: "transparent", stroke: "#452511", strokeWidth: 0.75, strokeUniform: true, originX: "left", originY: "top", selectable: false },

        { type: "text", text: "THE DAILY BREAD", left: 397, top: 72, fontFamily: "Playfair Display", fontSize: 44, fontWeight: "700", fill: "#fef3c7", textAlign: "center", originX: "center" },
        { type: "text", text: "ARTISAN BAKERY & COFFEE ROASTERS · EST. 2018", left: 397, top: 128, fontFamily: "Montserrat", fontSize: 12, fontWeight: "600", fill: "#d97706", textAlign: "center", originX: "center", charSpacing: 320 },
        { type: "line", x1: 250, y1: 160, x2: 544, y2: 160, stroke: "#d97706", strokeWidth: 2, selectable: false },

        { type: "text", text: "SPECIALTY COFFEE & BREWS", left: 397, top: 200, fontFamily: "Montserrat", fontSize: 15, fontWeight: "700", fill: "#d97706", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Single Origin Cortado", left: 140, top: 240, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "double ristretto, steamed oat or whole milk", left: 140, top: 260, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$4.50", left: 654, top: 240, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "text", text: "Honey Cardamom Latte", left: 140, top: 290, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "wild mountain honey, freshly ground green cardamom", left: 140, top: 310, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$5.50", left: 654, top: 290, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "text", text: "Nitro Cold Brew", left: 140, top: 340, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "steeped 24 hours, velvety cascading nitrogen foam", left: 140, top: 360, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$5.00", left: 654, top: 340, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "line", x1: 140, y1: 395, x2: 654, y2: 395, stroke: "#452511", strokeWidth: 1, selectable: false },

        { type: "text", text: "HEARTH PASTRIES & SWEETS", left: 397, top: 425, fontFamily: "Montserrat", fontSize: 15, fontWeight: "700", fill: "#d97706", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Butter Almond Croissant", left: 140, top: 465, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "twice baked with frangipane and toasted sliced almonds", left: 140, top: 485, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$4.75", left: 654, top: 465, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "text", text: "Pistachio Raspberry Cruffin", left: 140, top: 515, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "croissant muffin stuffed with pistachio ganache & coulis", left: 140, top: 535, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$5.25", left: 654, top: 515, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "line", x1: 140, y1: 570, x2: 654, y2: 570, stroke: "#452511", strokeWidth: 1, selectable: false },

        { type: "text", text: "ARTISANAL SOURDOUGH KITCHEN", left: 397, top: 600, fontFamily: "Montserrat", fontSize: 15, fontWeight: "700", fill: "#d97706", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Heirloom Sourdough Melt", left: 140, top: 640, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "aged cheddar, gruyère, braised caramelized onions, dijon", left: 140, top: 660, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$14.00", left: 654, top: 640, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "text", text: "Smoked Salmon Tartine", left: 140, top: 690, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "whipped herb cream cheese, pickled shallots, fried capers", left: 140, top: 710, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$16.50", left: 654, top: 690, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "text", text: "All bread naturally leavened with our 7-year wild starter · Baked fresh at dawn", left: 397, top: 1060, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#785338", textAlign: "center", originX: "center", fontStyle: "italic" },
      ],
    },
  },

  /* ============================================================
     3.  MODERN DARK — Cyber Noir Cosmic Purple-Black Gradient
     ============================================================ */
  "tpl-dark": {
    name: "Modern Dark",
    description: "Sleek velvet obsidian and cosmic violet gradient with refined champagne gold typography",
    category: "dark",
    style: "contemporary",
    orientation: "portrait",
    paperSize: "A4",
    isPremium: true,
    tags: ["dark", "modern", "sleek", "cocktails", "steakhouse", "gradient"],
    gradient: "from-purple-950 via-slate-900 to-black",
    preview: {
      bg: "#0c0a1a",
      title: "#ffffff",
      accent: "#d4af37",
      text: "#cbd5e1",
      items: [
        { n: "Bluefin Tuna Tartare", p: "$26" },
        { n: "Wagyu Beef Carpaccio", p: "$28" },
        { n: "Dry-Aged Tomahawk 32oz", p: "$120" },
        { n: "Maine Lobster Risotto", p: "$48" },
        { n: "70% Valrhona Dark Fondant", p: "$18" },
      ],
    },
    canvasData: {
      version: "7.0.0",
      background: "#0c0a1a",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 794,
          height: 1123,
          fill: {
            type: "linear",
            coords: { x1: 0, y1: 0, x2: 794, y2: 1123 },
            colorStops: [
              { offset: 0, color: "#1c1438" },
              { offset: 0.5, color: "#0c0a1a" },
              { offset: 1, color: "#030208" },
            ],
          },
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        },
        { type: "rect", left: 36, top: 36, width: 722, height: 1051, fill: "transparent", stroke: "#d4af37", strokeWidth: 1.5, strokeUniform: true, originX: "left", originY: "top", selectable: false },
        { type: "rect", left: 44, top: 44, width: 706, height: 1035, fill: "transparent", stroke: "#2e2052", strokeWidth: 0.75, strokeUniform: true, originX: "left", originY: "top", selectable: false },

        { type: "text", text: "NOIR", left: 397, top: 75, fontFamily: "Playfair Display", fontSize: 62, fontWeight: "700", fill: "#ffffff", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "SUPPER CLUB & COCKTAIL LOUNGE", left: 397, top: 148, fontFamily: "Inter", fontSize: 12, fontWeight: "600", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 420 },
        { type: "line", x1: 290, y1: 185, x2: 504, y2: 185, stroke: "#d4af37", strokeWidth: 1.5, selectable: false },

        { type: "text", text: "RAW & FIRST COURSES", left: 397, top: 225, fontFamily: "Inter", fontSize: 14, fontWeight: "700", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 300 },
        { type: "text", text: "Bluefin Tuna Tartare", left: 130, top: 265, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#ffffff", originX: "left" },
        { type: "text", text: "yuzu kosho, avocado mousse, puffed black rice crisp", left: 130, top: 287, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$26", left: 664, top: 265, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Wagyu Beef Carpaccio", left: 130, top: 318, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#ffffff", originX: "left" },
        { type: "text", text: "black winter truffle, pickled shallots, 24-month parmesan", left: 130, top: 340, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$28", left: 664, top: 318, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "line", x1: 130, y1: 380, x2: 664, y2: 380, stroke: "#2e2052", strokeWidth: 1, selectable: false },

        { type: "text", text: "PRIME CUTS & WOOD-FIRED", left: 397, top: 410, fontFamily: "Inter", fontSize: 14, fontWeight: "700", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 300 },
        { type: "text", text: "Dry-Aged Tomahawk 32oz (For Two)", left: 130, top: 450, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#ffffff", originX: "left" },
        { type: "text", text: "45-day dry aged, bone marrow butter, smoked sea salt", left: 130, top: 472, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$120", left: 664, top: 450, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Maine Lobster Risotto", left: 130, top: 503, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#ffffff", originX: "left" },
        { type: "text", text: "butter-poached lobster tail, saffron carnaroli, bisque emulsion", left: 130, top: 525, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$48", left: 664, top: 503, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "A5 Miyazaki Wagyu Striploin 6oz", left: 130, top: 556, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#ffffff", originX: "left" },
        { type: "text", text: "fresh wasabi, smoked soy glaze, wild maitake mushrooms", left: 130, top: 578, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$95", left: 664, top: 556, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "line", x1: 130, y1: 615, x2: 664, y2: 615, stroke: "#2e2052", strokeWidth: 1, selectable: false },

        { type: "text", text: "DECADE DESSERTS & SPIRITS", left: 397, top: 645, fontFamily: "Inter", fontSize: 14, fontWeight: "700", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 300 },
        { type: "text", text: "70% Valrhona Dark Chocolate Fondant", left: 130, top: 685, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#ffffff", originX: "left" },
        { type: "text", text: "bourbon vanilla gelato, gold leaf, hazelnut praline", left: 130, top: 707, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$18", left: 664, top: 685, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Smoked Old Fashioned", left: 130, top: 738, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#ffffff", originX: "left" },
        { type: "text", text: "rye whiskey, charred orange bitters, cherrywood smoke", left: 130, top: 760, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#94a3b8", originX: "left" },
        { type: "text", text: "$20", left: 664, top: 738, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Please notify your server of any food allergies · Service charge of 10% included", left: 397, top: 1060, fontFamily: "Inter", fontSize: 10, fontWeight: "400", fill: "#64748b", textAlign: "center", originX: "center" },
      ],
    },
  },

  /* ============================================================
     4.  FRESH & GREEN — Deep Rainforest Emerald to Teal Gradient
     ============================================================ */
  "tpl-fresh": {
    name: "Fresh & Green",
    description: "Deep rainforest emerald to midnight teal gradient with fresh organic botanical styling",
    category: "modern",
    style: "clean",
    orientation: "portrait",
    paperSize: "A4",
    isPremium: false,
    tags: ["fresh", "organic", "healthy", "botanical", "farm-to-table", "gradient"],
    gradient: "from-emerald-950 via-teal-950 to-black",
    preview: {
      bg: "#072418",
      title: "#f0fdf4",
      accent: "#10b981",
      text: "#a7f3d0",
      items: [
        { n: "Superfood Green Bowl", p: "$16" },
        { n: "Wild Salmon Poke Bowl", p: "$22" },
        { n: "Avocado Hemp Tartine", p: "$14" },
        { n: "Cold-Pressed Detox Tonic", p: "$9" },
        { n: "Raw Matcha Cashew Tart", p: "$11" },
      ],
    },
    canvasData: {
      version: "7.0.0",
      background: "#072418",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 794,
          height: 1123,
          fill: {
            type: "linear",
            coords: { x1: 0, y1: 0, x2: 794, y2: 1123 },
            colorStops: [
              { offset: 0, color: "#0c3b28" },
              { offset: 0.5, color: "#072418" },
              { offset: 1, color: "#020d08" },
            ],
          },
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        },
        { type: "rect", left: 36, top: 36, width: 722, height: 1051, fill: "transparent", stroke: "#10b981", strokeWidth: 1.5, strokeUniform: true, originX: "left", originY: "top", selectable: false },
        { type: "rect", left: 44, top: 44, width: 706, height: 1035, fill: "transparent", stroke: "#134e38", strokeWidth: 0.75, strokeUniform: true, originX: "left", originY: "top", selectable: false },

        { type: "text", text: "BOTANICA", left: 397, top: 72, fontFamily: "Montserrat", fontSize: 46, fontWeight: "700", fill: "#f0fdf4", textAlign: "center", originX: "center", charSpacing: 180 },
        { type: "text", text: "ORGANIC FARM-TO-TABLE & WELLNESS", left: 397, top: 128, fontFamily: "Inter", fontSize: 12, fontWeight: "600", fill: "#10b981", textAlign: "center", originX: "center", charSpacing: 320 },
        { type: "line", x1: 270, y1: 160, x2: 524, y2: 160, stroke: "#10b981", strokeWidth: 2, selectable: false },

        { type: "text", text: "HARVEST BOWLS & GREENS", left: 397, top: 200, fontFamily: "Montserrat", fontSize: 15, fontWeight: "700", fill: "#10b981", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Superfood Green Bowl", left: 140, top: 240, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f0fdf4" },
        { type: "text", text: "organic kale, quinoa, avocado, edamame, green tahini dressing", left: 140, top: 260, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#6ee7b7" },
        { type: "text", text: "$16", left: 654, top: 240, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#10b981", originX: "right" },

        { type: "text", text: "Wild Salmon Poke Bowl", left: 140, top: 290, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f0fdf4" },
        { type: "text", text: "sustainable salmon, brown rice, wakame, cucumber, ponzu", left: 140, top: 310, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#6ee7b7" },
        { type: "text", text: "$22", left: 654, top: 290, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#10b981", originX: "right" },

        { type: "line", x1: 140, y1: 360, x2: 654, y2: 360, stroke: "#134e38", strokeWidth: 1, selectable: false },

        { type: "text", text: "ARTISAN TARTINES & MAINS", left: 397, top: 390, fontFamily: "Montserrat", fontSize: 15, fontWeight: "700", fill: "#10b981", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Avocado Hemp Tartine", left: 140, top: 430, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f0fdf4" },
        { type: "text", text: "seeded sourdough, pickled radishes, hemp hearts, chili flakes", left: 140, top: 450, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#6ee7b7" },
        { type: "text", text: "$14", left: 654, top: 430, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#10b981", originX: "right" },

        { type: "text", text: "Herb Roasted Rainbow Trout", left: 140, top: 480, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f0fdf4" },
        { type: "text", text: "steamed asparagus, lemon dill vinaigrette, sweet pea purée", left: 140, top: 500, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#6ee7b7" },
        { type: "text", text: "$28", left: 654, top: 480, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#10b981", originX: "right" },

        { type: "line", x1: 140, y1: 550, x2: 654, y2: 550, stroke: "#134e38", strokeWidth: 1, selectable: false },

        { type: "text", text: "COLD-PRESSED TONICS & RAW DESSERTS", left: 397, top: 580, fontFamily: "Montserrat", fontSize: 15, fontWeight: "700", fill: "#10b981", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Cold-Pressed Green Detox Tonic", left: 140, top: 620, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f0fdf4" },
        { type: "text", text: "celery, cucumber, green apple, lemon, organic ginger", left: 140, top: 640, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#6ee7b7" },
        { type: "text", text: "$9", left: 654, top: 620, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#10b981", originX: "right" },

        { type: "text", text: "Raw Matcha Cashew Tart", left: 140, top: 670, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f0fdf4" },
        { type: "text", text: "almond date crust, ceremonial grade matcha, coconut cream", left: 140, top: 690, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#6ee7b7" },
        { type: "text", text: "$11", left: 654, top: 670, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#10b981", originX: "right" },

        { type: "text", text: "100% Certified Organic · Non-GMO · Zero refined sugars · Locally harvested", left: 397, top: 1060, fontFamily: "Inter", fontSize: 11, fontWeight: "500", fill: "#059669", textAlign: "center", originX: "center" },
      ],
    },
  },

  /* ============================================================
     5.  ROYAL GOLD — Imperial Palace Jade to Obsidian Gradient
     ============================================================ */
  "tpl-royal": {
    name: "Royal Gold",
    description: "Imperial dark jade velvet gradient with pure 24K gold accents and royal Bhutanese delicacies",
    category: "luxury",
    style: "ornate",
    orientation: "portrait",
    paperSize: "A4",
    isPremium: true,
    tags: ["luxury", "gold", "royal", "bhutanese", "palace", "gradient"],
    gradient: "from-emerald-950 via-neutral-900 to-black",
    preview: {
      bg: "#071f18",
      title: "#f8fafc",
      accent: "#d4af37",
      text: "#e2e8f0",
      items: [
        { n: "Royal Ema Datshi with Yak Cheese", p: "Nu. 380" },
        { n: "Phaksha Paa with Mountain Radish", p: "Nu. 480" },
        { n: "Saffron Himalayan Steamed Trout", p: "Nu. 650" },
        { n: "Shakam Paa Dried Beef Delicacy", p: "Nu. 520" },
        { n: "Warm Saffron Honey Rice Pudding", p: "Nu. 280" },
      ],
    },
    canvasData: {
      version: "7.0.0",
      background: "#071f18",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 794,
          height: 1123,
          fill: {
            type: "linear",
            coords: { x1: 0, y1: 0, x2: 794, y2: 1123 },
            colorStops: [
              { offset: 0, color: "#0c352a" },
              { offset: 0.5, color: "#071f18" },
              { offset: 1, color: "#020a08" },
            ],
          },
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        },
        { type: "rect", left: 36, top: 36, width: 722, height: 1051, fill: "transparent", stroke: "#d4af37", strokeWidth: 2, strokeUniform: true, originX: "left", originY: "top", selectable: false },
        { type: "rect", left: 44, top: 44, width: 706, height: 1035, fill: "transparent", stroke: "#ca8a04", strokeWidth: 0.75, strokeUniform: true, originX: "left", originY: "top", selectable: false },

        // 4 Corner diamonds
        { type: "rect", left: 36, top: 36, width: 12, height: 12, fill: "#d4af37", angle: 45, originX: "center", originY: "center" },
        { type: "rect", left: 758, top: 36, width: 12, height: 12, fill: "#d4af37", angle: 45, originX: "center", originY: "center" },
        { type: "rect", left: 36, top: 1087, width: 12, height: 12, fill: "#d4af37", angle: 45, originX: "center", originY: "center" },
        { type: "rect", left: 758, top: 1087, width: 12, height: 12, fill: "#d4af37", angle: 45, originX: "center", originY: "center" },

        { type: "text", text: "THE GOLDEN PALACE", left: 397, top: 75, fontFamily: "Playfair Display", fontSize: 44, fontWeight: "700", fill: "#f8fafc", textAlign: "center", originX: "center", charSpacing: 180 },
        { type: "text", text: "ROYAL BHUTANESE & HIMALAYAN BANQUET", left: 397, top: 135, fontFamily: "Inter", fontSize: 12, fontWeight: "600", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 380 },
        { type: "line", x1: 270, y1: 170, x2: 524, y2: 170, stroke: "#d4af37", strokeWidth: 1.5, selectable: false },

        { type: "text", text: "ROYAL HERITAGE STARTERS", left: 397, top: 210, fontFamily: "Playfair Display", fontSize: 15, fontWeight: "700", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 250 },
        { type: "text", text: "Kewa Datshi & Wild Mushroom Crostini", left: 130, top: 250, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc" },
        { type: "text", text: "organic Himalayan potatoes, artisanal cheese, chanterelles", left: 130, top: 272, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#cbd5e1" },
        { type: "text", text: "Nu. 280", left: 664, top: 250, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Steamed Yak Cheese Momos (6 pcs)", left: 130, top: 303, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc" },
        { type: "text", text: "handmade dough, aged yak cheese, fiery ezay chili dip", left: 130, top: 325, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#cbd5e1" },
        { type: "text", text: "Nu. 320", left: 664, top: 303, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "line", x1: 130, y1: 375, x2: 664, y2: 375, stroke: "#14483b", strokeWidth: 1, selectable: false },

        { type: "text", text: "IMPERIAL PALACE MAINS", left: 397, top: 405, fontFamily: "Playfair Display", fontSize: 15, fontWeight: "700", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 250 },
        { type: "text", text: "Royal Ema Datshi with Bumthang Yak Cheese", left: 130, top: 445, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc" },
        { type: "text", text: "organic mountain chili peppers simmered in royal Bhutanese cheese sauce", left: 130, top: 467, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#cbd5e1" },
        { type: "text", text: "Nu. 380", left: 664, top: 445, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Phaksha Paa with Mountain Radish", left: 130, top: 498, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc" },
        { type: "text", text: "succulent pork belly braised with sun-dried red chilies and radishes", left: 130, top: 520, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#cbd5e1" },
        { type: "text", text: "Nu. 480", left: 664, top: 498, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Saffron Himalayan Steamed Trout", left: 130, top: 551, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc" },
        { type: "text", text: "fresh Haa valley trout, mountain herbs, local butter, saffron broth", left: 130, top: 573, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#cbd5e1" },
        { type: "text", text: "Nu. 650", left: 664, top: 551, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "line", x1: 130, y1: 620, x2: 664, y2: 620, stroke: "#14483b", strokeWidth: 1, selectable: false },

        { type: "text", text: "HIMALAYAN SWEETS & BUTTER TEA", left: 397, top: 650, fontFamily: "Playfair Display", fontSize: 15, fontWeight: "700", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 250 },
        { type: "text", text: "Warm Saffron Honey Rice Pudding (Zow Shungo)", left: 130, top: 690, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc" },
        { type: "text", text: "organic red rice, mountain clover honey, cardamom, roasted walnuts", left: 130, top: 712, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#cbd5e1" },
        { type: "text", text: "Nu. 280", left: 664, top: 690, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Traditional Suja (Butter Tea with Roasted Rice)", left: 130, top: 743, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#f8fafc" },
        { type: "text", text: "churned tea leaves, organic butter, Himalayan salt, crispy zaw", left: 130, top: 765, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#cbd5e1" },
        { type: "text", text: "Nu. 150", left: 664, top: 743, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Prepared according to ancient Bhutanese culinary traditions · All ingredients locally sourced", left: 397, top: 1060, fontFamily: "Inter", fontSize: 10, fontWeight: "400", fill: "#ca8a04", textAlign: "center", originX: "center" },
      ],
    },
  },

  /* ============================================================
     6.  CAFÉ VELVET — Dark Mocha to Roasted Hazelnut Gradient
     ============================================================ */
  "tpl-cafe": {
    name: "Cafe Latte",
    description: "Dark roast velvet mocha gradient with warm crema gold and cinnamon highlights",
    category: "cafe",
    style: "modern",
    orientation: "portrait",
    paperSize: "A4",
    isPremium: false,
    tags: ["cafe", "coffee", "pastry", "breakfast", "gradient"],
    gradient: "from-amber-950 via-yellow-950 to-black",
    preview: {
      bg: "#1c0f08",
      title: "#fef3c7",
      accent: "#d97706",
      text: "#d1a884",
      items: [
        { n: "Spanish Caramel Latte", p: "$5.75" },
        { n: "Pistachio Rose Flat White", p: "$5.50" },
        { n: "Pain au Chocolat & Berries", p: "$4.50" },
        { n: "Truffle Mushroom Brioche", p: "$14.50" },
        { n: "Tiramisu Crepe Cake", p: "$9.00" },
      ],
    },
    canvasData: {
      version: "7.0.0",
      background: "#1c0f08",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 794,
          height: 1123,
          fill: {
            type: "linear",
            coords: { x1: 0, y1: 0, x2: 794, y2: 1123 },
            colorStops: [
              { offset: 0, color: "#2e180d" },
              { offset: 0.5, color: "#1c0f08" },
              { offset: 1, color: "#080402" },
            ],
          },
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        },
        { type: "rect", left: 36, top: 36, width: 722, height: 1051, fill: "transparent", stroke: "#d97706", strokeWidth: 1.5, strokeUniform: true, originX: "left", originY: "top", selectable: false },
        { type: "rect", left: 44, top: 44, width: 706, height: 1035, fill: "transparent", stroke: "#452210", strokeWidth: 0.75, strokeUniform: true, originX: "left", originY: "top", selectable: false },

        { type: "text", text: "CAFÉ VELVET", left: 397, top: 72, fontFamily: "Playfair Display", fontSize: 44, fontWeight: "700", fill: "#fef3c7", textAlign: "center", originX: "center" },
        { type: "text", text: "SPECIALTY ROASTS & ARTISAN BRIOCHE", left: 397, top: 128, fontFamily: "Inter", fontSize: 12, fontWeight: "600", fill: "#d97706", textAlign: "center", originX: "center", charSpacing: 320 },
        { type: "line", x1: 270, y1: 160, x2: 524, y2: 160, stroke: "#d97706", strokeWidth: 2, selectable: false },

        { type: "text", text: "SIGNATURE ESPRESSO", left: 397, top: 200, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d97706", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Spanish Caramel Latte", left: 140, top: 240, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "espresso, condensed milk, sea salt caramel, cinnamon dust", left: 140, top: 260, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$5.75", left: 654, top: 240, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "text", text: "Pistachio Rose Flat White", left: 140, top: 290, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "housemade pistachio milk, double shot, crushed rose petals", left: 140, top: 310, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$5.50", left: 654, top: 290, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "line", x1: 140, y1: 360, x2: 654, y2: 360, stroke: "#452210", strokeWidth: 1, selectable: false },

        { type: "text", text: "GOURMET BRIOCHE & BRUNCH", left: 397, top: 390, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d97706", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Truffle Mushroom Brioche", left: 140, top: 430, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "toasted brioche, roasted wild mushrooms, poached egg, truffle aioli", left: 140, top: 450, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$14.50", left: 654, top: 430, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "text", text: "Tiramisu Crepe Cake", left: 140, top: 480, fontFamily: "Inter", fontSize: 15, fontWeight: "600", fill: "#fef3c7" },
        { type: "text", text: "20 delicate crepes, espresso mascarpone cream, cocoa powder", left: 140, top: 500, fontFamily: "Inter", fontSize: 11, fontWeight: "400", fill: "#a88160" },
        { type: "text", text: "$9.00", left: 654, top: 480, fontFamily: "Inter", fontSize: 15, fontWeight: "700", fill: "#d97706", originX: "right" },

        { type: "text", text: "Roasted in-house weekly · Dairy-free oat and almond milk available on request", left: 397, top: 1060, fontFamily: "Inter", fontSize: 10, fontWeight: "400", fill: "#785338", textAlign: "center", originX: "center" },
      ],
    },
  },

  /* ============================================================
     7.  ELEGANT SCRIPT — Haute Plum to Velvet Amethyst Gradient
     ============================================================ */
  "tpl-elegant": {
    name: "Elegant Script",
    description: "Haute couture velvet amethyst to deep plum gradient with rose gold typography",
    category: "elegant",
    style: "script",
    orientation: "portrait",
    paperSize: "A4",
    isPremium: false,
    tags: ["elegant", "script", "romantic", "french", "gradient"],
    gradient: "from-purple-950 via-rose-950 to-black",
    preview: {
      bg: "#1b0d20",
      title: "#fdf2f8",
      accent: "#e879a0",
      text: "#e2c4d8",
      items: [
        { n: "Burrata & Heirloom Figs", p: "$16" },
        { n: "Seared Duck Breast & Cherry", p: "$34" },
        { n: "Chilean Sea Bass", p: "$38" },
        { n: "Rose Water Panna Cotta", p: "$14" },
        { n: "Pistachio Mousse Dome", p: "$16" },
      ],
    },
    canvasData: {
      version: "7.0.0",
      background: "#1b0d20",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 794,
          height: 1123,
          fill: {
            type: "linear",
            coords: { x1: 0, y1: 0, x2: 794, y2: 1123 },
            colorStops: [
              { offset: 0, color: "#2d1336" },
              { offset: 0.5, color: "#1b0d20" },
              { offset: 1, color: "#08030b" },
            ],
          },
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        },
        { type: "rect", left: 36, top: 36, width: 722, height: 1051, fill: "transparent", stroke: "#e879a0", strokeWidth: 1.5, strokeUniform: true, originX: "left", originY: "top", selectable: false },
        { type: "rect", left: 44, top: 44, width: 706, height: 1035, fill: "transparent", stroke: "#4a1c58", strokeWidth: 0.75, strokeUniform: true, originX: "left", originY: "top", selectable: false },

        { type: "text", text: "L'ATELIER GOURMET", left: 397, top: 72, fontFamily: "Cormorant Garamond", fontSize: 46, fontWeight: "700", fill: "#fdf2f8", textAlign: "center", originX: "center", charSpacing: 180 },
        { type: "text", text: "SEASONAL DEGUSTATION & PATISSERIE", left: 397, top: 128, fontFamily: "Inter", fontSize: 12, fontWeight: "500", fill: "#e879a0", textAlign: "center", originX: "center", charSpacing: 340 },
        { type: "line", x1: 280, y1: 160, x2: 514, y2: 160, stroke: "#e879a0", strokeWidth: 1.5, selectable: false },

        { type: "text", text: "PREMIÈRE COURSES", left: 397, top: 200, fontFamily: "Cormorant Garamond", fontSize: 16, fontWeight: "700", fill: "#e879a0", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Burrata & Heirloom Figs", left: 140, top: 240, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fdf2f8" },
        { type: "text", text: "caramelized mission figs, aged balsamic glaze, wild arugula", left: 140, top: 260, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#c084fc" },
        { type: "text", text: "$16", left: 654, top: 240, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#e879a0", originX: "right" },

        { type: "text", text: "Seared Duck Breast & Cherry Reduction", left: 140, top: 290, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fdf2f8" },
        { type: "text", text: "celeriac purée, baby glazed beets, morello cherry jus", left: 140, top: 310, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#c084fc" },
        { type: "text", text: "$34", left: 654, top: 290, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#e879a0", originX: "right" },

        { type: "line", x1: 140, y1: 360, x2: 654, y2: 360, stroke: "#4a1c58", strokeWidth: 1, selectable: false },

        { type: "text", text: "PATISSERIE & DESSERT", left: 397, top: 390, fontFamily: "Cormorant Garamond", fontSize: 16, fontWeight: "700", fill: "#e879a0", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Rose Water Panna Cotta", left: 140, top: 430, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fdf2f8" },
        { type: "text", text: "candied rose petals, raspberry coulis, edible gold leaf", left: 140, top: 450, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#c084fc" },
        { type: "text", text: "$14", left: 654, top: 430, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#e879a0", originX: "right" },

        { type: "text", text: "Pistachio Mousse Dome", left: 140, top: 480, fontFamily: "Lora", fontSize: 15, fontWeight: "600", fill: "#fdf2f8" },
        { type: "text", text: "Sicilian pistachio core, white chocolate velvet shell", left: 140, top: 500, fontFamily: "Lora", fontSize: 11, fontWeight: "400", fill: "#c084fc" },
        { type: "text", text: "$16", left: 654, top: 480, fontFamily: "Lora", fontSize: 15, fontWeight: "700", fill: "#e879a0", originX: "right" },

        { type: "text", text: "Handcrafted daily by Chef de Pâtisserie · 100% French Valrhona cocoa", left: 397, top: 1060, fontFamily: "Lora", fontSize: 10, fontWeight: "400", fill: "#9333ea", textAlign: "center", originX: "center" },
      ],
    },
  },

  /* ============================================================
     8.  HOTEL CLASSIC — Midnight Sapphire to Deep Ocean Gradient
     ============================================================ */
  "tpl-hotel": {
    name: "Hotel Classic",
    description: "5-Star midnight sapphire to deep ocean navy gradient with platinum gold dual crest framing",
    category: "hotel",
    style: "formal",
    orientation: "portrait",
    paperSize: "A4",
    isPremium: true,
    tags: ["hotel", "formal", "resort", "5-star", "luxury", "gradient"],
    gradient: "from-blue-950 via-slate-900 to-black",
    preview: {
      bg: "#0b1736",
      title: "#ffffff",
      accent: "#d4af37",
      text: "#cbd5e1",
      items: [
        { n: "Grand Himalayan Breakfast", p: "Nu. 650" },
        { n: "Eggs Benedict with Royal Trout", p: "Nu. 550" },
        { n: "Grilled Angus Ribeye 10oz", p: "Nu. 1,200" },
        { n: "Pan-Seared Mountain Sea Bass", p: "Nu. 980" },
        { n: "Valrhona Chocolate Molten Tart", p: "Nu. 380" },
      ],
    },
    canvasData: {
      version: "7.0.0",
      background: "#0b1736",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 794,
          height: 1123,
          fill: {
            type: "linear",
            coords: { x1: 0, y1: 0, x2: 794, y2: 1123 },
            colorStops: [
              { offset: 0, color: "#14285a" },
              { offset: 0.5, color: "#0b1736" },
              { offset: 1, color: "#030612" },
            ],
          },
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        },
        { type: "rect", left: 36, top: 36, width: 722, height: 1051, fill: "transparent", stroke: "#d4af37", strokeWidth: 2, strokeUniform: true, originX: "left", originY: "top", selectable: false },
        { type: "rect", left: 44, top: 44, width: 706, height: 1035, fill: "transparent", stroke: "#1e3a8a", strokeWidth: 0.75, strokeUniform: true, originX: "left", originY: "top", selectable: false },

        { type: "text", text: "THE GRAND HIMALAYAN", left: 397, top: 72, fontFamily: "Oswald", fontSize: 46, fontWeight: "500", fill: "#ffffff", textAlign: "center", originX: "center", charSpacing: 180 },
        { type: "text", text: "RESORT & SPA · ALL-DAY DINING", left: 397, top: 128, fontFamily: "Raleway", fontSize: 13, fontWeight: "600", fill: "#d4af37", textAlign: "center", originX: "center", charSpacing: 380 },
        { type: "line", x1: 260, y1: 160, x2: 534, y2: 160, stroke: "#d4af37", strokeWidth: 1.5, selectable: false },

        { type: "text", text: "BREAKFAST & BRUNCH (6:30 AM - 11:00 AM)", left: 397, top: 200, fontFamily: "Oswald", fontSize: 15, fontWeight: "500", fill: "#ffffff", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Grand Himalayan Breakfast", left: 140, top: 240, fontFamily: "Source Sans 3", fontSize: 15, fontWeight: "600", fill: "#ffffff" },
        { type: "text", text: "eggs any style, house chicken sausage, grilled tomato, hash brown, sourdough", left: 140, top: 260, fontFamily: "Source Sans 3", fontSize: 11, fontWeight: "400", fill: "#94a3b8" },
        { type: "text", text: "Nu. 650", left: 654, top: 240, fontFamily: "Source Sans 3", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Eggs Benedict with Royal Smoked Trout", left: 140, top: 290, fontFamily: "Source Sans 3", fontSize: 15, fontWeight: "600", fill: "#ffffff" },
        { type: "text", text: "toasted English muffin, local river trout, poached farm eggs, tarragon hollandaise", left: 140, top: 310, fontFamily: "Source Sans 3", fontSize: 11, fontWeight: "400", fill: "#94a3b8" },
        { type: "text", text: "Nu. 550", left: 654, top: 290, fontFamily: "Source Sans 3", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "line", x1: 140, y1: 360, x2: 654, y2: 360, stroke: "#1e3a8a", strokeWidth: 1, selectable: false },

        { type: "text", text: "ALL DAY DINING & CHEF'S MAINS", left: 397, top: 390, fontFamily: "Oswald", fontSize: 15, fontWeight: "500", fill: "#ffffff", textAlign: "center", originX: "center", charSpacing: 220 },
        { type: "text", text: "Grilled Angus Ribeye 10oz", left: 140, top: 430, fontFamily: "Source Sans 3", fontSize: 15, fontWeight: "600", fill: "#ffffff" },
        { type: "text", text: "truffle potato mousseline, roasted asparagus, peppercorn cognac sauce", left: 140, top: 450, fontFamily: "Source Sans 3", fontSize: 11, fontWeight: "400", fill: "#94a3b8" },
        { type: "text", text: "Nu. 1,200", left: 654, top: 430, fontFamily: "Source Sans 3", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Pan-Seared Mountain Sea Bass", left: 140, top: 480, fontFamily: "Source Sans 3", fontSize: 15, fontWeight: "600", fill: "#ffffff" },
        { type: "text", text: "saffron champagne emulsion, baby leeks, buttered fingerling potatoes", left: 140, top: 500, fontFamily: "Source Sans 3", fontSize: 11, fontWeight: "400", fill: "#94a3b8" },
        { type: "text", text: "Nu. 980", left: 654, top: 480, fontFamily: "Source Sans 3", fontSize: 15, fontWeight: "700", fill: "#d4af37", originX: "right" },

        { type: "text", text: "Room service available 24 hours · Dial 0 for in-room dining · 10% service charge included", left: 397, top: 1060, fontFamily: "Source Sans 3", fontSize: 10, fontWeight: "400", fill: "#64748b", textAlign: "center", originX: "center" },
      ],
    },
  },
};

/* ─────────────────────────────────────────────────────────────── */
/*  GENERATED TEMPLATES — High-end Modern Gradient Themes          */
/* ─────────────────────────────────────────────────────────────── */

type TemplateEntry = TemplateCanvasData[string];

interface GenSection {
  title: string;
  items: [string, string, string?][];
}

interface GenOptions {
  name: string;
  description: string;
  category: string;
  style: string;
  isPremium?: boolean;
  tags: string[];
  gradient: string;
  bgGradientStops: [string, string, string]; // [start, middle, end]
  background: string;
  title: string;
  subtitle: string;
  headingFont: string;
  bodyFont: string;
  titleColor: string;
  subtitleColor: string;
  bodyColor: string;
  priceColor: string;
  accentColor: string;
  innerBorderColor?: string;
  descColor?: string;
  footer: string;
  sections: GenSection[];
  preview: TemplatePreviewData;
}

function genTemplate(o: GenOptions): TemplateEntry {
  const innerBorder = o.innerBorderColor || o.accentColor;
  const objects: Record<string, unknown>[] = [
    {
      type: "rect",
      left: 0,
      top: 0,
      width: 794,
      height: 1123,
      fill: {
        type: "linear",
        coords: { x1: 0, y1: 0, x2: 794, y2: 1123 },
        colorStops: [
          { offset: 0, color: o.bgGradientStops[0] },
          { offset: 0.5, color: o.bgGradientStops[1] },
          { offset: 1, color: o.bgGradientStops[2] },
        ],
      },
      originX: "left",
      originY: "top",
      selectable: false,
      evented: false,
    },
    { type: "rect", left: 36, top: 36, width: 722, height: 1051, fill: "transparent", stroke: o.accentColor, strokeWidth: 1.5, strokeUniform: true, originX: "left", originY: "top", selectable: false },
    { type: "rect", left: 44, top: 44, width: 706, height: 1035, fill: "transparent", stroke: innerBorder, strokeWidth: 0.75, strokeUniform: true, originX: "left", originY: "top", selectable: false },

    // Top Header
    { type: "text", text: o.title, left: 397, top: 72, fontFamily: o.headingFont, fontSize: 44, fontWeight: "700", fill: o.titleColor, textAlign: "center", originX: "center" },
    { type: "text", text: o.subtitle, left: 397, top: 128, fontFamily: o.bodyFont, fontSize: 12, fontWeight: "600", fill: o.subtitleColor, textAlign: "center", originX: "center", charSpacing: 320 },
    { type: "line", x1: 260, y1: 160, x2: 534, y2: 160, stroke: o.accentColor, strokeWidth: 1.5, selectable: false },
  ];

  let cursor = 200;
  o.sections.forEach((section, idx) => {
    objects.push({
      type: "text",
      text: section.title.toUpperCase(),
      left: 397,
      top: cursor,
      fontFamily: o.headingFont,
      fontSize: 15,
      fontWeight: "700",
      fill: o.priceColor,
      textAlign: "center",
      originX: "center",
      charSpacing: 240,
    });
    cursor += 42;

    section.items.forEach(([n, p, desc]) => {
      objects.push({
        type: "text",
        text: n,
        left: 140,
        top: cursor,
        fontFamily: o.bodyFont,
        fontSize: 15,
        fontWeight: "600",
        fill: o.bodyColor,
        originX: "left",
      });
      objects.push({
        type: "text",
        text: p,
        left: 654,
        top: cursor,
        fontFamily: o.bodyFont,
        fontSize: 15,
        fontWeight: "700",
        fill: o.priceColor,
        originX: "right",
      });

      if (desc) {
        objects.push({
          type: "text",
          text: desc,
          left: 140,
          top: cursor + 20,
          fontFamily: o.bodyFont,
          fontSize: 11,
          fontWeight: "400",
          fill: o.descColor || o.subtitleColor,
          originX: "left",
        });
        cursor += 20;
      }
      cursor += 36;
    });

    if (idx < o.sections.length - 1) {
      objects.push({
        type: "line",
        x1: 140,
        y1: cursor + 10,
        x2: 654,
        y2: cursor + 10,
        stroke: innerBorder,
        strokeWidth: 0.5,
        selectable: false,
      });
      cursor += 36;
    }
  });

  objects.push({
    type: "text",
    text: o.footer,
    left: 397,
    top: 1060,
    fontFamily: o.bodyFont,
    fontSize: 10,
    fontWeight: "400",
    fill: o.descColor || o.subtitleColor,
    textAlign: "center",
    originX: "center",
  });

  return {
    name: o.name,
    description: o.description,
    category: o.category,
    style: o.style,
    orientation: "portrait",
    paperSize: "A4",
    isPremium: o.isPremium ?? false,
    tags: o.tags,
    gradient: o.gradient,
    preview: o.preview,
    canvasData: { version: "7.0.0", background: o.background, objects },
  };
}

const EXTRA: TemplateCanvasData = {
  /* 9. Old World Tavern — Hearth Charcoal to Smoked Amber Gradient */
  "tpl-vintage": genTemplate({
    name: "Old World Tavern",
    description: "Deep charcoal to smoked amber gradient with warm hearth-ember accents",
    category: "vintage",
    style: "traditional",
    tags: ["vintage", "tavern", "historic", "pub", "gradient"],
    gradient: "from-amber-950 via-stone-900 to-black",
    bgGradientStops: ["#2d170b", "#1a0d06", "#090402"],
    background: "#1a0d06",
    title: "THE DRUNKEN DRAGON",
    subtitle: "HERITAGE MOUNTAIN TAVERN & ALEHOUSE",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    titleColor: "#fef3c7",
    subtitleColor: "#d97706",
    bodyColor: "#fde68a",
    priceColor: "#d97706",
    accentColor: "#d97706",
    innerBorderColor: "#451a03",
    descColor: "#a88160",
    footer: "Brewing since 1884 · Hearty mountain fare cooked over open applewood embers",
    sections: [
      {
        title: "Tavern Starters",
        items: [
          ["Ale-Battered Onion Rings", "$11", "thick-cut vidalia onions, smoked chipotle dip"],
          ["Warm Soft Pretzel & Beer Cheese", "$13", "traditional salted pretzel, sharp cheddar fondue"],
        ],
      },
      {
        title: "Hearty Woodfired Mains",
        items: [
          ["Smoked Pork Shank", "$28", "braised red cabbage, roasted garlic potato purée"],
          ["Tavern Burger & Triple-Cooked Fries", "$19", "dry-aged beef, cave-aged cheddar, smoked bacon jam"],
          ["Guinness Beef Pot Pie", "$22", "slow-braised short rib, root vegetables, flaky golden crust"],
        ],
      },
    ],
    preview: {
      bg: "#1a0d06",
      title: "#fef3c7",
      accent: "#d97706",
      text: "#d1a884",
      items: [
        { n: "Smoked Pork Shank", p: "$28" },
        { n: "Tavern Burger", p: "$19" },
        { n: "Guinness Beef Pot Pie", p: "$22" },
      ],
    },
  }),

  /* 10. Sweet Crumbs — Parisian Raspberry to Velvet Cassis Gradient */
  "tpl-bakery": genTemplate({
    name: "Sweet Crumbs",
    description: "Deep berry velvet to midnight cassis gradient with French rose gold elegance",
    category: "bakery",
    style: "playful",
    tags: ["bakery", "pastry", "dessert", "french", "gradient"],
    gradient: "from-pink-950 via-rose-950 to-black",
    bgGradientStops: ["#330f24", "#1e0816", "#0a0207"],
    background: "#1e0816",
    title: "LA PETITE PATISSERIE",
    subtitle: "ARTISANAL FRENCH PASTRIES & MACARONS",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    titleColor: "#fdf2f8",
    subtitleColor: "#e879a0",
    bodyColor: "#fce7f3",
    priceColor: "#e879a0",
    accentColor: "#e879a0",
    innerBorderColor: "#500724",
    descColor: "#c084fc",
    footer: "Baked with 100% Normandy butter & French T55 flour · Fresh batch every morning",
    sections: [
      {
        title: "Morning Viennoiserie",
        items: [
          ["Kouign-Amann", "$4.75", "caramelized laminated pastry with breton salted butter"],
          ["Pistachio Rose Pain au Chocolat", "$5.25", "double valrhona chocolate baton, crushed pistachios"],
        ],
      },
      {
        title: "Haute Patisserie",
        items: [
          ["Tahitian Vanilla Eclair", "$6.50", "choux pastry, vanilla bean diplomat, mirror glaze"],
          ["Paris-Brest", "$7.50", "hazelnut praline mousseline, roasted hazelnuts, choux ring"],
        ],
      },
    ],
    preview: {
      bg: "#1e0816",
      title: "#fdf2f8",
      accent: "#e879a0",
      text: "#e2c4d8",
      items: [
        { n: "Kouign-Amann", p: "$4.75" },
        { n: "Tahitian Vanilla Eclair", p: "$6.50" },
        { n: "Paris-Brest", p: "$7.50" },
      ],
    },
  }),

  /* 11. Roast & Brew — Deep Slate Navy with Amber Gold Gradient */
  "tpl-brewery": genTemplate({
    name: "Roast & Brew",
    description: "Deep indigo gunmetal to dark obsidian gradient with amber gold highlights",
    category: "drinks",
    style: "bold",
    tags: ["brewery", "beer", "drinks", "craft-beer", "gradient"],
    gradient: "from-amber-600 via-yellow-700 to-slate-950",
    bgGradientStops: ["#16203b", "#0d1324", "#03050a"],
    background: "#0d1324",
    title: "ROAST & BREW",
    subtitle: "INDEPENDENT MICROBREWERY & TAPROOM",
    headingFont: "Oswald",
    bodyFont: "Inter",
    titleColor: "#ffffff",
    subtitleColor: "#f59e0b",
    bodyColor: "#f1f5f9",
    priceColor: "#f59e0b",
    accentColor: "#f59e0b",
    innerBorderColor: "#1e3a8a",
    descColor: "#94a3b8",
    footer: "Rotating 16 taps on draught · Ask your beertender for current seasonal flights",
    sections: [
      {
        title: "On Draught Taps",
        items: [
          ["Hazy Mountain IPA 6.8%", "$8.50", "citra, mosaic & galaxy hops with tropical fruit aroma"],
          ["Smoked Bourbon Porter 8.2%", "$9.00", "aged 9 months in oak bourbon barrels, dark chocolate notes"],
        ],
      },
      {
        title: "Taproom Eats",
        items: [
          ["IPA-Glazed Crispy Wings", "$16.00", "tossed in habanero beer glaze with blue cheese dip"],
          ["Smoked Pulled Pork Sliders", "$15.00", "applewood smoked, Carolina mustard sauce, brioche bun"],
        ],
      },
    ],
    preview: {
      bg: "#0d1324",
      title: "#ffffff",
      accent: "#f59e0b",
      text: "#cbd5e1",
      items: [
        { n: "Hazy Mountain IPA", p: "$8.50" },
        { n: "Smoked Bourbon Porter", p: "$9.00" },
        { n: "IPA-Glazed Wings", p: "$16.00" },
      ],
    },
  }),

  /* 12. Maison Lumière — Imperial Burgundy Wine to Midnight Noir Gradient */
  "tpl-french": genTemplate({
    name: "Maison Lumière",
    description: "Deep burgundy velvet to midnight noir gradient with gilded 24K gold haute cuisine borders",
    category: "elegant",
    style: "luxury",
    isPremium: true,
    tags: ["french", "fine-dining", "michelin", "paris", "gradient"],
    gradient: "from-rose-950 via-red-950 to-black",
    bgGradientStops: ["#320a1c", "#1c0510", "#080104"],
    background: "#1c0510",
    title: "MAISON LUMIÈRE",
    subtitle: "HAUTE CUISINE FRANÇAISE · PARIS - THIMPHU",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    titleColor: "#fef3c7",
    subtitleColor: "#d4af37",
    bodyColor: "#fde68a",
    priceColor: "#d4af37",
    accentColor: "#d4af37",
    innerBorderColor: "#4c0519",
    descColor: "#cbd5e1",
    footer: "Menu curated by Maitre Cuisinier · Sommelier wine pairings available for all courses",
    sections: [
      {
        title: "Entrées",
        items: [
          ["Escargots de Bourgogne", "$22", "wild burgundian snails, parsley garlic butter, puff pastry"],
          ["Soupe de Homard", "$26", "creamy lobster bisque, cognac flamed, chive crème fraîche"],
        ],
      },
      {
        title: "Plats Principaux",
        items: [
          ["Filet de Boeuf Rossini", "$54", "pan-seared foie gras, black summer truffle, madeira jus"],
          ["Canard à l'Orange", "$42", "crispy duck breast, bitter orange reduction, fondant potatoes"],
        ],
      },
    ],
    preview: {
      bg: "#1c0510",
      title: "#fef3c7",
      accent: "#d4af37",
      text: "#cbd5e1",
      items: [
        { n: "Escargots de Bourgogne", p: "$22" },
        { n: "Filet de Boeuf Rossini", p: "$54" },
        { n: "Canard à l'Orange", p: "$42" },
      ],
    },
  }),

  /* 13. Street Gourmet / Quick Bite — Carbon Graphite to Midnight Gradient */
  "tpl-bistro": genTemplate({
    name: "Quick Bite",
    description: "Deep carbon graphite to midnight smoke gradient with saffron gold street gourmet",
    category: "fastfood",
    style: "modern",
    tags: ["bistro", "burger", "street-food", "fast-casual", "gradient"],
    gradient: "from-yellow-500 via-orange-600 to-slate-950",
    bgGradientStops: ["#1c202d", "#10131b", "#050609"],
    background: "#10131b",
    title: "STREET GOURMET",
    subtitle: "ARTISAN SMASH BURGERS & MELTS",
    headingFont: "Montserrat",
    bodyFont: "Inter",
    titleColor: "#ffffff",
    subtitleColor: "#f59e0b",
    bodyColor: "#f1f5f9",
    priceColor: "#f59e0b",
    accentColor: "#f59e0b",
    innerBorderColor: "#1e293b",
    descColor: "#94a3b8",
    footer: "Fresh 100% pasture-raised beef smashed to order · Brioche buns baked daily",
    sections: [
      {
        title: "Signature Smash Burgers",
        items: [
          ["The Double Truffle Smash", "$14.50", "two 3oz beef patties, truffle aioli, aged swiss, crispy onions"],
          ["Smoky Bacon & Cheddar", "$15.00", "applewood bacon, smoked cheddar, house bourbon BBQ sauce"],
        ],
      },
      {
        title: "Loaded Sides & Shakes",
        items: [
          ["Parmesan Truffle Fries", "$7.50", "fresh hand-cut fries, white truffle oil, grated parmesan"],
          ["Salted Caramel Shake", "$6.50", "Madagascar vanilla ice cream, fleur de sel, whipped cream"],
        ],
      },
    ],
    preview: {
      bg: "#10131b",
      title: "#ffffff",
      accent: "#f59e0b",
      text: "#cbd5e1",
      items: [
        { n: "Double Truffle Smash", p: "$14.50" },
        { n: "Smoky Bacon & Cheddar", p: "$15.00" },
        { n: "Truffle Fries", p: "$7.50" },
      ],
    },
  }),

  /* 14. Forno Vero — Vesuvio Terracotta Ember to Smoked Charcoal Gradient */
  "tpl-pizza": genTemplate({
    name: "Forno Vero",
    description: "Vesuvio terracotta ember to smoked charcoal gradient with warm Italian terracotta accents",
    category: "pizza",
    style: "rustic",
    tags: ["pizza", "italian", "woodfired", "napoli", "gradient"],
    gradient: "from-red-950 via-amber-950 to-black",
    bgGradientStops: ["#33130a", "#1d0a05", "#080201"],
    background: "#1d0a05",
    title: "FORNO VERO",
    subtitle: "AUTENTICA PIZZA NAPOLETANA",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    titleColor: "#fef3c7",
    subtitleColor: "#ea580c",
    bodyColor: "#fed7aa",
    priceColor: "#ea580c",
    accentColor: "#ea580c",
    innerBorderColor: "#431407",
    descColor: "#cbd5e1",
    footer: "90 seconds at 900°F in our oak-fired Vesuvio oven · San Marzano DOP tomatoes",
    sections: [
      {
        title: "Pizze Tradizionali",
        items: [
          ["Margherita D.O.P.", "$18", "san marzano tomatoes, fior di latte mozzarella, fresh basil"],
          ["Diavola Piccante", "$21", "spicy calabrian salame, chili honey, smoked provolone"],
        ],
      },
      {
        title: "Pizze Gourmet",
        items: [
          ["Tartufo & Prosciutto", "$26", "black truffle cream, prosciutto di parma, wild arugula"],
          ["Quattro Formaggi & Walnut", "$23", "gorgonzola, fontina, parmigiano, toasted walnuts"],
        ],
      },
    ],
    preview: {
      bg: "#1d0a05",
      title: "#fef3c7",
      accent: "#ea580c",
      text: "#cbd5e1",
      items: [
        { n: "Margherita D.O.P.", p: "$18" },
        { n: "Diavola Piccante", p: "$21" },
        { n: "Tartufo & Prosciutto", p: "$26" },
      ],
    },
  }),

  /* 15. Spice Route — Imperial Dragon Cinnabar to Midnight Crimson Gradient */
  "tpl-asian": genTemplate({
    name: "Spice Route",
    description: "Deep imperial cinnabar to midnight crimson gradient with silk road dragon gold",
    category: "asian",
    style: "cultural",
    tags: ["asian", "spice", "pan-asian", "wok", "gradient"],
    gradient: "from-red-950 via-rose-950 to-black",
    bgGradientStops: ["#340b14", "#1e060b", "#080103"],
    background: "#1e060b",
    title: "SPICE ROUTE",
    subtitle: "SILK ROAD FLAVORS & HIMALAYAN SPICES",
    headingFont: "Playfair Display",
    bodyFont: "Inter",
    titleColor: "#fef3c7",
    subtitleColor: "#d4af37",
    bodyColor: "#f1f5f9",
    priceColor: "#d4af37",
    accentColor: "#d4af37",
    innerBorderColor: "#4c0519",
    descColor: "#cbd5e1",
    footer: "Wok cooked over live flame · Spices ground daily using Himalayan mortar & pestle",
    sections: [
      {
        title: "Small Plates & Dim Sum",
        items: [
          ["Peking Duck Spring Rolls", "$14", "cucumber, scallion, hoisin reduction glaze"],
          ["Sichuan Chili Pork Dumplings", "$16", "hand-rolled wrappers, chili crisp, black vinegar broth"],
        ],
      },
      {
        title: "Wok & Robata Grill",
        items: [
          ["Black Pepper Wagyu Beef", "$38", "flambéed wok beef, garlic shoots, crushed peppercorns"],
          ["Miso Glazed Chilean Sea Bass", "$42", "sweet saikyo miso, charred bok choy, ginger dashi"],
        ],
      },
    ],
    preview: {
      bg: "#1e060b",
      title: "#fef3c7",
      accent: "#d4af37",
      text: "#cbd5e1",
      items: [
        { n: "Peking Duck Rolls", p: "$14" },
        { n: "Black Pepper Wagyu", p: "$38" },
        { n: "Miso Glazed Sea Bass", p: "$42" },
      ],
    },
  }),

  /* 16. Druk Heritage Kitchen — Himalayan Saffron Crimson to Dzong Charcoal Gradient */
  "tpl-bhutanese": genTemplate({
    name: "Druk Heritage Kitchen",
    description: "Deep Himalayan saffron crimson to Dzong charcoal gradient with authentic heritage delicacies",
    category: "bhutanese",
    style: "cultural",
    tags: ["bhutanese", "ema-datshi", "himalayan", "authentic", "gradient"],
    gradient: "from-amber-950 via-red-950 to-black",
    bgGradientStops: ["#32110a", "#1d0905", "#090201"],
    background: "#1d0905",
    title: "DRUK HERITAGE KITCHEN",
    subtitle: "AUTHENTIC BHUTANESE & HIMALAYAN FLAVORS",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    titleColor: "#fef3c7",
    subtitleColor: "#d4af37",
    bodyColor: "#fef3c7",
    priceColor: "#d4af37",
    accentColor: "#d4af37",
    innerBorderColor: "#451a03",
    descColor: "#d1a884",
    footer: "Prepared with organic red rice from Paro Valley and fresh Bumthang dairy",
    sections: [
      {
        title: "Authentic Datshi Dishes",
        items: [
          ["Ema Datshi (National Dish)", "Nu. 180", "fresh green & red chilies simmered in local cottage cheese"],
          ["Kewa Datshi (Potato Cheese)", "Nu. 160", "sliced mountain potatoes, mild cheese sauce, butter"],
          ["Shamu Datshi (Mushroom Cheese)", "Nu. 220", "wild Himalayan mushrooms, rich cheesy broth"],
        ],
      },
      {
        title: "Traditional Himalayan Meats",
        items: [
          ["Phaksha Paa (Pork with Chili)", "Nu. 280", "slices of pork belly cooked with dried red chilies and radishes"],
          ["Shakam Paa (Dried Beef)", "Nu. 320", "sun-dried mountain beef strips, chili, spinach"],
        ],
      },
    ],
    preview: {
      bg: "#1d0905",
      title: "#fef3c7",
      accent: "#d4af37",
      text: "#d1a884",
      items: [
        { n: "Ema Datshi", p: "Nu. 180" },
        { n: "Kewa Datshi", p: "Nu. 160" },
        { n: "Phaksha Paa", p: "Nu. 280" },
        { n: "Shakam Paa", p: "Nu. 320" },
      ],
    },
  }),

  /* 17. Harvest Table — Botanical Olive Moss to Midnight Pine Gradient */
  "tpl-seasonal": genTemplate({
    name: "Harvest Table",
    description: "Deep botanical olive forest to midnight moss gradient with golden harvest highlights",
    category: "seasonal",
    style: "farm-to-table",
    tags: ["seasonal", "autumn", "farm", "organic", "gradient"],
    gradient: "from-lime-950 via-emerald-950 to-black",
    bgGradientStops: ["#192b0e", "#0e1807", "#030701"],
    background: "#0e1807",
    title: "HARVEST TABLE",
    subtitle: "FARM TO TABLE · LOCAL BOTANICALS",
    headingFont: "Cormorant Garamond",
    bodyFont: "Lora",
    titleColor: "#ecfccb",
    subtitleColor: "#84cc16",
    bodyColor: "#f7fee7",
    priceColor: "#84cc16",
    accentColor: "#84cc16",
    innerBorderColor: "#14532d",
    descColor: "#bef264",
    footer: "Menu changes with the harvest season · 100% grown within 50 miles",
    sections: [
      {
        title: "Autumn Garden",
        items: [
          ["Roasted Butternut Squash Velouté", "$14", "toasted pumpkin seeds, sage brown butter, nutmeg cream"],
          ["Charred Beet & Goat Cheese Tart", "$16", "wild honeycomb, thyme, crushed hazelnuts, baby arugula"],
        ],
      },
      {
        title: "Open Hearth Mains",
        items: [
          ["Cider-Braised Heritage Pork Belly", "$32", "caramelized orchard apples, parsnip puree, pork jus"],
          ["Wild Chanterelle & Truffle Risotto", "$28", "carnaroli rice, aged parmesan, fresh winter herbs"],
        ],
      },
    ],
    preview: {
      bg: "#0e1807",
      title: "#ecfccb",
      accent: "#84cc16",
      text: "#bef264",
      items: [
        { n: "Squash Velouté", p: "$14" },
        { n: "Beet & Goat Cheese", p: "$16" },
        { n: "Braised Pork Belly", p: "$32" },
      ],
    },
  }),

  /* 18. Druk Palace Kitchen — Royal Thangka Dragon Jade to Sacred Midnight Gradient */
  "tpl-bhutanese-palace": genTemplate({
    name: "Druk Palace Kitchen",
    description: "Deep sacred dragon jade to midnight emerald gradient with 24K Royal Bhutanese Gold",
    category: "bhutanese",
    style: "cultural",
    isPremium: true,
    tags: ["bhutanese", "palace", "thangka", "luxury", "dragon", "gradient"],
    gradient: "from-emerald-950 via-teal-950 to-black",
    bgGradientStops: ["#092e22", "#051a13", "#010705"],
    background: "#051a13",
    title: "DRUK PALACE KITCHEN",
    subtitle: "THANGKA ROYAL BANQUET · KINGDOM OF BHUTAN",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    titleColor: "#f8fafc",
    subtitleColor: "#d4af37",
    bodyColor: "#f8fafc",
    priceColor: "#d4af37",
    accentColor: "#d4af37",
    innerBorderColor: "#115e59",
    descColor: "#cbd5e1",
    footer: "Royal Bhutanese banquet fare prepared for auspicious celebrations and honored guests",
    sections: [
      {
        title: "Auspicious Starters",
        items: [
          ["Hoentay Buckwheat Dumplings (6 pcs)", "Nu. 260", "Haa valley turnip greens, local dried cheese, chili paste"],
          ["Wild Chanterelle Mushroom Soup", "Nu. 240", "forest harvested mushrooms, rich mountain broth"],
        ],
      },
      {
        title: "Royal Palace Curries",
        items: [
          ["Jasha Maroo (Spicy Minced Chicken)", "Nu. 380", "diced organic chicken, garlic, ginger, fresh red chilies"],
          ["Gondo Datshi (Scrambled Egg Cheese)", "Nu. 220", "farm eggs poached in melted cottage cheese & butter"],
          ["Royal Red Rice Feast (Paro Yangsom)", "Nu. 120", "steamed heirloom red rice from Paro terraced paddies"],
        ],
      },
    ],
    preview: {
      bg: "#051a13",
      title: "#f8fafc",
      accent: "#d4af37",
      text: "#cbd5e1",
      items: [
        { n: "Hoentay Dumplings", p: "Nu. 260" },
        { n: "Jasha Maroo", p: "Nu. 380" },
        { n: "Gondo Datshi", p: "Nu. 220" },
      ],
    },
  }),
};

const T: TemplateCanvasData = { ...BASE, ...EXTRA };

export default T;
