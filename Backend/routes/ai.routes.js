import express from "express";
import { askFromPdf } from "../controllers/ai.controller.js";
import { apiLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Protect & rate-limit AI routes
router.post("/ask",  apiLimiter, askFromPdf);

export default router;
