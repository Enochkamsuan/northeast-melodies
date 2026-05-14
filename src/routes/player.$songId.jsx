import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Bookmark,
  Shuffle,
  Repeat,
  ListMusic,
  Mic2,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { useSongs } from "../hooks/useSongs";
import { setCurrentSong } from "../store/playerStore";

export const Route = createFileRoute("/player/$songId")({
  component: PlayerPage,
  head: ({ params }) => ({
    meta: [
      { title: `Now Playing — LairikBeats` },
      {
        name: "description",
        content: `Listening to track ${params.songId} on LairikBeats.`,
      },
    ],
  }),
});

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80";

const SONG_DURATION = 210;

const MOCK_LYRICS = [
  "[Verse 1]",
  "Hills awaken with the morning light,",
  "Voices rising — soft, then bright.",
  "",
  "[Chorus]",
  "Sing for the rivers, sing for the rain,",
  "Northeast hearts in a familiar refrain.",
  "",
  "[Verse 2]",
  "Drums of the valley, hymns from above,",
  "Every dialect a language of love.",
];

function PlayerPage() {
  const { songId } = Route.useParams();
  const navigate = useNavigate();
  const { songs, isLoading } = useSongs();

  const index = songs.findIndex((s) => String(s.id) === String(songId));
  const song = index >= 0 ? songs[index] : songs[0];

  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(true);

  useEffect(() => {
    if (song) {
      setCurrentSong(song.id);
      setProgress(0);
      setPlaying(true);
    }
  }, [song?.id]);

  const goTo = (id) =>
    navigate({ to: "/player/$songId", params: { songId: String(id) } });

  const next = () => {
    if (!song || songs.length === 0) return;

    const i = songs.findIndex((s) => String(s.id) === String(song.id));
    goTo(songs[(i + 1) % songs.length].id);
  };

  const prev = () => {
    if (!song || songs.length === 0) return;

    const i = songs.findIndex((s) => String(s.id) === String(song.id));
    goTo(songs[(i - 1 + songs.length) % songs.length].id);
  };

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (repeat) return 0;
          next();
          return 0;
        }

        return Math.min(prev + 100 / SONG_DURATION, 100);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playing, repeat, song?.id]);

  const queue = useMemo(() => {
    if (!song) return [];

    const rest = songs.filter((s) => s.id !== song.id);
    return shuffle ? [...rest].sort(() => Math.random() - 0.5) : rest;
  }, [song?.id, shuffle, songs]);

  const stop = () => {
    setPlaying(false);
    setProgress(0);
  };

  if (!song) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        {isLoading ? "Loading track…" : "Track not found"}
      </div>
    );
  }

  const cover = song.cover || FALLBACK_COVER;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 scale-110 opacity-40 blur-3xl"
        style={{
          backgroundImage: `url(${cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div aria-hidden className="absolute inset-0 -z-10 bg-aurora opacity-80" />

      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--background) 40%, transparent) 0%, var(--background) 90%)",
        }}
      />

      <header className="sticky top-0 z-20 glass border-b border-border/60">
        <div className="max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft size={16} /> Library
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-10 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <section className="relative">
          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-4xl opacity-70 blur-2xl"
              style={{
                background:
                  "conic-gradient(from 120deg, var(--emerald), var(--violet), var(--tribal), var(--emerald))",
              }}
            />

            <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-muted shadow-2xl">
              <img
                src={cover}
                alt={`${song.artist} — ${song.title}`}
                className="max-h-64 w-full object-cover transition-transform duration-700"
                style={{ transform: playing ? "scale(1.04)" : "scale(1)" }}
              />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="mb-3 flex flex-wrap justify-center gap-1.5">
              <Chip tone="primary">{song.dialect}</Chip>
              <Chip tone="accent">{song.genre}</Chip>
              <Chip tone="muted">{song.mood}</Chip>
            </div>

            <h1 className="text-balance text-base font-bold tracking-tight">
              {song.title}
            </h1>

            <p className="mt-1 text-muted-foreground">{song.artist}</p>
          </div>

          <div className="mx-auto mt-8 max-w-xl">
            <div className="group relative h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald via-violet to-tribal transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />

              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                aria-label="Seek"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>

            <div className="mt-2 flex justify-between text-[11px] tabular-nums text-muted-foreground">
              <span>{fmt(progress)}</span>
              <span>{fmt(100)}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
            <CtrlBtn
              active={shuffle}
              onClick={() => setShuffle((v) => !v)}
              label="Shuffle"
            >
              <Shuffle size={18} />
            </CtrlBtn>

            <CtrlBtn onClick={prev} label="Previous">
              <SkipBack size={20} />
            </CtrlBtn>

            <button
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? "Pause" : "Play"}
              className="group relative grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_40px_-10px_var(--primary)] transition hover:scale-105 active:scale-95"
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-primary opacity-50 blur-xl transition group-hover:opacity-80"
              />

              <span className="relative">
                {playing ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" />
                )}
              </span>
            </button>

            <CtrlBtn onClick={stop} label="Stop">
              <Square size={16} fill="currentColor" />
            </CtrlBtn>

            <CtrlBtn onClick={next} label="Next">
              <SkipForward size={20} />
            </CtrlBtn>

            <CtrlBtn
              active={repeat}
              onClick={() => setRepeat((v) => !v)}
              label="Repeat"
            >
              <Repeat size={18} />
            </CtrlBtn>
          </div>

          <div className="mx-auto mt-6 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Volume2 size={16} />

              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
                className="h-1 w-32 cursor-pointer accent-primary"
              />

              <span className="w-8 text-right text-[11px] tabular-nums">
                {volume}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ToggleChip
                active={liked}
                onClick={() => setLiked((v) => !v)}
                icon={<Heart size={14} fill={liked ? "currentColor" : "none"} />}
              >
                Like
              </ToggleChip>

              <ToggleChip
                active={saved}
                onClick={() => setSaved((v) => !v)}
                icon={
                  <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                }
              >
                Save
              </ToggleChip>

              <ToggleChip icon={<Share2 size={14} />}>Share</ToggleChip>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <SegBtn
              active={showQueue && !showLyrics}
              onClick={() => {
                setShowQueue(true);
                setShowLyrics(false);
              }}
            >
              <ListMusic size={14} /> Up Next
            </SegBtn>

            <SegBtn
              active={showLyrics && !showQueue}
              onClick={() => {
                setShowLyrics(true);
                setShowQueue(false);
              }}
            >
              <Mic2 size={14} /> Lyrics
            </SegBtn>

            <SegBtn
              active={showLyrics && showQueue}
              onClick={() => {
                setShowLyrics(true);
                setShowQueue(true);
              }}
            >
              Both
            </SegBtn>
          </div>
        </section>

        <aside className="space-y-6">
          {showLyrics && (
            <div className="glass rounded-3xl p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Mic2 size={14} /> Lyrics
              </h2>

              <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90">
                {MOCK_LYRICS.join("\n")}
              </pre>
            </div>
          )}

          {showQueue && (
            <div className="glass rounded-3xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <ListMusic size={14} /> Up Next
                </h2>

                <span className="text-[11px] text-muted-foreground">
                  {queue.length} tracks
                </span>
              </div>

              <ul className="max-h-96 space-y-1 overflow-y-auto">
                {queue.slice(0, 10).map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => goTo(s.id)}
                      className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-secondary/60"
                    >
                      <span className="w-5 text-right text-xs tabular-nums text-muted-foreground">
                        {i + 1}
                      </span>

                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={s.cover || FALLBACK_COVER}
                          alt=""
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                          <Play
                            size={14}
                            className="text-white"
                            fill="currentColor"
                          />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{s.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {s.artist} · {s.dialect}
                        </p>
                      </div>

                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        {fmt(100)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

function Chip({ children, tone = "muted" }) {
  const tones = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    muted: "bg-secondary text-muted-foreground",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function CtrlBtn({ children, onClick, active, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={!!active}
      className={`grid h-11 w-11 place-items-center rounded-full border transition hover:scale-105 hover:bg-secondary ${
        active
          ? "border-primary/60 bg-primary/10 text-primary"
          : "border-border/60 text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ToggleChip({ children, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-primary/50 bg-primary/15 text-primary"
          : "border-border/60 text-muted-foreground hover:bg-secondary"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function SegBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}

function fmt(pct) {
  const sec = Math.round((pct / 100) * SONG_DURATION);
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}