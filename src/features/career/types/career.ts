/**
 * Tipe data Career Progress & konsultasi AI karier.
 */

export interface CareerSource {
  key: "roadmap" | "github" | "projects" | "cv";
  label: string;
  value: string;
  detail: string;
  score: number;
}

export interface CareerProfile {
  readiness: number;
  level: string;
  sources: CareerSource[];
  strengths: string[];
  nextSteps: string[];
}

export interface CareerMessage {
  id: string;
  role: "user" | "ai";
  text: string;
}
