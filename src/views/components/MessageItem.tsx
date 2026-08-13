import type { ChatMessage } from "@/features/chat/types/chat";
import CodeBlock from "./CodeBlock";
import { ChatIcon, FileIcon, ImageIcon, MaskIcon } from "@/shared/icons";

interface MessageItemProps {
  message: ChatMessage;
  replyCount: number;
  /** sembunyikan tombol thread (mis. saat item ini sudah di dalam thread). */
  showThreadButton?: boolean;
  onOpenThread?: (messageId: string) => void;
}

function MessageItem({
  message,
  replyCount,
  showThreadButton = true,
  onOpenThread,
}: MessageItemProps) {
  const isAnon = message.anonymous;

  return (
    <div className="group flex gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface/60">
      {/* Avatar */}
      {isAnon ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-elevate text-muted">
          <MaskIcon className="h-5 w-5" />
        </div>
      ) : (
        <img
          src={message.authorAvatar}
          alt={message.authorName}
          className="h-10 w-10 shrink-0 rounded-xl object-cover"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${isAnon ? "italic text-muted" : "text-ink"}`}>
            {isAnon ? "Anonymous" : message.authorName}
          </span>
          {isAnon ? (
            <span className="bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
              anon question
            </span>
          ) : null}
          <span className="font-mono text-[11px] text-muted">{message.timestamp}</span>
        </div>

        {/* Body */}
        {message.text ? (
          <p className="text-sm leading-relaxed text-ink/90">{message.text}</p>
        ) : null}

        {message.code ? <CodeBlock code={message.code} /> : null}

        {message.attachment ? (
          <div className="flex w-fit items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2">
            <span className="text-muted" aria-hidden="true">
              {message.attachment.kind === "image" ? (
                <ImageIcon className="h-5 w-5" />
              ) : (
                <FileIcon className="h-5 w-5" />
              )}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-ink">{message.attachment.name}</span>
              <span className="text-[11px] text-muted">{message.attachment.size}</span>
            </div>
          </div>
        ) : null}

        {/* Thread indicator */}
        {showThreadButton ? (
          <button
            type="button"
            onClick={() => onOpenThread?.(message.id)}
            className={`mt-0.5 inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors ${
              replyCount > 0
                ? "text-accent hover:bg-elevate"
                : "text-muted opacity-0 hover:bg-elevate group-hover:opacity-100"
            }`}
          >
            <ChatIcon className="h-3.5 w-3.5" />
            {replyCount > 0 ? `${replyCount} replies · view thread` : "Reply in thread"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default MessageItem;
