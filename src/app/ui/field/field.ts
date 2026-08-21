import { Component } from '@angular/core';

/**
 * The hero's background: a cross section of the platform, with one request
 * descending it.
 *
 * This is not an abstract pattern. The five tiers are the same five the
 * enterprise section maps — UI, API, DATA, ETL, INFRA — in the same order, and
 * the thing travelling down the spine is a request reaching each one in turn.
 * The page's own subject, drawn at the size of a background.
 *
 * Deterministic on purpose: no randomness, no particles, no canvas. Five lines,
 * a spine, a handful of nodes and one traveller, on a 14-second cycle slow
 * enough that you notice it only if you stop to look. Under reduced motion the
 * diagram stays and the movement goes.
 */
@Component({
  selector: 'app-field',
  template: `
    <svg
      class="field"
      viewBox="0 0 640 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="fieldFade" x1="0" y1="0" x2="640" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#46c4d6" stop-opacity="0" />
          <stop offset="0.35" stop-color="#46c4d6" stop-opacity="0.5" />
          <stop offset="1" stop-color="#46c4d6" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- The spine the request travels down. -->
      <line class="spine" x1="92" y1="52" x2="92" y2="372" />

      @for (tier of tiers; track tier.y) {
        <g class="tier" [style.--i]="$index">
          <line class="tier__rule" x1="92" [attr.y1]="tier.y" x2="600" [attr.y2]="tier.y" />
          <line
            class="tier__live"
            x1="92"
            [attr.y1]="tier.y"
            x2="600"
            [attr.y2]="tier.y"
            stroke="url(#fieldFade)"
          />
          <rect class="tier__node" x="86" [attr.y]="tier.y - 6" width="12" height="12" rx="3" />
          @for (stop of tier.stops; track stop) {
            <rect class="tier__stop" [attr.x]="stop" [attr.y]="tier.y - 3" width="6" height="6" rx="2" />
          }
        </g>
      }

      <rect class="rider" x="84" y="46" width="16" height="16" rx="5" />
    </svg>
  `,
  styleUrl: './field.scss',
})
export class Field {
  /** UI, API, DATA, ETL, INFRA — the same five tiers, in the same order. */
  protected readonly tiers = [
    { y: 52, stops: [188, 306, 470] },
    { y: 132, stops: [224, 398] },
    { y: 212, stops: [166, 288, 412, 528] },
    { y: 292, stops: [252, 436] },
    { y: 372, stops: [200, 330, 496] },
  ];
}
