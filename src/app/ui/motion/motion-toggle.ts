import { Component, computed, inject } from '@angular/core';
import { MotionPreferences } from '../../core/motion';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';

/**
 * The in-page motion switch.
 *
 * A real switch, not a link: `role="switch"` with `aria-checked`, so a screen
 * reader announces the state rather than the action. It reflects whatever is
 * currently in force — flip the OS setting and this moves with it — and
 * pressing it overrides that for this site only.
 */
@Component({
  selector: 'app-motion-toggle',
  template: `
    <button
      type="button"
      class="mt"
      role="switch"
      [attr.aria-checked]="reduced()"
      (click)="prefs.toggle()"
    >
      <span class="mt__track" aria-hidden="true"><span class="mt__knob"></span></span>
      {{ c().motionReduce }}
    </button>
  `,
  styles: `
    .mt {
      display: inline-flex;
      align-items: center;
      gap: var(--s2);
      padding: 6px var(--s2) 6px 6px;
      border-radius: var(--r-pill);
      font-family: var(--mono);
      font-size: 10.5px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-3);
      transition: color var(--t-fast) var(--e-standard);
    }

    .mt:hover {
      color: var(--text-2);
    }

    .mt:focus-visible {
      outline: 2px solid var(--amber);
      outline-offset: 3px;
    }

    .mt__track {
      width: 28px;
      height: 16px;
      padding: 2px;
      border-radius: var(--r-pill);
      background: var(--mat-sunken);
      border: 1px solid var(--edge);
      box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.5);
      transition: background var(--t-fast) var(--e-standard);
    }

    .mt__knob {
      display: block;
      width: 10px;
      height: 10px;
      border-radius: var(--r-pill);
      background: var(--text-3);
      transition: transform var(--t-base) var(--e-standard),
        background var(--t-fast) var(--e-standard);
    }

    .mt[aria-checked='true'] .mt__track {
      background: var(--cyan-wash);
      border-color: var(--cyan-line);
    }

    .mt[aria-checked='true'] .mt__knob {
      background: var(--cyan);
      transform: translateX(12px);
    }
  `,
})
export class MotionToggle {
  protected readonly prefs = inject(MotionPreferences);
  private readonly language = inject(Language);

  protected readonly c = computed(() => COPY[this.language.lang()]);
  protected readonly reduced = this.prefs.reduced;
}
