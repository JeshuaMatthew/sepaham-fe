/**
 * Tipe data untuk Penentuan Role IT.
 */

export interface Role {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  matchTags: string[];
  techStack: string[];
  accent: string;
}

export interface RoleRecommendation {
  recommendedId: string;
  roles: Role[];
}
