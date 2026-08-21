import { Component, computed, inject } from '@angular/core';
import { Icon } from '../../ui/icon';
import { Marker } from '../../ui/marker/marker';
import { Tech } from '../../ui/tech/tech';
import { Reveal } from '../../core/reveal.directive';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { NOTES, STACK_GROUPS } from '../../core/site.data';

@Component({
  selector: 'app-notes',
  imports: [Icon, Reveal, Marker, Tech],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class Notes {
  private readonly language = inject(Language);

  protected readonly c = computed(() => COPY[this.language.lang()]);

  protected readonly notes = computed(() => {
    const lang = this.language.lang();
    return NOTES.map((note, i) => ({
      id: note.id,
      number: String(i + 1).padStart(2, '0'),
      label: note.label[lang],
      body: note.body[lang],
    }));
  });

  protected readonly groups = computed(() => {
    const lang = this.language.lang();
    return STACK_GROUPS.map((group) => ({ ...group, labelText: group.label[lang] }));
  });
}
