import * as voiceService from "../services/voice.service.js";

// @desc    Convert Text to Speech (Streaming)
// @route   POST /api/voice/tts
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

    // Get the raw stream from Deepgram
    const deepgramStream = await voiceService.textToSpeechService(
      text,
      language
    );

    // Set headers for audio streaming
    res.set({
      "Content-Type": "audio/wav",
      "Transfer-Encoding": "chunked",
    });

    // Pipe the stream directly to the response (Memory Efficient)
    // Deepgram SDK v3 streams are web-standard ReadableStreams.
    // We convert web stream to node stream if necessary, or iterate.

    // Node.js < 18 compat (if needed):
    // const nodeStream = Readable.fromWeb(deepgramStream);
    // nodeStream.pipe(res);

    // Modern Node.js (18+):
    for await (const chunk of deepgramStream) {
      res.write(chunk);
    }
    res.end();
  } catch (error) {
    console.error("TTS Controller Error:", error);
    // Only send JSON if headers haven't been sent yet
    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Failed to generate audio." });
    } else {
      res.end();
    }
  }
};

// @desc    Convert Speech to Text
// @route   POST /api/voice/stt
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
