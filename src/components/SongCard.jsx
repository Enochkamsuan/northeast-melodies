import { Play } from "lucide-react";

// Fallback image used when a song has no `cover` set.
const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80";

export default function SongCard({ song }) {
  const cover = song.cover || FALLBACK_COVER;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
<<<<<<< HEAD
      <div className={`relative aspect-square overflow-hidden rounded-xl bg-linear-to-br ${grad}`}>
        <div className="absolute inset-0 opacity-30 [background-image:radial-linear(circle_at_30%_20%,white,transparent_40%)]" />
=======
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <img
          src={cover}
          alt={`${song.artist} — ${song.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
>>>>>>> d2dd8388f9052fc537fbf502d0a683e7c8ab768c
        <button
          aria-label={`Play ${song.title}`}
          className="absolute bottom-3 right-3 grid h-12 w-12 translate-y-3 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Play size={18} fill="currentColor" />
        </button>
      </div>
      <div className="mt-4">
        <h3 className="truncate font-semibold">{song.title}</h3>
        <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">{song.dialect}</span>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">{song.genre}</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{song.mood}</span>
        </div>
      </div>
    </article>
  );
}
