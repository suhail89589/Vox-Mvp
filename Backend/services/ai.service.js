import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

// Singleton instance
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateAIResponse = async ({ question, context, language }) => {
  try {
    // 1. Sanitize & Truncate Context (Cost & Injection Protection)
    // Limit context to ~3000 chars to prevent token exhaustion
    const safeContext = (context || "No context available.")
      .substring(0, 3000)
      .replace(/<|>/g, ""); // Basic HTML tag stripping

    const systemPrompt = `
      You are "Vox", an expert AI tutor.
      
      [STRICT CONTEXT START]
      ${safeContext}
      [STRICT CONTEXT END]
      
      INSTRUCTIONS:
      1. Answer the user's question based strictly on the context above.
      2. If the answer isn't in the context, define the term using general knowledge but mention it's outside the book.
      3. Use simple analogies.
      4. Language: ${language}
      5. Output format: Plain text, no markdown.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5, // Lower temperature = more focused/less hallucination
      max_tokens: 300, // Hard limit on output length
    });

    return (
      completion.choices[0]?.message?.content ||
      "I couldn't generate an answer."
    );
  } catch (error) {
    console.error("AI Service Error:", error.message); // Log internal error securely
    throw new Error("Failed to generate AI response"); // Throw generic error to controller
  }
};
