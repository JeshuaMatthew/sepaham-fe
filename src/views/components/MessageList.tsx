import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { ChatMessage } from "../../types/chat";
import MessageItem from "./MessageItem";
import { SmileIcon } from "../icons";

interface MessageListProps {
  messages: ChatMessage[];
  replyCountById: Record<string, number>;
  onOpenThread: (messageId: string) => void;
}

function MessageList({ messages, replyCountById, onOpenThread }: MessageListProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Animasi masuk + auto-scroll ke bawah saat pertama render (per view).
  useEffect(() => {
    // Empty state tidak me-render rootRef, jadi lewati animasinya.
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-msg]", {
        y: 12,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.05,
      });
    }, rootRef);
    bottomRef.current?.scrollIntoView({ block: "end" });
    return () => ctx.revert();
  }, []);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <SmileIcon className="h-8 w-8 text-muted" />
        <p className="text-sm text-muted">
          No messages here yet. Be the first to say hi!
        </p>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex flex-col gap-1 py-4">
      {messages.map((message) => (
        <div data-msg key={message.id}>
          <MessageItem
            message={message}
            replyCount={replyCountById[message.id] ?? message.replies.length}
            onOpenThread={onOpenThread}
          />
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
