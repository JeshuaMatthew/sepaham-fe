import type {
  ActiveCall,
  ActiveView,
  CallMode,
  Channel,
  ChatMessage,
  DirectConversation,
  SendPayload,
  Server,
} from "../../types/chat";
import ServerRail from "./ServerRail";
import ServerRailSkeleton from "./ServerRailSkeleton";
import ChannelSidebar from "./ChannelSidebar";
import ChannelSidebarSkeleton from "./ChannelSidebarSkeleton";
import MessageList from "./MessageList";
import MessageListSkeleton from "./MessageListSkeleton";
import { AlertIcon, CheckIcon, CloseIcon, MaskIcon, PhoneIcon, VideoIcon } from "../icons";
import MessageComposer from "./MessageComposer";
import ThreadPanel from "./ThreadPanel";
import CallPanel from "./CallPanel";

interface ChatContainerProps {
  servers: Server[];
  serverName: string;
  channels: Channel[];
  dms: DirectConversation[];
  activeServerId: string | null;
  activeView: ActiveView;
  activeChannel: Channel | null;
  activeDm: DirectConversation | null;
  messages: ChatMessage[];
  replyCountById: Record<string, number>;
  threadMessage: ChatMessage | null;
  threadReplies: ChatMessage[];
  activeCall: ActiveCall | null;
  joinNotice: string | null;
  isLoading: boolean;
  isMessagesLoading: boolean;
  isError: boolean;
  onDismissJoinNotice: () => void;
  onSelectServer: (id: string) => void;
  onSelectChannel: (id: string) => void;
  onSelectDm: (id: string) => void;
  onOpenThread: (messageId: string) => void;
  onCloseThread: () => void;
  onSendMessage: (payload: SendPayload) => void;
  onSendReply: (payload: SendPayload) => void;
  onStartCall: (mode: CallMode) => void;
  onEndCall: () => void;
  onRetry: () => void;
}

function ChatContainer({
  servers,
  serverName,
  channels,
  dms,
  activeServerId,
  activeView,
  activeChannel,
  activeDm,
  messages,
  replyCountById,
  threadMessage,
  threadReplies,
  activeCall,
  joinNotice,
  isLoading,
  isMessagesLoading,
  isError,
  onDismissJoinNotice,
  onSelectServer,
  onSelectChannel,
  onSelectDm,
  onOpenThread,
  onCloseThread,
  onSendMessage,
  onSendReply,
  onStartCall,
  onEndCall,
  onRetry,
}: ChatContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Couldn't load the community
          </h2>
          <p className="text-sm text-muted">Please try reloading in a moment.</p>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer py-2 text-sm font-semibold text-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const isChannel = activeView.kind === "channel";
  const showMessageSkeleton = isChannel && isMessagesLoading;

  return (
    <div className="flex h-full bg-canvas text-ink">
      {isLoading ? <ServerRailSkeleton /> : (
        <ServerRail
          servers={servers}
          activeServerId={activeServerId}
          onSelectServer={onSelectServer}
        />
      )}

      {/* Daftar channel disembunyikan saat panggilan aktif agar chat tetap lega */}
      {activeCall ? null : isLoading ? (
        <ChannelSidebarSkeleton />
      ) : (
        <ChannelSidebar
          serverName={serverName}
          channels={channels}
          dms={dms}
          activeView={activeView}
          onSelectChannel={onSelectChannel}
          onSelectDm={onSelectDm}
        />
      )}

      {/* Kolom utama */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Banner setelah bergabung lewat invite link */}
        {joinNotice ? (
          <div className="grad-blue flex items-center gap-2 px-5 py-2.5 text-sm text-ink">
            <CheckIcon className="h-4 w-4 shrink-0" />
            <span>
              Kamu bergabung ke komunitas{" "}
              <span className="font-semibold">{joinNotice}</span>.
            </span>
            <button
              type="button"
              onClick={onDismissJoinNotice}
              aria-label="Tutup notifikasi"
              className="ml-auto shrink-0 cursor-pointer text-muted hover:text-ink"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {/* Header */}
        <header className="flex items-center gap-3 border-b border-line px-5 py-3.5">
          {activeChannel ? (
            <>
              <span className="text-lg text-muted" aria-hidden="true">
                {activeChannel.kind === "anon" ? <MaskIcon className="h-4 w-4" /> : "#"}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-display text-base font-semibold text-ink">
                  {activeChannel.name}
                </span>
                <span className="truncate text-xs text-muted">{activeChannel.topic}</span>
              </div>
              {activeChannel.kind === "anon" ? (
                <span className="ml-2 bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">
                  asker identity hidden
                </span>
              ) : null}
            </>
          ) : activeDm ? (
            <>
              <span className="relative shrink-0">
                <img src={activeDm.avatar} alt={activeDm.userName} className="h-9 w-9 rounded-xl object-cover" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-canvas ${
                    activeDm.online ? "bg-neon" : "bg-muted"
                  }`}
                />
              </span>
              <div className="flex flex-col">
                <span className="font-display text-base font-semibold text-ink">
                  {activeDm.userName}
                </span>
                <span className="text-xs text-muted">
                  {activeDm.role} · {activeDm.online ? "online" : "offline"}
                </span>
              </div>
            </>
          ) : (
            <div className="h-6 w-40 rounded-full bg-elevate animate-shimmer" />
          )}

          {/* Aksi panggilan (grup untuk channel, langsung untuk DM) */}
          {(activeChannel || activeDm) && !activeCall ? (
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => onStartCall("audio")}
                title={activeDm ? "Voice call" : "Group voice call"}
                aria-label="Voice call"
                className="flex h-9 w-9 cursor-pointer items-center justify-center text-primary hover:text-accent"
              >
                <PhoneIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => onStartCall("video")}
                title={activeDm ? "Video call" : "Group video call"}
                aria-label="Video call"
                className="flex h-9 w-9 cursor-pointer items-center justify-center text-primary hover:text-accent"
              >
                <VideoIcon className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </header>

        {/* Pesan */}
        <div className="flex-1 overflow-y-auto px-4">
          {showMessageSkeleton ? (
            <MessageListSkeleton />
          ) : (
            <MessageList
              key={activeView.id}
              messages={messages}
              replyCountById={replyCountById}
              onOpenThread={onOpenThread}
            />
          )}
        </div>

        {/* Composer */}
        <div className="px-4 pb-4">
          <MessageComposer
            key={activeView.id}
            placeholder={
              activeChannel
                ? `Kirim pesan ke #${activeChannel.name}`
                : activeDm
                  ? `Kirim pesan ke ${activeDm.userName}`
                  : "Tulis pesan…"
            }
            allowAnonymous={isChannel}
            defaultAnonymous={activeChannel?.kind === "anon"}
            onSend={onSendMessage}
          />
        </div>
      </main>

      {/* Thread drawer */}
      {threadMessage ? (
        <ThreadPanel
          message={threadMessage}
          replies={threadReplies}
          onClose={onCloseThread}
          onSendReply={onSendReply}
        />
      ) : null}

      {/* Panel panggilan (mendamping chat, tidak menutupi) */}
      {activeCall ? (
        <CallPanel call={activeCall} onEnd={onEndCall} />
      ) : null}
    </div>
  );
}

export default ChatContainer;
