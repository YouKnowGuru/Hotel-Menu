import mongoose, { Schema, Document } from "mongoose";

export interface ITemplate extends Document {
  name: string;
  description: string;
  category: string;
  style: string;
  orientation: "portrait" | "landscape";
  paperSize: string;
  thumbnail: string;
  previewImages: string[];
  canvasData: Record<string, unknown>;
  gradient?: string;
  preview?: Record<string, unknown>;
  isPremium: boolean;
  tags: string[];
  usageCount: number;
  createdAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    style: { type: String, required: true },
    orientation: { type: String, enum: ["portrait", "landscape"], default: "portrait" },
    paperSize: { type: String, default: "A4" },
    thumbnail: { type: String, required: true },
    previewImages: [{ type: String }],
    canvasData: { type: Schema.Types.Mixed, required: true },
    gradient: { type: String },
    preview: { type: Schema.Types.Mixed },
    isPremium: { type: Boolean, default: false },
    tags: [{ type: String }],
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TemplateSchema.index({ category: 1 });
TemplateSchema.index({ tags: 1 });
TemplateSchema.index({ isPremium: 1 });

export default mongoose.models.Template || mongoose.model<ITemplate>("Template", TemplateSchema);
