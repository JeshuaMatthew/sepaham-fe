/**
 * Tipe data Profil & Badges (Dev-Card).
 */

export interface Profile {
  avatarUrl: string;
  name: string;
  username: string;
  university: string;
  batch: number;
  role: string;
  roleEmoji: string;
  bio: string;
  location: string;
}

export type BadgeTier = "common" | "rare" | "epic" | "legendary";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  earned: boolean;
}
