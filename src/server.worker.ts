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
    // Assets first, and the order is the whole point.
    //
    // In `_worker.js` mode every request reaches this Worker, files included.
    // Asking Angular first does not work here: app.routes.server.ts renders
    // `**`, so the engine answers for `/main-UY2U7YFM.js` too — with the page.
    // The browser then receives text/html where it asked for a module, refuses
    // it, and the site is a black screen with a MIME error in the console.
    //
    // A missing asset is a 404 from this binding rather than a throw, so that
    // is the signal to hand the request to Angular.
    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) {
      return asset;
    }

    return (await angularApp.handle(request, { env, ctx })) ?? asset;
  },
};
