import express from "express";
import {
  uploadPdf,
  getMyPdfs,
  getPdfById,
  deletePdf,
} from "../controllers/book.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// All book routes are protected
router.use(protect);

// Upload a book PDF
router.post("/upload", upload.single("file"), uploadPdf);

// Get all books of logged-in user
router.get("/", getMyPdfs);

// Get a single book by ID
router.get("/:id", getPdfById);

// Delete a book
router.delete("/:id", deletePdf);

export default router;
