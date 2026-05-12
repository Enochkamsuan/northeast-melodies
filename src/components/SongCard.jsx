import { Play } from "lucide-react";

const COVER_GRADIENTS = [
  "from-emerald-500 to-teal-700",
  "from-violet-500 to-fuchsia-700",
  "from-amber-500 to-orange-700",
  "from-rose-500 to-pink-700",
  "from-indigo-500 to-blue-700",
  "from-lime-500 to-emerald-700",
];

export default function SongCard({ song, index = 0 }) {
  const grad = COVER_GRADIENTS[index % COVER_GRADIENTS.length];
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
      <div className={`relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${grad}`}>
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />
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
