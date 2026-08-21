import { Component, computed, inject } from '@angular/core';
import { Counter } from '../../ui/counter/counter';
import { Field } from '../../ui/field/field';
import { Icon } from '../../ui/icon';
import { Signal } from '../signal/signal';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { CONTACT, HERO_METRICS } from '../../core/site.data';

@Component({
  selector: 'app-hero',
  imports: [Counter, Field, Icon, Signal],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly language = inject(Language);

  protected readonly c = computed(() => COPY[this.language.lang()]);
  protected readonly contact = CONTACT;

  protected readonly metrics = computed(() => {
    const lang = this.language.lang();
    return HERO_METRICS.map((metric) => ({ ...metric, text: metric.label[lang] }));
  });
}
