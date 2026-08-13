import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { ChatMessage, SendPayload } from "@/features/chat/types/chat";
import MessageItem from "./MessageItem";
import MessageComposer from "./MessageComposer";
import { CloseIcon } from "@/shared/icons";

interface ThreadPanelProps {
  message: ChatMessage;
  replies: ChatMessage[];
  onClose: () => void;
  onSendReply: (payload: SendPayload) => void;
}

function ThreadPanel({ message, replies, onClose, onSendReply }: ThreadPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(panelRef.current, { xPercent: 100, duration: 0.35, ease: "power3.out" });
    }, panelRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-canvas/60" onClick={onClose}>
      <div
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col border-l border-line bg-surface"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-display text-base font-semibold text-ink">Thread</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close thread"
            className="cursor-pointer rounded-full px-2 py-1 text-muted hover:bg-elevate hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Isi thread */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          <MessageItem message={message} replyCount={0} showThreadButton={false} />

          <div className="my-2 flex items-center gap-3 px-2">
            <span className="text-xs text-muted">
              {replies.length} replies
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {replies.map((reply) => (
            <MessageItem
              key={reply.id}
              message={reply}
              replyCount={0}
              showThreadButton={false}
            />
          ))}
        </div>

        {/* Composer balasan — jawaban selalu pakai nama asli */}
        <div className="border-t border-line p-3">
          <MessageComposer
            placeholder="Reply in thread…"
            allowAnonymous={false}
            onSend={onSendReply}
          />
        </div>
      </div>
    </div>
  );
}

export default ThreadPanel;
