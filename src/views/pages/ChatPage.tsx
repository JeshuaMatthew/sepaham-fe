import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DMS_QUERY_KEY,
  fetchChannelMessages,
  fetchDirectConversations,
  messagesQueryKey,
  sendChannelMessage,
  sendDmMessage,
} from "@/features/chat/services/chatService";
import { PROFILE_QUERY_KEY, fetchProfile } from "@/features/profile/services/profileService";
import type {
  ActiveCall,
  ActiveView,
  CallMode,
  ChatMessage,
  DirectConversation,
  SendPayload,
} from "@/features/chat/types/chat";
import {
  DISCOVER_SERVERS_QUERY_KEY,
  MY_COMMUNITIES_QUERY_KEY,
  fetchDiscoverServers,
  fetchMyCommunities,
  joinCommunity,
  openDm,
} from "@/features/chat/services/communityService";
import { getToken } from "@/features/auth/utils/authToken";
import { fetchCallToken } from "@/features/chat/services/callService";
import { reportError } from "@/shared/errors";
import ChatContainer from "../components/ChatContainer";

/** Sisipkan pesan channel dari event WS ke cache (dedup by id). */
function applyChannelMessage(
  old: ChatMessage[] | undefined,
  message: ChatMessage,
  parentId?: string | null,
): ChatMessage[] | undefined {
  if (!old) return old; // hanya update channel yang sedang dibuka
  if (parentId) {
    return old.map((m) =>
      m.id === parentId && !m.replies.some((r) => r.id === message.id)
        ? { ...m, replies: [...m.replies, message] }
        : m,
    );
  }
  return old.some((m) => m.id === message.id) ? old : [...old, message];
}

/** Sisipkan pesan DM dari event WS ke cache (dedup by id). */
function applyDmMessage(
  old: DirectConversation[] | undefined,
  dmId: string,
  message: ChatMessage,
): DirectConversation[] | undefined {
  if (!old) return old;
  return old.map((dm) =>
    dm.id === dmId && !dm.messages.some((m) => m.id === message.id)
      ? { ...dm, messages: [...dm.messages, message] }
      : dm,
  );
}

/** Info user yang diajak DM dari fitur lain (mis. Cari Tim). */
interface DmWithState {
  userId: string;
  userName: string;
  avatar: string;
  role: string;
}

function isDmWithState(value: unknown): value is { dmWith: DmWithState } {
  if (typeof value !== "object" || value === null) return false;
  const inner = (value as { dmWith?: unknown }).dmWith;
  return (
    typeof inner === "object" &&
    inner !== null &&
    typeof (inner as DmWithState).userId === "string" &&
    (inner as DmWithState).userId.length > 0
  );
}

/**
 * ChatPage — Tahap 4 (Core Slack).
 *
 * Page mengurus data (queries) + seluruh state interaksi: server/channel/DM
 * aktif, thread yang terbuka, serta pesan & balasan baru. Semua pesan berasal
 * dari server; tidak ada lagi overlay lokal. TIDAK ADA Tailwind.
 */

function ChatPage() {
  const dmsQuery = useQuery({ queryKey: DMS_QUERY_KEY, queryFn: fetchDirectConversations });
  const profileQuery = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: fetchProfile });
  const myCommunitiesQuery = useQuery({
    queryKey: MY_COMMUNITIES_QUERY_KEY,
    queryFn: fetchMyCommunities,
  });
  const discoverQuery = useQuery({
    queryKey: DISCOVER_SERVERS_QUERY_KEY,
    queryFn: fetchDiscoverServers,
  });

  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [joiningServerId, setJoiningServerId] = useState<string | null>(null);
  const [hasDismissedEmptyState, setHasDismissedEmptyState] = useState(false);

  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeServerId, setActiveServerId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView | null>(null);
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [call, setCall] = useState<ActiveCall | null>(null);
  // Notifikasi setelah bergabung lewat invite link (?join=serverId).
  const [joinNotice, setJoinNotice] = useState<string | null>(null);
  const joinHandledRef = useRef(false);

  // Notifikasi kalau DM dari Cari Tim gagal dibuka.
  const [dmOpenError, setDmOpenError] = useState<string | null>(null);
  // Notifikasi kalau pengiriman pesan gagal.
  const [sendError, setSendError] = useState<string | null>(null);

  // Buka DM yang diminta fitur lain (Cari Tim). Percakapan BENAR-BENAR dibuat
  // di server lewat `POST /api/dms` — sebelumnya halaman ini membuat DM palsu
  // di browser: id dari slug nama, `online: true`, dan pesan yang hanya
  // disimpan di React state lalu hilang saat pindah halaman.
  useEffect(() => {
    const state = location.state;
    if (!isDmWithState(state)) return;

    void openDm(state.dmWith.userId)
      .then(async (dm) => {
        await queryClient.invalidateQueries({ queryKey: DMS_QUERY_KEY });
        setActiveView({ kind: "dm", id: dm.id });
        setDmOpenError(null);
      })
      .catch(() => {
        setDmOpenError("Tidak bisa membuka DM. Coba lagi dari halaman Cari Tim.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time: WebSocket push pesan channel/DM dari user lain → update cache.
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const base = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000/api";
    const url = `${base.replace(/^http/, "ws")}/ws?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      let evt: {
        type: string;
        channelId?: string;
        dmId?: string;
        parentId?: string | null;
        message: ChatMessage;
      };
      try {
        evt = JSON.parse(event.data);
      } catch {
        return;
      }
      if (evt.type === "channel_message" && evt.channelId) {
        queryClient.setQueryData<ChatMessage[]>(messagesQueryKey(evt.channelId), (old) =>
          applyChannelMessage(old, evt.message, evt.parentId),
        );
      } else if (evt.type === "dm_message" && evt.dmId) {
        queryClient.setQueryData<DirectConversation[]>(DMS_QUERY_KEY, (old) =>
          applyDmMessage(old, evt.dmId as string, evt.message),
        );
      }
    };
    return () => ws.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Servers dan channels semuanya dari /community/mine — satu-satunya endpoint yang ada.
  const myCommunities = myCommunitiesQuery.data ?? [];
  const servers = myCommunities.map((c) => c.server);
  const channels = myCommunities.flatMap((c) => c.channels);
  const dms = dmsQuery.data ?? [];

  // User tanpa server sama sekali akan melihat chat kosong tanpa jalan keluar,
  // jadi panel "Temukan komunitas" otomatis terbuka pada kondisi itu. Diturunkan
  // (bukan effect) supaya tidak memicu render bertingkat.
  const isDiscoverVisible =
    isDiscoverOpen || (myCommunities.length === 0 && !hasDismissedEmptyState);

  const handleOpenDiscover = () => setIsDiscoverOpen(true);
  const handleCloseDiscover = () => {
    setIsDiscoverOpen(false);
    setHasDismissedEmptyState(true);
  };
  const handleJoinServer = (serverId: string) => {
    setJoiningServerId(serverId);
    void joinCommunity(serverId)
      .then((community) => {
        void queryClient.invalidateQueries({ queryKey: MY_COMMUNITIES_QUERY_KEY });
        void queryClient.invalidateQueries({ queryKey: DISCOVER_SERVERS_QUERY_KEY });
        setActiveServerId(community.server.id);
        const firstChannel = community.channels[0] ?? null;
        setActiveView(firstChannel ? { kind: "channel", id: firstChannel.id } : null);
        setJoinNotice(community.server.name);
        setIsDiscoverOpen(false);
        setHasDismissedEmptyState(true);
      })
      .catch((error) => {
        reportError("joinCommunity", error);
        setSendError("Gagal bergabung ke komunitas. Coba lagi.");
      })
      .finally(() => setJoiningServerId(null));
  };

  // Invite link: join server dari ?join=serverId ke backend lalu buka.
  const joinId = searchParams.get("join");
  useEffect(() => {
    if (!joinId || joinHandledRef.current) return;
    joinHandledRef.current = true;
    let cancelled = false;
    void joinCommunity(joinId)
      .then((community) => {
        if (cancelled) return;
        void queryClient.invalidateQueries({ queryKey: MY_COMMUNITIES_QUERY_KEY });
        setActiveServerId(joinId);
        const firstChannel = community.channels[0] ?? null;
        setActiveView(firstChannel ? { kind: "channel", id: firstChannel.id } : null);
        setJoinNotice(community.server.name);
      })
      .catch(() => {
        // Fallback: mungkin server bawaan / sudah member — pilih dari daftar lokal.
        const target = servers.find((server) => server.id === joinId);
        if (target) {
          setActiveServerId(joinId);
          setJoinNotice(target.name);
        }
      })
      .finally(() => {
        const next = new URLSearchParams(searchParams);
        next.delete("join");
        setSearchParams(next, { replace: true });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinId]);

  const effectiveServerId = activeServerId ?? servers[0]?.id ?? null;
  const serverChannels = channels.filter((channel) => channel.serverId === effectiveServerId);
  const defaultChannel = serverChannels[0] ?? null;
  const effectiveView: ActiveView =
    activeView ??
    (defaultChannel ? { kind: "channel", id: defaultChannel.id } : { kind: "channel", id: "" });

  const activeChannelId = effectiveView.kind === "channel" ? effectiveView.id : null;

  const messagesQuery = useQuery({
    queryKey: messagesQueryKey(activeChannelId ?? "none"),
    queryFn: () => fetchChannelMessages(activeChannelId as string),
    enabled: activeChannelId != null && activeChannelId !== "",
  });

  const activeChannel = channels.find((channel) => channel.id === activeChannelId) ?? null;
  const activeDm =
    effectiveView.kind === "dm"
      ? dms.find((dm) => dm.id === effectiveView.id) ?? null
      : null;

  // Semua DM berasal dari server. Tidak ada lagi DM buatan yang hanya hidup
  // di state browser.
  const baseMessages: ChatMessage[] =
    effectiveView.kind === "channel"
      ? messagesQuery.data ?? []
      : activeDm?.messages ?? [];

  const messages = baseMessages;

  const replyCountById: Record<string, number> = {};
  for (const message of messages) {
    replyCountById[message.id] = message.replies.length;
  }

  const threadMessage = openThreadId
    ? messages.find((message) => message.id === openThreadId) ?? null
    : null;
  const threadReplies = threadMessage ? threadMessage.replies : [];

  const currentUser = {
    id: profileQuery.data?.id ?? "me",
    name: profileQuery.data?.name ?? "Kamu",
    // Kosongkan bila user belum punya avatar — komponen Avatar akan
    // menampilkan inisial, bukan wajah orang lain.
    avatar: profileQuery.data?.avatarUrl ?? "",
  };

  const handleSelectServer = (id: string) => {
    setActiveServerId(id);
    const firstChannel = channels.find((channel) => channel.serverId === id) ?? null;
    setActiveView(firstChannel ? { kind: "channel", id: firstChannel.id } : null);
    setOpenThreadId(null);
  };

  const handleSelectChannel = (id: string) => {
    setActiveView({ kind: "channel", id });
    setOpenThreadId(null);
  };

  const handleSelectDm = (id: string) => {
    setActiveView({ kind: "dm", id });
    setOpenThreadId(null);
  };

  const handleSendMessage = (payload: SendPayload) => {    if (effectiveView.kind === "channel") {
      const channelId = effectiveView.id;
      setSendError(null);
      void sendChannelMessage(channelId, payload)
        .then((message) => {
          // Tempel pesan dari server langsung ke cache (update instan).
          queryClient.setQueryData<ChatMessage[]>(messagesQueryKey(channelId), (old) => [
            ...(old ?? []),
            message,
          ]);
        })
        .catch((error) => {
          reportError("sendChannelMessage", error);
          setSendError("Pesan gagal terkirim. Periksa koneksimu lalu coba lagi.");
        });
    } else {
      const dmId = effectiveView.id;
      setSendError(null);
      void sendDmMessage(dmId, payload)
        .then((message) => {
          queryClient.setQueryData<DirectConversation[]>(DMS_QUERY_KEY, (old) =>
            (old ?? []).map((dm) =>
              dm.id === dmId ? { ...dm, messages: [...dm.messages, message] } : dm,
            ),
          );
        })
        .catch((error) => {
          reportError("sendDmMessage", error);
          setSendError("Pesan gagal terkirim. Periksa koneksimu lalu coba lagi.");
        });
    }
  };

  const handleSendReply = (payload: SendPayload) => {
    if (!openThreadId || !activeChannelId) return;
    const channelId = activeChannelId;
    const parentId = openThreadId;
    setSendError(null);
    void sendChannelMessage(channelId, payload, parentId)
      .then((reply) => {
        // Sisipkan balasan ke replies parent di cache → thread panel langsung update.
        queryClient.setQueryData<ChatMessage[]>(messagesQueryKey(channelId), (old) =>
          (old ?? []).map((message) =>
            message.id === parentId
              ? { ...message, replies: [...message.replies, reply] }
              : message,
          ),
        );
      })
      .catch((error) => {
        reportError("sendReply", error);
        setSendError("Balasan gagal terkirim. Periksa koneksimu lalu coba lagi.");
      });
  };

  // Mulai panggilan LiveKit: room per channel/DM. Media lewat server LiveKit.
  // `identity`, `name`, dan `room` dipakai dari token yang dikembalikan
  // server — bukan nilai lokal — supaya yang tampil di panggilan sama dengan
  // yang disetujui server. Daftar peserta awal hanya diri sendiri; peserta
  // lain masuk lewat event room LiveKit, bukan dari konstanta.
  const handleStartCall = (mode: CallMode) => {
    const start = (room: string, title: string, kind: "group" | "direct") => {
      void fetchCallToken(room)
        .then((t) => {
          setCall({
            kind,
            mode,
            title,
            isHost: true,
            participants: [{ id: t.identity, name: t.name || currentUser.name, avatar: currentUser.avatar }],
            serverUrl: t.url,
            token: t.token,
            room: t.room,
          });
        })
        .catch((error) => {
          reportError("fetchCallToken", error);
          setSendError("Gagal memulai panggilan. Coba lagi.");
        });
    };
    if (effectiveView.kind === "channel" && activeChannel) {
      start(`call-${activeChannel.id}`, `#${activeChannel.name}`, "group");
    } else if (activeDm) {
      start(`call-dm-${activeDm.id}`, activeDm.userName, "direct");
    }
  };

  return (
    <ChatContainer
      servers={servers}
      serverName={servers.find((server) => server.id === effectiveServerId)?.name ?? ""}
      channels={serverChannels}
      dms={dms}
      activeServerId={effectiveServerId}
      activeView={effectiveView}
      activeChannel={activeChannel}
      activeDm={activeDm}
      messages={messages}
      replyCountById={replyCountById}
      threadMessage={threadMessage}
      threadReplies={threadReplies}
      activeCall={call}
      joinNotice={joinNotice}
      onDismissJoinNotice={() => setJoinNotice(null)}
      dmOpenError={dmOpenError}
      onDismissDmOpenError={() => setDmOpenError(null)}
      sendError={sendError}
      onDismissSendError={() => setSendError(null)}
      isLoading={myCommunitiesQuery.isLoading || dmsQuery.isLoading}
      isMessagesLoading={messagesQuery.isLoading}
      isError={myCommunitiesQuery.isError || dmsQuery.isError}
      onSelectServer={handleSelectServer}
      onOpenDiscover={handleOpenDiscover}
      onCloseDiscover={handleCloseDiscover}
      onJoinServer={handleJoinServer}
      isDiscoverOpen={isDiscoverVisible}
      isDiscoverLoading={discoverQuery.isLoading}
      discoverServers={discoverQuery.data ?? []}
      joiningServerId={joiningServerId}
      onSelectChannel={handleSelectChannel}
      onSelectDm={handleSelectDm}
      onOpenThread={setOpenThreadId}
      onCloseThread={() => setOpenThreadId(null)}
      onSendMessage={handleSendMessage}
      onSendReply={handleSendReply}
      onStartCall={handleStartCall}
      onEndCall={() => setCall(null)}
      onRetry={() => {
        void myCommunitiesQuery.refetch();
        void dmsQuery.refetch();
      }}
    />
  );
}

export default ChatPage;
