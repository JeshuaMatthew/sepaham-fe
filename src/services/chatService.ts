import axios from "axios";
import type {
  Channel,
  ChatMessage,
  DirectConversation,
  Server,
} from "../types/chat";

/**
 * Service Komunikasi & Komunitas (Tahap 4).
 * Semua fetcher menembak mock JSON di public/mocks/ (nanti API Axum).
 */

export const SERVERS_QUERY_KEY = ["chat", "servers"] as const;
export const CHANNELS_QUERY_KEY = ["chat", "channels"] as const;
export const DMS_QUERY_KEY = ["chat", "dms"] as const;
export const messagesQueryKey = (channelId: string) =>
  ["chat", "messages", channelId] as const;

export async function fetchServers(): Promise<Server[]> {
  const { data } = await axios.get<{ servers: Server[] }>("/mocks/servers.json");
  return data.servers;
}

export async function fetchChannels(): Promise<Channel[]> {
  const { data } = await axios.get<{ channels: Channel[] }>("/mocks/channels.json");
  return data.channels;
}

export async function fetchChannelMessages(channelId: string): Promise<ChatMessage[]> {
  const { data } = await axios.get<Record<string, ChatMessage[]>>("/mocks/messages.json");
  return data[channelId] ?? [];
}

export async function fetchDirectConversations(): Promise<DirectConversation[]> {
  const { data } = await axios.get<{ dms: DirectConversation[] }>("/mocks/dms.json");
  return data.dms;
}
