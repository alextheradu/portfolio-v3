# portfolio

my personal website — a single-page portfolio with a bio, areas of
expertise, and a log of things i've built. built with
[Astro](https://astro.build) as a static site, styled by hand (no CSS
framework), with GSAP + Lenis for scroll-triggered entrance animations
and smooth scrolling.

live sections: hero, about, areas of expertise, projects, footer.

## tech

- [Astro](https://astro.build) — static site generation, one page
- plain CSS (`src/styles/global.css`) — dark theme, monospace accents,
  no framework
- [GSAP](https://gsap.com) + [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
  + [Lenis](https://lenis.darkroom.engineering/) via CDN — top-to-bottom
  entrance timeline on load, smooth scrolling, respects
  `prefers-reduced-motion`

## dev

```
npm install
npm run dev      # localhost:4321
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## structure

```
src/
  pages/index.astro   # the whole page — markup + <head>
  styles/global.css   # all styles
public/
  main.js             # gsap/lenis animation setup, loaded as a plain
                       # <script> (not bundled) so it can see the CDN
                       # globals (gsap, Lenis, ScrollTrigger)
  favicon.ico
```

to edit cthe ontent (bio, projects, expertise), just edit the markup
directly in `index.astro` :)

thanks for reading!
