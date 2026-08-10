/**
 * Tipe data untuk Penentuan Role IT (Tahap 1.3).
 */

export interface Role {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  /** id hobi yang cocok dengan role ini — dipakai untuk scoring. */
  matchTags: string[];
  techStack: string[];
  accent: string;
}

export interface RoleRecommendation {
  /** id role dengan skor kecocokan tertinggi. */
  recommendedId: string;
  /** semua role, sudah diurutkan dari yang paling cocok. */
  roles: Role[];
}
