import express from "express";
import multer from "multer";
import { textToSpeech, speechToText } from "../controllers/voice.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Limit audio uploads to 5MB to prevent RAM exhaustion
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(protect);

router.post("/tts", textToSpeech);
router.post("/stt", upload.single("audio"), speechToText);

export default router;
