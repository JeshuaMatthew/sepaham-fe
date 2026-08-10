import { useState } from "react";
import type { KeyboardEvent } from "react";
import type { Attachment, SendPayload } from "../../types/chat";
import { AttachIcon, CloseIcon, CodeIcon, ImageIcon, MaskIcon } from "../icons";

interface MessageComposerProps {
  placeholder: string;
  allowAnonymous: boolean;
  defaultAnonymous?: boolean;
  onSend: (payload: SendPayload) => void;
}

// Attachment mock — di app nyata ini hasil upload file.
const MOCK_ATTACHMENT: Attachment = {
  name: "screenshot.png",
  kind: "image",
  size: "128 KB",
};

function MessageComposer({
  placeholder,
  allowAnonymous,
  defaultAnonymous = false,
  onSend,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(defaultAnonymous);
  const [codeMode, setCodeMode] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;

    const payload: SendPayload = {
      text: codeMode ? "" : trimmed,
      code: codeMode && trimmed ? { language: "tsx", content: text } : null,
      attachment,
      anonymous,
    };
    onSend(payload);

    setText("");
    setCodeMode(false);
    setAttachment(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !codeMode) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="rounded-2xl  p-3">
      {attachment ? (
        <div className="mb-2 flex w-fit items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-1.5">
          <ImageIcon className="h-4 w-4 text-muted" />
          <span className="text-xs text-ink">{attachment.name}</span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            aria-label="Hapus lampiran"
            className="cursor-pointer text-muted hover:text-danger"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={codeMode ? "// paste code here…" : placeholder}
        rows={codeMode ? 4 : 2}
        className={`w-full resize-none bg-transparent px-1 text-sm text-ink placeholder:text-muted/60 focus:outline-none ${
          codeMode ? "font-mono" : ""
        }`}
      />

      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCodeMode((prev) => !prev)}
          aria-pressed={codeMode}
          title="Code mode"
          className={`cursor-pointer px-1 py-1 font-mono text-xs ${
            codeMode ? "text-primary" : "text-muted hover:text-ink"
          }`}
        >
          <CodeIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setAttachment(MOCK_ATTACHMENT)}
          title="Attach file"
          className="cursor-pointer px-1 py-1 text-muted hover:text-ink"
        >
          <AttachIcon className="h-4 w-4" />
        </button>

        {allowAnonymous ? (
          <button
            type="button"
            onClick={() => setAnonymous((prev) => !prev)}
            aria-pressed={anonymous}
            title="Send anonymously"
            className={`flex cursor-pointer items-center gap-1.5 px-1 py-1 text-xs ${
              anonymous ? "text-primary" : "text-muted hover:text-ink"
            }`}
          >
            <MaskIcon className="h-4 w-4" /> Anonymous
          </button>
        ) : null}

        <button
          type="button"
          onClick={submit}
          className="ml-auto cursor-pointer px-2 py-1.5 text-sm font-semibold text-primary"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageComposer;
