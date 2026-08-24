(function () {
  if (typeof gsap === "undefined") return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ---------- smooth scroll ----------
  var lenis;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      anchors: true,
    });

    if (typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ---------- entrance, strictly top to bottom ----------
  var tl = gsap.timeline({
    defaults: { ease: "power2.out", duration: 0.5 },
  });

  tl.from(".wordmark", { opacity: 0, y: 6 })
    .from("nav a, nav .sep", { opacity: 0, y: 6, stagger: 0.03 }, "-=0.35")
    .from(
      ".eyebrow, .hero h1, .role",
      { opacity: 0, y: 10, stagger: 0.08 },
      "-=0.25"
    )
    .from(".hero p:not(.eyebrow):not(.role)", { opacity: 0, y: 10 }, "-=0.15")
    .from("#about h2", { opacity: 0, y: 12 }, "-=0.1")
    .from("#about p", { opacity: 0, y: 14 }, "-=0.25")
    .from("#expertise h2", { opacity: 0, y: 12 }, "-=0.1")
    .from(".expertise-item", { opacity: 0, y: 16, stagger: 0.08 }, "-=0.2")
    .from("#projects h2", { opacity: 0, y: 12 }, "-=0.1")
    .from(".project", { opacity: 0, y: 16, stagger: 0.08 }, "-=0.2")
    .from("footer p", { opacity: 0, y: 10 }, "-=0.1");
})();