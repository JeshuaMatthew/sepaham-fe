import type { Channel, Server } from "@/features/chat/types/chat";

/**
 * Komunitas dari server — bentuk yang dikembalikan `/community/mine`.
 *
 * (Dulu ada `getStoredCommunities`/`addStoredCommunity` yang menyimpan
 * komunitas di localStorage. Itu sudah tidak dipakai: daftar komunitas selalu
 * diambil dari server.)
 */

export interface StoredCommunity {
  server: Server;
  channels: Channel[];
}
