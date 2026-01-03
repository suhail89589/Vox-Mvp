import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

let groq;
try {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "dummy_key",
  });
} catch (error) {
  console.warn("⚠️ AI Service Warning: Groq Client failed to initialize.");
}

export const generateAIResponse = async ({ question, context, language }) => {
  if (!process.env.GROQ_API_KEY) {
    return "I cannot answer right now because the AI Key is missing in the backend.";
  }

  try {
    // Limit context to prevent huge bills and confusion
    const safeContext = (context || "").substring(0, 3500);

    // ✨ THIS IS THE SECRET SAUCE: The Persona
    const systemPrompt = `
      You are "VisionTutor", a friendly, empathetic, and highly intelligent teacher for visually impaired students.
      
      YOUR GOAL:
      Explain the answer in the simplest way possible (Like 'Explain Like I'm 5'). 
      Avoid complex jargon. If you must use a big word, explain it immediately.

      CONTEXT FROM USER'S PDF:
      """
      ${safeContext}
      """

      INSTRUCTIONS:
      1. Answer the user's question primarily using the PDF context above.
      2. If the PDF is too technical, simplify it using your own general knowledge.
      3. Use analogies (e.g., "Think of a CPU like a brain...").
      4. Keep sentences short and conversational so they sound good when spoken out loud.
      5. Structure your answer in clear, bite-sized paragraphs.
      6. Language: ${language}
      7. NEVER use Markdown (no **, ##, -). Just write plain text paragraphs.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      model: "llama-3.3-70b-versatile", // This is a very smart, fast model
      temperature: 0.7, // Slightly higher creativity for better explanations
      max_tokens: 450,
    });

    return (
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't find a simple answer for that."
    );
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error("Failed to generate AI response");
  }
};
