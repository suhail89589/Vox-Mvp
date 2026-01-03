import express from "express";
import { askFromPdf } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { apiLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Protect & rate-limit AI routes
router.post("/ask", protect, apiLimiter, askFromPdf);

export default router;
