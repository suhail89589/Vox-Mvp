import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import {
  Volume2,
  Pause,
  Play,
  Mic,
  Loader2,
  Radio,
  Send,
  BookOpen,
} from "lucide-react";
import Microphone from "./Microphone";
import { motion, AnimatePresence } from "framer-motion";

const Reader = ({ sessionId }) => {
  // --- STATE LOGIC (KEPT 1:1) ---
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [currentParaIndex, setCurrentParaIndex] = useState(-1);
  const [status, setStatus] = useState("idle");
  const [countdown, setCountdown] = useState(0);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const activeRequestId = useRef(0);

  useEffect(() => {
    if (sessionId) askAI("Summarize this document simply.");
    return () => stopEverything();
  }, [sessionId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.code === "Space") {
        e.preventDefault();
        document.getElementById("mic-trigger-btn")?.click();
      }
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
      audioRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus("idle");
  };

  const handleRecordingStart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioRef.current) audioRef.current.pause();
    setStatus("listening");
  };

  const handleRecordingStop = () => setStatus("thinking");

  const askAI = async (text) => {
    const reqId = activeRequestId.current + 1;
    activeRequestId.current = reqId;
    stopEverything();
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
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play().catch((e) => {
        console.warn("Autoplay blocked:", e);
        setStatus("paused");
      });
      audio.onended = () => startDoubtWindow(index, allParas, reqId);
    } catch (err) {
      startDoubtWindow(index, allParas, reqId);
    }
  };

  const startDoubtWindow = (index, allParas, reqId) => {
    if (activeRequestId.current !== reqId) return;
    setStatus("waiting");
    setCountdown(5);
    let timeLeft = 5;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
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

  // --- UI HELPERS ---
  const getStatusColor = () => {
    switch (status) {
      case "listening":
        return "bg-red-500 shadow-red-500/50";
      case "playing":
        return "bg-green-500 shadow-green-500/50";
      case "thinking":
        return "bg-blue-500 shadow-blue-500/50";
      case "waiting":
        return "bg-amber-500 shadow-amber-500/50";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <main className="max-w-4xl mx-auto space-y-8 relative" aria-live="polite">
      {/* 1. Dynamic Status Header */}
      <motion.div layout className="sticky top-24 z-30 mx-auto w-fit">
        <div
          className={`
          flex items-center gap-4 px-6 py-3 rounded-full 
          bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
          border border-slate-200 dark:border-slate-700 shadow-2xl
        `}
        >
          <div
            className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor()}`}
          />
          <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
            {status === "thinking" && "Processing Answer..."}
            {status === "playing" && "Reading Aloud"}
            {status === "waiting" && `Any doubts? Continuing in ${countdown}s`}
            {status === "listening" && "Listening..."}
            {status === "idle" && "Ready for questions"}
            {status === "paused" && "Paused"}
          </span>
        </div>
      </motion.div>

      {/* 2. Content Area */}
      <article className="min-h-[50vh] bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
        {paragraphs.length > 0 ? (
          paragraphs.map((para, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: idx === currentParaIndex ? 1 : 0.4,
                scale: idx === currentParaIndex ? 1.02 : 1,
                y: 0,
              }}
              transition={{ duration: 0.5 }}
              className={`
                text-xl lg:text-2xl leading-loose mb-8 p-6 rounded-2xl transition-colors duration-500
                ${
                  idx === currentParaIndex
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-slate-900 dark:text-slate-100 font-medium shadow-sm border-l-4 border-indigo-500"
                    : "text-slate-600 dark:text-slate-500"
                }
              `}
              tabIndex={0}
            >
              {para}
            </motion.p>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <BookOpen size={48} className="mb-4 opacity-50" />
            <p className="text-xl font-medium">
              {answer || "Waiting for content..."}
            </p>
          </div>
        )}
      </article>

      {/* 3. Floating Action Bar */}
      <div className="fixed bottom-8 left-0 right-0 px-4 flex justify-center z-40 pointer-events-none">
        <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-2xl flex items-center gap-2 pointer-events-auto max-w-2xl w-full">
          {/* Play/Pause */}
          <button
            id="play-pause-btn"
            onClick={status === "playing" ? handlePause : handleResume}
            className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {status === "playing" ? (
              <Pause size={24} />
            ) : (
              <Play size={24} className="ml-1" />
            )}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              className="w-full h-14 pl-4 pr-12 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 outline-none font-medium"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askAI(question)}
              placeholder="Ask a question..."
              disabled={status === "listening" || status === "thinking"}
            />
            <button
              onClick={() => askAI(question)}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Send size={20} />
            </button>
          </div>

          {/* Mic */}
          <div className="border-l border-slate-200 dark:border-slate-800 pl-2">
            <Microphone
              onTranscript={handleUserVoice}
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reader;
