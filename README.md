# portfolio :O

this is my personal website! it's a (mostly) simple one-page portfolio with a
little bit about me, the stuff i know how to do, and some of the projects i've
worked on. that currently includes robotics scouting software, an ai assistant
for frc teams, a bioinformatics pipeline, a Hack Club YSWS, and a few other
things i thought were cool enough to put here.

i wanted the site to feel more like me than a giant grid of identical project
cards, so it's pretty text-heavy, intentionally minimal, and slightly
terminal-ish. it is also the place where i get to call myself a "hardware
specialist" because i own a 3d printer 😎

## what's on the site

- a quick intro and some links to find me elsewhere
- a longer about section with what i'm doing in school, frc, Hack Club, and
  outside of programming
- the areas i spend most of my time in: full-stack web development, robotics,
  3d modeling, and infrastructure
- a growing list of things i've built (or helped build), with links to the live
  projects/repos when there is one
- enough animation to make scrolling fun without turning the page into a
  powerpoint presentation

right now everything lives on one page. the navigation just jumps between
sections, which keeps the site quick and means nobody has to dig through five
pages to figure out what i do.

## built with

- [Astro](https://astro.build) for the site itself and static output
- [React](https://react.dev) for the word-by-word `ScrollReveal` component
- plain css in `src/styles/global.css` because this site really did not need a
  ui framework
- [GSAP](https://gsap.com) and
  [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for the intro
  and scroll animations
- [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling

GSAP, ScrollTrigger, and Lenis are loaded from CDNs, then wired together in
`public/main.js`. the React reveal component uses those same browser globals so
its animations stay in sync with the rest of the page instead of running a
second copy of GSAP.

the animation code also checks `prefers-reduced-motion`, and the content stays
visible if one of the CDN scripts gets blocked or fails to load. animations are
nice; being able to read the website is nicer.

## running it locally

you'll need Node.js 22.12 or newer. after cloning the repo:

```sh
npm install
npm run dev
```

Astro will start the dev server at
[`http://localhost:4321`](http://localhost:4321). edits should show up as you
make them.

for a production build:

```sh
npm run build
npm run preview:start
```

the first command generates the static site in `dist/`, and the second serves
that build locally so you can check it before deploying.

## where everything is

```text
src/
  components/
    ScrollReveal.tsx  # reveals paragraph text one word at a time
  pages/
    index.astro       # page content, structure, links, and <head>
  styles/
    global.css        # all layout, typography, colors, and responsive styles
public/
  main.js             # gsap + lenis setup and the page entrance animations
  favicon.ico
astro.config.mjs      # astro config + the react integration
```

there isn't a cms or a big data file hiding somewhere. to update my bio, add a
project, or change one of the links, i edit `src/pages/index.astro` directly.
for a new animated description, the text gets passed into `ScrollReveal` as a
prop. styles all live in the one global stylesheet so i can find them again
later (hopefully).

## a couple design/tech notes

the page starts with a short top-to-bottom entrance animation, then reveals the
remaining sections as they enter the viewport. project and expertise rows are
batched so they cascade in together, while their descriptions reveal word by
word. each reveal only plays once; having the text fade back out because you
scrolled up by two pixels was not nearly as cool as it sounded.

Astro handles most of the page as static html, and only the text reveal
component is hydrated in the browser. that keeps the setup small while still
letting me use React where it is actually useful.

## changing the content

if you're me in three months and forgot how this works:

1. open `src/pages/index.astro`
2. copy an existing project row
3. change the number, title, link, tags, and description
4. run `npm run build` before pushing

that's pretty much it! thanks for checking out the repo (and possibly reading
all the way down here).
