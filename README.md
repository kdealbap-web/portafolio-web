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

Cloudflare Workers with static assets. `npm run build:cf` produces it:

```bash
npm run build:cf     # ng build --configuration cloudflare, then the worker patch
npx wrangler dev     # run it locally in workerd, the same runtime Cloudflare uses
npx wrangler deploy  # or let the Git integration build it
```

Cloudflare panel: build command `npm run build:cf`, and leave the output
directory empty — `wrangler.jsonc` declares both the worker entry and the
assets directory, so Cloudflare reads it rather than guessing.

Three things had to be true before this worked, and each was a real failure
first:

**A static deploy 404s at the root.** With `outputMode: "server"` Angular emits
`index.csr.html`, not `index.html`, because the server is supposed to render
`/`. Point Pages at the browser directory and there is no index to serve.

**The Node entry cannot run in a Worker.** `src/server.ts` is Express and stays
for local use; `src/server.worker.ts` is the Workers entry, selected by the
`cloudflare` configuration in angular.json. It is the same engine —
`AngularAppEngine.handle` takes a `Request` and returns a `Response` — without
the Node server around it.

**Angular's server bundle will not load in workerd unadjusted.** Every server
bundle carries `createRequire(import.meta.url)`, and `import.meta.url` is
undefined there, so the runtime fails to start. `design/tools/patch-worker.mjs`
replaces that one expression; `build:cf` runs it. The builder's `define` option
cannot do this — Angular injects the shim after esbuild has run.

**Hostnames are an allowlist.** Angular refuses to render for a `Host` it does
not know, which is its SSRF defence. The list lives in
`architect.build.options.security.allowedHosts` in angular.json and it is
checked twice — against the `Host` header, which carries a port, and against
the URL hostname, which does not. `*.pages.dev` covers preview deployments.
A new hostname that answers 400 belongs in that list.

## Content rules

Figures on the page come from the CV, a repository count, or the live check,
and anything without a source does not go on the page. Enterprise work is
described at the level a CV describes it — what was built, with what, to what
result — and never with code, screenshots, internal URLs or credentials from
an employer's systems.

---

© Kevin De Alba. The code is mine to show; the client deployments it links to
are not.
