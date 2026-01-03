import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    filePath: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
      select: true, // do not return full text by default
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Future-ready fields
    totalPages: {
      type: Number,
      default: 0,
    },
    currentPosition: {
      type: Number,
      default: 0, // character index or line number
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
const pdf = mongoose.models.Pdf || mongoose.model("Pdf", pdfSchema);

export default pdf;
