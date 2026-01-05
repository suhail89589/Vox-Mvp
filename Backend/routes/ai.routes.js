import express from "express";
import { askFromPdf } from "../controllers/ai.controller.js";
import { apiLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();


router.post("/ask",  apiLimiter, askFromPdf);

export default router;
