import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { clearUser, getUser } from "../lib/auth";

export const Route = createFileRoute("/logout")({
  component: LogoutPage,
});

function LogoutPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const u = getUser();
    clearUser();
    toast.success("Logged out", {
      description: u ? `See you soon, ${u.name || u.email}.` : "Your session has ended.",
    });
    navigate({ to: "/" });
  }, [navigate]);
  return null;
}
