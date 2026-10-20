import { useEffect, useState } from "react";
import LineSidebar from "./LineSidebar";

interface Section { id: string; label: string }

// scroll-spy wrapper: highlights the section nearest the top third of the
// viewport and scrolls via Lenis (exposed on window by main.js) when clicked.
export default function SectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.35;
      let idx: number | null = null;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      setActive(idx);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <LineSidebar
      items={sections.map((s) => s.label)}
      active={active}
      onItemClick={(i) => {
        const el = document.getElementById(sections[i].id);
        if (!el) return;
        const lenis = (window as any).__lenis;
        if (lenis) lenis.scrollTo(el, { offset: -24 });
        else el.scrollIntoView({ behavior: "smooth" });
      }}
    />
  );
}
