/**
 * Normalize saved canvas JSON before loading into Fabric.
 *
 * 1. Flatten `{ background: { value } }` → plain string (legacy saves).
 * 2. Convert static "text" objects → editable "i-text" so users can
 *    double-click to edit content in templates and saved projects (Fabric v7).
 * 3. Strip any saved viewport transform so templates always load at 100%
 *    zoom / no pan, regardless of how they were exported.
 */
export function prepareCanvasData(canvasData: Record<string, unknown> | string): string {
  let data: Record<string, unknown>;
  if (typeof canvasData === "string") {
    try {
      data = JSON.parse(canvasData);
    } catch {
      return canvasData;
    }
  } else {
    data = { ...canvasData };
  }

  const bg = data.background;
  if (bg && typeof bg === "object" && "value" in (bg as Record<string, unknown>)) {
    data.background = (bg as { value: string }).value || "#ffffff";
  }

  if (Array.isArray(data.objects)) {
    data.objects = (data.objects as Record<string, unknown>[]).map((obj) => {
      const item = { ...obj };
      if (item.type === "text") {
        item.type = "i-text";
      }

      // If this is a page background or border frame, guarantee originX: "left", originY: "top"
      if (item.type === "rect") {
        const w = Number(item.width || 0);
        const h = Number(item.height || 0);
        const l = Number(item.left || 0);
        const t = Number(item.top || 0);
        if ((l < 100 && w > 500) || (t < 100 && h > 700) || (l === 0 && t === 0)) {
          item.originX = "left";
          item.originY = "top";
        }
      }

      // Fabric 7 compatibility: ensure every object has explicit originX/originY
      if (!item.originX) {
        if (item.textAlign === "center") {
          item.originX = "center";
        } else if (item.textAlign === "right") {
          item.originX = "right";
        } else {
          item.originX = "left";
        }
      }
      if (!item.originY) {
        item.originY = "top";
      }
      return item;
    });
  }

  // Remove saved zoom/pan so every load starts from a clean 100% viewport.
  delete data.viewportTransform;

  return JSON.stringify(data);
}

/** Check whether a Fabric text object is in active editing mode. */
export function isTextEditing(canvas: { getActiveObject?: () => { isEditing?: () => boolean; type?: string } | null | undefined } | null | undefined): boolean {
  const obj = canvas?.getActiveObject?.();
  if (!obj) return false;
  if (obj.type !== "i-text" && obj.type !== "text" && obj.type !== "textbox") return false;
  return typeof (obj as { isEditing?: () => boolean }).isEditing === "function" && (obj as { isEditing: () => boolean }).isEditing();
}
