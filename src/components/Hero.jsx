import { Play, Sparkles, Disc3 } from "lucide-react";

export default function Hero() {
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
            Stream and explore songs by dialect, genre and mood — from Tangkhul gospel
            to Manipuri pop, Rongmei festival drums to Nagamese street soul.
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
            <div><span className="text-xl font-bold text-foreground">7+</span><br />Dialects</div>
            <div className="h-8 w-px bg-border" />
            <div><span className="text-xl font-bold text-foreground">200+</span><br />Mock tracks</div>
            <div className="h-8 w-px bg-border" />
            <div><span className="text-xl font-bold text-foreground">∞</span><br />Stories</div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald/30 via-violet/30 to-tribal/30 blur-2xl" />
          <div className="relative glass rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald to-violet">
                  <Disc3 size={22} className="animate-spin text-primary-foreground [animation-duration:6s]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Now Playing</p>
                  <p className="font-semibold">Hingmi Khangai</p>
                </div>
              </div>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">Tangkhul</span>
            </div>

            <div className="mt-6">
              <div className="flex h-20 items-end gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-emerald via-violet to-tribal"
                    style={{
                      height: `${20 + Math.abs(Math.sin(i * 0.6)) * 80}%`,
                      opacity: 0.5 + (i % 4) * 0.15,
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-emerald to-violet" />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>1:42</span><span>4:08</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {["Gospel", "Folk", "Festive"].map((t) => (
                <div key={t} className="rounded-xl border border-border bg-secondary/50 p-3 text-center text-xs font-medium">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
