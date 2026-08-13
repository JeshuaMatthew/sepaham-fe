/**
 * Tipe data Komunikasi & Komunitas (Core Slack).
 */

export interface Server {
  id: string;
  name: string;
  initial: string;
  color: string;
}

export type ChannelKind = "text" | "anon";

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  topic: string;
  kind: ChannelKind;
}

export interface CodeSnippet {
  language: string;
  content: string;
}

export interface Attachment {
  name: string;
  kind: "image" | "file";
  size: string;
}

export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  text?: string;
  code?: CodeSnippet;
  attachment?: Attachment;
  anonymous: boolean;
  replies: ChatMessage[];
}

export interface DirectConversation {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  role: string;
  online: boolean;
  messages: ChatMessage[];
}

export type ActiveView =
  | { kind: "channel"; id: string }
  | { kind: "dm"; id: string };

export interface SendPayload {
  text: string;
  code: CodeSnippet | null;
  attachment: Attachment | null;
  anonymous: boolean;
}

export type CallMode = "audio" | "video";
export type CallKind = "group" | "direct";

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
}

export interface ActiveCall {
  kind: CallKind;
  mode: CallMode;
  title: string;
  isHost: boolean;
  participants: CallParticipant[];
  serverUrl: string;
  token: string;
  room: string;
}
