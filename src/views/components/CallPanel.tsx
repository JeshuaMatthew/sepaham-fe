import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";
import type { Participant } from "livekit-client";
import type { ActiveCall } from "../../types/chat";
import type { LofiTrack } from "../../types/music";
import CallMusicPlayer from "./CallMusicPlayer";
import { MicIcon, MicOffIcon, PhoneIcon, PhoneOffIcon, VideoIcon, VideoOffIcon } from "../icons";

interface CallPanelProps {
  call: ActiveCall;
  tracks: LofiTrack[];
  onEnd: () => void;
}

/** Satu tile peserta — meng-attach video/audio track LiveKit ke elemennya. */
function ParticipantTile({
  participant,
  isLocal,
  refreshKey,
}: {
  participant: Participant;
  isLocal: boolean;
  refreshKey: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [videoOn, setVideoOn] = useState(false);

  useEffect(() => {
    const camPub = participant.getTrackPublication(Track.Source.Camera);
    const videoTrack = camPub?.videoTrack;
    if (videoTrack && videoRef.current && camPub && !camPub.isMuted) {
      videoTrack.attach(videoRef.current);
      setVideoOn(true);
    } else {
      setVideoOn(false);
    }
    if (!isLocal) {
      const audioTrack = participant.getTrackPublication(Track.Source.Microphone)?.audioTrack;
      if (audioTrack && audioRef.current) audioTrack.attach(audioRef.current);
    }
  }, [participant, isLocal, refreshKey]);

  const label = isLocal
    ? `${participant.name || "Kamu"} (kamu)`
    : participant.name || participant.identity;
  const micMuted = participant.getTrackPublication(Track.Source.Microphone)?.isMuted ?? true;
  const initials = (participant.name || participant.identity || "?").slice(0, 2).toUpperCase();

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-xl border bg-elevate ${
        participant.isSpeaking ? "border-primary" : "border-line"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        className={`h-full w-full object-cover ${isLocal ? "-scale-x-100" : ""} ${
          videoOn ? "" : "hidden"
        }`}
      />
      {!isLocal ? <audio ref={audioRef} autoPlay /> : null}
      {!videoOn ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            {initials}
          </span>
        </div>
      ) : null}
      <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-canvas/70 px-1.5 py-0.5 text-[10px] font-medium text-ink">
        {micMuted ? <MicOffIcon className="h-3 w-3 text-danger" /> : null}
        {label}
      </span>
    </div>
  );
}

function CallPanel({ call, tracks, onEnd }: CallPanelProps) {
  const roomRef = useRef<Room | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(call.mode === "video");
  // Kegagalan mic vs kamera dipisah supaya salah satunya masih bisa jalan.
  const [micError, setMicError] = useState<string | null>(null);
  const [camError, setCamError] = useState<string | null>(null);
  // Daftar perangkat untuk pemilih (beberapa mesin punya kamera virtual yang
  // "default"-nya gagal — user perlu bisa memilih perangkat lain).
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [selectedCam, setSelectedCam] = useState("");
  const [selectedMic, setSelectedMic] = useState("");

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  /** Enumerasi perangkat + sinkronkan pilihan dari perangkat aktif. */
  const loadDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameras(devices.filter((d) => d.kind === "videoinput" && d.deviceId));
      setMics(devices.filter((d) => d.kind === "audioinput" && d.deviceId));
      const room = roomRef.current;
      if (room) {
        const cam = room.getActiveDevice("videoinput");
        const mic = room.getActiveDevice("audioinput");
        if (cam) setSelectedCam(cam);
        if (mic) setSelectedMic(mic);
      }
    } catch {
      // abaikan — tanpa izin, enumerateDevices bisa gagal/kosong
    }
  }, []);

  // Connect ke LiveKit room + publish mic/kamera. Media lewat server LiveKit.
  useEffect(() => {
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;
    room
      .on(RoomEvent.ParticipantConnected, refresh)
      .on(RoomEvent.ParticipantDisconnected, refresh)
      .on(RoomEvent.TrackSubscribed, refresh)
      .on(RoomEvent.TrackUnsubscribed, refresh)
      .on(RoomEvent.TrackMuted, refresh)
      .on(RoomEvent.TrackUnmuted, refresh)
      .on(RoomEvent.LocalTrackPublished, refresh)
      .on(RoomEvent.LocalTrackUnpublished, refresh)
      .on(RoomEvent.ActiveSpeakersChanged, refresh)
      .on(RoomEvent.MediaDevicesChanged, () => void loadDevices())
      .on(RoomEvent.Disconnected, () => onEnd());

    let cancelled = false;
    void (async () => {
      try {
        await room.connect(call.serverUrl, call.token);
        if (cancelled) return;
        setConnected(true);

        // Mikrofon dulu — ini juga yang memicu prompt izin, sehingga setelahnya
        // enumerateDevices mengembalikan label + deviceId lengkap.
        try {
          await room.localParticipant.setMicrophoneEnabled(true);
        } catch {
          setMicOn(false);
          setMicError("Mikrofon tidak bisa diakses.");
        }

        const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
        const cams = devices.filter((d) => d.kind === "videoinput" && d.deviceId);
        if (!cancelled) {
          setCameras(cams);
          setMics(devices.filter((d) => d.kind === "audioinput" && d.deviceId));
          const activeMic = room.getActiveDevice("audioinput");
          if (activeMic) setSelectedMic(activeMic);
        }

        // Kamera dengan deviceId EKSPLISIT (kamera pertama) — memilih "default"
        // (video:true) bisa nyangkut di kamera virtual yang tak streaming
        // ("Timeout starting video source"). User bisa ganti lewat pemilih.
        if (call.mode === "video") {
          const preferredCam = cams[0]?.deviceId;
          try {
            await room.localParticipant.setCameraEnabled(
              true,
              preferredCam ? { deviceId: { exact: preferredCam } } : undefined,
            );
            if (preferredCam && !cancelled) setSelectedCam(preferredCam);
          } catch {
            if (!cancelled) {
              setCamOn(false);
              setCamError("Kamera gagal dimulai. Pilih perangkat lain di bawah.");
            }
          }
        }

        if (!cancelled) refresh();
      } catch {
        if (!cancelled) setError("Gagal terhubung ke server panggilan.");
      }
    })();

    return () => {
      cancelled = true;
      // Lepas listener dulu supaya disconnect teardown tak memicu onEnd
      // (React StrictMode menjalankan effect dua kali saat dev).
      room.removeAllListeners();
      room.disconnect();
      roomRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMic = () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !micOn;
    setMicOn(next);
    if (next) setMicError(null);
    void room.localParticipant
      .setMicrophoneEnabled(next, next && selectedMic ? { deviceId: { exact: selectedMic } } : undefined)
      .then(() => refresh())
      .catch(() => {
        if (next) {
          setMicOn(false);
          setMicError("Mikrofon tidak bisa diakses.");
        }
      });
  };

  const toggleCam = () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !camOn;
    setCamOn(next);
    if (next) setCamError(null);
    void room.localParticipant
      .setCameraEnabled(next, next && selectedCam ? { deviceId: { exact: selectedCam } } : undefined)
      .then(() => refresh())
      .catch(() => {
        if (next) {
          setCamOn(false);
          setCamError("Kamera gagal dimulai. Pilih perangkat lain.");
        }
      });
  };

  const changeCamera = async (deviceId: string) => {
    const room = roomRef.current;
    if (!room || !deviceId) return;
    setSelectedCam(deviceId);
    setCamError(null);
    try {
      const pub = room.localParticipant.getTrackPublication(Track.Source.Camera);
      if (pub?.track && !pub.isMuted) {
        // exact=true wajib: tanpa itu deviceId hanya jadi "ideal" dan browser
        // bisa tetap memakai kamera lama.
        await room.switchActiveDevice("videoinput", deviceId, true);
      } else {
        await room.localParticipant.setCameraEnabled(true, { deviceId: { exact: deviceId } });
        setCamOn(true);
      }
      refresh();
    } catch {
      setCamOn(false);
      setCamError("Kamera itu tidak bisa dimulai. Coba perangkat lain.");
    }
  };

  const changeMic = async (deviceId: string) => {
    const room = roomRef.current;
    if (!room || !deviceId) return;
    setSelectedMic(deviceId);
    setMicError(null);
    try {
      const pub = room.localParticipant.getTrackPublication(Track.Source.Microphone);
      if (pub?.track && !pub.isMuted) {
        // exact=true supaya benar-benar pindah ke perangkat yang dipilih.
        await room.switchActiveDevice("audioinput", deviceId, true);
      } else {
        await room.localParticipant.setMicrophoneEnabled(true, { deviceId: { exact: deviceId } });
        setMicOn(true);
      }
      refresh();
    } catch {
      setMicError("Mikrofon itu tidak bisa diakses.");
    }
  };

  const leave = () => {
    roomRef.current?.disconnect();
    onEnd();
  };

  const room = roomRef.current;
  const remotes = room ? Array.from(room.remoteParticipants.values()) : [];
  const participantCount = 1 + remotes.length;
  const deviceLabel = (d: MediaDeviceInfo, fallback: string, i: number) =>
    d.label || `${fallback} ${i + 1}`;

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
            {connected ? `${participantCount} peserta` : "menyambungkan…"}
          </span>
        </div>
      </div>

      {/* Grid video peserta */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {room && connected ? (
            <ParticipantTile participant={room.localParticipant} isLocal refreshKey={refreshKey} />
          ) : null}
          {remotes.map((participant) => (
            <ParticipantTile
              key={participant.identity}
              participant={participant}
              isLocal={false}
              refreshKey={refreshKey}
            />
          ))}
        </div>

        {error ? <p className="mt-2 text-[11px] text-danger">{error}</p> : null}

        {/* Pemilih perangkat kamera & mikrofon */}
        {connected && !error ? (
          <div className="mt-3 space-y-2">
            {call.mode === "video" ? (
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium text-muted">Kamera</span>
                <select
                  value={selectedCam}
                  onChange={(e) => void changeCamera(e.target.value)}
                  className="w-full rounded-lg border border-line bg-elevate px-2 py-1.5 text-xs text-ink"
                >
                  {cameras.length === 0 ? <option value="">Tidak ada kamera</option> : null}
                  {cameras.map((d, i) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {deviceLabel(d, "Kamera", i)}
                    </option>
                  ))}
                </select>
                {camError ? <span className="mt-1 block text-[11px] text-danger">{camError}</span> : null}
              </label>
            ) : null}
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-muted">Mikrofon</span>
              <select
                value={selectedMic}
                onChange={(e) => void changeMic(e.target.value)}
                className="w-full rounded-lg border border-line bg-elevate px-2 py-1.5 text-xs text-ink"
              >
                {mics.length === 0 ? <option value="">Tidak ada mikrofon</option> : null}
                {mics.map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {deviceLabel(d, "Mikrofon", i)}
                  </option>
                ))}
              </select>
              {micError ? <span className="mt-1 block text-[11px] text-danger">{micError}</span> : null}
            </label>
          </div>
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
          onClick={toggleMic}
          title={micOn ? "Matikan mic" : "Nyalakan mic"}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors ${
            micOn ? "bg-elevate text-ink hover:bg-line" : "bg-danger/15 text-danger"
          }`}
        >
          {micOn ? <MicIcon className="h-5 w-5" /> : <MicOffIcon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={toggleCam}
          title={camOn ? "Matikan kamera" : "Nyalakan kamera"}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors ${
            camOn ? "bg-elevate text-ink hover:bg-line" : "bg-danger/15 text-danger"
          }`}
        >
          {camOn ? <VideoIcon className="h-5 w-5" /> : <VideoOffIcon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={leave}
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
