import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { CareerMessage, CareerProfile } from "@/features/career/types/career";
import MarkdownView from "@/components/ui/MarkdownView";
import { ArrowLeftIcon, ArrowRightIcon, SparkleIcon } from "@/shared/icons";

interface CareerConsultContainerProps {
  profile: CareerProfile | null;
  isLoading: boolean;
  isAiTyping: boolean;
  messages: CareerMessage[];
  input: string;
  suggestions: string[];
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
}

function CareerConsultContainer({
  profile,
  isLoading,
  isAiTyping,
  messages,
  input,
  suggestions,
  onInputChange,
  onSend,
}: CareerConsultContainerProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isAiTyping]);

  const handleSubmit = () => {
    const text = input.trim();
    if (text) onSend(text);
  };

  return (
    <div className="flex h-full flex-col bg-canvas px-6 py-6 sm:px-8">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col gap-3">
        {/* Header ringkas agar chat memenuhi tinggi halaman */}
        <header className="flex flex-col gap-1">
          <Link
            to="/career"
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Career
          </Link>
          <h1 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
            <SparkleIcon className="h-5 w-5" /> Career AI consult
          </h1>
          <p className="text-xs text-muted">
            {profile
              ? `Ask about your ${profile.readiness}% readiness (${profile.level}), next steps, roadmap, GitHub, projects, or CV.`
              : "Ask about your career progress and next steps."}
          </p>
        </header>

        {/* Panel chat memenuhi sisa tinggi (netral; hanya bubble user yang gradient) */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-line bg-surface">
          <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
            {isLoading ? (
              <span className="text-sm text-muted">Loading your career data…</span>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 text-sm ${
                        message.role === "user"
                          ? "grad-blue whitespace-pre-line text-ink"
                          : "border border-line bg-canvas text-ink/90"
                      }`}
                    >
                      {message.role === "ai" ? (
                        <MarkdownView content={message.text} />
                      ) : (
                        message.text
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator — tampil saat menunggu respons Gemini */}
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 border border-line bg-canvas px-3 py-2.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-1.5 border-t border-line px-4 py-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSend(suggestion)}
                disabled={!profile || isAiTyping}
                className="cursor-pointer border border-line px-2.5 py-1 text-[11px] text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Composer */}
          <div className="flex items-center gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSubmit();
              }}
              placeholder={isAiTyping ? "AI is thinking…" : "Ask about your career progress…"}
              disabled={isAiTyping}
              className="flex-1 border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!input.trim() || !profile || isAiTyping}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold ${
                input.trim() && profile && !isAiTyping ? "cursor-pointer text-primary" : "cursor-not-allowed text-muted"
              }`}
            >
              Send <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerConsultContainer;

