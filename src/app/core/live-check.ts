import { isPlatformServer } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  TransferState,
  inject,
  makeStateKey,
  provideAppInitializer,
  signal,
} from '@angular/core';
import { ENDPOINTS } from './site.data';
import { Text } from './i18n';

export interface CheckRow {
  host: string;
  url?: string;
  /** Bilingual, because a row with nothing to check explains itself in words. */
  note?: Text;
  /** HTTP status, or null when the host did not answer in time. */
  status: number | null;
  ms: number | null;
  answers: boolean;
}

export interface CheckReport {
  rows: CheckRow[];
  /** Already formatted for display, in Barranquilla time. */
  at: string;
}

const REPORT = makeStateKey<CheckReport>('liveChecks');

/** How long one probe may take before it counts as no answer. */
const TIMEOUT_MS = 2500;

/**
 * The report is cached in the isolate: a Cloudflare worker instance serves many
 * requests, and probing five hosts on each one would make the page slow and
 * hammer my own projects. Five minutes is fresh enough for a portfolio.
 */
const TTL_MS = 5 * 60 * 1000;
let cached: { report: CheckReport; expires: number } | null = null;

const AT_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'America/Bogota',
});

async function probe(url: string): Promise<{ status: number | null; ms: number | null }> {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      method: 'GET',
      // A permanent redirect is an answer, so don't let fetch swallow it.
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'kdealbap.com live check' },
    });
    return { status: response.status, ms: Date.now() - started };
  } catch {
    return { status: null, ms: null };
  }
}

async function runChecks(): Promise<CheckReport> {
  const rows = await Promise.all(
    ENDPOINTS.map(async (endpoint): Promise<CheckRow> => {
      if (!endpoint.url) {
        return { host: endpoint.host, note: endpoint.note, status: null, ms: null, answers: false };
      }
      const { status, ms } = await probe(endpoint.url);
      return {
        host: endpoint.host,
        url: endpoint.url,
        status,
        ms,
        answers: status !== null && status < 400,
      };
    }),
  );

  return { rows, at: AT_FORMAT.format(new Date()).replace(',', ' ·') + ' COT' };
}

@Injectable({ providedIn: 'root' })
export class LiveCheckService {
  private readonly state = inject(TransferState);
  private readonly onServer = isPlatformServer(inject(PLATFORM_ID));

  /** Null until the checks have run; the strip renders a quiet fallback. */
  readonly report = signal<CheckReport | null>(null);

  /**
   * Awaited during server rendering, so the HTML that leaves the edge already
   * carries the result. On the browser it only picks up what came with the page —
   * a cross-origin probe from a browser would be blocked by CORS anyway.
   */
  async load(): Promise<void> {
    if (!this.onServer) {
      this.report.set(this.state.get(REPORT, null));
      return;
    }

    if (cached && cached.expires > Date.now()) {
      this.publish(cached.report);
      return;
    }

    const report = await runChecks();
    cached = { report, expires: Date.now() + TTL_MS };
    this.publish(report);
  }

  private publish(report: CheckReport): void {
    this.state.set(REPORT, report);
    this.report.set(report);
  }
}

export const provideLiveChecks = () => provideAppInitializer(() => inject(LiveCheckService).load());
