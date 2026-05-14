import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Music2 } from "lucide-react";
import { toast } from "sonner";
import { getUser, clearUser } from "../lib/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setUser(getUser());
    sync();
    window.addEventListener("auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Welcome-back toast when an existing session is found
  useEffect(() => {
    if (!user) return;
    const flagKey = "lairikbeats.welcomed";
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem(flagKey)) return;
    sessionStorage.setItem(flagKey, "1");
    toast.success("Signed in successfully", {
      description: `Welcome back, ${user.name || user.email}.`,
    });
  }, [user]);

  function handleLogout() {
    clearUser();
    toast.success("Logged out", { description: "Your session has ended." });
    setOpen(false);
    if (typeof sessionStorage !== "undefined") sessionStorage.removeItem("lairikbeats.welcomed");
    navigate({ to: "/" });
  }

  const links = user
    ? [{ label: "Logout", action: "logout" }]
    : [
        { label: "Login", to: "/login" },
        { label: "Signup", to: "/signup", primary: true },
      ];

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-emerald to-violet text-primary-foreground">
            <Music2 size={18} />
          </span>
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            Lairik<span className="text-gradient">Beats</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-2 md:flex">
          {user && (
            <li className="mr-2 text-sm text-muted-foreground">
              Hi, <span className="text-foreground">{user.name || user.email}</span>
            </li>
          )}
          {links.map((l) =>
            l.action === "logout" ? (
              <li key={l.label}>
                <button
                  onClick={handleLogout}
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </button>
              </li>
            ) : (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className={
                    l.primary
                      ? "rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                      : "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  }
                >
                  {l.label}
                </Link>
              </li>
            ),
          )}
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
          <ul className="flex flex-col gap-1 px-4 py-4">
            {user && (
              <li className="px-4 py-2 text-sm text-muted-foreground">
                Hi, <span className="text-foreground">{user.name || user.email}</span>
              </li>
            )}
            {links.map((l) =>
              l.action === "logout" ? (
                <li key={l.label}>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {l.label}
                  </button>
                </li>
              ) : (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={
                      l.primary
                        ? "block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        : "block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }
                  >
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
