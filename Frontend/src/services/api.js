// src/services/api.js
import axios from "axios";

const api = axios.create({
  // ✅ Paste your Render URL here, and make sure to add "/api" at the end
  baseURL: "https://gfgbq-team-losers-backend1.onrender.com/api",
});

export default api;
