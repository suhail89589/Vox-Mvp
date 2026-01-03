import { createClient } from "@deepgram/sdk";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DEEPGRAM_API_KEY) {
  console.error("FATAL: DEEPGRAM_API_KEY is missing.");
  process.exit(1);
}

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export const textToSpeechService = async (text, language = "en") => {
  try {
    // Model Selection: 'aura-stella-en' is standard, 'aura-stella-hi' is hypothetical (check docs for exact Hindi model)
    // Deepgram currently supports specific English voices. Fallback to English if Hindi not available in Aura yet.
    const model = "aura-asteria-en";

    const response = await deepgram.speak.request(
      { text },
      {
        model: model,
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();
    if (!stream) throw new Error("Empty audio stream received");

    return stream;
  } catch (err) {
    console.error("Deepgram TTS Error:", err.message);
    throw new Error("Voice generation service unavailable");
  }
};

export const speechToTextService = async (buffer) => {
  try {
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        model: "nova-2",
        smart_format: true,
        detect_language: true, // Auto-detect English/Hindi
      }
    );

    if (error) throw error;

    return result?.results?.channels[0]?.alternatives[0]?.transcript || "";
  } catch (err) {
    console.error("Deepgram STT Error:", err.message);
    throw new Error("Transcription service unavailable");
  }
};
