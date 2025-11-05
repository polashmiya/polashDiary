import axios from "axios";
import { toast } from "react-hot-toast";

export const BASE_URL = "https://polash-dairy-api.onrender.com/api";

// Storage keys
const TOKEN_KEY = "authToken";

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
  // Prevent infinite pending requests that can lock the UI behind a loader
  timeout: 12000, // 12s network timeout; adjust as needed
});

// Attach token if available
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Clear token on unauthorized
      try { localStorage.removeItem("authToken"); } catch { /* noop */ void 0; }
    }
    const message = err?.response?.data?.message || err?.response?.data?.error || err.message || "Request failed";
    try { toast.error(message); } catch { /* ignore toast errors in non-UI contexts */ }
    return Promise.reject(new Error(message));
  }
);

export const api = {
  get: (url, config) => http.get(url, config).then((r) => r.data),
  post: (url, data, config) => http.post(url, data, config).then((r) => r.data),
  put: (url, data, config) => http.put(url, data, config).then((r) => r.data),
  patch: (url, data, config) => http.patch(url, data, config).then((r) => r.data),
  delete: (url, config) => http.delete(url, config).then((r) => r.data),
};

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
