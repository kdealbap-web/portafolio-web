import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // Rendered per request: the live check has to run when the visitor arrives,
    // not when the site was built.
    renderMode: RenderMode.Server,
  },
];
