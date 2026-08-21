import {
  Component,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Icon } from '../icon';
import { ImageReveal } from '../../core/image-reveal.directive';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { SYSTEMS } from '../../core/site.data';

/** Time each system holds the stage, in milliseconds. */
const DWELL = 7000;
/** How far a drag must travel before it counts as a change of slide. */
const THRESHOLD = 64;

@Component({
  selector: 'app-slider',
  imports: [Icon, ImageReveal],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
  host: {
    '(mouseenter)': 'hold()',
    '(mouseleave)': 'release()',
    '(focusin)': 'hold()',
    '(focusout)': 'release()',
    '(keydown)': 'onKey($event)',
  },
})
export class Slider implements OnDestroy {
  private readonly language = inject(Language);

  protected readonly c = computed(() => COPY[this.language.lang()]);

  /** The five systems, flattened into what a slide needs, in the active language. */
  protected readonly slides = computed(() => {
    const lang = this.language.lang();
    return SYSTEMS.map((system, i) => ({
      id: system.id,
      number: String(i + 1).padStart(2, '0'),
      name: system.name,
      kicker: system.kicker[lang],
      detail: system.detail[lang],
      host: system.endpoint.host,
      url: system.endpoint.url,
      note: system.endpoint.note?.[lang],
      plate: system.plates[0] ?? null,
      alt: system.plates[0]?.alt[lang] ?? '',
      tone: system.plates[0]?.tone ?? 'var(--cyan-deep)',
    }));
  });

  protected readonly index = signal(0);
  protected readonly playing = signal(true);
  /** 0–100 across the current slide's dwell. Drives the bar under the paginator. */
  protected readonly progress = signal(0);
  protected readonly dragging = signal(false);
  protected readonly dragX = signal(0);

  protected readonly current = computed(() => this.slides()[this.index()]);
  protected readonly total = computed(() => this.slides().length);

  protected readonly shift = computed(
    () => `translate3d(calc(${-100 * this.index()}% + ${this.dragX()}px), 0, 0)`,
  );

  private frame?: number;
  private last = 0;
  private elapsed = 0;
  private reduced = false;
  private pointerId: number | null = null;
  private startX = 0;

  constructor() {
    afterNextRender(() => {
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Nothing moves on its own for a visitor who asked for less motion; the
      // controls and the paginator still work.
      if (this.reduced) {
        this.playing.set(false);
        return;
      }
      this.tick();
    });
  }

  protected go(step: number): void {
    const total = this.total();
    this.index.set((this.index() + step + total) % total);
    this.restart();
  }

  protected select(index: number): void {
    this.index.set(index);
    this.restart();
  }

  protected toggle(): void {
    this.playing.set(!this.playing());
    if (this.playing()) this.restart();
  }

  protected onKey(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
        this.go(1);
        break;
      case 'ArrowLeft':
        this.go(-1);
        break;
      case 'Home':
        this.select(0);
        break;
      case 'End':
        this.select(this.total() - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  /* ── drag ─────────────────────────────────────────────────────────────── */

  protected onDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.dragging.set(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onMove(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId || !this.dragging()) return;
    this.dragX.set(event.clientX - this.startX);
  }

  protected onUp(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) return;
    const travelled = this.dragX();
    this.pointerId = null;
    this.dragging.set(false);
    this.dragX.set(0);

    if (travelled <= -THRESHOLD) this.go(1);
    else if (travelled >= THRESHOLD) this.go(-1);
  }

  /* ── autoplay ─────────────────────────────────────────────────────────── */

  protected hold(): void {
    this.playing.set(false);
  }

  protected release(): void {
    if (this.reduced) return;
    this.playing.set(true);
    this.restart();
  }

  private restart(): void {
    this.elapsed = 0;
    this.progress.set(0);
  }

  private tick(): void {
    this.last = performance.now();

    const step = (now: number) => {
      const delta = now - this.last;
      this.last = now;

      if (this.playing() && !this.dragging() && !document.hidden) {
        this.elapsed += delta;
        this.progress.set(Math.min(100, (this.elapsed / DWELL) * 100));
        if (this.elapsed >= DWELL) {
          this.elapsed = 0;
          this.index.set((this.index() + 1) % this.total());
        }
      }

      this.frame = requestAnimationFrame(step);
    };

    this.frame = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    if (this.frame) cancelAnimationFrame(this.frame);
  }
}
