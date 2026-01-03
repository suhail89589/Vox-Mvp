import express from "express";
import { textToSpeech, speechToText } from "../controllers/voice.controller.js";
import { upload } from "../middleware/upload.middleware.js"; // Reuse your multer middleware
import { apiLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Convert Text -> Audio Stream
router.post("/tts", apiLimiter, textToSpeech);

// Convert Audio File -> Text
// uses upload.single('file') to handle the audio file upload
router.post("/stt", apiLimiter, upload.single("file"), speechToText);

export default router;
