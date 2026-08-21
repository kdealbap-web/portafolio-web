import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideLiveChecks } from './core/live-check';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    /* One route today. View transitions are wired now so a second one (a case
       study, say) animates without revisiting this file. */
    provideRouter(routes, withViewTransitions()),
    /* Incremental hydration is what lets the sections below the fold be
       deferred: the server still renders their HTML, only the JavaScript waits
       for them to reach the viewport. Deferring the markup instead would hide
       the content from anything without JavaScript. */
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideLiveChecks(),
  ],
};
