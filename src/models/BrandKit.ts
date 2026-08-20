import mongoose, { Schema, Document } from "mongoose";

export interface IBrandKit extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BrandKitSchema = new Schema<IBrandKit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    logo: { type: String },
    primaryColor: { type: String, default: "#000000" },
    secondaryColor: { type: String, default: "#ffffff" },
    accentColor: { type: String, default: "#f59e0b" },
    fonts: {
      heading: { type: String, default: "Playfair Display" },
      body: { type: String, default: "Inter" },
      accent: { type: String, default: "Dancing Script" },
    },
  },
  { timestamps: true }
);

BrandKitSchema.index({ userId: 1 });

export default mongoose.models.BrandKit || mongoose.model<IBrandKit>("BrandKit", BrandKitSchema);
