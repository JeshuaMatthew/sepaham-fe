import AxiosInstance from "@/lib/axios";
import type { StoredCommunity } from "@/features/chat/utils/communityStore";

export const MY_COMMUNITIES_QUERY_KEY = ["community", "mine"] as const;
export const DISCOVER_SERVERS_QUERY_KEY = ["community", "servers"] as const;

/** Server hasil dari /community/servers — termasuk yang belum jadi anggota. */
export interface DiscoverServer extends StoredCommunity {
  memberCount: number;
  joined: boolean;
}

export async function fetchMyCommunities(): Promise<StoredCommunity[]> {
  const { data } = await AxiosInstance.get<{ communities: StoredCommunity[] }>("/community/mine");
  return data.communities;
}

/**
 * Daftar semua server yang bisa diikuti. Tanpa ini user baru tidak punya jalan
 * masuk ke chat: endpoint join hanya dipanggil dari invite link.
 */
export async function fetchDiscoverServers(): Promise<DiscoverServer[]> {
  const { data } = await AxiosInstance.get<{ servers: DiscoverServer[] }>("/community/servers");
  return data.servers;
}

export async function joinCommunity(serverId: string): Promise<StoredCommunity> {
  const { data } = await AxiosInstance.post<StoredCommunity>(`/community/servers/${serverId}/join`);
  return data;
}

export const DMS_QUERY_KEY = ["chat", "dms"] as const;

export interface DmConversation {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  role: string;
}

/** Semua DM milik user yang sedang login. */
export async function fetchDms(): Promise<DmConversation[]> {
  const { data } = await AxiosInstance.get<{ dms: DmConversation[] }>("/dms");
  return data.dms;
}

/**
 * Buka (atau ambil) DM dengan user lain. Percakapan benar-benar dibuat di
 * server.
 *
 * Sebelumnya "Gabung via DM" di halaman Cari Tim membuat percakapan palsu di
 * browser: `userId` diturunkan dari slug nama penulis, `online` di-set
 * `true`, dan pesan yang diketik hanya disimpan di React state lalu hilang
 * saat pindah halaman. Tidak ada satu pun yang sampai ke server.
 */
export async function openDm(userId: string): Promise<DmConversation> {
  const { data } = await AxiosInstance.post<DmConversation>("/dms", { userId });
  return data;
}
