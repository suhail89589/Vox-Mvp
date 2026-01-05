import { createClient } from "@deepgram/sdk";
import dotenv from "dotenv";
dotenv.config();

let deepgram = null;


if (!process.env.DEEPGRAM_API_KEY) {
  console.warn("⚠️  WARNING: DEEPGRAM_API_KEY is missing in .env file.");
  console.warn(
    "    Voice features (TTS/STT) will be disabled, but the server will stay ONLINE."
  );
} else {
  try {
    deepgram = createClient(process.env.DEEPGRAM_API_KEY);
    console.log("🎤 Voice Service Initialized");
  } catch (err) {
    console.error("❌ Deepgram Client Failed:", err.message);
  }
}


const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const textToSpeechService = async (text, retries = 3) => {
  if (!deepgram) {
    throw new Error("Voice service unavailable: DEEPGRAM_API_KEY missing");
  }


  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await deepgram.speak.request(
        { text },
        {
          model: "aura-asteria-en",
          encoding: "linear16",
          container: "wav",
        }
      );

      const stream = await response.getStream();
      if (!stream) throw new Error("Deepgram returned empty stream");

      return stream; 
    } catch (err) {
      console.warn(`⚠️ TTS Attempt ${attempt} failed: ${err.message}`);

      if (attempt === retries) {
       
        console.error("❌ All TTS attempts failed.");
        throw new Error(
          "Failed to generate voice audio after multiple attempts."
        );
      }

      
      await wait(1000 * attempt);
    }
  }
};

export const speechToTextService = async (buffer) => {
  if (!deepgram) {
    throw new Error("Voice service unavailable: DEEPGRAM_API_KEY missing");
  }

  try {
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        model: "nova-2",
        smart_format: true,
        detect_language: true,
      }
    );

    if (error) throw error;

    return result?.results?.channels[0]?.alternatives[0]?.transcript || "";
  } catch (err) {
    console.error("STT Transcription Error:", err.message);
    throw new Error("Failed to transcribe audio");
  }
};
