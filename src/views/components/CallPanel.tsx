import { useEffect, useRef, useState } from "react";
import type { ActiveCall } from "../../types/chat";
import type { LofiTrack } from "../../types/music";
import CallMusicPlayer from "./CallMusicPlayer";
import { MicIcon, MicOffIcon, PhoneIcon, PhoneOffIcon, VideoIcon, VideoOffIcon } from "../icons";

interface CallPanelProps {
  call: ActiveCall;
  tracks: LofiTrack[];
  onEnd: () => void;
}

const FALLBACK_AVATAR = "https://i.pravatar.cc/80?img=13";

function CallPanel({ call, tracks, onEnd }: CallPanelProps) {
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(call.mode === "video");
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Kamera nyata via getUserMedia (mirip Google Meet). Nyala/mati mengikuti state.
  useEffect(() => {
    let cancelled = false;
    const stop = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    if (!cameraOn) {
      stop();
      return;
    }

    void (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraError(false);
      } catch {
        setCameraError(true);
        setCameraOn(false);
      }
    })();

    return () => {
      cancelled = true;
      stop();
    };
  }, [cameraOn]);

  const [local, ...remotes] = call.participants;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-line bg-surface xl:w-96">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          {call.mode === "video" ? <VideoIcon className="h-4 w-4" /> : <PhoneIcon className="h-4 w-4" />}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-ink">{call.title}</span>
          <span className="text-[11px] text-muted">
            {call.kind === "group" ? "Panggilan grup" : "Panggilan langsung"} ·{" "}
            {call.participants.length} peserta
          </span>
        </div>
      </div>

      {/* Grid video peserta */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* Tile lokal (kamu) */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-elevate">
            {cameraOn && !cameraError ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full -scale-x-100 object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={local?.avatar || FALLBACK_AVATAR}
                  alt={local?.name ?? "Kamu"}
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
            )}
            <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-canvas/70 px-1.5 py-0.5 text-[10px] font-medium text-ink">
              {muted ? <MicOffIcon className="h-3 w-3 text-danger" /> : null}
              {local?.name ?? "Kamu"} (kamu)
            </span>
          </div>

          {/* Tile peserta lain */}
          {remotes.map((participant) => (
            <div
              key={participant.id}
              className="relative aspect-video overflow-hidden rounded-xl border border-line bg-elevate"
            >
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={participant.avatar || FALLBACK_AVATAR}
                  alt={participant.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-1 left-1 rounded bg-canvas/70 px-1.5 py-0.5 text-[10px] font-medium text-ink">
                {participant.name}
              </span>
            </div>
          ))}
        </div>

        {cameraError ? (
          <p className="mt-2 text-[11px] text-muted">
            Kamera tidak tersedia atau izinnya ditolak.
          </p>
        ) : null}

        {/* Pemutar musik (khusus host/pembuat panggilan) */}
        {call.isHost ? (
          <div className="mt-3">
            <CallMusicPlayer tracks={tracks} />
          </div>
        ) : null}
      </div>

      {/* Kontrol panggilan */}
      <div className="flex items-center justify-center gap-2 border-t border-line px-4 py-3">
        <button
          type="button"
          onClick={() => setMuted((prev) => !prev)}
          title={muted ? "Nyalakan mic" : "Matikan mic"}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors ${
            muted ? "bg-danger/15 text-danger" : "bg-elevate text-ink hover:bg-line"
          }`}
        >
          {muted ? <MicOffIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={() => setCameraOn((prev) => !prev)}
          title={cameraOn ? "Matikan kamera" : "Nyalakan kamera"}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors ${
            cameraOn ? "bg-elevate text-ink hover:bg-line" : "bg-danger/15 text-danger"
          }`}
        >
          {cameraOn ? <VideoIcon className="h-5 w-5" /> : <VideoOffIcon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={onEnd}
          title="Akhiri panggilan"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-danger text-canvas transition-transform hover:scale-105 active:scale-95"
        >
          <PhoneOffIcon className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}

export default CallPanel;
