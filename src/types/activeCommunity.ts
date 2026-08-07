/**
 * Tipe data "Komunitas Aktif" — presence: siapa yang sedang aktif di tiap
 * komunitas dan sedang ngapain.
 */

export type PresenceStatus = "online" | "idle";

export interface ActiveMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: PresenceStatus;
  /** aktivitas singkat, mis. "di #general" atau "lagi nugas". */
  activity: string;
}

export interface ActiveCommunity {
  id: string;
  name: string;
  /** 2 huruf inisial untuk badge. */
  initial: string;
  color: string;
  members: ActiveMember[];
}
