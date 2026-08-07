import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { NewCollabInput } from "../../types/collab";
import { CloseIcon } from "../icons";

interface CreateRequestModalProps {
  onCreate: (input: NewCollabInput) => void;
  onClose: () => void;
}

function CreateRequestModal({ onCreate, onClose }: CreateRequestModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [neededRoles, setNeededRoles] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [membersNeeded, setMembersNeeded] = useState("3");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, { y: 24, opacity: 0, scale: 0.96, duration: 0.4, ease: "power3.out" });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const canSubmit = title.trim().length > 0 && neededRoles.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onCreate({
      title: title.trim(),
      description: description.trim(),
      neededRoles: neededRoles.trim(),
      repoUrl: repoUrl.trim(),
      membersNeeded: Number(membersNeeded) || 2,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[88vh] w-full max-w-lg flex-col gap-4 overflow-y-auto border border-line bg-canvas p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">Ajak bikin aplikasi bareng</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="cursor-pointer rounded-full px-2 py-1 text-muted hover:bg-elevate hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted">
          Ceritakan ide aplikasimu dan role apa yang kamu cari. Mahasiswa lain bisa gabung.
        </p>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Ide / judul proyek</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Contoh: Aplikasi split bill anak kos"
            className="rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Deskripsi</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Jelaskan idenya, tujuan (tugas/startup/hackathon), dan timeline."
            className="resize-none rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Role dibutuhkan</span>
            <input
              value={neededRoles}
              onChange={(event) => setNeededRoles(event.target.value)}
              placeholder="Backend, UI/UX"
              className="rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Jumlah anggota</span>
            <input
              type="number"
              value={membersNeeded}
              onChange={(event) => setMembersNeeded(event.target.value)}
              min="2"
              className="rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Repository project (opsional)</span>
          <input
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/username/nama-project"
            className="rounded-xl border border-line bg-canvas px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
        </label>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-ink transition-transform hover:enabled:scale-[1.02] active:enabled:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Posting request
        </button>
      </div>
    </div>
  );
}

export default CreateRequestModal;
