import { Component, computed, inject } from '@angular/core';
import { LANGS, Lang, Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';

/**
 * Two states, one sliding indicator. The whole page re-reads its strings from
 * signals, so pressing this changes every word without a reload or a route.
 */
@Component({
  selector: 'app-lang-toggle',
  template: `
    <div class="switch" role="group" [attr.aria-label]="c().langLabel">
      <span class="switch__thumb" [style.transform]="thumb()" aria-hidden="true"></span>
      @for (option of langs; track option) {
        <button
          type="button"
          class="switch__opt"
          [class.switch__opt--on]="option === lang()"
          [attr.aria-pressed]="option === lang()"
          (click)="select(option)"
        >
          {{ option }}
        </button>
      }
    </div>
  `,
  styleUrl: './lang-toggle.scss',
})
export class LangToggle {
  private readonly language = inject(Language);

  protected readonly langs = LANGS;
  protected readonly lang = this.language.lang;
  protected readonly c = computed(() => COPY[this.lang()]);
  protected readonly thumb = computed(() => `translateX(${this.lang() === 'en' ? 0 : 100}%)`);

  protected select(lang: Lang): void {
    this.language.set(lang);
  }
}
