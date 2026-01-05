import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, FileText, AlertCircle, Loader2 } from "lucide-react";
import Reader from "./Reader";
import api from "../services/api";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- LOGIC PRESERVED ---
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
      const res = await api.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
  // -----------------------

  return (
    <section
      id="upload-section"
      className="min-h-[80vh] flex flex-col justify-center py-20 bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {!sessionId ? (
            <motion.div
              key="upload-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 lg:p-12 border border-slate-100 dark:border-slate-800 text-center">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <FileUp size={32} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                    Upload your Document
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-lg">
                    We support PDF files up to 10MB.
                  </p>
                </div>

                {/* Styled Input Zone */}
                <div className="relative group">
                  <input
                    type="file"
                    accept="application/pdf"
                    id="file-upload"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={loading}
                  />
                  <div
                    className={`
                    border-3 border-dashed rounded-2xl p-8 transition-all duration-300
                    flex flex-col items-center justify-center gap-3
                    ${
                      file
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 group-hover:border-indigo-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800"
                    }
                  `}
                  >
                    {file ? (
                      <>
                        <FileText
                          size={40}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                        <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-full px-4">
                          {file.name}
                        </span>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wide">
                          Click to change
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-400 dark:text-slate-500">
                          Drag & drop or click to browse
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex items-center justify-center gap-2 text-red-500 mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                    >
                      <AlertCircle size={18} />
                      <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={uploadPdf}
                  disabled={loading || !file}
                  className={`
                    w-full mt-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform
                    ${
                      loading || !file
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />{" "}
                      Processing...
                    </>
                  ) : (
                    "Start Learning"
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reader-view"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full"
            >
              <Reader sessionId={sessionId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Upload;
