import fs from "fs";
import Book from "../models/Pdf.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const uploadPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    const filePath = req.file.path;
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let extractedText = "";
    // Inside uploadPdf loop
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Inside the uploadBook loop
      const pageText = content.items
        .map((item) => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .replace(/(Activity\s\d+\.\d+\s?){2,}/g, "$1") // Removes repeated activity titles
        .trim();

      // Add a custom delimiter so frontend knows exactly where to pause
      extractedText += pageText + " [PAUSE] ";
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract meaningful text from PDF",
      });
    }

    const book = await Pdf.create({
      title: req.body.title || req.file.originalname,
      filePath,
      extractedText,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Pdf uploaded and processed successfully",
      data: {
        id: pdf._id,
        title: Pdf.title,
      },
    });
  } catch (error) {
    console.error("UPLOAD PDF ERROR:", error);
    next(error);
  }
};


export const getMyPdfs = async (req, res, next) => {
  try {
    const books = await Pdf.find({ user: req.user.id }).select(
      "_id title createdAt"
    );

    res.status(200).json({
      success: true,
      count: pdf.length,
      data: pdfs,
    });
  } catch (error) {
    next(error);
  }
};


export const getPdfById = async (req, res, next) => {
  try {
    const pdf = await Pdf.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "Pdf not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pdf,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete book
 */
export const deletePdf = async (req, res, next) => {
  try {
    const pdf = await Pdf.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "Pdf not found or not authorized",
      });
    }

    if (pdf.filePath && fs.existsSync(pdf.filePath)) {
      fs.unlinkSync(pdf.filePath);
    }

    res.status(200).json({
      success: true,
      message: "Pdf deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
