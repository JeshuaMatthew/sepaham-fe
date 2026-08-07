/**
 * Tipe data Interactive IT Roadmap (Skill Tree, multi-roadmap).
 * Tiap node punya artikel Markdown + submission (bukti penyelesaian).
 */

export interface RoadmapResource {
  label: string;
  url: string;
}

export interface RoadmapMission {
  id: string;
  text: string;
}

export type SubmissionType = "checkmark" | "file" | "text" | "quiz";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  /** indeks opsi yang benar. */
  correctIndex: number;
}

export interface NodeSubmission {
  type: SubmissionType;
  /** untuk type "text": petunjuk (mis. "Tempel link GitHub repo kamu"). */
  prompt?: string;
  /** untuk type "quiz". */
  questions?: QuizQuestion[];
  /** nilai minimal lulus quiz (0–100). Default 60. */
  passingScore?: number;
}

export interface RoadmapNode {
  id: string;
  title: string;
  emoji: string;
  /** posisi horizontal dalam persen (0–100) di kanvas skill tree. */
  x: number;
  /** posisi vertikal dalam persen (0–100). */
  y: number;
  /** skill opsional (nice-to-have) — diberi label & tidak menggating progres wajib. */
  optional?: boolean;
  /** (opsional/legacy) id node prasyarat. Sumber kebenaran utama = `edges` roadmap. */
  prereqs?: string[];
  /** materi/artikel dalam format Markdown, ditampilkan saat node diklik. */
  article?: string;
  /** cara mahasiswa membuktikan penyelesaian node. */
  submission?: NodeSubmission;
  /** (legacy) materi & misi — dipakai sebagai fallback artikel bila `article` kosong. */
  resources?: RoadmapResource[];
  missions?: RoadmapMission[];
}

/** Koneksi antar-node (dosen bisa styling: putus-putus, opsional, animasi). */
export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  /** garis putus-putus. */
  dashed?: boolean;
  /** prasyarat opsional — diberi label & TIDAK mengunci node target. */
  optional?: boolean;
  /** garis beranimasi. */
  animated?: boolean;
}

/** Status submission mahasiswa untuk sebuah node (state lokal). */
export interface SubmissionState {
  done: boolean;
  fileName?: string;
  text?: string;
  /** nilai quiz 0–100. */
  score?: number;
  quizAnswers?: Record<string, number>;
}

/** Payload saat mahasiswa mengumpulkan submission. */
export interface SubmissionPayload {
  fileName?: string;
  text?: string;
  quizAnswers?: Record<string, number>;
}

/** Satu roadmap lengkap dengan skill tree-nya. */
export interface Roadmap {
  id: string;
  roleId: string;
  title: string;
  emoji: string;
  /** dosen/pembuat roadmap ini. */
  author?: string;
  nodes: RoadmapNode[];
  /** koneksi antar-node. Kalau kosong, diturunkan dari `node.prereqs` (legacy). */
  edges?: RoadmapEdge[];
}

export type RoadmapDifficulty = "Beginner" | "Intermediate" | "Advanced";

/** Ringkasan roadmap untuk katalog (tanpa node). */
export interface RoadmapSummary {
  id: string;
  roleId: string;
  title: string;
  emoji: string;
  color: string;
  description: string;
  difficulty: RoadmapDifficulty;
  matchTags: string[];
  totalNodes: number;
  /** dosen/pembuat roadmap ini. */
  author: string;
}

/** locked = prasyarat belum selesai; available = siap dikerjakan; completed = submission selesai. */
export type NodeStatus = "locked" | "available" | "completed";
