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
  neededRoles: string[];
  techStack: string[];
  tags: string[];
  repoUrl?: string;
  images?: string[];
  communityId?: string;
  communityName?: string;
  author: CollabAuthor;
  membersCurrent: number;
  membersNeeded: number;
  interested: number;
  status: CollabStatus;
  postedMinutesAgo: number;
}

export interface NewCollabInput {
  title: string;
  description: string;
  neededRoles: string;
  repoUrl: string;
  membersNeeded: number;
  images: string[];
  communityId?: string;
  newCommunityName?: string;
}
