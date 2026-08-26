(function () {
  // always reveal, whether or not the animation below actually runs —
  // otherwise a blocked/failed CDN script leaves the page invisible
  var reveal = function () {
    document.documentElement.classList.remove("gsap-loading");
  };

  if (typeof gsap === "undefined") {
    reveal();
    return;
  }

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    reveal();
    return;
  }

  var hasScrollTrigger = typeof ScrollTrigger !== "undefined";
  if (hasScrollTrigger) {
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

    if (hasScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // keep in sync with the hidden-on-load selector list in global.css
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
      ".expertise-row",
      "#projects h2",
      ".project-row",
      "footer p",
    ],
    { force3D: true }
  );

  // ---------- hero + header: animate in immediately, top to bottom ----------
  var tl = gsap.timeline({
    defaults: { ease: "power1.out", duration: 0.45 },
  });

  tl.from(".wordmark", { opacity: 0, y: 8 })
    .from("nav a, nav .sep", { opacity: 0, y: 8, stagger: 0.02 }, "<0.05")
    .from(".eyebrow", { opacity: 0, y: 10 }, "<0.05")
    .from(".hero h1", { opacity: 0, y: 10 }, "<0.05")
    .from(".role", { opacity: 0, y: 10 }, "<0.06")
    .from(".hero p:not(.eyebrow):not(.role)", { opacity: 0, y: 10 }, "<0.1");

  reveal();

  // no ScrollTrigger available (CDN blocked/failed) — everything below
  // the hero just stays visible, no scroll animation. still fine.
  if (!hasScrollTrigger) return;

  // ---------- everything below the hero: reveal as it scrolls into view ----------
  var revealOnEnter = function (selector, vars) {
    gsap.from(
      selector,
      Object.assign(
        {
          opacity: 0,
          y: 14,
          duration: 0.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: selector,
            start: "top bottom",
            toggleActions: "play none none none",
          },
        },
        vars
      )
    );
  };

  revealOnEnter("#about h2", {});
  revealOnEnter("#about p", { y: 10 });
  revealOnEnter("#expertise h2", {});
  revealOnEnter("#projects h2", {});
  revealOnEnter("footer p", {});

  // rows: pre-hide up front (so nothing flashes before its batch enters),
  // then cascade each batch of rows in together as they cross the trigger
  var revealRows = function (selector) {
    gsap.set(selector, { opacity: 0, y: 14 });
    ScrollTrigger.batch(selector, {
      start: "top bottom",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power1.out",
          stagger: 0.08,
        });
      },
    });
  };

  revealRows(".expertise-row");
  revealRows(".project-row");
})();
