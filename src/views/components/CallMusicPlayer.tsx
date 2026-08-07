import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { LofiTrack } from "../../types/music";
import { MusicIcon, NextIcon, PauseIcon, PlayIcon } from "../icons";

interface CallMusicPlayerProps {
  tracks: LofiTrack[];
}

const BAR_COUNT = 4;

/**
 * Pemutar musik lo-fi untuk host panggilan. Visual (equalizer beranimasi) —
 * mock, belum mengeluarkan audio nyata (belum ada aset lagu).
 */
function CallMusicPlayer({ tracks }: CallMusicPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const barsRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  const track = tracks[index];

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

  if (!track) return null;

  const nextTrack = () => setIndex((prev) => (prev + 1) % tracks.length);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-accent/40 bg-accent/5 p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <MusicIcon className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Musik · host
        </span>
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

      <div className="flex flex-col">
        <span className="truncate text-xs font-semibold text-ink">{track.title}</span>
        <span className="truncate text-[11px] text-muted">
          {track.artist}
          {playing ? " · diputar untuk semua peserta" : ""}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPlaying((prev) => !prev)}
          aria-label={playing ? "Jeda musik" : "Putar musik"}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-accent text-ink transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={nextTrack}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:text-ink"
        >
          Lagu berikutnya <NextIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default CallMusicPlayer;
