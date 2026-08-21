import {
  Component,
  DOCUMENT,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Logo } from '../logo/logo';
import { Spinner } from '../spinner/spinner';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { LiveCheckService } from '../../core/live-check';

/** Never longer than this, whatever is still outstanding. */
const CEILING_MS = 1200;
/** Never shorter than this: below it the veil is a flash, not a state. */
const FLOOR_MS = 320;

/**
 * The first-load veil.
 *
 * It shows once per session — the inline gate in index.html adds `.intro` to
 * the document element before the first paint, so this component only takes
 * over something that is already on screen and never causes one.
 *
 * The progress is real. Three things are actually waited on, and the bar moves
 * a third at a time as each resolves:
 *
 *   1. the live-check report, which arrives with the server's HTML
 *   2. the web fonts, via `document.fonts.ready`
 *   3. hydration, which is where this component starts running
 *
 * There is no fourth signal invented to smooth the ramp, and no interpolation
 * between steps: a percentage nobody measured is a lie told in a progress bar.
 * If a signal cannot be read at all — no `document.fonts` — it counts as
 * resolved rather than stalling the veil over a browser detail.
 *
 * The ceiling is hard. Whatever is still outstanding at 1.2 s, the veil goes;
 * the page underneath is already rendered and readable, so continuing to cover
 * it would be decoration blocking content. The floor is the opposite problem:
 * on a warm cache all three resolve within a frame, and a veil that appears and
 * vanishes inside 80 ms reads as a glitch.
 */
@Component({
  selector: 'app-preloader',
  imports: [Logo, Spinner],
  template: `
    @if (visible()) {
      <div class="veil" [class.veil--leaving]="leaving()">
        <span class="veil__plate"><app-logo [size]="72" label="" /></span>
        <span class="veil__name">Kevin De Alba</span>

        <p class="veil__status" role="status" aria-live="polite">
          {{ message() }}
        </p>

        <div
          class="veil__track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="3"
          [attr.aria-valuenow]="done()"
          [attr.aria-valuetext]="message()"
        >
          <span class="veil__fill" [style.transform]="'scaleX(' + done() / 3 + ')'"></span>
        </div>

        <span class="veil__spin"><app-spinner [size]="16" [label]="message()" /></span>
      </div>
    }
  `,
  styleUrl: './preloader.scss',
})
export class Preloader implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly language = inject(Language);
  private readonly liveCheck = inject(LiveCheckService);

  protected readonly visible = signal(false);
  protected readonly leaving = signal(false);

  private readonly checked = signal(false);
  private readonly fonts = signal(false);
  private readonly hydrated = signal(false);

  protected readonly done = computed(
    () => Number(this.checked()) + Number(this.fonts()) + Number(this.hydrated()),
  );

  /** The last state reached, so the message never runs ahead of the progress. */
  protected readonly message = computed(() => {
    const boot = COPY[this.language.lang()].boot;
    return boot[Math.min(this.done(), 2)];
  });

  private timers: ReturnType<typeof setTimeout>[] = [];
  private shownAt = 0;

  constructor() {
    afterNextRender(() => {
      // Only take over a veil the inline gate actually put up.
      if (!this.document.documentElement.classList.contains('intro')) return;

      this.visible.set(true);
      this.shownAt = performance.now();

      this.hydrated.set(true);
      this.checked.set(this.liveCheck.report() !== null);
      this.watchFonts();

      // The ceiling, armed the moment the veil appears.
      this.timers.push(setTimeout(() => this.finish(), CEILING_MS));

      // And a poll for the one signal with no event: the report is either in
      // the transferred state at hydration or it is not coming at all.
      if (!this.checked()) this.timers.push(setTimeout(() => this.checked.set(true), 400));

      this.timers.push(setTimeout(() => this.settle(), 0));
    });
  }

  private watchFonts(): void {
    const fonts = (this.document as Document).fonts;
    if (!fonts) {
      this.fonts.set(true);
      return;
    }
    fonts.ready.then(
      () => {
        this.fonts.set(true);
        this.settle();
      },
      () => this.fonts.set(true),
    );
  }

  /** Close as soon as everything has resolved, respecting the floor. */
  private settle(): void {
    if (this.done() < 3) return;
    const elapsed = performance.now() - this.shownAt;
    const wait = Math.max(0, FLOOR_MS - elapsed);
    this.timers.push(setTimeout(() => this.finish(), wait));
  }

  private finish(): void {
    if (this.leaving()) return;
    this.leaving.set(true);
    this.document.documentElement.classList.remove('intro');
    // Long enough for the fade in the stylesheet, then out of the DOM entirely
    // so nothing is left covering the page or trapping focus.
    this.timers.push(setTimeout(() => this.visible.set(false), 420));
  }

  ngOnDestroy(): void {
    for (const timer of this.timers) clearTimeout(timer);
  }
}
