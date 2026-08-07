import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CHANNELS_QUERY_KEY,
  DMS_QUERY_KEY,
  SERVERS_QUERY_KEY,
  fetchChannels,
  fetchChannelMessages,
  fetchDirectConversations,
  fetchServers,
  messagesQueryKey,
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
import { getStoredCommunities } from "../../utils/communityStore";
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

  const location = useLocation();

  const [activeServerId, setActiveServerId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView | null>(null);
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [call, setCall] = useState<ActiveCall | null>(null);

  // Overlay lokal untuk pesan/balasan baru (mock: belum ada backend).
  const [extraByChannel, setExtraByChannel] = useState<Record<string, ChatMessage[]>>({});
  const [extraByDm, setExtraByDm] = useState<Record<string, ChatMessage[]>>({});
  const [extraReplies, setExtraReplies] = useState<Record<string, ChatMessage[]>>({});
  // DM ad-hoc yang dibuka dari fitur lain (Cari Tim, dst).
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

  // Komunitas yang dibuat dari request "Cari Tim" (localStorage) tampil paling atas.
  const storedCommunities = getStoredCommunities();
  const servers = [...storedCommunities.map((c) => c.server), ...(serversQuery.data ?? [])];
  const channels = [
    ...storedCommunities.flatMap((c) => c.channels),
    ...(channelsQuery.data ?? []),
  ];
  const dms = [...extraDms, ...(dmsQuery.data ?? [])];

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

  const baseMessages: ChatMessage[] =
    effectiveView.kind === "channel"
      ? messagesQuery.data ?? []
      : activeDm?.messages ?? [];

  const extraMessages: ChatMessage[] =
    effectiveView.kind === "channel"
      ? extraByChannel[effectiveView.id] ?? []
      : extraByDm[effectiveView.id] ?? [];

  const messages = [...baseMessages, ...extraMessages];

  const replyCountById: Record<string, number> = {};
  for (const message of messages) {
    replyCountById[message.id] =
      message.replies.length + (extraReplies[message.id]?.length ?? 0);
  }

  const threadMessage = openThreadId
    ? messages.find((message) => message.id === openThreadId) ?? null
    : null;
  const threadReplies = threadMessage
    ? [...threadMessage.replies, ...(extraReplies[threadMessage.id] ?? [])]
    : [];

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
    const message = buildMessage(payload, effectiveView.kind === "channel");
    if (effectiveView.kind === "channel") {
      const channelId = effectiveView.id;
      setExtraByChannel((prev) => ({
        ...prev,
        [channelId]: [...(prev[channelId] ?? []), message],
      }));
    } else {
      const dmId = effectiveView.id;
      setExtraByDm((prev) => ({
        ...prev,
        [dmId]: [...(prev[dmId] ?? []), message],
      }));
    }
  };

  const handleSendReply = (payload: SendPayload) => {
    if (!openThreadId) return;
    const reply = buildMessage(payload, false);
    setExtraReplies((prev) => ({
      ...prev,
      [openThreadId]: [...(prev[openThreadId] ?? []), reply],
    }));
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
