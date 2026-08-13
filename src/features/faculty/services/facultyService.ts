import AxiosInstance from "@/lib/axios";
import type { Server } from "@/features/chat/types/chat";
import type { CollabRequest } from "@/features/collab/types/collab";

export const MOD_SERVERS_QUERY_KEY = ["faculty", "mod-servers"] as const;
export const MOD_REQUESTS_QUERY_KEY = ["faculty", "mod-requests"] as const;

export interface ModServers {
  servers: Server[];
  bannedIds: string[];
}

export async function fetchModServers(): Promise<ModServers> {
  const { data } = await AxiosInstance.get<ModServers>("/faculty/servers");
  return data;
}

export async function toggleBanServer(id: string): Promise<void> {
  await AxiosInstance.post(`/faculty/servers/${id}/ban`);
}

export interface ModRequests {
  requests: CollabRequest[];
  closedIds: string[];
}

export async function fetchModRequests(): Promise<ModRequests> {
  const { data } = await AxiosInstance.get<ModRequests>("/faculty/requests");
  return data;
}

export async function toggleCloseRequest(id: string): Promise<void> {
  await AxiosInstance.post(`/faculty/requests/${id}/close`);
}
