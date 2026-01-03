import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { v4 as uuidv4 } from "uuid";

// In-memory session store
export const sessions = new Map();

// 🧹 Helper: Delete session after 1 hour to free up RAM
const scheduleCleanup = (sessionId) => {
  setTimeout(() => {
    if (sessions.has(sessionId)) {
      sessions.delete(sessionId);
      console.log(`🧹 Auto-Cleanup: Removed session ${sessionId}`);
    }
  }, 1000 * 60 * 60); // 1 Hour
};

export const uploadPdf = async (req, res, next) => {
  try {
    // 1. Validate File
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only PDFs are allowed.",
      });
    }

    // 2. Extract Text
    const data = await pdfParse(req.file.buffer);

    if (!data.text || data.text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text. PDF might be an image scan.",
      });
    }

    // 3. Create Session
    const sessionId = uuidv4();

    sessions.set(sessionId, {
      id: sessionId,
      filename: req.file.originalname,
      text: data.text,
      uploadedAt: new Date(),
    });

    // 🛡️ SECURITY FIX: Schedule cleanup
    scheduleCleanup(sessionId);

    console.log(`✅ PDF Processed: ${sessionId} (${data.text.length} chars)`);

    // 4. Respond
    res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("PDF Processing Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process PDF.",
    });
  }
};
