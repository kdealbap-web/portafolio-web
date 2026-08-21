import { IconName } from '../ui/icon';
import { Text } from './i18n';

/**
 * Typed models for everything the site states.
 *
 * Prose is `Text` — it exists in English and Spanish. Names, domains, versions
 * and technology names stay plain strings: they read the same in both
 * languages, and translating them would only introduce drift.
 */

export interface Endpoint {
  host: string;
  url?: string;
  note?: Text;
}

/** A real capture, described honestly — including when it is a sign-in screen. */
export interface Plate {
  /** Resolves to /plates/{base}-1440.webp and /plates/{base}-900.webp */
  base: string;
  width: number;
  height: number;
  alt: Text;
  /** What the capture actually shows. Never implies more than it does. */
  caption: Text;
  /** The project's own brand colour, revealed on hover and focus. */
  tone: string;
}

export type CaseLayout = 'lead' | 'split' | 'panel' | 'note';
export type CaseMotif = 'catalogue';

export interface SystemCase {
  id: string;
  /** A product name; the same in both languages. */
  name: string;
  kicker: Text;
  endpoint: Endpoint;
  problem: Text;
  solution: Text;
  role: Text;
  /** One verifiable technical detail or figure. */
  detail: Text;
  stack: string[];
  layout: CaseLayout;
  /** Split layouts face opposite sides, so the page does not repeat itself. */
  mirror?: boolean;
  /** Real captures. Two or more make the plate a carousel. */
  plates: Plate[];
  motif?: CaseMotif;
}

/** One tier of the enterprise architecture map. */
export interface Layer {
  id: string;
  icon: IconName;
  /** UI, API, DATA … reads the same either way. */
  label: string;
  tech: string;
  /** Rendered in amber. Absent when there is no defensible number. */
  figure?: string;
  note: Text;
}

export interface Domain {
  name: Text;
  body: Text;
}

export interface EnterpriseRole {
  employer: string;
  period: Text;
  title: Text;
  summary: Text;
  domains: Domain[];
}

/** A short entry from the engineering log — a decision, with its reason. */
export interface EngineeringNote {
  id: string;
  label: Text;
  body: Text;
}

export interface HeroMetric {
  value: string;
  /** Set when the figure should count up on reveal. */
  count?: number;
  suffix?: string;
  label: Text;
  /** Where the number comes from, so it can be defended in an interview. */
  source: string;
}

export interface StackGroup {
  icon: IconName;
  label: Text;
  items: string[];
}
