/**
 * Tipe data "Cari Tim" — request mengajak user lain membangun aplikasi bareng.
 */

export type CollabStatus = "open" | "full";

export interface CollabAuthor {
  name: string;
  avatar: string;
  role: string;
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
}
