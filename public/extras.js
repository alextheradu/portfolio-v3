// interactive extras: progress bar,
// goal count-up, and the project dialog. everything is
// independent of gsap/lenis so a blocked CDN can't break it.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var lenis = function () { return window.__lenis; };

  // ---------- scroll progress ----------
  var bar = $(".progress");
  var onScroll = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- goals: bars fill + numbers count up when scrolled to ----------
  var goalRows = $$(".goal-row");
  if (goalRows.length && "IntersectionObserver" in window && !reduced) {
    goalRows.forEach(function (row) {
      $(".goal-bar-fill", row).style.width = "0%";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var fill = $(".goal-bar-fill", en.target);
        var num = $(".count-num", en.target);
        var to = Number(num.getAttribute("data-to"));
        requestAnimationFrame(function () {
          fill.style.transition = "width 1.1s cubic-bezier(.2,.8,.2,1)";
          fill.style.width = fill.getAttribute("data-percent") + "%";
        });
        var t0 = performance.now();
        (function tick(now) {
          var p = Math.min(1, (now - t0) / 1100);
          num.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.4 });
    goalRows.forEach(function (r) { io.observe(r); });
  }

  // ---------- project dialog ----------
  var dlg = $("#project-dialog");
  var body = $(".pd-body", dlg);
  var projects = JSON.parse($("#projects-data").textContent);
  var lastFocus = null;

  // warm the cache so a project's image is already there when it opens
  projects.forEach(function (p) { if (p.image) new Image().src = p.image; });

  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  function fill(p, index) {
    body.textContent = "";
    var media = el("div", "pd-media");
    var idx = el("span", "pd-index", String(index + 1).padStart(2, "0"));
    if (p.image) {
      var img = el("img");
      img.decoding = "sync";
      img.src = p.image;
      img.alt = p.title + " screenshot";
      img.addEventListener("error", function () { img.remove(); media.appendChild(idx); });
      media.appendChild(img);
    } else {
      media.appendChild(idx);
    }
    body.appendChild(media);

    var main = el("div", "pd-main");
    var head = el("div", "pd-head");
    var title = el("h3", null, p.title);
    title.id = "pd-title";
    var close = el("button", "pd-close", "esc ✕");
    close.type = "button";
    close.setAttribute("aria-label", "close");
    close.addEventListener("click", closeDialog);
    head.appendChild(title);
    head.appendChild(close);
    main.appendChild(head);

    var tags = el("div", "tags");
    p.tags.forEach(function (t) { tags.appendChild(el("span", null, t)); });
    main.appendChild(tags);
    main.appendChild(el("p", "pd-summary", p.summary));

    if (p.highlights && p.highlights.length) {
      var ul = el("ul", "pd-highlights");
      p.highlights.forEach(function (h) { ul.appendChild(el("li", null, h)); });
      main.appendChild(ul);
    }
    var links = el("div", "pd-links");
    (p.links || []).forEach(function (l) {
      var a = el("a", null, l.label);
      a.appendChild(el("i", "arrow-ne"));
      a.href = l.href; a.target = "_blank"; a.rel = "noopener";
      links.appendChild(a);
    });
    main.appendChild(links);
    body.appendChild(main);
  }

  function openDialog(id) {
    var i = projects.findIndex(function (p) { return p.id === id; });
    if (i < 0) return;
    fill(projects[i], i);
    dlg.classList.remove("closing");
    dlg.showModal();
    if (lenis()) lenis().stop();
  }

  function closeDialog() {
    if (!dlg.open || dlg.classList.contains("closing")) return;
    var done = function () {
      dlg.classList.remove("closing");
      dlg.close();
    };
    if (reduced) return done();
    dlg.classList.add("closing");
    setTimeout(done, 220);
  }

  dlg.addEventListener("close", function () {
    if (lenis()) lenis().start();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  });
  dlg.addEventListener("cancel", function (e) { e.preventDefault(); closeDialog(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) closeDialog(); });

  $$("[data-project]").forEach(function (row) {
    var open = function () { lastFocus = row; openDialog(row.getAttribute("data-project")); };
    row.addEventListener("click", open);
    row.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
})();
