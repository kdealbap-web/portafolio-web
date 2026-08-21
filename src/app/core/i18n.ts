import { Injectable, REQUEST, afterNextRender, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Lang = 'en' | 'es';

/** A string that exists in both languages. */
export interface Text {
  en: string;
  es: string;
}

export const LANGS: readonly Lang[] = ['en', 'es'] as const;

const STORAGE_KEY = 'kda.lang';

/**
 * Language state for the whole page.
 *
 * The server always renders English — that is who the site is written for — and
 * the browser switches to Spanish instantly if the visitor asked for it before,
 * or presses the toggle. No route change, no second bundle, no reload: every
 * string on the page is a signal read.
 */
@Injectable({ providedIn: 'root' })
export class Language {
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly current = signal<Lang>(this.fromRequest() ?? 'en');

  readonly lang = this.current.asReadonly();
  readonly other = computed<Lang>(() => (this.current() === 'en' ? 'es' : 'en'));

  constructor() {
    // Server and browser alike: the attribute matches what is rendered, so
    // screen readers and crawlers get the right language from the first byte.
    this.document.documentElement.lang = this.current();

    afterNextRender(() => {
      // A language in the URL wins over what the browser remembers: it is what
      // the visitor was handed.
      const asked = this.fromLocation();
      const stored = this.read();
      const wanted = asked ?? stored;
      if (wanted && wanted !== this.current()) this.set(wanted);
      else this.document.documentElement.lang = this.current();
    });
  }

  /**
   * `?lang=es` renders Spanish straight from the server, so the Spanish page is
   * a real, shareable, crawlable URL rather than a click away.
   */
  private fromRequest(): Lang | null {
    const url = this.request?.url;
    if (!url) return null;
    try {
      return parse(new URL(url).searchParams.get('lang'));
    } catch {
      return null;
    }
  }

  private fromLocation(): Lang | null {
    try {
      return parse(new URLSearchParams(location.search).get('lang'));
    } catch {
      return null;
    }
  }

  set(lang: Lang): void {
    this.current.set(lang);
    this.document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Private mode or blocked storage: the choice simply does not persist.
    }
  }

  toggle(): void {
    this.set(this.other());
  }

  private read(): Lang | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'en' || value === 'es' ? value : null;
    } catch {
      return null;
    }
  }
}

function parse(value: string | null): Lang | null {
  return value === 'en' || value === 'es' ? value : null;
}

/** Resolves one bilingual string. */
export function pick(text: Text, lang: Lang): string {
  return text[lang];
}
