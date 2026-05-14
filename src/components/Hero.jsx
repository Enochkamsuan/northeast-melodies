import { useEffect, useState } from "react";
import { Play, Pause, Sparkles, Disc3, SkipForward, SkipBack } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useSongs } from "../hooks/useSongs";
import { setCurrentSong, useCurrentSong } from "../store/playerStore";

const TRACK_SECONDS = 248; // 4:08

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

export default function Hero() {
  const navigate = useNavigate();
  const { songs } = useSongs();
  const song = useCurrentSong(songs);
  const index = song
    ? Math.max(
        0,
        songs.findIndex((s) => s.id === song.id),
      )
    : 0;
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
  }, [song?.id]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setElapsed((e) => (e + 1) % TRACK_SECONDS);
    }, 1000);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    if (!songs.length) return;
    if (elapsed >= TRACK_SECONDS - 1) {
      const nextSong = songs[(index + 1) % songs.length];
      setCurrentSong(nextSong.id);
    }
  }, [elapsed, index, songs]);

  if (!song) return null;

  const next = () => setCurrentSong(songs[(index + 1) % songs.length].id);
  const prev = () => setCurrentSong(songs[(index - 1 + songs.length) % songs.length].id);
  const openPlayer = () => navigate({ to: "/player/$songId", params: { songId: String(song.id) } });

  const pct = (elapsed / TRACK_SECONDS) * 100;

  return (
    <section className="relative overflow-hidden bg-aurora">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles size={14} className="text-primary" />
            Sounds of the Seven Sisters
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
            Discover <span className="text-gradient">Northeast Indian</span> Music
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Stream and explore songs by dialect, genre and mood — from Tangkhul gospel to Manipuri
            pop, Rongmei festival drums to Nagamese street soul.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#explore"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] hover:opacity-95"
            >
              <Play size={16} fill="currentColor" /> Explore Music
            </a>
            <a
              href="#dialects"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Browse Dialects
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <div>
              <span className="text-xl font-bold text-foreground">7+</span>
              <br />
              Dialects
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="text-xl font-bold text-foreground">200+</span>
              <br />
              Mock tracks
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="text-xl font-bold text-foreground">∞</span>
              <br />
              Stories
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-4xl bg-linear-to-br from-emerald/30 via-violet/30 to-tribal/30 blur-2xl" />
          <div className="relative glass rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <button onClick={openPlayer} className="flex items-center gap-3 text-left">
                <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-linear-to-br from-emerald to-violet">
                  {song.cover ? (
                    <img
                      src={song.cover}
                      alt={song.title}
                      className={`h-full w-full object-cover ${playing ? "animate-spin animation-duration-[6s]" : ""}`}
                    />
                  ) : (
                    <Disc3
                      size={22}
                      className="animate-spin text-primary-foreground animation-duration-[6s]"
                    />
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Now Playing
                  </p>
                  <p className="font-semibold leading-tight">{song.title}</p>
                  <p className="text-xs text-muted-foreground">{song.artist}</p>
                </div>
              </button>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                {song.dialect}
              </span>
            </div>

            <div className="mt-6">
              <div className="flex h-20 items-end gap-1">
                {Array.from({ length: 32 }).map((_, i) => {
                  const base = 20 + Math.abs(Math.sin((i + elapsed) * 0.6)) * 80;
                  return (
                    <span
                      key={i}
                      className="flex-1 rounded-sm bg-linear-to-t from-emerald via-violet to-tribal transition-all duration-300"
                      style={{
                        height: `${playing ? base : 15}%`,
                        opacity: 0.5 + (i % 4) * 0.15,
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald to-violet transition-[width] duration-1000 ease-linear"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{fmt(elapsed)}</span>
                <span>{fmt(TRACK_SECONDS)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={prev}
                aria-label="Previous"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-secondary"
              >
                <SkipBack size={16} />
              </button>
              <button
                onClick={() => setPlaying((v) => !v)}
                aria-label={playing ? "Pause" : "Play"}
                className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105"
              >
                {playing ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-secondary"
              >
                <SkipForward size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
