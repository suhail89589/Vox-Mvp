import { generateAIResponse } from "../services/ai.service.js";
import { sessions } from "./pdf.controller.js"; // shared session store

export const askFromPdf = async (req, res, next) => {
  try {
    const { question, sessionId, language = "en" } = req.body;

    // 1. Validate input
    if (!question || typeof question !== "string" || question.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Invalid question (max 500 characters).",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required.",
      });
    }

    // 2. Validate session
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(403).json({
        success: false,
        message: "Session expired. Please upload the PDF again.",
      });
    }

    // 3. Generate answer
    const answer = await generateAIResponse({
      question,
      context: session.text.slice(0, 3000), // hard safety limit
      language,
    });

    res.status(200).json({
      success: true,
      data: { answer },
    });
  } catch (error) {
    next(error);
  }
};
