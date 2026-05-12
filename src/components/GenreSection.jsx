import { GENRES } from "../data/mockSongs";
import { Flame, Heart, Music, PartyPopper, Church, Mic2, Guitar } from "lucide-react";

const ICONS = {
  Gospel: Church,
  "Love Song": Heart,
  "Festive Mode": Flame,
  "Party Mode": PartyPopper,
  Folk: Music,
  Worship: Mic2,
  Acoustic: Guitar,
};

export default function GenreSection() {
  return (
    <section className="bg-aurora">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Popular Genres</h2>
            <p className="mt-2 text-muted-foreground">From Sunday hymns to Saturday parties — pick your vibe.</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {GENRES.map((g) => {
            const Icon = ICONS[g] || Music;
            return (
              <a
                key={g}
                href="#explore"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card/70 p-5 transition hover:-translate-y-1 hover:border-primary/50"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br from-emerald/30 to-violet/30 text-primary">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="font-semibold">{g}</p>
                  <p className="text-xs text-muted-foreground">Curated playlist</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
