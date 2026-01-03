import { generateAIResponse } from "../services/ai/ai.service.js";

export const askFromPdf = async (req, res, next) => {
  try {
    const { question, currentParagraph, language = "en" } = req.body;

    // 1. Input Validation
    if (!question || typeof question !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Valid question is required" });
    }

    if (question.length > 500) {
      return res
        .status(400)
        .json({ success: false, message: "Question too long (max 500 chars)" });
    }

    // 2. Delegate to Service
    const answer = await generateAIResponse({
      question,
      context: currentParagraph, // Renamed for clarity
      language,
    });

    res.status(200).json({
      success: true,
      data: { answer },
    });
  } catch (error) {
    // Pass to global error handler (don't console.error here to avoid log duplication)
    next(error);
  }
};
