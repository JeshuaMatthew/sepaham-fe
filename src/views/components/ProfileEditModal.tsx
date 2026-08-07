import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Profile } from "../../types/profile";
import { CloseIcon } from "../icons";

interface ProfileEditModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (patch: Partial<Profile>) => void;
}

function ProfileEditModal({ profile, onClose, onSave }: ProfileEditModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [university, setUniversity] = useState(profile.university);
  const [batch, setBatch] = useState(String(profile.batch));
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, { y: 24, opacity: 0, scale: 0.96, duration: 0.4, ease: "power3.out" });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const canSave = name.trim().length > 0 && username.trim().length > 0;

  const submit = () => {
    if (!canSave) return;
    onSave({
      name: name.trim(),
      username: username.trim().replace(/^@/, ""),
      university: university.trim(),
      batch: Number(batch) || profile.batch,
      location: location.trim(),
      bio: bio.trim(),
    });
  };

  const fieldClass =
    "rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none";

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
          <h2 className="font-display text-xl font-bold text-ink">Edit profile</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-full px-2 py-1 text-muted hover:bg-elevate hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Campus</span>
            <input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Class year</span>
            <input
              type="number"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-medium text-muted">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-medium text-muted">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className={`resize-none ${fieldClass}`}
            />
          </label>
        </div>

        <div className="mt-1 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-3 py-2 text-sm font-semibold text-muted hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSave}
            className="cursor-pointer px-3 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditModal;
