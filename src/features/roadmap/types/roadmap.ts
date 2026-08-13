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
  correctIndex: number;
}

export interface NodeSubmission {
  type: SubmissionType;
  prompt?: string;
  questions?: QuizQuestion[];
  passingScore?: number;
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
  score?: number;
  quizAnswers?: Record<string, number>;
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
