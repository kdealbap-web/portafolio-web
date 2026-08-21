import { Component, input } from '@angular/core';
import { Icon, IconName } from '../icon';

/**
 * The section marker: the middle of the three plate sizes.
 *
 * The logo is this plate at 34px and the seal is the same plate at 108px, so
 * putting it at the head of every section is what ties the chrome to the body —
 * the page is stamped by the same object three times, at three scales, and
 * nowhere else.
 *
 * It holds the section's icon and its number. The number is not decoration:
 * the rail, the masthead and these markers all count the same five stops, so a
 * reader who sees `02` here knows exactly where they are in the rail.
 */
@Component({
  selector: 'app-marker',
  imports: [Icon],
  template: `
    <span class="marker">
      <span class="marker__plate">
        <app-icon [name]="icon()" [size]="18" />
      </span>
      <span class="marker__index">{{ index() }}</span>
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .marker {
      display: inline-flex;
      align-items: center;
      gap: var(--s3);
    }

    .marker__plate {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      flex: none;
      border-radius: var(--r-plate);
      background: linear-gradient(158deg, #143039 0%, #0b1c22 52%, #071216 100%);
      box-shadow: inset 0 1px 0 var(--edge-strong), inset 0 0 0 1px rgb(255 255 255 / 0.04),
        0 2px 8px -3px rgb(0 0 0 / 0.7);
      color: var(--cyan);
    }

    .marker__index {
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: var(--text-3);
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class Marker {
  readonly icon = input.required<IconName>();
  readonly index = input.required<string>();
}
