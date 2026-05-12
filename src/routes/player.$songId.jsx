import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Heart, Bookmark, Shuffle, Repeat, ListMusic, Mic2,
  Play, Pause, Square, SkipBack, SkipForward,
} from "lucide-react";
import { SONGS } from "../data/mockSongs";
import { setCurrentSong } from "../store/playerStore";

export const Route = createFileRoute("/player/$songId")({
  component: PlayerPage,
  head: ({ params }) => ({
    meta: [
      { title: `Now Playing — LairikBeats` },
      { name: "description", content: `Listening to track ${params.songId} on LairikBeats.` },
    ],
  }),
});

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80";

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

  const index = SONGS.findIndex((s) => String(s.id) === String(songId));
  const song = index >= 0 ? SONGS[index] : SONGS[0];

  // Keep the global "now playing" in sync with the visited track
  useEffect(() => { setCurrentSong(song.id); }, [song.id]);

  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(32);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(true);

  const queue = useMemo(() => {
    const rest = SONGS.filter((s) => s.id !== song.id);
    return shuffle ? [...rest].sort(() => Math.random() - 0.5) : rest;
  }, [song.id, shuffle]);

  const goTo = (id) => navigate({ to: "/player/$songId", params: { songId: String(id) } });
  const next = () => goTo(queue[0]?.id ?? song.id);
  const prev = () => {
    const i = SONGS.findIndex((s) => s.id === song.id);
    const p = SONGS[(i - 1 + SONGS.length) % SONGS.length];
    goTo(p.id);
  };
  const stop = () => { setPlaying(false); setProgress(0); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 glass border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-bold text-gradient">LairikBeats</Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Library</Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.2fr_1fr]">
        {/* Now Playing */}
        <section className="glass rounded-3xl">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-muted shadow-2xl shadow-primary/20">
            <img
              src={song.cover || FALLBACK_COVER}
              alt={`${song.artist} — ${song.title}`}
              className={`h-full w-full object-cover ${playing ? "animate-[spin_18s_linear_infinite]" : ""}`}
              style={{ animationPlayState: playing ? "running" : "paused" }}
            />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">{song.title}</h1>
            <p className="text-muted-foreground">{song.artist}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">{song.dialect}</span>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">{song.genre}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{song.mood}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <input
              type="range" min={0} max={100} value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>{fmt(progress)}</span><span>3:30</span>
            </div>
          </div>

          {/* Primary controls */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <CtrlBtn active={shuffle} onClick={() => setShuffle((v) => !v)} label="Shuffle"><Shuffle size={18} /></CtrlBtn>
            <CtrlBtn onClick={prev} label="Previous"><SkipBack size={20} /></CtrlBtn>
            <button
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? "Pause" : "Play"}
              className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:scale-105"
            >
              {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>
            <CtrlBtn onClick={stop} label="Stop"><Square size={18} fill="currentColor" /></CtrlBtn>
            <CtrlBtn onClick={next} label="Next"><SkipForward size={20} /></CtrlBtn>
            <CtrlBtn active={repeat} onClick={() => setRepeat((v) => !v)} label="Repeat"><Repeat size={18} /></CtrlBtn>
          </div>

          {/* Secondary actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <ToggleChip active={liked} onClick={() => setLiked((v) => !v)} icon={<Heart size={14} fill={liked ? "currentColor" : "none"} />}>Like</ToggleChip>
            <ToggleChip active={saved} onClick={() => setSaved((v) => !v)} icon={<Bookmark size={14} fill={saved ? "currentColor" : "none"} />}>Save</ToggleChip>
            <ToggleChip active={showLyrics} onClick={() => setShowLyrics((v) => !v)} icon={<Mic2 size={14} />}>Lyrics</ToggleChip>
            <ToggleChip active={showQueue} onClick={() => setShowQueue((v) => !v)} icon={<ListMusic size={14} />}>Up Next</ToggleChip>
          </div>
        </section>

        {/* Side panel */}
        <aside className="space-y-6">
          {showLyrics && (
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-3 flex items-center gap-2 font-semibold"><Mic2 size={16} /> Lyrics</h2>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                {MOCK_LYRICS.join("\n")}
              </pre>
            </div>
          )}
          {showQueue && (
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-3 flex items-center gap-2 font-semibold"><ListMusic size={16} /> Up Next</h2>
              <ul className="divide-y divide-border">
                {queue.slice(0, 8).map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => goTo(s.id)}
                      className="flex w-full items-center gap-3 py-2.5 text-left transition hover:bg-secondary/40 rounded-lg px-2"
                    >
                      <img src={s.cover || FALLBACK_COVER} alt="" className="h-10 w-10 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{s.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.artist} · {s.dialect}</p>
                      </div>
                      <Play size={14} className="text-muted-foreground" />
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

function CtrlBtn({ children, onClick, active, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={!!active}
      className={`grid h-10 w-10 place-items-center rounded-full border border-border transition hover:bg-secondary ${active ? "text-primary border-primary/50" : "text-muted-foreground"}`}
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
        active ? "border-primary/50 bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-secondary"
      }`}
    >
      {icon}{children}
    </button>
  );
}

function fmt(pct) {
  const total = 210; // 3:30
  const sec = Math.round((pct / 100) * total);
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}
