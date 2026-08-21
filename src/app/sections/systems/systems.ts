import { Component, computed, inject } from '@angular/core';
import { Icon } from '../../ui/icon';
import { Marker } from '../../ui/marker/marker';
import { Tech } from '../../ui/tech/tech';
import { Plate } from '../../ui/plate/plate';
import { Slider } from '../../ui/slider/slider';
import { Reveal, RevealVariant } from '../../core/reveal.directive';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { CaseLayout } from '../../core/site.model';
import { SYSTEMS } from '../../core/site.data';

@Component({
  selector: 'app-systems',
  imports: [Icon, Plate, Slider, Reveal, Marker, Tech],
  templateUrl: './systems.html',
  styleUrl: './systems.scss',
})
export class Systems {
  private readonly language = inject(Language);

  protected readonly c = computed(() => COPY[this.language.lang()]);

  /**
   * How each case arrives, decided by its composition rather than picked one
   * at a time. The five cases already carry four different layouts, so letting
   * the layout choose the reveal means no two neighbours enter the same way —
   * and a sixth project inherits the right behaviour instead of needing
   * another entry in a lookup nobody remembers to update.
   */
  private readonly REVEAL_BY_LAYOUT: Record<CaseLayout, RevealVariant> = {
    lead: 'clip-horizontal',
    split: 'scale-subtle',
    panel: 'mask-up',
    note: 'fade',
  };

  /** Cases with every field already resolved to the active language. */
  protected readonly systems = computed(() => {
    const lang = this.language.lang();
    return SYSTEMS.map((system, i) => ({
      ...system,
      reveal: this.REVEAL_BY_LAYOUT[system.layout] ?? ('fade' as RevealVariant),
      number: String(i + 1).padStart(2, '0'),
      kickerText: system.kicker[lang],
      problemText: system.problem[lang],
      solutionText: system.solution[lang],
      roleText: system.role[lang],
      detailText: system.detail[lang],
      noteText: system.endpoint.note ? system.endpoint.note[lang] : '',
    }));
  });
}
