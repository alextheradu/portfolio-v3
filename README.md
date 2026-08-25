my personal website! built with [Astro](https://astro.build).

## dev

```
npm install
npm run dev      # localhost:4321
npm run build    # outputs to dist/
npm run preview  # preview the build
```

## structure

- `src/pages/index.astro` — the whole page
- `src/styles/global.css` — styles
- `public/main.js` — gsap/lenis scroll + entrance animations (plain script, loaded from `<head>`/end of `<body>`, not bundled)
