import { useSyncExternalStore } from "react";

const KEY = "lairikbeats:nowplaying";

let state = { songId: null };
const listeners = new Set();

if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(KEY);

    if (raw) {
      const parsed = JSON.parse(raw);

      if (parsed && parsed.songId != null) {
        state = { songId: parsed.songId };
      }
    }
  } catch {}
}

function emit() {
  listeners.forEach((l) => l());
}

export function setCurrentSong(songId) {
  state = { songId };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }

  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => ({ songId: null });

export function useCurrentSongId() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  ).songId;
}

export function useCurrentSong(songs) {
  const id = useCurrentSongId();

  if (!songs?.length) return null;

  return songs.find((x) => String(x.id) === String(id)) || songs[0];
}