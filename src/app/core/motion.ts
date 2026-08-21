import { DOCUMENT, Injectable, afterNextRender, computed, inject, signal } from '@angular/core';

export type MotionSetting = 'system' | 'reduced' | 'full';

const KEY = 'kda.motion';
const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Whether this visitor wants motion, and how we were told.
 *
 * Two sources, in order: the operating-system setting, and an override the
 * visitor can set on this site. The override exists because the OS setting is
 * all-or-nothing across every application, and someone may want the animation
 * here while keeping it off elsewhere — or the reverse, which is the case that
 * actually matters: a person on a low-end machine who has never found the OS
 * toggle needs a way to say so from the page.
 *
 * The resolved answer is mirrored onto `<html data-motion>` so the stylesheet
 * can honour it with the same rules it uses for the media query. Signals drive
 * the components; the attribute drives the CSS; neither has to know about the
 * other.
 *
 * Server-side this resolves to "not reduced" and touches nothing: there is no
 * media query to read and no storage to consult, and the first client render
 * corrects it before paint.
 */
@Injectable({ providedIn: 'root' })
export class MotionPreferences {
  private readonly document = inject(DOCUMENT);

  /** What the visitor chose here. `system` means "follow the OS". */
  readonly setting = signal<MotionSetting>('system');

  /** What the OS says, kept live — someone can change it while the tab is open. */
  private readonly systemReduced = signal(false);

  /** The resolved answer every component should read. */
  readonly reduced = computed(() => {
    const setting = this.setting();
    if (setting === 'reduced') return true;
    if (setting === 'full') return false;
    return this.systemReduced();
  });

  private media?: MediaQueryList;
  private onChange?: (event: MediaQueryListEvent) => void;

  constructor() {
    afterNextRender(() => {
      this.restore();
      this.watchSystem();
      this.mirror();
    });
  }

  set(setting: MotionSetting): void {
    this.setting.set(setting);
    try {
      if (setting === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, setting);
    } catch {
      /* Private mode, or storage blocked. The choice still holds for this page. */
    }
    this.mirror();
  }

  /** Flips between following the OS and forcing reduced, which is the only
      switch worth putting in the interface: two states, one control. */
  toggle(): void {
    this.set(this.reduced() ? 'full' : 'reduced');
  }

  private restore(): void {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      stored = null;
    }
    if (stored === 'reduced' || stored === 'full') this.setting.set(stored);
  }

  private watchSystem(): void {
    if (typeof matchMedia !== 'function') return;
    this.media = matchMedia(QUERY);
    this.systemReduced.set(this.media.matches);

    this.onChange = (event) => {
      this.systemReduced.set(event.matches);
      this.mirror();
    };
    this.media.addEventListener('change', this.onChange);
  }

  /** `full` is written out too: it has to beat the media query, so the
      stylesheet needs to see an explicit "no, keep the motion". */
  private mirror(): void {
    const root = this.document.documentElement;
    if (this.reduced()) root.setAttribute('data-motion', 'reduced');
    else if (this.setting() === 'full') root.setAttribute('data-motion', 'full');
    else root.removeAttribute('data-motion');
  }
}
