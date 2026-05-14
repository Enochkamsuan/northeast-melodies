import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSongs } from "../hooks/useSongs";
import SongCard from "./SongCard";

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border bg-secondary/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SearchMusic() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [dialect, setDialect] = useState("");
  const [mood, setMood] = useState("");

  const { songs = [], isLoading } = useSongs();

  const dialectOptions = useMemo(() => {
    return [...new Set(songs.map((s) => s.dialect).filter(Boolean))];
  }, [songs]);

  const genreOptions = useMemo(() => {
    return [...new Set(songs.map((s) => s.genre).filter(Boolean))];
  }, [songs]);

  const moodOptions = useMemo(() => {
    return [...new Set(songs.map((s) => s.mood).filter(Boolean))];
  }, [songs]);

  const results = useMemo(() => {
    return songs.filter((s) => {
      const searchText = `${s.title} ${s.artist}`.toLowerCase();

      const matchQ = q ? searchText.includes(q.toLowerCase()) : true;

      return (
        matchQ &&
        (!genre || s.genre === genre) &&
        (!dialect || s.dialect === dialect) &&
        (!mood || s.mood === mood)
      );
    });
  }, [q, genre, dialect, mood, songs]);

  return (
    <section id="explore" className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">Explore the Library</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Filter by dialect, genre or mood to find your next favorite track.
          </p>
        </div>

        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          {results.length} results
        </span>
      </div>

      <div className="mt-8 glass rounded-2xl p-4 sm:p-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search songs or artists…"
            className="w-full rounded-xl border border-border bg-background/50 py-3 pl-12 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label="Dialect / Language"
            value={dialect}
            onChange={setDialect}
            options={dialectOptions}
          />

          <Select label="Genre" value={genre} onChange={setGenre} options={genreOptions} />

          <Select label="Mood" value={mood} onChange={setMood} options={moodOptions} />
        </div>
      </div>

      {isLoading && <p className="mt-12 text-center text-muted-foreground">Loading songs...</p>}

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((s, i) => (
          <SongCard key={s.id} song={s} index={i} />
        ))}
      </div>

      {!isLoading && results.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">No songs match your filters yet.</p>
      )}
    </section>
  );
}
