import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { saveUser, getUser } from "../lib/auth";
import Navbar from "../components/Navbar.jsx";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Sign up — LairikBeats" },
      { name: "description", content: "Create your LairikBeats account." },
    ],
  }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    const existing = getUser();
    if (existing && existing.email === form.email) {
      toast("Welcome back", { description: "You're already signed in." });
      navigate({ to: "/" });
      return;
    }
    saveUser({ name: form.name, email: form.email });
    toast.success("Sign up successful", {
      description: `Welcome, ${form.name}! Session valid for 2 days.`,
    });
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12 sm:py-20">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join LairikBeats — your session lasts 2 days.
          </p>
        </div>
        <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Sign up
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );
}
