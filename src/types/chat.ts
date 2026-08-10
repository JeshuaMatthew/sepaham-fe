/**
 * Tipe data Komunikasi & Komunitas (Tahap 4 — Core Slack).
 */

export interface Server {
  id: string;
  name: string;
  /** 2 huruf inisial untuk ikon rail. */
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
  /** true jika penanya menyembunyikan identitas (mode Tanya Anonim). */
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

/** Tampilan aktif di area utama: sebuah channel atau sebuah DM. */
export type ActiveView =
  | { kind: "channel"; id: string }
  | { kind: "dm"; id: string };

/** Payload yang dikirim composer saat user mengirim pesan. */
export interface SendPayload {
  text: string;
  code: CodeSnippet | null;
  attachment: Attachment | null;
  anonymous: boolean;
}

/** Panggilan suara/video. */
export type CallMode = "audio" | "video";
/** group = panggilan channel; direct = panggilan 1-on-1 (DM). */
export type CallKind = "group" | "direct";

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
}

export interface ActiveCall {
  kind: CallKind;
  mode: CallMode;
  /** judul panggilan (nama channel atau nama lawan bicara). */
  title: string;
  /** true jika user ini yang membuat panggilan (boleh memutar musik). */
  isHost: boolean;
  participants: CallParticipant[];
  /** Koneksi LiveKit untuk media nyata (mic/video grup). */
  serverUrl: string;
  token: string;
  room: string;
}
