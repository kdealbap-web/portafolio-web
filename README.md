# kdealbap.com

The source of my portfolio: an Angular 21 application, server-rendered per
request, that checks its own claims while it renders.

**Status:** built and running locally. Not yet deployed to the apex — see
[Deploying](#deploying).

---

## What is interesting in here

**The page verifies itself.** Every project listed is a real deployment, and
the server probes each address while it renders the page. If one of them is
down you read it in the hero, above the case that describes it. The report is
cached for five minutes per isolate so the check does not hammer my own
projects, and it travels to the browser with the HTML rather than being
fetched again — a cross-origin probe from a browser would be blocked by CORS
anyway.

`src/app/core/live-check.ts`

**The latency readout is a chart, not a table with a sparkline.** An earlier
version drew a line joining the five hosts, which was wrong: a line implies a
trend along a continuous axis and the axis is a list of names. It is now a bar
per row on one zero-based scale, so a bar twice as long really is twice as
slow.

`src/app/sections/signal/`

**Motion is a system, not a pile of effects.** Durations and easings are named
for intent, the reduced-motion contract is written once and invoked from both
the media query and an in-page override, and the reveal directive has five
variants that each case picks from its own layout — so no two neighbours
arrive the same way. Two of those variants clip the element away rather than
fading it, so the directive measures the viewport synchronously and carries a
timeout: a dropped observer callback would mean missing content, not a missing
animation.

`src/styles/_motion.scss`, `src/app/core/motion.ts`, `src/app/core/reveal.directive.ts`

**The preloader reports measured state.** It waits on three real signals — the
live-check report, `document.fonts.ready`, and hydration — and moves a third
at a time. No fourth signal invented to smooth the ramp. It has a hard 1.2 s
ceiling, a floor so it cannot flash, and a CSS dead-man's switch in
`index.html` so a bundle that never boots cannot leave a black rectangle over
the page.

`src/app/ui/preloader/`

**Nothing is hidden from a browser without JavaScript.** The reveal styles live
inside `@media (scripting: enabled)`, so with scripting off the media query is
false and the content is simply visible.

## Stack

Angular 21 · TypeScript · SCSS · SSR per request · Vitest

No animation library, no CSS framework, no component library. The only design
dependency is `simple-icons`, and it is a devDependency: a generator extracts
the thirty brand marks the site names into a typed registry, so the package
never reaches the browser.

## Running it

```bash
npm install
npm start                            # dev server
npm run build                        # production build, browser + server bundles
npm run serve:ssr:portafolio-web     # serve the build (PORT=4000 by default)
```

> Verify against the production build, not the dev server. `ng serve` can
> rebuild the server bundle while leaving the browser bundle stale, and the two
> then disagree: the server sends correct HTML and hydration replaces it with
> the previous template. If something looks wrong, compare the served HTML
> against the hydrated DOM before believing either.

## Generators

Design assets are generated and committed, and the scripts that make them are
in the repository:

```bash
node design/tools/gen-tech-icons.mjs   # brand marks -> src/app/ui/tech/tech-marks.generated.ts
node design/tools/make-ico.mjs         # PNG set -> public/favicon.ico
```

The icon set is rendered at each size rather than downscaled from one master —
a 16px favicon reduced from 512 turns to mush.

## Layout

```
src/app/core/        data, i18n, live check, motion, reveal
src/app/sections/    hero, systems, enterprise, notes, contact, masthead, signal
src/app/ui/          logo, marker, seal, plate, slider, rail, tech, preloader, spinner
src/styles/          tokens, motion tokens, mixins
public/brand/        the mark and the icon set
design/tools/        the generators above
```

## Deploying

The domain is on Cloudflare and the apex has no record yet. Deploying the SSR
build to Workers needs the server entry adapted first: `src/server.ts` is
Node/Express — `AngularNodeAppEngine`, `node:path`, `app.listen()` — and
Workers needs `AngularAppEngine` behind a `fetch` handler.

Prerendering to static Pages would deploy today but would make the page lie:
the copy says the server checks each address while it renders, and a
prerendered check is frozen at build time.

## Content rules

Figures on the page come from the CV, a repository count, or the live check,
and anything without a source does not go on the page. Enterprise work is
described at the level a CV describes it — what was built, with what, to what
result — and never with code, screenshots, internal URLs or credentials from
an employer's systems.

---

© Kevin De Alba. The code is mine to show; the client deployments it links to
are not.
