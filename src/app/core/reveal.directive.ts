import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * How an element arrives. Each variant says something different about what it
 * is revealing, which is the point — one transition applied to everything is
 * what makes a page feel automated:
 *
 *  - `fade`             the default: it appears, lifted a little
 *  - `mask-up`          type rising out from behind its own edge, for headings
 *  - `clip-horizontal`  a surface wiped open from its leading edge, for panels
 *  - `scale-subtle`     a card settling forward, for things you can act on
 *  - `line-draw`        a rule drawn from its origin, for dividers and spines
 */
export type RevealVariant = 'fade' | 'mask-up' | 'clip-horizontal' | 'scale-subtle' | 'line-draw';

/** Past this many, a stagger stops reading as sequence and starts reading as lag. */
const STAGGER_CAP = 5;

/**
 * Reveals an element when it scrolls into view.
 *
 * The attribute is rendered on the server too, but the stylesheet only hides a
 * `[data-reveal]` element inside `@media (scripting: enabled)`. So with
 * JavaScript off — or blocked — the content is simply visible, and nothing here
 * can hide it permanently.
 *
 * The variant and the stagger index are written to the host as an attribute and
 * a custom property; the stylesheet owns what each one looks like. The timing
 * therefore lives in the motion tokens rather than scattered through
 * components, and a variant can be redesigned without touching TypeScript.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    'data-reveal': '',
    '[attr.data-reveal-variant]': 'variant()',
    '[style.--reveal-i]': 'position()',
  },
})
export class Reveal implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** `<div appReveal="mask-up">`. Empty falls back to the plain fade. */
  readonly appReveal = input<RevealVariant | ''>('');

  /** Place in a group. Only the first few stagger; the rest arrive together. */
  readonly revealIndex = input(0);

  private observer?: IntersectionObserver;
  private rescue?: ReturnType<typeof setTimeout>;

  protected variant(): RevealVariant {
    return this.appReveal() || 'fade';
  }

  protected position(): number {
    return Math.min(this.revealIndex(), STAGGER_CAP);
  }

  constructor() {
    afterNextRender(() => {
      const element = this.host.nativeElement;

      // Reduced motion, or no observer: show it now. The stylesheet says the
      // same thing, but setting the state here keeps an element from sitting
      // in the hidden style for a frame first.
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced || !('IntersectionObserver' in window)) {
        this.show();
        return;
      }

      // Already on screen when the page arrived? Then there is nothing to
      // wait for. Measuring directly is not an optimisation — it is what
      // makes the first screenful independent of an observer callback ever
      // landing, and it covers a very tall viewport where everything is in
      // view at once and the observer has nothing to report.
      if (element.getBoundingClientRect().top < window.innerHeight) {
        this.show();
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset['reveal'] = 'shown';
            this.observer?.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.04 },
      );
      this.observer.observe(element);

      // The last line of defence. Two of these variants clip the element away
      // completely rather than fading it, so a dropped callback would not mean
      // a missing animation — it would mean missing content. After this long
      // the element is shown whatever happened, and since it is off screen by
      // definition, nobody sees it arrive without its transition.
      this.rescue = setTimeout(() => this.show(), 10_000);
    });
  }

  private show(): void {
    this.host.nativeElement.dataset['reveal'] = 'shown';
    this.observer?.disconnect();
    this.observer = undefined;
    if (this.rescue) clearTimeout(this.rescue);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.rescue) clearTimeout(this.rescue);
  }
}
