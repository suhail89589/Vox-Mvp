// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 🔥 THIS is the key
});

export default api;
