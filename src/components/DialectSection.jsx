import { FEATURED_DIALECTS } from "../data/filters";

export default function DialectSection() {
  return (
    <section id="dialects" className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">Featured Dialects</h2>
          <p className="mt-2 text-muted-foreground">Voices from the hills, valleys and rivers of the Northeast.</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {FEATURED_DIALECTS.map((d) => (
          <a
            key={d.name}
            href="#explore"
            className={`group relative h-44 overflow-hidden rounded-2xl border border-border bg-linear-to-br ${d.hue} p-5 transition hover:-translate-y-1 hover:border-primary/40`}
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            <p className="text-xs uppercase tracking-widest text-foreground/70">{d.tag}</p>
            <p className="mt-2 text-2xl font-bold">{d.name}</p>
            <span className="absolute bottom-4 right-5 text-sm font-medium text-foreground/70 transition group-hover:text-foreground">
              Listen →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
