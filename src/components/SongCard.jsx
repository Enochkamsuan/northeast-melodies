import { Play } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { setCurrentSong } from "../store/playerStore";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80";

export default function SongCard({ song }) {
  const cover = song.cover || FALLBACK_COVER;
  const navigate = useNavigate();
  const open = () => {
    setCurrentSong(song.id);
    navigate({ to: "/player/$songId", params: { songId: String(song.id) } });
  };
  return (
    <article
      onClick={open}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <img
          src={cover}
          alt={`${song.artist} — ${song.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-70" />
        <button
          aria-label={`Play ${song.title}`}
          onClick={(e) => { e.stopPropagation(); open(); }}
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
