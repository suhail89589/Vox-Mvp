import express from "express";
import cors from "cors";
import morgan from "morgan"; // SECURITY: Headers
import hpp from "hpp"; // SECURITY: Parameter Pollution
import mongoSanitize from "express-mongo-sanitize"; // SECURITY: NoSQL Injection


import bookRoutes from "../routes/pdf.routes.js";
import aiRoutes from "../routes/ai.routes.js";
import voiceRoutes from "../routes/voice.routes.js";

import errorHandler from "../middleware/error.middleware.js";

const app = express();


app.use(helmet()); // Secure HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Dynamic CORS for Production
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json({ limit: "10mb" })); // Limit body size
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// ... other middlewares
app.use(express.json());

// ...
// ==================
// ❤️ Health Check
// ==================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// ==================
// 🧭 Routes


app.use("/api/pdfs", bookRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api/voice", voiceRoutes);

// ==================
// ❌ 404 Handler
// ==================
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// ==================
// 🛑 Global Error Handler
// ==================
app.use(errorHandler);

export default app;
