import {
  Component,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Icon } from '../icon';
import { ImageReveal } from '../../core/image-reveal.directive';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { CaseMotif, Plate as PlateModel } from '../../core/site.model';

/** Dwell time per capture, in milliseconds. */
const DWELL = 6000;

/**
 * A project's capture, or its editorial cover when there is none.
 *
 * With one capture it is a still plate. With two or more it becomes a carousel
 * that advances on its own, stops the moment a pointer or the keyboard focus
 * enters it, and never moves at all when the visitor asked for reduced motion.
 *
 * Images are hand-written `<img srcset>` rather than NgOptimizedImage: the
 * directive needs an image loader to build a srcset, and these files are static
 * assets on our own origin, so a loader would add configuration and no value.
 */
@Component({
  selector: 'app-plate',
  imports: [Icon, ImageReveal],
  templateUrl: './plate.html',
  styleUrl: './plate.scss',
  host: {
    '(mouseenter)': 'hold()',
    '(mouseleave)': 'release()',
    '(focusin)': 'hold()',
    '(focusout)': 'release()',
    '(keydown)': 'onKey($event)',
  },
})
export class Plate implements OnDestroy {
  private readonly language = inject(Language);
  protected readonly c = computed(() => COPY[this.language.lang()]);

  readonly plates = input.required<PlateModel[]>();
  readonly motif = input<CaseMotif | undefined>(undefined);
  /** Name of the project, used to label the carousel and its controls. */
  readonly label = input.required<string>();
  /** True for the one plate that is likely the largest contentful paint. */
  readonly priority = input(false);
  readonly ratio = input('21 / 9');

  protected readonly index = signal(0);

  /** The visible capture, with its prose already resolved to the active language. */
  protected readonly current = computed(() => {
    const plate = this.plates()[this.index()];
    if (!plate) return null;
    const lang = this.language.lang();
    return { ...plate, altText: plate.alt[lang], captionText: plate.caption[lang] };
  });
  protected readonly many = computed(() => this.plates().length > 1);
  protected readonly paused = signal(false);

  private timer?: ReturnType<typeof setInterval>;
  private reduced = false;

  constructor() {
    afterNextRender(() => {
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!this.reduced && this.many()) this.start();
    });
  }

  protected go(step: number): void {
    const total = this.plates().length;
    if (total < 2) return;
    this.index.set((this.index() + step + total) % total);
  }

  protected select(index: number): void {
    this.index.set(index);
  }

  protected hold(): void {
    if (!this.many()) return;
    this.paused.set(true);
    this.stop();
  }

  protected release(): void {
    if (!this.many() || this.reduced) return;
    this.paused.set(false);
    this.start();
  }

  protected onKey(event: KeyboardEvent): void {
    if (!this.many()) return;
    if (event.key === 'ArrowRight') {
      this.go(1);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      this.go(-1);
      event.preventDefault();
    }
  }

  private start(): void {
    this.stop();
    this.timer = setInterval(() => this.go(1), DWELL);
  }

  private stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
