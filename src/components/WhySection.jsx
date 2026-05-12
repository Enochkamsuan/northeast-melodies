import { Mountain, Headphones, Globe2, Heart } from "lucide-react";

const ITEMS = [
  { icon: Mountain, title: "Made for the Hills", text: "Built around Northeast dialects you won't find on mainstream platforms." },
  { icon: Headphones, title: "Smart Discovery", text: "Filter by mood, dialect and genre — find a song that fits the moment." },
  { icon: Globe2, title: "Cultural First", text: "Every playlist celebrates a community, language and tradition." },
  { icon: Heart, title: "Artist Friendly", text: "Designed to lift independent voices from across the seven sisters." },
];

export default function WhySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Why <span className="text-gradient">LairikBeats</span></h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          A streaming home for Northeast Indian music — premium, modern, and rooted in culture.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br from-emerald to-violet text-primary-foreground">
              <Icon size={22} />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
