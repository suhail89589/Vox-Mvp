import { generateAIResponse } from "../services/ai.service.js";
import { sessions } from "./pdf.controller.js"; 
export const askFromPdf = async (req, res, next) => {
  try {
    const { question, sessionId, language = "en" } = req.body;

   
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

   
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(403).json({
        success: false,
        message: "Session expired. Please upload the PDF again.",
      });
    }

   
    const answer = await generateAIResponse({
      question,
      context: session.text.slice(0, 3000), 
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
