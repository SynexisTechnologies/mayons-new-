// Resolves a product/variant image value into a usable <img src>.
// - Full URLs (http/https/data/blob) are returned untouched (back-compat with old links).
// - Bare filenames or "/uploads/x" are pointed at the backend's static /uploads mount.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export function imageUrl(src?: string | null): string {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  const clean = src.replace(/^\/?uploads\//, "");
  return `${SERVER_ORIGIN}/uploads/${clean}`;
}
