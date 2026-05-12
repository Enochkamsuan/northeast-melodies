import { useSyncExternalStore } from "react";
import { SONGS } from "../data/mockSongs";

const KEY = "lairikbeats:nowplaying";

const defaultState = { songId: SONGS[0]?.id ?? null };

let state = defaultState;
const listeners = new Set();

// Hydrate from localStorage on the client
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

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return defaultState;
}

export function useCurrentSong() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const song =
    SONGS.find((x) => String(x.id) === String(s.songId)) || SONGS[0];

  return song;
}