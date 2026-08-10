import AxiosInstance from "../utils/Axiosinstance";
import type { StoredCommunity } from "../utils/communityStore";

/**
 * Service komunitas (backend Axum, /api/community/*): komunitas milik user,
 * join via invite link, dan pembuatan invite token.
 */

export const MY_COMMUNITIES_QUERY_KEY = ["community", "mine"] as const;

/** Komunitas (server + channels) yang diikuti user. */
export async function fetchMyCommunities(): Promise<StoredCommunity[]> {
  const { data } = await AxiosInstance.get<{ communities: StoredCommunity[] }>(
    "/community/mine",
  );
  return data.communities;
}

/** Bergabung ke sebuah community server (dipakai invite link ?join=). */
export async function joinCommunity(serverId: string): Promise<StoredCommunity> {
  const { data } = await AxiosInstance.post<StoredCommunity>(
    `/community/servers/${serverId}/join`,
  );
  return data;
}

/** Buat invite token untuk sebuah community (hanya anggota). */
export async function createInvite(serverId: string): Promise<{ token: string }> {
  const { data } = await AxiosInstance.post<{ token: string }>(
    `/community/servers/${serverId}/invites`,
  );
  return data;
}
