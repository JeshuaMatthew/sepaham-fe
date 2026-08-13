import AxiosInstance from "@/lib/axios";
import type { StoredCommunity } from "@/features/chat/utils/communityStore";

export const MY_COMMUNITIES_QUERY_KEY = ["community", "mine"] as const;

export async function fetchMyCommunities(): Promise<StoredCommunity[]> {
  const { data } = await AxiosInstance.get<{ communities: StoredCommunity[] }>("/community/mine");
  return data.communities;
}

export async function joinCommunity(serverId: string): Promise<StoredCommunity> {
  const { data } = await AxiosInstance.post<StoredCommunity>(`/community/servers/${serverId}/join`);
  return data;
}

export async function createInvite(serverId: string): Promise<{ token: string }> {
  const { data } = await AxiosInstance.post<{ token: string }>(`/community/servers/${serverId}/invites`);
  return data;
}
