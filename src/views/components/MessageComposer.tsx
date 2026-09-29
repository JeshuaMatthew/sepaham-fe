import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Attachment, SendPayload } from "@/features/chat/types/chat";
import { uploadChatAttachment } from "@/features/chat/services/chatService";
import { AttachIcon, CloseIcon, CodeIcon, ImageIcon, MaskIcon } from "@/shared/icons";

interface MessageComposerProps {
  placeholder: string;
  allowAnonymous: boolean;
  defaultAnonymous?: boolean;
  onSend: (payload: SendPayload) => void;
}

function formatLocalSize(bytes: number): string {
  const kb = Math.max(1, Math.round(bytes / 1024));
  return kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const trimmed = text.trim();
    if ((!trimmed && !attachment) || isUploading) return;

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
    setUploadError(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !codeMode) {
      event.preventDefault();
      submit();
    }
  };

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      // Berkas benar-benar diunggah ke server dulu. Sebelumnya tombol ini
      // langsung menempelkan konstanta `screenshot.png` 128 KB tanpa file
      // picker dan tanpa upload.
      const uploaded = await uploadChatAttachment(file);
      setAttachment(uploaded);
    } catch {
      // Fallback lokal supaya pesan tetap bisa dikirim sebagai teks kalau
      // upload gagal: tampilkan nama berkas, tapi tanpa URL — dan backend
      // tetap menyimpan pesannya sebagai teks biasa.
      setUploadError("Gagal mengunggah berkas. Pesan akan dikirim tanpa lampiran.");
      setAttachment({
        name: file.name,
        kind: file.type.startsWith("image/") ? "image" : "file",
        size: formatLocalSize(file.size),
      });
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl  p-3">
      {attachment ? (
        <div className="mb-2 flex w-fit items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-1.5">
          <ImageIcon className="h-4 w-4 text-muted" />
          <span className="text-xs text-ink">{attachment.name}</span>
          <span className="text-[11px] text-muted">{attachment.size}</span>
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
      {uploadError ? <p className="mb-2 text-xs text-danger">{uploadError}</p> : null}

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
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          title="Attach file"
          className="cursor-pointer px-1 py-1 text-muted hover:text-ink disabled:opacity-50"
        >
          <AttachIcon className="h-4 w-4" />
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(event) => void handleFileChange(event.target.files?.[0])}
        />
        {isUploading ? <span className="text-xs text-muted">Mengunggah…</span> : null}

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
          disabled={isUploading}
          className="ml-auto cursor-pointer px-2 py-1.5 text-sm font-semibold text-primary disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageComposer;
