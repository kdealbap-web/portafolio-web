import { Component, computed, inject } from '@angular/core';
import { Icon } from '../../ui/icon';
import { Marker } from '../../ui/marker/marker';
import { Tech } from '../../ui/tech/tech';
import { Reveal } from '../../core/reveal.directive';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { ENTERPRISE, LAYERS } from '../../core/site.data';

@Component({
  selector: 'app-enterprise',
  imports: [Icon, Reveal, Marker, Tech],
  templateUrl: './enterprise.html',
  styleUrl: './enterprise.scss',
})
export class Enterprise {
  private readonly language = inject(Language);

  protected readonly c = computed(() => COPY[this.language.lang()]);

  protected readonly role = computed(() => {
    const lang = this.language.lang();
    return {
      employer: ENTERPRISE.employer,
      period: ENTERPRISE.period[lang],
      title: ENTERPRISE.title[lang],
      summary: ENTERPRISE.summary[lang],
      domains: ENTERPRISE.domains.map((domain) => ({
        name: domain.name[lang],
        body: domain.body[lang],
      })),
    };
  });

  protected readonly layers = computed(() => {
    const lang = this.language.lang();
    return LAYERS.map((layer) => ({
      ...layer,
      noteText: layer.note[lang],
      /* The tier's technologies are authored as one middot-separated line, so
         it reads as prose in the data file and stays readable with no
         JavaScript. Splitting it here lets each name carry its own mark. */
      techParts: layer.tech
        .split('·')
        .map((part) => part.trim())
        .filter(Boolean),
    }));
  });
}
