import { Injectable, signal } from '@angular/core';

export type StopKey = 'top' | 'systems' | 'enterprise' | 'notes' | 'contact';

export interface Stop {
  id: StopKey;
  index: string;
}

export const STOPS: Stop[] = [
  { id: 'top', index: '00' },
  { id: 'systems', index: '01' },
  { id: 'enterprise', index: '02' },
  { id: 'notes', index: '03' },
  { id: 'contact', index: '04' },
];

/**
 * Where the reader is, held in one place.
 *
 * Both the masthead's segmented control and the rail need the active section,
 * and computing it twice would mean two observers disagreeing at the boundary.
 * The rail starts it after the first render; everything else just reads.
 *
 * Server-side this stays at its initial value, which is correct: the first
 * paint is the top of the page.
 */
@Injectable({ providedIn: 'root' })
export class Sections {
  readonly active = signal<StopKey>('top');
  readonly progress = signal(0);

  private observer?: IntersectionObserver;
  private onScroll?: () => void;
  private started = false;

  start(): void {
    if (this.started || typeof window === 'undefined') return;
    this.started = true;
    this.watchSections();
    this.watchScroll();
  }

  stop(): void {
    this.observer?.disconnect();
    if (this.onScroll) window.removeEventListener('scroll', this.onScroll);
    this.started = false;
  }

  private watchSections(): void {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        // The stop whose section covers the middle of the viewport wins.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) this.active.set(visible.target.id as StopKey);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.01, 0.5] },
    );

    for (const stop of STOPS) {
      const element = document.getElementById(stop.id);
      if (element) this.observer.observe(element);
    }
  }

  private watchScroll(): void {
    let queued = false;
    this.onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        this.progress.set(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
        queued = false;
      });
    };
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }
}
