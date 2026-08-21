import { Component, computed, input } from '@angular/core';
import { TECH_MARKS, TechMark } from './tech-marks.generated';

/**
 * A technology, with its own mark when one exists.
 *
 * The labels in site.data.ts are written for a reader — "Angular 21",
 * "React 18 + Vite", "Deno edge functions" — not as identifiers, so the match
 * is by keyword rather than by lookup. Order matters in the table below:
 * `vitest` has to be tested before `vite`, and `gitlab` before `git`, or the
 * shorter name swallows the longer one.
 *
 * Anything with no mark renders as the label alone. That is the case for
 * Oracle and SQL Server — both were withdrawn from simple-icons at the
 * trademark holders' request — and for the things that are not brands at all:
 * REST, SSR, PL/SQL, multi-tenant. A typographic chip is the correct answer
 * there; inventing a logo is not.
 */
const MATCHES: [RegExp, string][] = [
  // Names that contain another name have to be tested first, or the shorter
  // one wins: `vitest` before `vite`, `gitlab` before `git`.
  [/vitest/i, 'vitest'],
  [/gitlab/i, 'gitlab'],
  // Then the headline technology of a label, before any tool it mentions in
  // passing. "React 18 + Vite" is a React project that happens to build with
  // Vite, so it gets React's mark.
  [/rxjs|reactivex/i, 'reactivex'],
  [/\breact\b/i, 'react'],
  [/angular/i, 'angular'],
  [/spring/i, 'springboot'],
  [/openjdk|\bjava\b/i, 'openjdk'],
  [/typescript/i, 'typescript'],
  [/php/i, 'php'],
  [/deno/i, 'deno'],
  [/node/i, 'nodedotjs'],
  [/postgres/i, 'postgresql'],
  [/mysql/i, 'mysql'],
  [/supabase/i, 'supabase'],
  [/prestashop|smarty/i, 'prestashop'],
  [/leaflet/i, 'leaflet'],
  [/tailwind/i, 'tailwindcss'],
  [/scss|sass/i, 'sass'],
  [/vite/i, 'vite'],
  [/cloudflare/i, 'cloudflare'],
  [/vercel/i, 'vercel'],
  [/vmware/i, 'vmware'],
  [/docker/i, 'docker'],
  [/hibernate/i, 'hibernate'],
  [/mongo/i, 'mongodb'],
  [/veeam/i, 'veeam'],
  [/talend/i, 'talend'],
  [/sonar/i, 'sonarqubeserver'],
  [/\bgit\b/i, 'git'],
  // Last: "Material" here means Angular Material, and the Material Design mark
  // is the signifier people recognise. It has to sit after `angular` so that
  // "Angular SSR" and "Angular 6–19" keep the Angular shield.
  [/\bmaterial\b/i, 'materialdesign'],
];

@Component({
  selector: 'app-tech',
  template: `
    @if (mark(); as m) {
      <span class="seat">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
          <path [attr.d]="m.path" />
        </svg>
      </span>
    }
    <span class="tech__name">{{ name() }}</span>
  `,
  host: {
    class: 'tech',
    '[class.tech--marked]': 'mark() !== null',
    '[style.--brand]': 'mark()?.tint',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--s2);
      min-width: 0;
    }

    /* The mark gets a seat rather than floating against the text: a small
       recessed tile washed with the brand's own colour at a tenth strength.
       That is what gives a logo presence at 15px — the tile reads first, the
       glyph second, and the row still holds together because every seat is
       the same size and the same shape. */
    .seat {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      flex: none;
      border-radius: var(--r-xs);
      background: color-mix(in srgb, var(--brand, var(--cyan)) 13%, transparent);
      border: 1px solid color-mix(in srgb, var(--brand, var(--cyan)) 26%, transparent);
      transition: background var(--t-fast) var(--e-standard),
        border-color var(--t-fast) var(--e-standard);
    }

    svg {
      display: block;
      fill: var(--brand, currentColor);
    }

    .tech__name {
      min-width: 0;
    }

    :host(:hover) .seat {
      background: color-mix(in srgb, var(--brand, var(--cyan)) 24%, transparent);
      border-color: color-mix(in srgb, var(--brand, var(--cyan)) 46%, transparent);
    }
  `,
})
export class Tech {
  readonly name = input.required<string>();

  protected readonly mark = computed<TechMark | null>(() => {
    const label = this.name();
    for (const [pattern, slug] of MATCHES) {
      if (pattern.test(label)) return TECH_MARKS[slug] ?? null;
    }
    return null;
  });
}
