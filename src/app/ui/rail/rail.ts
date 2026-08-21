import { Component, OnDestroy, afterNextRender, computed, inject } from '@angular/core';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { STOPS, Sections } from '../../core/sections';

/**
 * The page paginator: a floating panel of stops on the right, plus the
 * progress line across the top.
 *
 * It is the one piece of chrome on screen the whole way down, so it states the
 * reading position rather than hinting at it — the labels are always set, not
 * revealed on hover. It also owns starting the tracker, since it renders on
 * every page and the masthead reads the same signals.
 *
 * Rendered on the server as plain anchors: with no JavaScript it is still a
 * working table of contents, only without the active state.
 */
@Component({
  selector: 'app-rail',
  templateUrl: './rail.html',
  styleUrl: './rail.scss',
})
export class Rail implements OnDestroy {
  private readonly language = inject(Language);
  private readonly sections = inject(Sections);

  protected readonly c = computed(() => COPY[this.language.lang()]);
  protected readonly stops = STOPS;
  protected readonly active = this.sections.active;
  protected readonly progress = this.sections.progress;

  constructor() {
    afterNextRender(() => this.sections.start());
  }

  ngOnDestroy(): void {
    this.sections.stop();
  }
}
