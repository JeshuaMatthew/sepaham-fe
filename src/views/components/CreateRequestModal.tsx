import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import gsap from "gsap";
import type { NewCollabInput } from "@/features/collab/types/collab";
import { CloseIcon, ImageIcon } from "@/shared/icons";

interface CreateRequestModalProps {
  /** komunitas yang sudah ada untuk dipilih. */
  communities: { id: string; name: string }[];
  onCreate: (input: NewCollabInput) => void;
  onClose: () => void;
}

const NEW_COMMUNITY = "__new";

function CreateRequestModal({ communities, onCreate, onClose }: CreateRequestModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [neededRoles, setNeededRoles] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [membersNeeded, setMembersNeeded] = useState("3");
  const [communityChoice, setCommunityChoice] = useState(NEW_COMMUNITY);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((prev) => [...prev, String(reader.result)]);
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, { y: 24, opacity: 0, scale: 0.96, duration: 0.4, ease: "power3.out" });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const canSubmit = title.trim().length > 0 && neededRoles.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    const isNew = communityChoice === NEW_COMMUNITY;
    onCreate({
      title: title.trim(),
      description: description.trim(),
      neededRoles: neededRoles.trim(),
      repoUrl: repoUrl.trim(),
      membersNeeded: Number(membersNeeded) || 2,
      images,
      communityId: isNew ? undefined : communityChoice,
      newCommunityName: isNew ? newCommunityName.trim() || title.trim() : undefined,
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
            className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Deskripsi</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Jelaskan idenya, tujuan (tugas/startup/hackathon), dan timeline."
            className="resize-none rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Role dibutuhkan</span>
            <input
              value={neededRoles}
              onChange={(event) => setNeededRoles(event.target.value)}
              placeholder="Backend, UI/UX"
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Jumlah anggota</span>
            <input
              type="number"
              value={membersNeeded}
              onChange={(event) => setMembersNeeded(event.target.value)}
              min="2"
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Repository project (opsional)</span>
          <input
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/username/nama-project"
            className="rounded-xl border border-line bg-surface px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
        </label>

        {/* Community server — anggota yang diterima diundang ke sini */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">
            Community server (anggota yang diterima diundang ke sini)
          </span>
          <select
            value={communityChoice}
            onChange={(event) => setCommunityChoice(event.target.value)}
            className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
          >
            <option value={NEW_COMMUNITY}>+ Buat community baru</option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </label>
        {communityChoice === NEW_COMMUNITY ? (
          <input
            value={newCommunityName}
            onChange={(event) => setNewCommunityName(event.target.value)}
            placeholder={title.trim() || "Nama community baru"}
            className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
        ) : null}

        {/* Gambar project (bisa beberapa) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Gambar project (opsional, bisa beberapa)</span>
          <label className="flex w-fit cursor-pointer items-center gap-1.5 border border-line px-4 py-2 text-sm font-semibold text-primary">
            <ImageIcon className="h-4 w-4" /> Upload gambar
            <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
          </label>
          {images.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {images.map((src, index) => (
                <div key={index} className="relative">
                  <img src={src} alt="" className="h-16 w-16 border border-line object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center border border-line bg-canvas text-muted hover:text-ink"
                  >
                    <CloseIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-canvas transition-transform hover:enabled:scale-[1.02] active:enabled:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Posting request
        </button>
      </div>
    </div>
  );
}

export default CreateRequestModal;
