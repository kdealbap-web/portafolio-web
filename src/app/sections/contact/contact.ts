import { Component, computed, inject } from '@angular/core';
import { Icon } from '../../ui/icon';
import { Marker } from '../../ui/marker/marker';
import { MotionToggle } from '../../ui/motion/motion-toggle';
import { Seal } from '../../ui/seal/seal';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { CONTACT } from '../../core/site.data';

@Component({
  selector: 'app-contact',
  imports: [Icon, Seal, Marker, MotionToggle],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly language = inject(Language);

  protected readonly c = computed(() => COPY[this.language.lang()]);
  protected readonly contact = CONTACT;

  protected readonly local = computed(() => {
    const lang = this.language.lang();
    return {
      english: CONTACT.english[lang],
      city: CONTACT.city[lang],
      degree: CONTACT.degree[lang],
    };
  });
}
