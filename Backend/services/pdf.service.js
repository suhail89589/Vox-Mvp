import fs from "fs-extra"; // Use fs-extra for promise support
import pdf from "pdf-parse";

export const parsePdfFile = async (filePath) => {
  try {
    // Async read (Non-blocking)
    const dataBuffer = await fs.readFile(filePath);
    const parsed = await pdf(dataBuffer);

    if (!parsed.text || parsed.text.trim().length < 50) {
      throw new Error("PDF appears to be empty or image-based.");
    }

    return {
      text: parsed.text,
      totalPages: parsed.numpages || 0,
    };
  } catch (error) {
    console.error("PDF Parse Error:", error);
    throw error;
  }
};