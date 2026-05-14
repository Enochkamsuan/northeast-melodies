import { createFileRoute } from "@tanstack/react-router";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import SearchMusic from "../components/SearchMusic.jsx";
import DialectSection from "../components/DialectSection.jsx";
import GenreSection from "../components/GenreSection.jsx";
import WhySection from "../components/WhySection.jsx";
import Footer from "../components/Footer.jsx";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LairikBeats — Northeast Indian Music Streaming" },
      {
        name: "description",
        content:
          "Discover and stream Northeast Indian music by dialect, genre and mood — Nagamese, Manipuri, Tangkhul, Kuki, Rongmei, Liangmei and Zeme.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <SearchMusic />
        <DialectSection />
        <GenreSection />
        <WhySection />
      </main>
      <Footer />
    </div>
  );
}
