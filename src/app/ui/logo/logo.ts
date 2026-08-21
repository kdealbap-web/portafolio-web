import { Component, input } from '@angular/core';

/**
 * The mark: the KD monogram seated on the squircle plate.
 *
 * The monogram is artwork, not type — a rendered form with bevels and its own
 * light. Tracing it to flat paths would throw away the thing that makes it a
 * mark, so it stays raster and the plate around it is CSS. The plate is the
 * same object at three sizes: this at 34px in the masthead, 44px at the head
 * of every section, 108px in the seal.
 *
 * The plate is not decoration. On its own the monogram is dark petrol on a
 * dark page and disappears; the plate gives it a ground to sit on and the
 * brightness lift gives it the separation it has on a pale one.
 */
@Component({
  selector: 'app-logo',
  template: `
    <span class="plate" [style.--s.px]="size()">
      <!-- 256, not the 1024 master: this paints at 34-108px, and shipping
           600 kB of artwork to draw a 34px logo is not a rounding error. -->
      <img
        class="plate__mark"
        src="/brand/mark-256.png"
        [attr.alt]="label() || null"
        [attr.aria-hidden]="label() ? null : 'true'"
        [attr.role]="label() ? 'img' : null"
        width="256"
        height="256"
        decoding="async"
      />
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }

    .plate {
      position: relative;
      display: grid;
      place-items: center;
      width: var(--s);
      height: var(--s);
      border-radius: var(--r-plate);
      background: linear-gradient(158deg, #173842 0%, #0b1c23 52%, #060f13 100%);
      box-shadow: inset 0 1px 0 var(--edge-strong), inset 0 0 0 1px rgb(255 255 255 / 0.04),
        0 2px 8px -3px rgb(0 0 0 / 0.7);
      overflow: hidden;
      transition: box-shadow var(--t-base) var(--e-standard);
    }

    /* The bloom the plate carries in every other size, as a layer rather than
       a gradient stop, so the mark can sit above it. */
    .plate::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        60% 60% at 82% 88%,
        rgb(70 196 214 / 0.34),
        rgb(70 196 214 / 0) 70%
      );
    }

    .plate__mark {
      position: relative;
      width: 74%;
      height: 74%;
      object-fit: contain;
      /* Lifted and warmed so the petrol monogram separates from the petrol
         plate. Measured against the artwork rather than guessed: unlifted it
         reads as a smudge at anything under 48px. */
      filter: brightness(1.9) saturate(1.15) drop-shadow(0 0 3px rgb(120 214 230 / 0.5));
      transition: filter var(--t-base) var(--e-standard), transform var(--t-base) var(--e-standard);
    }

    /* One interaction, and only where the mark is a control: the light behind
       it comes up as if the plate caught it. */
    :host(:hover) .plate__mark,
    a:hover .plate .plate__mark,
    a:focus-visible .plate .plate__mark {
      filter: brightness(2.25) saturate(1.2) drop-shadow(0 0 6px rgb(120 214 230 / 0.75));
      transform: scale(1.04);
    }

    @media (prefers-reduced-motion: reduce) {
      .plate__mark {
        transition: none;
      }

      :host(:hover) .plate__mark {
        transform: none;
      }
    }
  `,
})
export class Logo {
  readonly size = input(34);
  /** Empty for a decorative lockup where the name is already spelled out. */
  readonly label = input('Kevin De Alba');
}
