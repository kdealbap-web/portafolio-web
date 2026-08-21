import { Component, computed, inject } from '@angular/core';
import { Icon } from '../../ui/icon';
import { Logo } from '../../ui/logo/logo';
import { LangToggle } from '../../ui/lang/lang-toggle';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { CONTACT } from '../../core/site.data';
import { STOPS, Sections } from '../../core/sections';

@Component({
  selector: 'app-masthead',
  imports: [Icon, Logo, LangToggle],
  templateUrl: './masthead.html',
  styleUrl: './masthead.scss',
})
export class Masthead {
  private readonly language = inject(Language);
  private readonly sections = inject(Sections);

  protected readonly c = computed(() => COPY[this.language.lang()]);
  protected readonly contact = CONTACT;
  protected readonly active = this.sections.active;

  /** `top` is the identity block on the left, not a segment. */
  protected readonly segments = STOPS.filter((stop) => stop.id !== 'top');
}
