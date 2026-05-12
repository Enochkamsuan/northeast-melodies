import { useSyncExternalStore } from "react";

const KEY = "lairikbeats:nowplaying";

<<<<<<< HEAD
const defaultState = { songId: SONGS[0]?.id ?? null };

let state = defaultState;
=======
let state = { songId: null };
>>>>>>> 0dbc15a7aa37911aa3101562aeb11b4aa0bea42f
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
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).songId;
}

<<<<<<< HEAD
function getServerSnapshot() {
  return defaultState;
}

export function useCurrentSong() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const song =
    SONGS.find((x) => String(x.id) === String(s.songId)) || SONGS[0];

  return song;
}
=======
// Resolve current song from a provided songs list (so consumers stay decoupled
// from the data source — Spotify, mock, etc.)
export function useCurrentSong(songs) {
  const id = useCurrentSongId();
  if (!songs?.length) return null;
  return songs.find((x) => String(x.id) === String(id)) || songs[0];
}
>>>>>>> 0dbc15a7aa37911aa3101562aeb11b4aa0bea42f
