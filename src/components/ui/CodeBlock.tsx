import { useState } from "react";
import type { CodeSnippet } from "@/features/chat/types/chat";
import { CheckIcon } from "@/shared/icons";

interface CodeBlockProps {
  code: CodeSnippet;
}

function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
          {code.language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 cursor-pointer font-mono text-[11px] text-muted transition-colors hover:text-accent"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3 w-3" /> copied
            </>
          ) : (
            "copy"
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3">
        <code className="font-mono text-xs leading-relaxed text-ink">{code.content}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
