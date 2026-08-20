import { Canvas, IText, Text, Textbox, Rect, Line, Path } from "fabric";
import type { FabricObject } from "fabric";
import type { MenuTheme } from "@/constants";

/** Custom data key written onto the invisible marker rect we add to every
 *  canvas produced by `generateMenu`.  `fillTemplate` reads this flag and
 *  returns false immediately so it never tries to "fill" a generated layout. */
const GENERATED_MENU_MARKER = "__menuStudioGenerated__";

/** Re-initialises every text object's internal dimensions so that, after the
 *  web-fonts have loaded, all width / height measurements reflect the real
 *  glyphs rather than the system fallback font used at construction time.
 *  Call this inside a `document.fonts.ready` / requestAnimationFrame chain
 *  after `generateMenu` has run. */
export function remeasureCanvasText(canvas: Canvas): void {
  let touched = false;
  canvas.getObjects().forEach((o: FabricObject) => {
    if (
      (o.type === "i-text" || o.type === "text" || o.type === "textbox") &&
      typeof (o as IText).initDimensions === "function"
    ) {
      (o as IText).initDimensions();
      o.setCoords();
      touched = true;
    }
  });
  if (touched) canvas.requestRenderAll();
}

/** Fonts used by templates/themes. Canvas text does not reliably trigger
 *  web-font downloads, so these are loaded explicitly before measuring. */
export const MENU_CANVAS_FONTS = [
  "Inter",
  "Playfair Display",
  "Lora",
  "Cormorant Garamond",
  "Source Sans 3",
  "Montserrat",
  "Raleway",
  "Oswald",
  "Dancing Script",
  "Great Vibes",
  "Poppins",
  "Merriweather",
];

export function loadMenuFonts(): Promise<unknown> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }
  return Promise.all(
    MENU_CANVAS_FONTS.map((f) => document.fonts.load(`16px "${f}"`))
  );
}

/** Google renamed "Source Sans Pro" to "Source Sans 3" — map old template
 *  data onto the font the app actually loads. */
const FONT_ALIASES: Record<string, string> = {
  '"Source Sans Pro"': '"Source Sans 3"',
};

export function normalizeCanvasFonts(json: string): string {
  let out = json;
  for (const [from, to] of Object.entries(FONT_ALIASES)) {
    if (out.includes(from)) out = out.split(from).join(to);
  }

  // Strip any saved viewport transform/zoom/pan so the canvas always loads
  // at a clean 100% zoom. This prevents templates from appearing zoomed-in or
  // zoomed-out because of whatever zoom level happened to be active when they
  // were last saved/exported.
  try {
    const parsed = JSON.parse(out);
    if (parsed && typeof parsed === "object") {
      delete parsed.viewportTransform;
      out = JSON.stringify(parsed);
    }
  } catch {
    // If the JSON is somehow invalid, leave it untouched and let loadFromJSON
    // surface the real error.
  }

  return out;
}

export interface QuickFillItem {
  id: string;
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  badge: string;
  badgeColor: string;
}

export interface QuickFillCategory {
  id: string;
  title: string;
  items: QuickFillItem[];
}

export interface QuickFillData {
  restaurantName: string;
  tagline: string;
  footerText: string;
  currency: string;
  themeId: string;
  categories: QuickFillCategory[];
  icons: string[];
  addFrame: boolean;
}

/** Builds a complete, editable menu directly onto the Fabric canvas. */
export function generateMenu(canvas: Canvas, data: QuickFillData, theme: MenuTheme): void {
  // The canvas element is always paper-sized — zoom is applied via the
  // viewport transform and never changes object coordinates, so we must NOT
  // divide by the current zoom here.
  const W = Math.round(canvas.getWidth());
  const H = Math.round(canvas.getHeight());

  // Responsive padding relative to canvas dimensions — generous margins so text is never cut off
  const marginX = Math.max(54, Math.round(W * 0.09));
  const marginTop = Math.max(48, Math.round(H * 0.06));
  const marginBottom = Math.max(48, Math.round(H * 0.06));
  const contentW = W - marginX * 2;
  const centerX = Math.round(W / 2);
  const availableH = H - marginTop - marginBottom;

  // Filter categories that have at least one named or priced item
  const validCategories = data.categories
    .map((c) => ({
      ...c,
      items: c.items.filter((i) => i.name.trim() || i.price.trim()),
    }))
    .filter((c) => c.items.length > 0 || c.title.trim());

  const totalItems = validCategories.reduce((n, c) => n + c.items.length, 0);

  // ---- Header space calculation ----
  let headerH = 0;
  if (data.restaurantName.trim()) headerH += 46;
  if (data.tagline.trim()) headerH += 24;
  headerH += 24; // divider line + diamond
  if (data.icons.length > 0) headerH += 30;
  headerH += 18; // gap below header

  const footerH = data.footerText.trim() ? 44 : 0;
  const usableBodyH = availableH - headerH - footerH;

  // ---- Decide if two columns is best (wide canvas or lots of content) ----
  const canUseTwoCols = contentW >= 560;
  const twoCols = canUseTwoCols && (totalItems > 8 || validCategories.length >= 3);

  // ---- Dynamic scale & vertical spacing so the menu fills the page harmoniously ----
  const minItemH = 34;
  const totalBaseH = validCategories.length * 50 + totalItems * minItemH;
  // If content is sparse, expand spacing; if dense, scale down gracefully
  let scale = 1;
  if (usableBodyH > 100) {
    if (totalBaseH > usableBodyH) {
      scale = Math.max(0.65, Math.min(1, usableBodyH / totalBaseH));
    }
  }

  const s = (val: number) => Math.round(val * scale);

  // Calculate dynamic item and category spacing based on available height
  const remainingSpace = Math.max(0, usableBodyH - (validCategories.length * s(48) + totalItems * s(36)));
  const extraCatGap = Math.min(32, Math.round(remainingSpace / Math.max(1, validCategories.length * 3)));
  const extraItemGap = Math.min(16, Math.round(remainingSpace / Math.max(1, totalItems * 2)));

  // ---- Background ----
  canvas.backgroundColor = theme.bg;

  // ---- Decorative frame ----
  if (data.addFrame) {
    const frameInset = Math.max(20, Math.round(marginX * 0.4));
    canvas.add(
      new Rect({
        left: frameInset,
        top: frameInset,
        originX: "left",
        originY: "top",
        width: W - frameInset * 2,
        height: H - frameInset * 2,
        fill: "transparent",
        stroke: theme.accent,
        strokeWidth: 1.5,
        rx: 8,
        ry: 8,
        strokeUniform: true,
        selectable: false,
        evented: false,
      })
    );
  }

  // ---- Header Section ----
  let curY = marginTop;

  // Restaurant Title
  if (data.restaurantName.trim()) {
    const titleSize = Math.min(40, Math.max(24, s(Math.round(W / 20))));
    canvas.add(
      new IText(data.restaurantName.trim(), {
        left: centerX,
        top: curY,
        originX: "center",
        originY: "top",
        fontFamily: theme.headingFont,
        fontSize: titleSize,
        fontWeight: "700",
        fill: theme.title,
        charSpacing: 20,
        textAlign: "center",
      })
    );
    curY += Math.round(titleSize * 1.25);
  }

  // Tagline
  if (data.tagline.trim()) {
    const tagSize = Math.min(14, Math.max(10, s(12)));
    canvas.add(
      new Text(data.tagline.trim(), {
        left: centerX,
        top: curY,
        originX: "center",
        originY: "top",
        fontFamily: theme.bodyFont,
        fontSize: tagSize,
        fill: theme.accent,
        charSpacing: 180,
        textAlign: "center",
      })
    );
    curY += Math.round(tagSize * 1.5) + s(6);
  }

  // Header Divider (two lines flanking a center diamond)
  {
    const dy = curY + s(6);
    const halfLineW = Math.min(s(110), Math.round(contentW * 0.22));
    canvas.add(new Line([centerX - halfLineW, dy, centerX - 10, dy], {
      stroke: theme.accent,
      strokeWidth: 1,
      originX: "left",
      originY: "center",
      selectable: false,
    }));
    canvas.add(new Line([centerX + 10, dy, centerX + halfLineW, dy], {
      stroke: theme.accent,
      strokeWidth: 1,
      originX: "left",
      originY: "center",
      selectable: false,
    }));
    canvas.add(
      new Rect({
        left: centerX,
        top: dy,
        width: 8,
        height: 8,
        fill: theme.accent,
        angle: 45,
        originX: "center",
        originY: "center",
        selectable: false,
      })
    );
    curY += s(18);
  }

  // Optional decorative icons
  if (data.icons.length > 0) {
    const iconGap = s(32);
    let iconStartX = centerX - ((data.icons.length - 1) * iconGap) / 2;
    for (const pathStr of data.icons) {
      canvas.add(
        new Path(pathStr, {
          left: iconStartX,
          top: curY,
          originX: "center",
          originY: "top",
          scaleX: 0.8 * scale,
          scaleY: 0.8 * scale,
          stroke: theme.accent,
          strokeWidth: 1.5,
          fill: "",
          strokeUniform: true,
          selectable: false,
        })
      );
      iconStartX += iconGap;
    }
    curY += s(26);
  }

  curY += s(16) + Math.round(extraCatGap * 0.5); // Breathing room before menu categories

  // ---- Helper to render a category column ----
  const renderCategoryBlock = (
    colLeft: number,
    colWidth: number,
    cat: QuickFillCategory,
    startY: number
  ): number => {
    let yPos = startY;

    // Category Title
    if (cat.title.trim()) {
      const headerSize = Math.max(14, s(17));
      canvas.add(
        new Text(cat.title.trim().toUpperCase(), {
          left: colLeft,
          top: yPos,
          originX: "left",
          originY: "top",
          fontFamily: theme.headingFont,
          fontSize: headerSize,
          fontWeight: "700",
          fill: theme.accent,
          charSpacing: 80,
        })
      );
      yPos += headerSize + s(6);

      // Underline under category
      canvas.add(
        new Line([colLeft, yPos, colLeft + colWidth, yPos], {
          stroke: theme.accent,
          strokeWidth: 1.5,
          originX: "left",
          originY: "top",
          selectable: false,
        })
      );
      yPos += s(12) + extraItemGap;
    }

    // Render each item
    for (const item of cat.items) {
      if (!item.name.trim() && !item.price.trim()) continue;
      if (yPos + s(36) > H - marginBottom - footerH) break;

      let itemY = yPos;
      const itemName = item.name.trim() || "Menu Item";
      const itemPrice = item.price.trim() ? `${data.currency}${item.price.trim()}` : "";
      const nameSize = Math.max(12, s(15));
      const priceSize = Math.max(12, s(15));

      // Item Name
      const nameObj = new IText(itemName, {
        left: colLeft,
        top: itemY,
        originX: "left",
        originY: "top",
        fontFamily: theme.bodyFont,
        fontSize: nameSize,
        fontWeight: "600",
        fill: theme.text,
      });
      canvas.add(nameObj);

      // Inline Badge (placed neatly right next to item name on the same line)
      let badgeExtraW = 0;
      if (item.badge && item.badge.trim()) {
        const badgeSize = Math.max(8, s(9));
        const badgeText = new Text(item.badge.toUpperCase(), {
          left: 0,
          top: 0,
          originX: "center",
          originY: "center",
          fontFamily: theme.bodyFont,
          fontSize: badgeSize,
          fontWeight: "700",
          fill: "#ffffff",
          charSpacing: 30,
        });
        const approxTextW = badgeText.width || item.badge.length * 6;
        const pillW = approxTextW + s(12);
        const pillH = Math.max(14, s(16));

        const approxNameW = nameObj.width || itemName.length * (nameSize * 0.55);
        const pillLeft = colLeft + approxNameW + s(8);
        const pillTop = itemY + Math.round((nameSize - pillH) / 2);

        const pill = new Rect({
          left: pillLeft,
          top: pillTop,
          originX: "left",
          originY: "top",
          width: pillW,
          height: pillH,
          rx: pillH / 2,
          ry: pillH / 2,
          fill: item.badgeColor || theme.accent,
          selectable: false,
        });
        badgeText.set({
          left: pillLeft + pillW / 2,
          top: pillTop + pillH / 2,
        });

        canvas.add(pill);
        canvas.add(badgeText);
        badgeExtraW = pillW + s(12);
      }

      // Price & Old Price
      let priceTotalW = 0;
      if (itemPrice) {
        const priceObj = new IText(itemPrice, {
          left: colLeft + colWidth,
          top: itemY,
          originX: "right",
          originY: "top",
          fontFamily: theme.bodyFont,
          fontSize: priceSize,
          fontWeight: "700",
          fill: theme.title,
        });
        canvas.add(priceObj);

        const approxPriceW = priceObj.width || (itemPrice.length * priceSize * 0.6);
        priceTotalW = approxPriceW;

        // Old price (crossed out) to the left of the current price
        if (item.oldPrice.trim()) {
          const oldPriceStr = `${data.currency}${item.oldPrice.trim()}`;
          const oldPriceObj = new Text(oldPriceStr, {
            left: colLeft + colWidth - approxPriceW - s(10),
            top: itemY + s(1),
            originX: "right",
            originY: "top",
            fontFamily: theme.bodyFont,
            fontSize: Math.max(10, s(12)),
            fill: theme.muted,
            linethrough: true,
          });
          canvas.add(oldPriceObj);
          priceTotalW += (oldPriceObj.width || oldPriceStr.length * 7) + s(10);
        }

        // Leader dotted line (crisp dashed vector line that never overlaps or wraps)
        const approxNameW = nameObj.width || (itemName.length * nameSize * 0.55);
        const dotsStartX = colLeft + approxNameW + badgeExtraW + s(8);
        const dotsEndX = colLeft + colWidth - priceTotalW - s(8);

        if (dotsEndX > dotsStartX + s(16)) {
          const dotLineY = itemY + Math.round(nameSize * 0.72);
          canvas.add(
            new Line([dotsStartX, dotLineY, dotsEndX, dotLineY], {
              stroke: theme.divider || "rgba(0,0,0,0.18)",
              strokeWidth: 1,
              strokeDashArray: [2, 4],
              originX: "left",
              originY: "center",
              selectable: false,
            })
          );
        }
      }

      itemY += nameSize + s(3);

      // Description (wrapped gracefully within column width)
      if (item.description.trim()) {
        const descSize = Math.max(10, s(11));
        const descObj = new Textbox(item.description.trim(), {
          left: colLeft,
          top: itemY,
          originX: "left",
          originY: "top",
          width: colWidth - s(12),
          fontFamily: theme.bodyFont,
          fontSize: descSize,
          fill: theme.body,
          lineHeight: 1.2,
          splitByGrapheme: false,
        });
        canvas.add(descObj);
        itemY += (descObj.height || descSize * 1.25) + s(3);
      }

      itemY += s(5);

      // Subtle separator line under item
      canvas.add(
        new Line([colLeft, itemY, colLeft + colWidth, itemY], {
          stroke: theme.divider || "rgba(0,0,0,0.1)",
          strokeWidth: 0.75,
          strokeDashArray: [2, 3],
          originX: "left",
          originY: "top",
          selectable: false,
        })
      );

      itemY += s(8) + extraItemGap;
      yPos = itemY;
    }

    return yPos + s(12) + extraCatGap;
  };

  // ---- Render Columns ----
  if (!twoCols || validCategories.length === 0) {
    // Single column centered with proper margin
    for (const cat of validCategories) {
      curY = renderCategoryBlock(marginX, contentW, cat, curY);
    }
  } else {
    // Two columns side-by-side
    const colGap = Math.max(24, s(36));
    const colW = Math.round((contentW - colGap) / 2);
    const leftX = marginX;
    const rightX = marginX + colW + colGap;

    if (validCategories.length === 1) {
      const cat = validCategories[0];
      const half = Math.ceil(cat.items.length / 2);
      const leftItems = cat.items.slice(0, half);
      const rightItems = cat.items.slice(half);

      const leftCat = { ...cat, items: leftItems };
      const rightCat = { id: `${cat.id}-r`, title: `${cat.title} (cont.)`, items: rightItems };

      const lEnd = renderCategoryBlock(leftX, colW, leftCat, curY);
      const rEnd = renderCategoryBlock(rightX, colW, rightCat, curY);
      curY = Math.max(lEnd, rEnd);
    } else {
      const heights = validCategories.map(
        (c: QuickFillCategory) => c.items.reduce((acc: number, i: QuickFillItem) => acc + (i.description ? 42 : 28), 36)
      );
      const totalH = heights.reduce((a: number, b: number) => a + b, 0);
      let accH = 0;
      let splitIdx = 1;

      for (let i = 0; i < heights.length; i++) {
        accH += heights[i];
        if (accH >= totalH / 2 && i < heights.length - 1) {
          splitIdx = i + 1;
          break;
        }
      }

      const leftCats = validCategories.slice(0, splitIdx);
      const rightCats = validCategories.slice(splitIdx);

      let leftY = curY;
      let rightY = curY;

      for (const cat of leftCats) {
        leftY = renderCategoryBlock(leftX, colW, cat, leftY);
      }
      for (const cat of rightCats) {
        rightY = renderCategoryBlock(rightX, colW, cat, rightY);
      }

      curY = Math.max(leftY, rightY);
    }
  }

  // ---- Footer Section ----
  if (data.footerText.trim()) {
    const footerY = H - marginBottom - s(4);
    const footLineW = Math.min(s(110), Math.round(contentW * 0.25));

    canvas.add(
      new Line([centerX - footLineW, footerY - s(12), centerX + footLineW, footerY - s(12)], {
        stroke: theme.accent,
        strokeWidth: 0.75,
        originX: "left",
        originY: "center",
        selectable: false,
      })
    );

    const footSize = Math.max(9, s(11));
    canvas.add(
      new Text(data.footerText.trim(), {
        left: centerX,
        top: footerY,
        originX: "center",
        originY: "top",
        fontFamily: theme.bodyFont,
        fontSize: footSize,
        fill: theme.muted,
        charSpacing: 80,
        textAlign: "center",
      })
    );
  }

  // ---- Stamp a tiny invisible marker so fillTemplate skips this canvas ----
  canvas.add(
    new Rect({
      left: 0,
      top: 0,
      width: 1,
      height: 1,
      fill: "transparent",
      opacity: 0,
      selectable: false,
      evented: false,
      data: { [GENERATED_MENU_MARKER]: true },
    })
  );

  canvas.requestRenderAll();
}


/* ---------------------------- Template fill ---------------------------- */
/* Fills a loaded template (or any compatible generated layout) in place:  */
/* keeps the design, fonts, colors and positions while swapping in the      */
/* user's content. Returns false when the canvas doesn't contain a          */
/* fillable layout, so the caller can fall back to `generateMenu`.          */

interface FillSlot {
  nameObj: IText;
  priceObj: IText | null;
}

interface FillSection {
  heading: IText | null;
  names: IText[];
  prices: IText[];
}

export function fillTemplate(canvas: Canvas, data: QuickFillData): boolean {
  const W = Math.round(canvas.getWidth());
  const H = Math.round(canvas.getHeight());
  if (!W || !H) {
    console.log("[fillTemplate] Failed: no canvas dimensions", W, H);
    return false;
  }

  // If this canvas was built by generateMenu it carries an invisible marker
  // rect. Trying to fill it in-place produces garbled layouts because the
  // section-detection heuristics expect template-style centred headings, not
  // the left-aligned category blocks that generateMenu produces.
  const hasGeneratedMarker = canvas
    .getObjects()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .some((o) => (o as any).data?.[GENERATED_MENU_MARKER] === true);
  if (hasGeneratedMarker) {
    console.log("[fillTemplate] Failed: canvas has generated marker");
    return false;
  }

  const texts = canvas
    .getObjects()
    .filter(
      (o): o is IText =>
        (o.type === "i-text" || o.type === "text" || o.type === "textbox") &&
        typeof (o as IText).text === "string"
    );
  console.log("[fillTemplate] Found text objects:", texts.length);
  if (texts.length < 6) {
    console.log("[fillTemplate] Failed: not enough text objects (need 6+)");
    return false;
  }

  const isCentered = (t: IText) => t.originX === "center" || t.textAlign === "center";
  const headerLimit = Math.min(200, H * 0.2);
  const footerLimit = H - Math.min(110, H * 0.11);

  // Expand header detection zone for templates with larger headers
  const expandedHeaderLimit = Math.min(280, H * 0.28);
  const headerTexts = texts.filter((t) => (t.top ?? 0) < expandedHeaderLimit);
  const footerTexts = texts
    .filter((t) => (t.top ?? 0) > footerLimit)
    .sort((a, b) => (a.top ?? 0) - (b.top ?? 0));
  const middleTexts = texts
    .filter((t) => (t.top ?? 0) >= headerLimit && (t.top ?? 0) <= footerLimit)
    .sort((a, b) => (a.top ?? 0) - (b.top ?? 0));

  // Header: title = biggest text, subtitle = other centered header text
  const title = headerTexts.reduce<IText | null>(
    (best, t) => (!best || (t.fontSize ?? 0) > (best.fontSize ?? 0) ? t : best),
    null
  );
  console.log("[fillTemplate] Header texts:", headerTexts.length, "Title:", title?.text, "at top:", title?.top);
  if (!title) {
    console.log("[fillTemplate] Failed: no title found in header zone (0-" + expandedHeaderLimit + ")");
    return false;
  }
  // Subtitle: prefer centered text, but accept any smaller text near title
  const subtitle = headerTexts.find((t) => t !== title && isCentered(t))
    ?? headerTexts.find((t) => t !== title && (t.fontSize ?? 0) < (title.fontSize ?? 0) * 0.6)
    ?? null;
  const footer = footerTexts.find((t) => isCentered(t)) ?? null;
  // Only small texts are real footer lines (item text is >= 12px)
  const extraFooters = footerTexts.filter((t) => t !== footer && (t.fontSize ?? 20) <= 12);

  // Middle zone: centered texts are section headings, the rest names/prices
  // Also detect headings by: uppercase text, larger font, or accent color
  const sections: FillSection[] = [];
  let cur: FillSection | null = null;

  const isLikelyHeading = (t: IText) => {
    if (isCentered(t)) return true;
    const text = t.text ?? "";
    const isUpperCase = text.length > 0 && text === text.toUpperCase() && text.length <= 30;
    const isLargerFont = (t.fontSize ?? 0) >= 14 && (t.fontWeight === "600" || t.fontWeight === "700" || t.fontWeight === "bold");
    return isUpperCase || isLargerFont;
  };

  for (const t of middleTexts) {
    if (isLikelyHeading(t)) {
      cur = { heading: t, names: [], prices: [] };
      sections.push(cur);
    } else {
      if (!cur) {
        cur = { heading: null, names: [], prices: [] };
        sections.push(cur);
      }
      if (t.originX === "right") cur.prices.push(t);
      else cur.names.push(t);
    }
  }

  // Pair names with prices sitting on the same line
  const paired = sections.map((s) => {
    const prices = [...s.prices];
    const slots: FillSlot[] = s.names.map((n) => {
      const idx = prices.findIndex((p) => Math.abs((p.top ?? 0) - (n.top ?? 0)) <= 8);
      return { nameObj: n, priceObj: idx >= 0 ? prices.splice(idx, 1)[0] : null };
    });
    return { heading: s.heading, slots };
  });

  const totalSlots = paired.reduce((n, s) => n + s.slots.length, 0);
  console.log("[fillTemplate] Sections:", sections.length, "Total slots:", totalSlots);
  if (totalSlots === 0) {
    console.log("[fillTemplate] Failed: no item slots detected");
    return false;
  }

  // User content (same validity filter as generateMenu)
  const userCats = data.categories
    .map((c) => ({
      title: c.title,
      items: c.items.filter((i) => i.name.trim() || i.price.trim()),
    }))
    .filter((c) => c.items.length > 0 || c.title.trim());
  const userTotal = userCats.reduce((n, c) => n + c.items.length, 0);
  console.log("[fillTemplate] User categories:", userCats.length, "User items:", userTotal);
  if (userTotal === 0) {
    console.log("[fillTemplate] Failed: no user items to fill");
    return false;
  }

  /* ---- Capacity check: overflow is appended above the footer ---- */

  const withSlots = paired.filter((s) => s.slots.length > 0);
  const styleSection = withSlots[withSlots.length - 1];
  if (!styleSection) return false;
  const styleSlot = styleSection.slots.find((sl) => sl.priceObj) ?? styleSection.slots[0];
  const styleHeading = [...paired].reverse().find((s) => s.heading)?.heading ?? null;

  // Average line spacing inside the style section
  const slotTops = styleSection.slots.map((sl) => sl.nameObj.top ?? 0).sort((a, b) => a - b);
  let lineH = 36;
  if (slotTops.length >= 2) {
    const gaps = slotTops.slice(1).map((v, i) => v - slotTops[i]);
    lineH = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) || 36;
  }

  const lastContentTop = middleTexts.reduce((m, t) => Math.max(m, t.top ?? 0), 0);
  const footerTop = footer ? (footer.top ?? H - 40) : H - Math.max(40, H * 0.05);
  const freeSpace = footerTop - (lastContentTop + lineH);

  let extraLines = 0;
  userCats.forEach((uc, i) => {
    const capacity = paired[i] ? paired[i].slots.length : 0;
    if (uc.items.length > capacity) extraLines += uc.items.length - capacity;
    if (i >= paired.length) extraLines += 2; // heading block for a new section
  });

  // Instead of failing when content doesn't fit, we'll truncate overflow
  // to preserve the template layout. The user can always add more space manually.
  const fitsPerfectly = extraLines * lineH + lineH * 0.6 <= freeSpace;
  // If it doesn't fit, we still fill what we can (better than regenerating)

  /* ----------------------------- Apply ----------------------------- */

  // Set text and, if it now exceeds `maxWidth`, shrink the font so it fits
  // its allotted space (keeps items out of the price column, titles centered).
  const defaultLimit = W * 0.86;
  const setText = (obj: IText, text: string, maxWidth?: number) => {
    obj.set({ text });
    const limit = maxWidth ?? defaultLimit;
    const w = obj.width ?? 0;
    const size = obj.fontSize ?? 14;
    if (w > limit && w > 0) {
      obj.set({ fontSize: Math.max(8, Math.floor(size * (limit / w))) });
    }
  };
  const priceStr = (p: string) => (p.trim() ? `${data.currency}${p.trim()}` : "");

  if (data.restaurantName.trim()) setText(title, data.restaurantName.trim());
  if (data.tagline.trim() && subtitle) setText(subtitle, data.tagline.trim());
  if (data.footerText.trim() && footer) {
    setText(footer, data.footerText.trim(), W * 0.9);
    extraFooters.forEach((f) => setText(f, ""));
  }

  // Fill existing sections - PRESERVE layout by keeping all template elements
  // Only update text content, never remove template elements
  paired.forEach((sec, i) => {
    const uc = userCats[i];
    if (!uc) {
      // User has fewer categories than template - KEEP template structure
      // but clear the text to empty strings (preserves spacing/layout)
      // Option: keep original template text as placeholders
      // For now, we keep the original text so layout is unchanged
      return;
    }
    if (sec.heading && uc.title.trim()) setText(sec.heading, uc.title.toUpperCase());
    sec.slots.forEach((sl, j) => {
      const item = uc.items[j];
      if (!item) {
        // User has fewer items - KEEP the slot but leave original text
        // This preserves the template layout exactly
        return;
      }
      setText(sl.nameObj, item.name.trim() || "Menu Item",
        sl.priceObj ? (sl.priceObj.left ?? W) - (sl.nameObj.left ?? 0) - 10 : undefined);
      if (sl.priceObj) setText(sl.priceObj, priceStr(item.price));
    });
  });

  /* ---- Append overflow content at the bottom in template style ---- */
  /* Only append if there's space; otherwise truncate to preserve layout */

  if (extraLines > 0 && fitsPerfectly) {
    const nameProto = styleSlot.nameObj;
    const priceProto = styleSlot.priceObj;
    let y = lastContentTop + lineH + Math.round(lineH * 0.6);

    const addHeading = (text: string) => {
      const base = styleHeading ?? nameProto;
      canvas.add(
        new IText(text.toUpperCase(), {
          left: styleHeading ? base.left : W / 2,
          top: y,
          originX: styleHeading ? base.originX : "center",
          originY: "top",
          textAlign: styleHeading ? base.textAlign : "center",
          fontFamily: base.fontFamily,
          fontSize: base.fontSize,
          fontWeight: base.fontWeight,
          fill: base.fill,
          charSpacing: styleHeading ? styleHeading.charSpacing : 200,
        })
      );
      y += Math.round((base.fontSize ?? 16) * 1.4) + Math.round(lineH * 0.4);
    };

    const addItem = (item: { name: string; price: string }) => {
      const nameLimit = priceProto
        ? (priceProto.left ?? W) - (nameProto.left ?? 0) - 10
        : undefined;
      const nameObj = new IText(item.name.trim() || "Menu Item", {
        left: nameProto.left,
        top: y,
        originY: "top",
        fontFamily: nameProto.fontFamily,
        fontSize: nameProto.fontSize,
        fontWeight: nameProto.fontWeight,
        fill: nameProto.fill,
      });
      canvas.add(nameObj);
      if (nameLimit) setText(nameObj, item.name.trim() || "Menu Item", nameLimit);
      if (priceProto) {
        canvas.add(
          new IText(priceStr(item.price), {
            left: priceProto.left,
            top: y,
            originX: "right",
            originY: "top",
            fontFamily: priceProto.fontFamily,
            fontSize: priceProto.fontSize,
            fontWeight: priceProto.fontWeight,
            fill: priceProto.fill,
          })
        );
      }
      y += lineH;
    };

    userCats.forEach((uc, i) => {
      const sec = paired[i];
      if (!sec) {
        addHeading(uc.title);
        uc.items.forEach(addItem);
        y += Math.round(lineH * 0.4);
      } else if (uc.items.length > sec.slots.length) {
        uc.items.slice(sec.slots.length).forEach(addItem);
      }
    });
  }

  canvas.requestRenderAll();
  console.log("[fillTemplate] SUCCESS: Template filled in place");
  return true;
}

