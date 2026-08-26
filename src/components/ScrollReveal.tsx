import { useEffect, useMemo, useRef } from "react";

// Adapted from React Bits' ScrollReveal (https://reactbits.dev).
//
// Changes from the original:
// - Takes the text as a `text` string prop instead of JSX children.
//   Astro passes framework-component children across the Astro->React
//   boundary as a slot, not a plain JS string, so the original's
//   `typeof children === "string"` check never held — every instance
//   rendered one empty span. A prop crosses that boundary as a real
//   string.
// - Uses the gsap/ScrollTrigger already loaded on `window` from the CDN
//   scripts in the page <head>, instead of importing its own copy of gsap.
//   That's required for it to share timing with the site's Lenis smooth
//   scroll (main.js wires `lenis.on("scroll", ScrollTrigger.update)` onto
//   that same global ScrollTrigger instance) — a second, separately
//   bundled gsap instance wouldn't get those updates and would drift.
// - Renders as a plain <p>, not the original's <h2><p>...</p></h2>, since
//   this is used for existing description paragraphs, not standalone
//   headings — the site's own CSS classes handle typography.
// - Drops the original's `scrub: true` + rotation. Scrub ties opacity
//   directly to raw scroll position, which — stacked on top of Lenis's
//   own scroll smoothing — read as laggy/glitchy, and reverses (words
//   blur back out) on the smallest scroll-up wobble. Fires once instead,
//   same discrete on-enter pattern the rest of the site's reveals use:
//   cheaper (one ScrollTrigger per paragraph instead of three) and
//   doesn't fight Lenis.
interface ScrollRevealProps {
  text: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
}

export default function ScrollReveal({
  text,
  enableBlur = true,
  baseOpacity = 0.1,
  blurStrength = 6,
  containerClassName = "",
  textClassName = "",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const splitText = useMemo(() => {
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    var gsap = (window as any).gsap;
    var ScrollTrigger = (window as any).ScrollTrigger;
    if (!gsap || !ScrollTrigger) return; // CDN scripts blocked/failed — leave text as plain, visible

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var wordElements = el.querySelectorAll(".word");
    // will-change:filter is what actually lets the browser hand `blur()`
    // to the compositor instead of doing main-thread repaints — without
    // it, filter animations often fall back to software blur, which is
    // what was causing the lag. Only earns its keep while running, so
    // it's cleared the moment the fade finishes (see onComplete below).
    var willChange = enableBlur ? "opacity, filter" : "opacity";
    var from: Record<string, any> = { opacity: baseOpacity, willChange: willChange };
    if (enableBlur) from.filter = "blur(" + blurStrength + "px)";

    var tween = gsap.fromTo(wordElements, from, {
      ease: "power1.out",
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.25,
      stagger: 0.03,
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        gsap.set(wordElements, { clearProps: "willChange" });
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [enableBlur, baseOpacity, blurStrength]);

  return (
    <p ref={containerRef} className={containerClassName}>
      <span className={textClassName}>{splitText}</span>
    </p>
  );
}
