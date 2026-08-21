import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Holds an image behind a skeleton until it has actually decoded, then reveals
 * it.
 *
 * Three states, written to the host element as `data-img`:
 *
 *   `loading`  the file is on its way; the frame shows a skeleton
 *   `ready`    decoded and revealed
 *   `failed`   it did not arrive, and the frame says so rather than sitting
 *              on a skeleton forever
 *
 * The state is set from the element itself, never from a timer. An image that
 * came out of cache is already `complete` when this runs, so it goes straight
 * to `ready` with no flash of skeleton — which is the case that matters most,
 * because it is every navigation after the first.
 *
 * Nothing here hides the image from a browser without JavaScript: the
 * stylesheet only dresses `[data-img]`, an attribute that exists only once
 * this directive has run.
 */
@Directive({
  selector: 'img[appImageReveal]',
})
export class ImageReveal {
  private readonly host = inject<ElementRef<HTMLImageElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const img = this.host.nativeElement;

      // Already decoded — from cache, or because the server sent it inline.
      if (img.complete && img.naturalWidth > 0) {
        img.dataset['img'] = 'ready';
        return;
      }

      img.dataset['img'] = 'loading';

      const settle = (state: 'ready' | 'failed') => () => {
        img.dataset['img'] = state;
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
      };
      const onLoad = settle('ready');
      const onError = settle('failed');

      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', onError, { once: true });
    });
  }
}
