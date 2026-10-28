# portfolio

personal website & project showcase. built with [Astro](https://astro.build), [React](https://react.dev), [GSAP](https://gsap.com), and [Lenis](https://lenis.darkroom.engineering/).

## quick start

```sh
npm install
npm run dev
```

dev server: [`http://localhost:4321`](http://localhost:4321)

production build:
```sh
npm run build
npm run preview:start
```

Astro handles most of the page as static html. That keeps the setup small while still
letting me use React where I lwk need to

## Docker

Docker can deploy this project using the included `Dockerfile`. It builds the static
Astro site and serves `dist/` with Astro's Node preview server on port `3000`. If using Dokploy, 
set the application port to `3000`.

## changing the content

how to edit site:

1. don't unless youre alex
2. open `src/pages/index.astro`
3. copy an existing project row
4. change the number, title, link, tags, and description
5. run `npm run build` before pushing

that's pretty much it! thanks for checking out the repo
