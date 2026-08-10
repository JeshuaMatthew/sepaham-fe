/**
 * Tipe data AI & Reminder (Tahap 7).
 */

export interface DevQuote {
  text: string;
  author: string;
}

export interface GithubNudge {
  title: string;
  message: string;
  streak: number;
  cta: string;
}

export interface Internship {
  id: string;
  company: string;
  emoji: string;
  role: string;
  location: string;
  type: string;
  /** skor kecocokan 0–100 (internship matcher). */
  matchPercent: number;
  tags: string[];
}

export interface AiFeed {
  quotes: DevQuote[];
  nudge: GithubNudge;
  internships: Internship[];
}
