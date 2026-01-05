import * as voiceService from "../services/voice.service.js";


export const textToSpeech = async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text || text.length > 2000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Text is required and must be under 2000 chars.",
        });
    }

   
    const deepgramStream = await voiceService.textToSpeechService(
      text,
      language
    );

    
    res.set({
      "Content-Type": "audio/wav",
      "Transfer-Encoding": "chunked",
    });

    
    for await (const chunk of deepgramStream) {
      res.write(chunk);
    }
    res.end();
  } catch (error) {
    console.error("TTS Controller Error:", error);
    
    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Failed to generate audio." });
    } else {
      res.end();
    }
  }
};


export const speechToText = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No audio file uploaded." });
    }

    const transcript = await voiceService.speechToTextService(req.file.buffer);
    res.json({ success: true, transcript });
  } catch (error) {
    console.error("STT Controller Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to transcribe audio." });
  }
};
