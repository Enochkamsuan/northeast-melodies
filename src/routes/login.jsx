import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { saveUser } from "../lib/auth";
import Navbar from "../components/Navbar.jsx";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Log in — LairikBeats" },
      { name: "description", content: "Log in to LairikBeats." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  function onSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    saveUser({ name: form.email.split("@")[0], email: form.email });
    toast.success("Signed in successfully", {
      description: "Session will be remembered for 2 days.",
    });
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12 sm:py-20">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Log in to continue listening.</p>
        </div>
        <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none transition focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none transition focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Log in
          </button>
          <p className="text-center text-xs text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="text-foreground underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
