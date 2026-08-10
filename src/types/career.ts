/**
 * Tipe data Career Progress & konsultasi AI karier.
 * Progres diturunkan dari beberapa sumber: CV, GitHub, project yang diikuti,
 * serta progres & nilai roadmap.
 */

export interface CareerSource {
  key: "roadmap" | "github" | "projects" | "cv";
  label: string;
  /** nilai ringkas untuk ditampilkan (mis. "6/10 skills"). */
  value: string;
  detail: string;
  /** kontribusi 0–100 untuk sumber ini. */
  score: number;
}

export interface CareerProfile {
  /** kesiapan karier keseluruhan 0–100. */
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
