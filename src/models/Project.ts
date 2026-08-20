import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  templateId?: string;
  canvasData: Record<string, unknown>;
  thumbnail?: string;
  paperSize: string;
  orientation: "portrait" | "landscape";
  customWidth?: number;
  customHeight?: number;
  status: "active" | "archived" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    templateId: { type: String },
    canvasData: { type: Schema.Types.Mixed, default: { objects: [], background: { type: "solid", value: "#ffffff" } } },
    thumbnail: { type: String },
    paperSize: { type: String, default: "A4" },
    orientation: { type: String, enum: ["portrait", "landscape"], default: "portrait" },
    customWidth: { type: Number, min: 50, max: 2000 },
    customHeight: { type: Number, min: 50, max: 2000 },
    status: { type: String, enum: ["active", "archived", "deleted"], default: "active" },
  },
  { timestamps: true }
);

ProjectSchema.index({ userId: 1, status: 1 });
ProjectSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
