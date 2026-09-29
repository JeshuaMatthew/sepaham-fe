/**
 * Tipe data Interactive IT Roadmap (Skill Tree, multi-roadmap).
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
  // Sengaja tidak ada `correctIndex`. Backend membuangnya dari payload sebelum
  // dikirim ke browser, dan penilaian quiz terjadi di server.
}

/**
 * Soal yang SEDANG DIEDIT oleh dosen, jadi masih punya kunci jawaban.
 *
 * Hanya dipakai di editor faculty. Jangan pakai tipe ini di komponen
 * mahasiswa: begitu `correctIndex` masuk ke state yang terkirim ke browser,
 * penilaian bisa dimanipulasi dari sisi klien.
 */
export interface QuizQuestionWithKey extends QuizQuestion {
  correctIndex: number;
}

export interface NodeSubmission {
  type: SubmissionType;
  prompt?: string;
  questions?: QuizQuestion[];
  /** Ambang kelulusan, dikirim backend supaya UI tidak perlu menebak. */
  passingScore?: number;
}

/** Varian yang dipakai editor dosen: menyertakan kunci jawaban. */
export interface EditableNodeSubmission extends Omit<NodeSubmission, "questions"> {
  questions?: QuizQuestionWithKey[];
}

/** Node roadmap di sisi editor dosen: submission-nya boleh punya kunci. */
export interface EditableRoadmapNode extends Omit<RoadmapNode, "submission"> {
  submission?: EditableNodeSubmission;
}

/** Roadmap utuh di sisi editor dosen. */
export interface EditableRoadmap extends Omit<Roadmap, "nodes"> {
  nodes: EditableRoadmapNode[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  emoji: string;
  x: number;
  y: number;
  group?: string;
  image?: string;
  titleInside?: boolean;
  alwaysUnlocked?: boolean;
  optional?: boolean;
  prereqs?: string[];
  article?: string;
  submission?: NodeSubmission;
  resources?: RoadmapResource[];
  missions?: RoadmapMission[];
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  dashed?: boolean;
  optional?: boolean;
  animated?: boolean;
}

export interface SubmissionState {
  done: boolean;
  fileName?: string;
  text?: string;
  /** Skor dari server. `null`/undefined berarti belum dinilai atau bukan quiz. */
  score?: number | null;
  quizAnswers?: Record<string, number>;
  /** Rincian penilaian yang dihitung server. */
  scoreDetail?: {
    correct: number;
    total: number;
    passingScore: number;
    questions: { questionId: string; correct: boolean }[];
    selfDeclared?: boolean;
  } | null;
}

export interface SubmissionPayload {
  fileName?: string;
  text?: string;
  quizAnswers?: Record<string, number>;
}

export interface RoadmapStyle {
  nodeRounded?: boolean;
  nodeBorderWidth?: number;
  iconSize?: number;
  textSize?: number;
  textAlign?: "left" | "center" | "right";
  textPosition?: "top" | "bottom" | "left" | "right";
  groupBg?: string;
  edgeColor?: string;
}

export interface Roadmap {
  id: string;
  roleId: string;
  title: string;
  emoji: string;
  author?: string;
  style?: RoadmapStyle;
  nodes: RoadmapNode[];
  edges?: RoadmapEdge[];
}

export type RoadmapDifficulty = "Beginner" | "Intermediate" | "Advanced";

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
  author: string;
}

export type NodeStatus = "locked" | "available" | "completed";
