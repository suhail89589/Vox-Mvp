import { useState, useRef } from "react";
import { Mic, Square, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const Microphone = ({ onTranscript, onRecordingStart, onRecordingStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      if (onRecordingStart) onRecordingStart();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        if (onRecordingStop) onRecordingStop();

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

        if (audioBlob.size === 0) {
          console.error("Empty audio recording");
          alert("No audio detected.");
          return;
        }

        await handleTranscribe(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone Access Error:", err);
      alert("Could not access microphone. Check permissions.");
      if (onRecordingStop) onRecordingStop();
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async (audioBlob) => {
    setProcessing(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    try {
      const res = await api.post("/voice/stt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.transcript) {
        onTranscript(res.data.transcript);
      }
    } catch (err) {
      console.error("Transcription Failed:", err);
      alert("Failed to transcribe audio.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* 1. Animated Ripple Effect (Visible only when recording) */}
      {isRecording && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-full h-full rounded-full bg-red-500/30"
          />
          <motion.div
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
            className="absolute w-full h-full rounded-full bg-red-500/20"
          />
        </div>
      )}

      {/* 2. Main Button */}
      <motion.button
        id="mic-trigger-btn"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={processing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative z-10 flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-all duration-300
          ${
            isRecording
              ? "bg-red-500 text-white shadow-red-500/40"
              : processing
              ? "bg-indigo-400 text-white cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30"
          }
        `}
        title={isRecording ? "Stop Recording" : "Start Voice Input"}
        aria-label={isRecording ? "Stop Recording" : "Start Voice Input"}
      >
        <AnimatePresence mode="wait">
          {processing ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Loader2 className="animate-spin" size={24} />
            </motion.div>
          ) : isRecording ? (
            <motion.div
              key="stop"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Square size={20} fill="currentColor" className="rounded-[2px]" />
            </motion.div>
          ) : (
            <motion.div
              key="mic"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Mic size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 3. Helper Label (Optional) */}
      {!isRecording && !processing && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-400 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          Tap to Speak
        </div>
      )}
    </div>
  );
};

export default Microphone;
