/**
 * Tipe data GitHub Widget (Dev-Card).
 */

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

export interface Repo {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  url: string;
}

export interface GithubSummary {
  /** `null` = tidak diketahui (GitHub tidak menyediakannya tanpa token). */
  totalCommits: number | null;
  currentStreak: number | null;
  longestStreak: number | null;
  publicRepos: number;
}

export interface GithubStats {
  username: string;
  stats: GithubSummary;
  topLanguages: LanguageStat[];
  /** matriks kontribusi: tiap minggu berisi 7 angka jumlah commit (Min–Sab). */
  weeks: number[][];
  topRepos: Repo[];
}
