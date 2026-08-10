import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CHANNELS_QUERY_KEY,
  DMS_QUERY_KEY,
  SERVERS_QUERY_KEY,
  fetchChannels,
  fetchChannelMessages,
  fetchDirectConversations,
  fetchServers,
  messagesQueryKey,
  sendChannelMessage,
  sendDmMessage,
} from "../../services/chatService";
import { PROFILE_QUERY_KEY, fetchProfile } from "../../services/profileService";
import { LOFI_TRACKS_QUERY_KEY, fetchLofiTracks } from "../../services/musicService";
import type {
  ActiveCall,
  ActiveView,
  CallMode,
  ChatMessage,
  DirectConversation,
  SendPayload,
} from "../../types/chat";
import {
  MY_COMMUNITIES_QUERY_KEY,
  fetchMyCommunities,
  joinCommunity,
} from "../../services/communityService";
import ChatContainer from "../components/ChatContainer";

/** Info user yang diajak DM dari fitur lain (mis. Cari Tim). */
interface DmWithState {
  userId: string;
  userName: string;
  avatar: string;
  role: string;
}

/**
 * ChatPage — Tahap 4 (Core Slack).
 *
 * Page mengurus data (queries) + seluruh state interaksi: server/channel/DM
 * aktif, thread yang terbuka, serta pesan & balasan baru (disimpan sebagai
 * overlay lokal di atas data mock). Komponen tetap dumb. TIDAK ADA Tailwind.
 */

function nowLabel(): string {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatPage() {
  const serversQuery = useQuery({ queryKey: SERVERS_QUERY_KEY, queryFn: fetchServers });
  const channelsQuery = useQuery({ queryKey: CHANNELS_QUERY_KEY, queryFn: fetchChannels });
  const dmsQuery = useQuery({ queryKey: DMS_QUERY_KEY, queryFn: fetchDirectConversations });
  const profileQuery = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: fetchProfile });
  const musicQuery = useQuery({ queryKey: LOFI_TRACKS_QUERY_KEY, queryFn: fetchLofiTracks });
  const myCommunitiesQuery = useQuery({
    queryKey: MY_COMMUNITIES_QUERY_KEY,
    queryFn: fetchMyCommunities,
  });

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

  // Overlay lokal HANYA untuk DM ad-hoc dari Cari Tim (partner belum tentu user
  // nyata). Pesan channel & DM nyata sudah dari backend.
  const [extraByDm, setExtraByDm] = useState<Record<string, ChatMessage[]>>({});
  const [extraDms, setExtraDms] = useState<DirectConversation[]>([]);

  // Buka/buat DM saat diarahkan ke sini dengan state { dmWith }.
  useEffect(() => {
    const dmWith = (location.state as { dmWith?: DmWithState } | null)?.dmWith;
    if (!dmWith) return;
    const dmId = `dm-${dmWith.userId}`;
    setExtraDms((prev) =>
      prev.some((dm) => dm.id === dmId)
        ? prev
        : [
            ...prev,
            {
              id: dmId,
              userId: dmWith.userId,
              userName: dmWith.userName,
              avatar: dmWith.avatar,
              role: dmWith.role,
              online: true,
              messages: [],
            },
          ],
    );
    setActiveView({ kind: "dm", id: dmId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Komunitas tim milik user (dari backend) tampil paling atas.
  const myCommunities = myCommunitiesQuery.data ?? [];
  const servers = [...myCommunities.map((c) => c.server), ...(serversQuery.data ?? [])];
  const channels = [
    ...myCommunities.flatMap((c) => c.channels),
    ...(channelsQuery.data ?? []),
  ];
  const dms = [...extraDms, ...(dmsQuery.data ?? [])];

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

  // DM nyata (dari backend) vs ad-hoc (overlay lokal dari Cari Tim).
  const realDmIds = new Set((dmsQuery.data ?? []).map((dm) => dm.id));

  const baseMessages: ChatMessage[] =
    effectiveView.kind === "channel"
      ? messagesQuery.data ?? []
      : activeDm?.messages ?? [];

  // Hanya DM ad-hoc yang punya overlay lokal.
  const extraMessages: ChatMessage[] =
    effectiveView.kind === "dm" ? extraByDm[effectiveView.id] ?? [] : [];

  const messages = [...baseMessages, ...extraMessages];

  const replyCountById: Record<string, number> = {};
  for (const message of messages) {
    replyCountById[message.id] = message.replies.length;
  }

  const threadMessage = openThreadId
    ? messages.find((message) => message.id === openThreadId) ?? null
    : null;
  const threadReplies = threadMessage ? threadMessage.replies : [];

  const currentUser = {
    id: "me",
    name: profileQuery.data?.name ?? "Kamu",
    avatar: profileQuery.data?.avatarUrl ?? "https://i.pravatar.cc/64?img=13",
  };

  const buildMessage = (payload: SendPayload, anonymousAllowed: boolean): ChatMessage => {
    const anon = anonymousAllowed && payload.anonymous;
    return {
      id: crypto.randomUUID(),
      authorId: anon ? "anon" : currentUser.id,
      authorName: anon ? "Anonim" : currentUser.name,
      authorAvatar: anon ? "" : currentUser.avatar,
      timestamp: nowLabel(),
      text: payload.text || undefined,
      code: payload.code ?? undefined,
      attachment: payload.attachment ?? undefined,
      anonymous: anon,
      replies: [],
    };
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

  const handleSendMessage = (payload: SendPayload) => {
    if (effectiveView.kind === "channel") {
      const channelId = effectiveView.id;
      void sendChannelMessage(channelId, payload)
        .then((message) => {
          // Tempel pesan dari server langsung ke cache (update instan).
          queryClient.setQueryData<ChatMessage[]>(messagesQueryKey(channelId), (old) => [
            ...(old ?? []),
            message,
          ]);
        })
        .catch(() => {});
    } else {
      const dmId = effectiveView.id;
      if (realDmIds.has(dmId)) {
        void sendDmMessage(dmId, payload)
          .then((message) => {
            queryClient.setQueryData<DirectConversation[]>(DMS_QUERY_KEY, (old) =>
              (old ?? []).map((dm) =>
                dm.id === dmId ? { ...dm, messages: [...dm.messages, message] } : dm,
              ),
            );
          })
          .catch(() => {});
      } else {
        // DM ad-hoc (dari Cari Tim) — simpan lokal.
        const message = buildMessage(payload, false);
        setExtraByDm((prev) => ({
          ...prev,
          [dmId]: [...(prev[dmId] ?? []), message],
        }));
      }
    }
  };

  const handleSendReply = (payload: SendPayload) => {
    if (!openThreadId || !activeChannelId) return;
    const channelId = activeChannelId;
    const parentId = openThreadId;
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
      .catch(() => {});
  };

  // Mulai panggilan: grup untuk channel, langsung (1-on-1) untuk DM.
  const handleStartCall = (mode: CallMode) => {
    const me = { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar };
    if (effectiveView.kind === "channel" && activeChannel) {
      setCall({
        kind: "group",
        mode,
        title: `#${activeChannel.name}`,
        isHost: true,
        participants: [
          me,
          ...dms
            .slice(0, 3)
            .map((dm) => ({ id: dm.id, name: dm.userName, avatar: dm.avatar })),
        ],
      });
    } else if (activeDm) {
      setCall({
        kind: "direct",
        mode,
        title: activeDm.userName,
        isHost: true,
        participants: [me, { id: activeDm.id, name: activeDm.userName, avatar: activeDm.avatar }],
      });
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
      musicTracks={musicQuery.data ?? []}
      isLoading={serversQuery.isLoading || channelsQuery.isLoading || dmsQuery.isLoading}
      isMessagesLoading={messagesQuery.isLoading}
      isError={serversQuery.isError || channelsQuery.isError || dmsQuery.isError}
      onSelectServer={handleSelectServer}
      onSelectChannel={handleSelectChannel}
      onSelectDm={handleSelectDm}
      onOpenThread={setOpenThreadId}
      onCloseThread={() => setOpenThreadId(null)}
      onSendMessage={handleSendMessage}
      onSendReply={handleSendReply}
      onStartCall={handleStartCall}
      onEndCall={() => setCall(null)}
      onRetry={() => {
        void serversQuery.refetch();
        void channelsQuery.refetch();
        void dmsQuery.refetch();
      }}
    />
  );
}

export default ChatPage;
