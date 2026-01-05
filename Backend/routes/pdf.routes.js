import express from "express";
import { uploadPdf } from "../controllers/pdf.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { apiLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();


router.post("/upload", apiLimiter, upload.single("file"), uploadPdf);

export default router;
