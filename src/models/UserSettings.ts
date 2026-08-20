import mongoose, { Schema, Document } from "mongoose";

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  defaultPaperSize: string;
  defaultOrientation: string;
  defaultCurrency: string;
  autoSave: boolean;
  autoSaveInterval: number;
  theme: "light" | "dark";
  snapToGrid: boolean;
  showGrid: boolean;
  showSafeArea: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    defaultPaperSize: { type: String, default: "A4" },
    defaultOrientation: { type: String, default: "portrait" },
    defaultCurrency: { type: String, default: "USD" },
    autoSave: { type: Boolean, default: true },
    autoSaveInterval: { type: Number, default: 30000 },
    theme: { type: String, enum: ["light", "dark"], default: "dark" },
    snapToGrid: { type: Boolean, default: true },
    showGrid: { type: Boolean, default: false },
    showSafeArea: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.UserSettings ||
  mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema);
