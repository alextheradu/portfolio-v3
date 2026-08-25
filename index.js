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
  gsap.set(
    [
      ".wordmark",
      "nav a",
      "nav .sep",
      ".eyebrow",
      ".hero h1",
      ".role",
      ".hero p:not(.eyebrow):not(.role)",
      "#about h2",
      "#about p",
      "#expertise h2",
      ".expertise-item",
      "#projects h2",
      ".project",
      "footer p",
      ".hl-bg",
    ],
    { force3D: true }
  );

  var tl = gsap.timeline({
    defaults: { ease: "power1.out", duration: 0.45 },
  });

  tl.from(".wordmark", { opacity: 0, y: 8 })
    .from("nav a, nav .sep", { opacity: 0, y: 8, stagger: 0.02 }, "<0.05")
    .from(".eyebrow", { opacity: 0, y: 10 }, "<0.05")
    .from(".hero h1", { opacity: 0, y: 10 }, "<0.05")
    .from(".role", { opacity: 0, y: 10 }, "<0.06")
    .to(
      ".role .hl-bg",
      { scaleX: 1, duration: 0.35, ease: "power2.out" },
      "<0.15"
    )
    .from(".hero p:not(.eyebrow):not(.role)", { opacity: 0, y: 10 }, "<0.1")
    .from("#about h2", { opacity: 0, y: 10 }, "<0.1")
    .from("#about p", { opacity: 0, y: 10 }, "<0.08")
    .to(
      "#about .hl-bg",
      { scaleX: 1, duration: 0.35, stagger: 0.08, ease: "power2.out" },
      "<0.15"
    )
    .from("#expertise h2", { opacity: 0, y: 10 }, "<0.15")
    .from(".expertise-item", { opacity: 0, y: 12, stagger: 0.03 }, "<0.1")
    .from("#projects h2", { opacity: 0, y: 10 }, "<0.1")
    .from(".project", { opacity: 0, y: 12, stagger: 0.03 }, "<0.1")
    .from("footer p", { opacity: 0, y: 10 }, "<0.15");
})();