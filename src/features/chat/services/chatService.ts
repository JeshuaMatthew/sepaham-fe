import AxiosInstance from "@/lib/axios";
import type { ChatMessage, DirectConversation, SendPayload } from "@/features/chat/types/chat";

export const DMS_QUERY_KEY = ["chat", "dms"] as const;
export const messagesQueryKey = (channelId: string) => ["chat", "messages", channelId] as const;

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

/**
 * Unggah lampiran chat. Mengembalikan metadata + URL yang dipakai sebagai
 * `attachment` saat mengirim pesan.
 */
export async function uploadChatAttachment(file: File): Promise<SendPayload["attachment"]> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await AxiosInstance.post<{
    name: string;
    kind: string;
    size: string;
    url: string;
  }>("/chat/attachments", form);
  return {
    name: data.name,
    kind: data.kind === "image" ? "image" : "file",
    size: data.size,
    url: data.url,
  };
}
