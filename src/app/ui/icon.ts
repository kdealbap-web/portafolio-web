import { Component, input } from '@angular/core';

export type IconName =
  | 'download'
  | 'arrow-up-right'
  | 'arrow-right'
  | 'chevron-left'
  | 'chevron-right'
  | 'mail'
  | 'phone'
  | 'pin'
  | 'linkedin'
  | 'github'
  | 'layers'
  | 'server'
  | 'database'
  | 'flow'
  | 'rack'
  | 'activity'
  | 'play'
  | 'pause';

/**
 * One stroke set on a 24 grid, drawn inline so every icon scales and inherits
 * the colour of whatever it sits in. No icon font, no sprite, no dependency —
 * and no emoji anywhere on the page.
 */
@Component({
  selector: 'app-icon',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="weight()"
      stroke-linecap="square"
      stroke-linejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      @switch (name()) {
        @case ('download') {
          <path d="M12 3v13" /><path d="M6 11l6 6 6-6" /><path d="M4 21h16" />
        }
        @case ('arrow-up-right') {
          <path d="M7 17L17 7" /><path d="M8 7h9v9" />
        }
        @case ('arrow-right') {
          <path d="M4 12h15" /><path d="M13 6l6 6-6 6" />
        }
        @case ('chevron-left') {
          <path d="M15 5l-7 7 7 7" />
        }
        @case ('chevron-right') {
          <path d="M9 5l7 7-7 7" />
        }
        @case ('mail') {
          <path d="M3 6h18v12H3z" /><path d="M3 7l9 6 9-6" />
        }
        @case ('phone') {
          <path d="M6 3h4l2 5-3 2a10 10 0 0 0 5 5l2-3 5 2v4h-3A15 15 0 0 1 3 7z" />
        }
        @case ('pin') {
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        }
        @case ('linkedin') {
          <path d="M4 4h16v16H4z" />
          <path d="M8 11v6" />
          <path d="M8 8.2v.2" />
          <path d="M12 17v-4a2 2 0 0 1 4 0v4" />
        }
        @case ('github') {
          <path
            d="M9 20c-4 1-4-2.5-6-3m12 5v-3.6c0-1 .1-1.4-.5-2 2.3-.3 4.5-1.2 4.5-5a3.9 3.9 0 0 0-1-2.7 3.6 3.6 0 0 0-.1-2.7s-1.1-.3-3.5 1.3a8.7 8.7 0 0 0-4.8 0C7.2 4.7 6.1 5 6.1 5a3.6 3.6 0 0 0-.1 2.7 3.9 3.9 0 0 0-1 2.8c0 3.7 2.2 4.6 4.5 5-.6.6-.6 1.2-.5 2V21"
          />
        }
        @case ('layers') {
          <path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" />
        }
        @case ('server') {
          <path d="M3 4h18v6H3z" /><path d="M3 14h18v6H3z" />
          <path d="M7 7h.2" /><path d="M7 17h.2" />
        }
        @case ('database') {
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
          <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        }
        @case ('flow') {
          <path d="M4 6h6l4 6h6" /><path d="M16 8l4 4-4 4" /><path d="M4 18h6" />
        }
        @case ('rack') {
          <path d="M4 3h16v7H4z" /><path d="M4 14h16v7H4z" />
          <path d="M8 6.5h4" /><path d="M8 17.5h4" />
          <path d="M17 6.5h.2" /><path d="M17 17.5h.2" />
        }
        @case ('activity') {
          <path d="M3 12h4l3 7 4-14 3 7h4" />
        }
        @case ('play') {
          <path d="M8 5l11 7-11 7z" />
        }
        @case ('pause') {
          <path d="M9 5v14" /><path d="M15 5v14" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(16);
  readonly weight = input(1.8);
}
