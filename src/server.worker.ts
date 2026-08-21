import { AngularAppEngine } from '@angular/ssr';

/**
 * The Cloudflare Workers entry.
 *
 * `src/server.ts` stays as it is — Node and Express, for `ng serve` and for
 * running the build locally. This file exists because Workers has no Node
 * runtime to give Express: no `app.listen`, no `node:path`, no streams. What
 * it does have is the web platform, and `AngularAppEngine.handle` already
 * speaks it — a `Request` in, a `Response` out.
 *
 * Static files never reach this handler. Cloudflare serves anything matching
 * the assets directory first and only invokes the Worker for what is left,
 * which is exactly the set of routes Angular should render.
 */

/**
 * Angular refuses to render for a `Host` it does not recognise, which is how
 * it defends against server-side request forgery. The list has to be exact —
 * the check is a Set lookup, there are no wildcards, and the port counts.
 *
 * It is deliberately an allowlist rather than the `'*'` escape hatch. Cloudflare
 * does route by hostname, so `'*'` would arguably be safe here, but a list that
 * has to be edited when a hostname changes is a list somebody reads; `'*'` is a
 * decision nobody revisits.
 *
 * If a preview deployment answers 400, its hostname belongs here.
 */
const ALLOWED_HOSTS = [
  'kdealbap.com',
  'www.kdealbap.com',
  'portafolio-web-eht.pages.dev',
  // `wrangler dev`
  'localhost:8799',
  '127.0.0.1:8799',
];

const angularApp = new AngularAppEngine({ allowedHosts: ALLOWED_HOSTS });

/** What Pages hands the Worker: a binding that serves the build output. */
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env, ctx: unknown): Promise<Response> {
    const response = await angularApp.handle(request, { env, ctx });
    if (response) {
      return response;
    }

    // Every request reaches this Worker, including the ones for files —
    // that is how `_worker.js` works in Pages, and it is the part that is easy
    // to get wrong: returning 404 here renders the page perfectly and then
    // 404s its own favicon, icons, manifest and every capture on it.
    // Anything Angular does not render belongs to the static assets.
    return env.ASSETS.fetch(request);
  },
};
