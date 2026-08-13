import type { Channel, Server } from "@/features/chat/types/chat";

/**
 * Komunitas yang dibuat dari request "Cari Tim", disimpan di localStorage.
 */

export interface StoredCommunity {
  server: Server;
  channels: Channel[];
}

const STORAGE_KEY = "sepaham:communities";

export function getStoredCommunities(): StoredCommunity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredCommunity[]) : [];
  } catch {
    return [];
  }
}

export function addStoredCommunity(community: StoredCommunity): void {
  try {
    const all = getStoredCommunities();
    if (all.some((item) => item.server.id === community.server.id)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([community, ...all]));
  } catch {}
}
