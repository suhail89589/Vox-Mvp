import { useState } from "react";
import Reader from "./Reader";
import api from "../services/api";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (file) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (!file) return "Please select a PDF.";
    if (file.type !== "application/pdf") return "Only PDF files are allowed.";
    if (file.size > MAX_SIZE) return "File is too large (Max 10MB).";
    return null;
  };

  const uploadPdf = async () => {
    setError("");
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // ✅ Using your api instance
      const res = await api.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ FIX: Match the backend response structure
      // Backend returns: { success: true, sessionId: "..." }
      if (res.data.sessionId) {
        setSessionId(res.data.sessionId);
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message || "Upload failed. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="upload-section"
      className="py-16 text-center container mx-auto px-4"
    >
      {!sessionId ? (
        <div className="max-w-md mx-auto bg-slate-50 p-8 rounded-2xl border border-slate-200">
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Upload your PDF
          </h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 mb-6"
          />

          {error && (
            <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>
          )}

          <button
            onClick={uploadPdf}
            disabled={loading}
            className={`w-full text-white px-6 py-3 rounded-xl font-bold transition-all ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
            }`}
          >
            {loading ? "Processing PDF..." : "Start Learning"}
          </button>
        </div>
      ) : (
        <Reader sessionId={sessionId} />
      )}
    </section>
  );
};

export default Upload;
