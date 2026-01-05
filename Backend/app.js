import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";

import pdfRoutes from "./routes/pdf.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
const app = express();

app.use(helmet());
app.use(hpp());

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://vox-mvp.vercel.app/",
    ],
    credentials: true, 
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
  });
});
app.use("/api", apiLimiter);


app.use("/api/pdf", pdfRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/voice", voiceRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});


app.use(errorHandler);

export default app;
