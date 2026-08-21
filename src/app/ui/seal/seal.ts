import { Component, computed, input } from '@angular/core';
import { Logo } from '../logo/logo';

let seq = 0;

/**
 * The maker's mark. A ring of set text around the same squircle plate the
 * header uses, at the largest of its three sizes.
 *
 * It carries proper nouns only — a name, a city, a country and the year — so
 * it needs no translation and cannot go stale in one language while staying
 * correct in the other. It sits once, at the end of the page, the way a stamp
 * sits at the end of a drawing.
 */
@Component({
  selector: 'app-seal',
  imports: [Logo],
  template: `
    <div class="seal" [style.--seal.px]="size()">
      <svg viewBox="0 0 200 200" class="seal__ring" aria-hidden="true">
        <defs>
          <path
            [attr.id]="'r' + uid"
            d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            fill="none"
          />
        </defs>
        <circle cx="100" cy="100" r="94" class="seal__rim" />
        <circle cx="100" cy="100" r="86.5" class="seal__rim seal__rim--inner" />
        <text class="seal__text">
          <textPath [attr.href]="'#r' + uid" startOffset="0">{{ ring }}</textPath>
        </text>
      </svg>

      <span class="seal__plate"><app-logo [size]="plateSize()" label="" /></span>
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      line-height: 0;
    }

    .seal {
      position: relative;
      width: var(--seal);
      height: var(--seal);
      display: grid;
      place-items: center;
    }

    .seal__ring {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      /* One slow turn. It is the only thing on the page that moves without
         being asked to, so it moves at a speed you have to look for. */
      animation: turn 64s linear infinite;
    }

    .seal__rim {
      fill: none;
      stroke: var(--line-strong);
      stroke-width: 1;
    }

    .seal__rim--inner {
      stroke: var(--edge);
    }

    .seal__text {
      font-family: var(--mono);
      font-size: 10.5px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      fill: var(--text-3);
    }

    .seal__plate {
      position: relative;
      line-height: 0;
    }

    @keyframes turn {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .seal__ring {
        animation: none;
      }
    }
  `,
})
export class Seal {
  readonly size = input(128);

  /** The plate holds a third of the seal, so the ring keeps its air. */
  protected readonly plateSize = computed(() => Math.round(this.size() * 0.34));
  /* Trailing separator so the loop closes cleanly where the path meets. */
  protected readonly ring = 'KEVIN DE ALBA · BARRANQUILLA · COLOMBIA · ';
  protected readonly uid = `sl${++seq}`;
}
