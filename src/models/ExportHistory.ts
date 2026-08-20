import mongoose, { Schema, Document } from "mongoose";

export interface IExportHistory extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  format: string;
  dpi: number;
  fileSize: number;
  fileUrl: string;
  createdAt: Date;
}

const ExportHistorySchema = new Schema<IExportHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    format: { type: String, required: true },
    dpi: { type: Number, default: 300 },
    fileSize: { type: Number },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

ExportHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.ExportHistory ||
  mongoose.model<IExportHistory>("ExportHistory", ExportHistorySchema);
