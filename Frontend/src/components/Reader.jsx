import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import { Volume2, Pause, Play, Mic, Loader2, Radio } from "lucide-react";
import Microphone from "./Microphone";

const Reader = ({ sessionId }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [currentParaIndex, setCurrentParaIndex] = useState(-1);

  // Status: 'idle', 'thinking', 'playing', 'paused', 'waiting', 'listening'
  const [status, setStatus] = useState("idle");
  const [countdown, setCountdown] = useState(0);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const activeRequestId = useRef(0);

  // 1. Auto-Start
  useEffect(() => {
    if (sessionId) askAI("Summarize this document simply.");
    return () => stopEverything();
  }, [sessionId]);

  // 2. ⌨️ KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      // SPACEBAR = Click Microphone
      if (e.code === "Space") {
        e.preventDefault();
        document.getElementById("mic-trigger-btn")?.click();
      }

      // P = Play / Pause
      if (e.code === "KeyP") {
        const playButton = document.getElementById("play-pause-btn");
        if (playButton) playButton.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const stopEverything = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null; // Clean reference
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus("idle");
  };

  // --- CRITICAL FIX: Handlers for Microphone Sync ---
  const handleRecordingStart = () => {
    // Immediately kill the doubt timer so we don't skip ahead
    if (timerRef.current) clearInterval(timerRef.current);

    // Pause any background reading
    if (audioRef.current) audioRef.current.pause();

    setStatus("listening");
  };

  const handleRecordingStop = () => {
    // Give immediate feedback that we are processing
    setStatus("thinking");
  };
  // --------------------------------------------------

  const askAI = async (text) => {
    const reqId = activeRequestId.current + 1;
    activeRequestId.current = reqId;

    stopEverything(); // Clear previous state
    setStatus("thinking");
    setAnswer("Thinking...");

    try {
      const res = await api.post("/ai/ask", {
        question: text,
        sessionId,
        language: "en",
      });
      if (activeRequestId.current !== reqId) return;

      const fullText = res.data.data.answer;
      setAnswer(fullText);
      const paraList = fullText.split(/\n+/).filter((p) => p.trim().length > 0);
      setParagraphs(paraList);

      playParagraph(0, paraList, reqId);
    } catch (err) {
      console.error(err);
      setAnswer("Sorry, I had trouble reading that.");
      setStatus("idle");
    }
  };

  const playParagraph = async (index, allParas, reqId) => {
    if (activeRequestId.current !== reqId) return;

    // Safety check: if index is out of bounds, stop.
    if (!allParas || index >= allParas.length) {
      setStatus("idle");
      return;
    }

    setCurrentParaIndex(index);
    setStatus("playing");

    try {
      const response = await api.post(
        "/voice/tts",
        { text: allParas[index] },
        { responseType: "blob" }
      );
      if (activeRequestId.current !== reqId) return;

      const audioUrl = URL.createObjectURL(response.data);

      // Stop previous audio if somehow still playing
      if (audioRef.current) audioRef.current.pause();

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.play().catch((e) => {
        console.warn("Autoplay blocked or failed:", e);
        setStatus("paused");
      });

      audio.onended = () => startDoubtWindow(index, allParas, reqId);
    } catch (err) {
      console.error("TTS Error:", err);
      // If TTS fails, wait a moment then try next paragraph or stop
      startDoubtWindow(index, allParas, reqId);
    }
  };

  const startDoubtWindow = (index, allParas, reqId) => {
    if (activeRequestId.current !== reqId) return;

    setStatus("waiting");
    setCountdown(5);

    let timeLeft = 5;

    // Clear any existing timer before starting a new one
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      // Double check reqId inside interval
      if (activeRequestId.current !== reqId) {
        clearInterval(timerRef.current);
        return;
      }

      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerRef.current);
        playParagraph(index + 1, allParas, reqId);
      }
    }, 1000);
  };

  const handleUserVoice = (text) => {
    if (!text) {
      // If transcript failed/empty, resume or go idle
      setStatus("idle");
      return;
    }
    askAI(text);
  };

  const handleResume = () => {
    if (audioRef.current && currentParaIndex > -1) {
      audioRef.current.play();
      setStatus("playing");
    } else {
      playParagraph(
        currentParaIndex > -1 ? currentParaIndex : 0,
        paragraphs,
        activeRequestId.current
      );
    }
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setStatus("paused");
  };

  return (
    <main className="max-w-3xl mx-auto mt-8 p-4 space-y-6" aria-live="polite">
      {/* 🟢 STATUS BAR */}
      <section
        className={`text-white p-6 rounded-2xl flex items-center justify-between shadow-xl transition-colors duration-500 ${
          status === "listening"
            ? "bg-red-900 border-2 border-red-500"
            : "bg-slate-900"
        }`}
        aria-label="Audio Controls and Status"
      >
        <div className="flex items-center gap-4">
          {status === "thinking" && (
            <Loader2 className="animate-spin" size={32} />
          )}
          {status === "playing" && (
            <Volume2 className="animate-pulse text-green-400" size={32} />
          )}
          {status === "waiting" && (
            <Mic className="animate-bounce text-yellow-400" size={32} />
          )}
          {status === "listening" && (
            <Radio className="animate-pulse text-red-500" size={32} />
          )}

          <div>
            <h2 className="text-xl font-bold">
              {status === "thinking" && "AI is Thinking..."}
              {status === "playing" && "Reading Aloud..."}
              {status === "waiting" &&
                `Speak now if you have doubts (${countdown}s)`}
              {status === "listening" && "Listening... (Press Space to Stop)"}
              {status === "idle" && "Ready. Tap Mic or Press Space."}
              {status === "paused" && "Paused. Press P to Resume."}
            </h2>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-4">
          {status === "playing" ? (
            <button
              id="play-pause-btn"
              onClick={handlePause}
              className="bg-slate-700 hover:bg-slate-600 p-4 rounded-full transition-all"
              aria-label="Pause Reading (Press P)"
            >
              <Pause size={28} />
            </button>
          ) : (
            (status === "paused" || status === "idle") && (
              <button
                id="play-pause-btn"
                onClick={handleResume}
                className="bg-green-600 hover:bg-green-700 p-4 rounded-full transition-all"
                aria-label="Resume Reading (Press P)"
              >
                <Play size={28} />
              </button>
            )
          )}

          {/* CRITICAL FIX: Passing handlers to Microphone */}
          <Microphone
            onTranscript={handleUserVoice}
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
          />
        </div>
      </section>

      {/* TEXT DISPLAY */}
      <article className="bg-white p-8 rounded-2xl border-2 border-slate-200 shadow-sm">
        {paragraphs.length > 0 ? (
          paragraphs.map((para, idx) => (
            <p
              key={idx}
              className={`text-xl leading-loose mb-6 transition-all duration-300 p-4 rounded-xl ${
                idx === currentParaIndex
                  ? "bg-yellow-100 text-black border-l-8 border-yellow-500 font-semibold shadow-inner"
                  : "text-slate-700 opacity-50"
              }`}
              tabIndex={0}
            >
              {para}
            </p>
          ))
        ) : (
          <p className="text-xl text-slate-500 italic">
            {answer || "Waiting for content..."}
          </p>
        )}
      </article>

      <label className="sr-only" htmlFor="text-input">
        Type a question
      </label>
      <input
        id="text-input"
        className="w-full p-4 border-2 border-slate-300 rounded-xl text-lg focus:border-blue-600 outline-none transition-all"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && askAI(question)}
        placeholder="Type here if you prefer not to speak..."
        disabled={status === "listening" || status === "thinking"}
      />
    </main>
  );
};

export default Reader;
