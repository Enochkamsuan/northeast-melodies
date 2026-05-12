import { useState } from "react";
import { Menu, X, Music2 } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = ["Login", "Logout", "Signup"];

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-emerald to-violet text-primary-foreground">
            <Music2 size={18} />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Lairik<span className="text-gradient">Beats</span>
          </span>
        </a>

        <ul className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <li key={l}>
              <a
                href="#"
                className={
                  l === "Signup"
                    ? "rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    : "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                }
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
