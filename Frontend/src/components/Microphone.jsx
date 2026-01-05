import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import api from "../services/api";

const Microphone = ({ onTranscript, onRecordingStart, onRecordingStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // Notify parent to stop timers immediately
      if (onRecordingStart) onRecordingStart();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        // Stop all tracks to release hardware
        stream.getTracks().forEach((track) => track.stop());

        // Notify parent that recording stopped (but processing is starting)
        if (onRecordingStop) onRecordingStop();

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

        // Validate Audio size
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
      // Ensure we reset state if permission fails
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
    // Security: Add file limit check here if not done in UI
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
    <button
      id="mic-trigger-btn"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={processing}
      className={`p-4 rounded-full transition-all duration-300 shadow-lg ${
        isRecording
          ? "bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-200"
          : "bg-indigo-600 hover:bg-indigo-700"
      } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isRecording ? "Stop Recording" : "Start Voice Input"}
      aria-label={isRecording ? "Stop Recording" : "Start Voice Input"}
    >
      {processing ? (
        <Loader2 className="animate-spin" size={24} />
      ) : isRecording ? (
        <Square size={24} fill="currentColor" />
      ) : (
        <Mic size={24} />
      )}
    </button>
  );
};

export default Microphone;
