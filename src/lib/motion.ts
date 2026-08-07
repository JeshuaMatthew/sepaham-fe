import gsap from "gsap";

/**
 * Sementara: NONAKTIFKAN semua animasi GSAP.
 * - from / fromTo  -> langsung loncat ke state akhir (konten tetap terlihat).
 * - to (hover/loop) -> no-op, elemen dibiarkan statis.
 * Hapus impor "./lib/motion" di main.tsx untuk menyalakan animasi lagi.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = gsap as any;

const origFrom = g.from.bind(gsap);
const origFromTo = g.fromTo.bind(gsap);
const origTo = g.to.bind(gsap);

const instant = { duration: 0, delay: 0, repeat: 0, yoyo: false };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
g.from = (targets: any, vars: any) => origFrom(targets, { ...vars, ...instant });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
g.fromTo = (targets: any, fromVars: any, toVars: any) =>
  origFromTo(targets, { ...fromVars, duration: 0 }, { ...toVars, ...instant });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
g.to = (targets: any) => origTo(targets, { duration: 0 });

export {};
