import { Component, input } from '@angular/core';

/**
 * The system spinner: twelve tapered spokes with the fade chasing around the
 * ring. It is the macOS indeterminate indicator, drawn rather than imported —
 * one element, no dependency, and it inherits `currentColor` so it works on a
 * plate, in a button or over a capture.
 *
 * Indeterminate on purpose. A percentage would be a lie: nothing on this page
 * knows how far along an image or a fetch actually is.
 */
@Component({
  selector: 'app-spinner',
  template: `
    <span
      class="sp"
      [style.--sp-size.px]="size()"
      role="status"
      [attr.aria-label]="label()"
    >
      @for (spoke of spokes; track spoke) {
        <i [style.--i]="spoke"></i>
      }
    </span>
  `,
  styles: `
    .sp {
      display: inline-block;
      position: relative;
      width: var(--sp-size);
      height: var(--sp-size);
      flex: none;
    }

    i {
      position: absolute;
      inset: 0;
      /* Each spoke is one bar, rotated into place and pushed to the rim. */
      transform: rotate(calc(var(--i) * 30deg));
      opacity: calc(0.14 + var(--i) * 0.07);
      animation: chase 1s linear infinite;
      animation-delay: calc(var(--i) * -83ms);
    }

    i::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 6%;
      width: 10%;
      height: 26%;
      margin-left: -5%;
      border-radius: var(--r-pill);
      background: currentColor;
    }

    @keyframes chase {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0.12;
      }
    }

    /* Without motion the ring still reads as a busy state — it just holds the
       staggered opacity instead of animating it. */
    @media (prefers-reduced-motion: reduce) {
      i {
        animation: none;
      }
    }
  `,
})
export class Spinner {
  readonly size = input(20);
  readonly label = input('Loading');

  protected readonly spokes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
}
