/**
 * Resolusi ikon brand untuk nama tech stack (data-driven).
 * Dipisah dari icons.ts (ikon UI semantik) karena ini dipetakan dari data.
 * Semua ikon tetap dari react-icons (Simple Icons); fallback ke ikon kode generik.
 */
import type { ComponentType } from "react";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiFlutter,
  SiKotlin,
  SiFirebase,
  SiGo,
  SiRust,
  SiDocker,
  SiPython,
  SiPytorch,
  SiUnity,
  SiSharp,
} from "react-icons/si";
import { CodeIcon } from "@/shared/icons";

type IconComponent = ComponentType<{ className?: string }>;

const TECH_ICONS: Record<string, IconComponent> = {
  react: SiReact,
  typescript: SiTypescript,
  ts: SiTypescript,
  javascript: SiJavascript,
  js: SiJavascript,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  next: SiNextdotjs,
  "node.js": SiNodedotjs,
  nodejs: SiNodedotjs,
  node: SiNodedotjs,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  flutter: SiFlutter,
  kotlin: SiKotlin,
  firebase: SiFirebase,
  go: SiGo,
  golang: SiGo,
  rust: SiRust,
  docker: SiDocker,
  python: SiPython,
  pytorch: SiPytorch,
  unity: SiUnity,
  "c#": SiSharp,
  csharp: SiSharp,
};

/** Ikon brand untuk sebuah nama tech (fallback: ikon kode generik). */
export function techIcon(name: string): IconComponent {
  return TECH_ICONS[name.trim().toLowerCase()] ?? CodeIcon;
}
