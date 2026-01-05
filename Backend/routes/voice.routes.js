import express from "express";
import { textToSpeech, speechToText } from "../controllers/voice.controller.js";
import { upload } from "../middleware/upload.middleware.js"; 
import { apiLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();


router.post("/tts", apiLimiter, textToSpeech);


router.post("/stt", apiLimiter, upload.single("file"), speechToText);

export default router;
