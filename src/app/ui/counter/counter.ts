import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';

const DURATION = 1100;

/**
 * Counts up to a figure, once, when it comes into view.
 *
 * The server renders the final value, so the number is correct with no
 * JavaScript and correct for a crawler. The browser rewinds to zero only when
 * it is about to count, and only if the figure is actually on screen — a
 * counter that runs while it is three sections below the fold has animated for
 * nobody and simply arrives already finished.
 *
 * The host keeps `aria-label` at the final value for the whole run, so a
 * screen reader announces "60+" rather than every frame between 0 and 60.
 */
@Component({
  selector: 'app-counter',
  template: `{{ shown() }}{{ suffix() }}`,
  host: { '[attr.aria-label]': 'to() + suffix()' },
})
export class Counter implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly to = input.required<number>();
  readonly suffix = input('');

  protected readonly shown = signal(0);

  private frame?: number;
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      // Reduced motion, or nothing to observe with: the figure is already
      // correct from the server, so leave it alone.
      if (
        matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !('IntersectionObserver' in window)
      ) {
        this.shown.set(this.to());
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          this.observer?.disconnect();
          this.observer = undefined;
          this.run();
        },
        { threshold: 0.35 },
      );
      this.observer.observe(this.host.nativeElement);
    });
  }

  ngOnInit(): void {
    this.shown.set(this.to());
  }

  private run(): void {
    const target = this.to();
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // easeOutCubic: fast, then settles — reads as a measurement landing.
      const eased = 1 - Math.pow(1 - t, 3);
      this.shown.set(Math.round(target * eased));
      if (t < 1) this.frame = requestAnimationFrame(step);
    };

    this.shown.set(0);
    this.frame = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
  }
}
