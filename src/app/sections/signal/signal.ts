import { Component, computed, inject } from '@angular/core';
import { Icon } from '../../ui/icon';
import { CheckRow, LiveCheckService } from '../../core/live-check';
import { Language } from '../../core/i18n';
import { COPY } from '../../core/ui-copy';
import { ENDPOINTS } from '../../core/site.data';

/**
 * The live check, drawn as the instrument it is.
 *
 * This was a table with a sparkline under it, and the sparkline was wrong: a
 * line joining five different hosts implies a trend along a continuous axis,
 * and the axis here is a list of names. Five discrete measurements are bars.
 *
 * So the table and the chart are now one object — every row carries its own
 * latency bar on a scale shared by all of them, starting at zero. Starting at
 * zero matters: the old plot stretched the range between fastest and slowest,
 * which turned a 40 ms spread into a mountain. On a common zero-based scale a
 * bar twice as long really is twice as slow.
 */
@Component({
  selector: 'app-signal',
  imports: [Icon],
  templateUrl: './signal.html',
  styleUrl: './signal.scss',
})
export class Signal {
  private readonly language = inject(Language);
  private readonly service = inject(LiveCheckService);

  protected readonly c = computed(() => COPY[this.language.lang()]);
  protected readonly report = this.service.report;

  /** Measured rows, or the same hosts with nothing measured yet. */
  protected readonly rows = computed(() => {
    const lang = this.language.lang();
    const source: CheckRow[] =
      this.report()?.rows ??
      ENDPOINTS.map((endpoint) => ({
        host: endpoint.host,
        url: endpoint.url,
        note: endpoint.note,
        status: null,
        ms: null,
        answers: false,
      }));

    const scale = this.scaleOf(source);

    return source.map((row) => ({
      ...row,
      noteText: row.note ? row.note[lang] : '',
      /** Percentage of the shared axis, or null when there is nothing to draw. */
      width: row.ms !== null && scale ? Math.max(1.5, (row.ms / scale.ceiling) * 100) : null,
    }));
  });

  protected readonly scale = computed(() => this.scaleOf(this.rows()));

  protected readonly answering = computed(() => {
    const checked = this.rows().filter((row) => row.url);
    return { ok: checked.filter((row) => row.answers).length, total: checked.length };
  });

  /**
   * A ceiling a person would choose, rounded up from the slowest sample, and
   * the gridline spacing that goes with it. Without the rounding the axis ends
   * on whatever the slowest host happened to take, which reads as a number
   * that means something when it does not.
   */
  private scaleOf(rows: Pick<CheckRow, 'ms'>[]): { ceiling: number; tick: number } | null {
    const values = rows
      .map((row) => row.ms)
      .filter((value): value is number => value !== null && value > 0);
    if (!values.length) return null;

    const max = Math.max(...values);
    const step = max <= 200 ? 50 : max <= 500 ? 125 : max <= 1000 ? 250 : 500;
    const ceiling = Math.max(step, Math.ceil(max / step) * step);
    return { ceiling, tick: (step / ceiling) * 100 };
  }
}
