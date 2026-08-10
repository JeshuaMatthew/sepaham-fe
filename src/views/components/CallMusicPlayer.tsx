import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Track } from "livekit-client";
import type { LocalTrackPublication, Room } from "livekit-client";
import type { PlaylistTrack } from "../../types/music";
import {
  MusicIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  ShuffleIcon,
  TrashIcon,
  UploadIcon,
  VolumeIcon,
} from "../icons";

interface CallMusicPlayerProps {
  /** Room LiveKit — dipakai untuk menyiarkan musik ke semua peserta. */
  room: Room | null;
}

const BAR_COUNT = 4;

/** Format detik → m:ss. */
function fmt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Elemen audio yang mendukung captureStream (Chromium) untuk disiarkan. */
type CapturableAudio = HTMLAudioElement & { captureStream?: () => MediaStream };

/**
 * Pemutar musik host saat panggilan. Host mengunggah lagu (playlist), memilih
 * lagu, menggeser durasi (seek), dan mengacak (shuffle). Audio diputar lokal
 * DAN — bila terhubung — disiarkan ke semua peserta lewat track audio LiveKit.
 */
function CallMusicPlayer({ room }: CallMusicPlayerProps) {
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [broadcasting, setBroadcasting] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const publicationRef = useRef<LocalTrackPublication | null>(null);
  const playlistRef = useRef<PlaylistTrack[]>([]);
  const playIntentRef = useRef(false);

  playlistRef.current = playlist;
  const track = playlist[index];

  // Equalizer beranimasi (visual saat memutar).
  useEffect(() => {
    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray<HTMLElement>("[data-bar]");
      tweensRef.current = bars.map((bar, i) =>
        gsap.to(bar, {
          scaleY: 0.3,
          transformOrigin: "bottom",
          duration: 0.4 + i * 0.12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          paused: true,
        }),
      );
    }, barsRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    for (const tween of tweensRef.current) {
      if (playing) tween.play();
      else tween.pause();
    }
  }, [playing]);

  // Ganti sumber saat lagu (index) berubah; putar bila memang sedang memutar.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track) return;
    if (el.src !== track.url) {
      el.src = track.url;
      el.load();
    }
    if (playIntentRef.current) el.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, track?.url]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = volume;
  }, [volume]);

  // Bersihkan saat unmount: hentikan siaran + bebaskan object URL.
  useEffect(() => {
    return () => {
      const pub = publicationRef.current;
      const mst = pub?.track?.mediaStreamTrack;
      if (room && mst) {
        try {
          room.localParticipant.unpublishTrack(mst);
        } catch {
          // abaikan
        }
      }
      for (const t of playlistRef.current) URL.revokeObjectURL(t.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Siarkan output audio ke room (sekali) supaya peserta lain ikut dengar. */
  const ensureBroadcast = async () => {
    if (!room || publicationRef.current) return;
    const el = audioRef.current as CapturableAudio | null;
    if (!el || typeof el.captureStream !== "function") return;
    try {
      const stream = el.captureStream();
      const mst = stream.getAudioTracks()[0];
      if (!mst) return;
      publicationRef.current = await room.localParticipant.publishTrack(mst, {
        name: "call-music",
        source: Track.Source.Unknown,
      });
      setBroadcasting(true);
    } catch {
      // best-effort — pemutaran lokal tetap jalan
    }
  };

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const additions: PlaylistTrack[] = Array.from(files)
      .filter((f) => f.type.startsWith("audio/"))
      .map((f) => ({
        id: `${f.name}-${f.size}-${crypto.randomUUID()}`,
        title: f.name.replace(/\.[^.]+$/, ""),
        url: URL.createObjectURL(f),
      }));
    if (additions.length === 0) return;
    setPlaylist((prev) => {
      const wasEmpty = prev.length === 0;
      const next = [...prev, ...additions];
      if (wasEmpty) setIndex(0);
      return next;
    });
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !track) return;
    if (el.paused) {
      playIntentRef.current = true;
      el.play().catch(() => setPlaying(false));
    } else {
      playIntentRef.current = false;
      el.pause();
    }
  };

  const selectTrack = (i: number) => {
    playIntentRef.current = true;
    if (i === index) {
      const el = audioRef.current;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => setPlaying(false));
      }
    } else {
      setIndex(i);
    }
  };

  const goNext = () => {
    if (playlist.length === 0) return;
    if (shuffle && playlist.length > 1) {
      let r = index;
      while (r === index) r = Math.floor(Math.random() * playlist.length);
      setIndex(r);
    } else {
      setIndex((prev) => (prev + 1) % playlist.length);
    }
  };

  const goPrev = () => {
    if (playlist.length === 0) return;
    const el = audioRef.current;
    if (el && el.currentTime > 3) {
      el.currentTime = 0;
      return;
    }
    setIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const removeTrack = (i: number) => {
    setPlaylist((prev) => {
      const removed = prev[i];
      if (removed) URL.revokeObjectURL(removed.url);
      const next = prev.filter((_, j) => j !== i);
      setIndex((cur) => {
        if (i < cur) return cur - 1;
        if (i === cur) return Math.min(cur, next.length - 1);
        return cur;
      });
      if (next.length === 0) {
        playIntentRef.current = false;
        audioRef.current?.pause();
      }
      return next;
    });
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    const t = Number(e.target.value);
    if (el) el.currentTime = t;
    setCurrentTime(t);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-accent/40 bg-accent/5 p-3">
      <audio
        ref={audioRef}
        onPlay={() => {
          setPlaying(true);
          void ensureBroadcast();
        }}
        onPause={() => setPlaying(false)}
        onEnded={goNext}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
      />

      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <MusicIcon className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Musik · host</span>
        <div ref={barsRef} className="ml-auto flex h-4 items-end gap-0.5">
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <span
              key={i}
              data-bar
              className="w-1 rounded-full bg-accent"
              style={{ height: `${50 + ((i * 29) % 50)}%` }}
            />
          ))}
        </div>
      </div>

      {track ? (
        <>
          {/* Judul lagu + status siaran */}
          <div className="flex flex-col">
            <span className="truncate text-xs font-semibold text-ink">{track.title}</span>
            <span className="truncate text-[11px] text-muted">
              {playing ? (broadcasting ? "Diputar untuk semua peserta" : "Diputar") : "Dijeda"}
            </span>
          </div>

          {/* Seek — pilih durasi mana yang diputar */}
          <div className="flex items-center gap-2">
            <span className="w-8 shrink-0 text-right font-mono text-[10px] text-muted">
              {fmt(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={onSeek}
              aria-label="Geser durasi lagu"
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-accent"
            />
            <span className="w-8 shrink-0 font-mono text-[10px] text-muted">{fmt(duration)}</span>
          </div>

          {/* Kontrol pemutar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShuffle((s) => !s)}
              aria-label="Acak lagu"
              aria-pressed={shuffle}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                shuffle ? "bg-accent/20 text-accent" : "text-muted hover:text-ink"
              }`}
            >
              <ShuffleIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Lagu sebelumnya"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
            >
              <PrevIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Jeda musik" : "Putar musik"}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-accent text-ink transition-transform hover:scale-105 active:scale-95"
            >
              {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Lagu berikutnya"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
            >
              <NextIcon className="h-3.5 w-3.5" />
            </button>
            <div className="ml-auto flex items-center gap-1">
              <VolumeIcon className="h-3.5 w-3.5 text-muted" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume musik"
                className="h-1 w-14 cursor-pointer appearance-none rounded-full bg-line accent-accent"
              />
            </div>
          </div>
        </>
      ) : (
        <p className="text-[11px] text-muted">Belum ada lagu. Unggah lagu untuk memutar musik di panggilan.</p>
      )}

      {/* Playlist */}
      {playlist.length > 0 ? (
        <ul className="flex max-h-36 flex-col gap-0.5 overflow-y-auto">
          {playlist.map((t, i) => (
            <li key={t.id}>
              <div
                className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                  i === index ? "bg-accent/15" : "hover:bg-elevate"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectTrack(i)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                      i === index ? "text-accent" : "text-muted"
                    }`}
                  >
                    {i === index && playing ? (
                      <PauseIcon className="h-3 w-3" />
                    ) : (
                      <PlayIcon className="h-3 w-3" />
                    )}
                  </span>
                  <span
                    className={`truncate text-[11px] ${
                      i === index ? "font-semibold text-ink" : "text-muted"
                    }`}
                  >
                    {t.title}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => removeTrack(i)}
                  aria-label={`Hapus ${t.title}`}
                  className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-muted opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Unggah lagu */}
      <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-dashed border-accent/50 px-3 py-2 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10">
        <UploadIcon className="h-3.5 w-3.5" />
        Unggah lagu
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
    </div>
  );
}

export default CallMusicPlayer;
