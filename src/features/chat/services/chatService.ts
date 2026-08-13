import AxiosInstance from "@/lib/axios";
import type { Channel, ChatMessage, DirectConversation, SendPayload, Server } from "@/features/chat/types/chat";

export const SERVERS_QUERY_KEY = ["chat", "servers"] as const;
export const CHANNELS_QUERY_KEY = ["chat", "channels"] as const;
export const DMS_QUERY_KEY = ["chat", "dms"] as const;
export const messagesQueryKey = (channelId: string) => ["chat", "messages", channelId] as const;

export async function fetchServers(): Promise<Server[]> {
  const { data } = await AxiosInstance.get<{ servers: Server[] }>("/community/servers");
  return data.servers;
}

export async function fetchChannels(): Promise<Channel[]> {
  const { data } = await AxiosInstance.get<{ channels: Channel[] }>("/community/channels");
  return data.channels;
}

export async function fetchChannelMessages(channelId: string): Promise<ChatMessage[]> {
  const { data } = await AxiosInstance.get<ChatMessage[]>(`/channels/${channelId}/messages`);
  return data;
}

export async function fetchDirectConversations(): Promise<DirectConversation[]> {
  const { data } = await AxiosInstance.get<{ dms: DirectConversation[] }>("/dms");
  return data.dms;
}

function sendBody(payload: SendPayload, parentId?: string) {
  return {
    text: payload.text || undefined,
    code: payload.code ?? undefined,
    attachment: payload.attachment ?? undefined,
    anonymous: payload.anonymous,
    parentId,
  };
}

export async function sendChannelMessage(
  channelId: string,
  payload: SendPayload,
  parentId?: string,
): Promise<ChatMessage> {
  const { data } = await AxiosInstance.post<ChatMessage>(
    `/channels/${channelId}/messages`,
    sendBody(payload, parentId),
  );
  return data;
}

export async function sendDmMessage(dmId: string, payload: SendPayload): Promise<ChatMessage> {
  const { data } = await AxiosInstance.post<ChatMessage>(`/dms/${dmId}/messages`, sendBody(payload));
  return data;
}
