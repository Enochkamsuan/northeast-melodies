import { Music2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-emerald to-violet text-primary-foreground">
              <Music2 size={18} />
            </span>
            <span className="text-lg font-semibold">
              Lairik<span className="text-gradient">Beats</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Streaming the sounds of Nagaland, Manipur and the wider Northeast — one dialect at a
            time.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#explore" className="hover:text-foreground">
                Library
              </a>
            </li>
            <li>
              <a href="#dialects" className="hover:text-foreground">
                Dialects
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Genres
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-foreground">
                Login
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Signup
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LairikBeats. Made with love in the Northeast.
      </div>
    </footer>
  );
}
