/**
 * Tipe data "Cari Tim" — request mengajak user lain membangun aplikasi bareng.
 */

export type CollabStatus = "open" | "full";

export interface CollabAuthor {
  name: string;
  avatar: string;
  role: string;
}

export type ApplicantStatus = "pending" | "accepted" | "rejected";

/** Orang yang mendaftar untuk ikut sebuah project team. */
export interface CollabApplicant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  message?: string;
  status: ApplicantStatus;
  appliedMinutesAgo: number;
}

export interface CollabRequest {
  id: string;
  title: string;
  description: string;
  /** tag pekerjaan/role yang dibutuhkan, mis. ["Backend", "UI/UX"] — bisa difilter. */
  neededRoles: string[];
  techStack: string[];
  tags: string[];
  /** link repository project yang sedang berlangsung (opsional). */
  repoUrl?: string;
  /** gambar-gambar project (data URL). */
  images?: string[];
  /** komunitas tempat anggota yang diterima diundang. */
  communityId?: string;
  communityName?: string;
  author: CollabAuthor;
  membersCurrent: number;
  membersNeeded: number;
  interested: number;
  status: CollabStatus;
  postedMinutesAgo: number;
}

/** Payload form "Buat Request". */
export interface NewCollabInput {
  title: string;
  description: string;
  /** dipisah koma, mis. "Backend, UI/UX". */
  neededRoles: string;
  repoUrl: string;
  membersNeeded: number;
  /** gambar project (data URL). */
  images: string[];
  /** id komunitas yang dipilih; kosong = buat komunitas baru. */
  communityId?: string;
  /** nama komunitas baru (kalau communityId kosong). */
  newCommunityName?: string;
}
