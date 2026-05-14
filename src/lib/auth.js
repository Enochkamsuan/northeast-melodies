// Simple client-side auth using localStorage with a 2-day expiry.
const KEY = "lairikbeats.auth";
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export function saveUser(user) {
  if (typeof window === "undefined") return;
  const payload = {
    user,
    expiresAt: Date.now() + TWO_DAYS_MS,
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
  // also drop a cookie so it's visible to the server if ever needed
  const expires = new Date(payload.expiresAt).toUTCString();
  document.cookie = `${KEY}=${encodeURIComponent(user.email || user.name || "user")}; expires=${expires}; path=/`;
  window.dispatchEvent(new Event("auth-changed"));
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed.user;
  } catch {
    return null;
  }
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  document.cookie = `${KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  window.dispatchEvent(new Event("auth-changed"));
}
