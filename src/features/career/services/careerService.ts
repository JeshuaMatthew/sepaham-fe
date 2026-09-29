import type { CareerProfile, CareerSource } from "@/features/career/types/career";
import type { Role } from "@/features/onboarding/types/role";

export interface CareerMatch {
  role: Role;
  fitPercent: number;
}

/**
 * Role teratas berdasarkan skor onboarding.
 *
 * PENTING: kalau user belum pernah menyelesaikan onboarding, hasilnya kosong.
 * Versi lama memakai `fallback = [92, 84, 76, 70, 64]` sehingga semua user
 * tanpa skor tetap melihat "AI career match #1 92%" di bawah judul
 * "Ranked from your questionnaire, roadmap & activity". Angka itu tidak
 * berasal dari data siapa pun.
 *
 * `fitPercent` adalah skor relatif terhadap role tertinggi, jadi 95 berarti
 * "95% sepadat role terbaik kamu", bukan "95% kecocokan absolut".
 */
export function topCareers(
  roles: Role[],
  roleScores: Record<string, number>,
  count = 3,
): CareerMatch[] {
  const scored = roles
    .map((role) => ({ role, score: roleScores[role.id] ?? 0 }))
    .filter((entry) => entry.score > 0);

  if (scored.length === 0) return [];

  const ranked = [...scored].sort((a, b) => b.score - a.score);
  const max = ranked[0].score || 1;

  return ranked.slice(0, count).map((entry) => ({
    role: entry.role,
    fitPercent: Math.round((entry.score / max) * 95),
  }));
}

export interface CareerInputs {
  roadmap: { completed: number; total: number; title: string };
  github: { commits: number | null; repos: number; topLanguages: string[] } | null;
  projects: number;
  cv: { provided: boolean; fileName?: string };
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function levelFor(readiness: number): string {
  if (readiness < 30) return "Exploring";
  if (readiness < 55) return "Building foundations";
  if (readiness < 78) return "Internship-ready";
  return "Job-ready";
}

function githubValue(input: NonNullable<CareerInputs["github"]>): string {
  const repos = `${input.repos} repos`;
  if (input.commits == null) return `${repos} · commits unknown`;
  return `${repos} · ${input.commits} commits`;
}

export function buildCareerProfile(input: CareerInputs): CareerProfile {
  const roadmapScore = input.roadmap.total > 0 ? (input.roadmap.completed / input.roadmap.total) * 100 : 0;
  // `commits` bisa null (GitHub tidak menyediakannya tanpa token). Kalau null,
  // skor hanya dari repo — jangan mengarang commits = 0 yang artinya beda.
  const githubScore = input.github
    ? clamp(input.github.repos * 8 + (input.github.commits != null ? Math.min(60, input.github.commits / 10) : 0))
    : 0;
  const projectsScore = clamp(input.projects * 30);
  const cvScore = input.cv.provided ? 70 : 0;

  const sources: CareerSource[] = [
    { key: "roadmap", label: "Learning roadmap", value: `${input.roadmap.completed}/${input.roadmap.total} skills`, detail: input.roadmap.title || "No roadmap picked yet", score: clamp(roadmapScore) },
    { key: "github", label: "GitHub activity", value: input.github ? githubValue(input.github) : "Not connected", detail: input.github?.topLanguages.slice(0, 3).join(" · ") || "No GitHub activity linked yet", score: githubScore },
    { key: "projects", label: "Projects joined", value: `${input.projects} ${input.projects === 1 ? "team" : "teams"}`, detail: input.projects > 0 ? "Real collaboration experience" : "Join a project team to gain experience", score: projectsScore },
    { key: "cv", label: "CV / résumé", value: input.cv.provided ? "Uploaded" : "Not uploaded", detail: input.cv.fileName || "Add your CV during onboarding", score: cvScore },
  ];

  const readiness = clamp(roadmapScore * 0.4 + githubScore * 0.3 + projectsScore * 0.2 + cvScore * 0.1);
  const strengths = sources.filter((s) => s.score >= 60).sort((a, b) => b.score - a.score).map((s) => s.label);
  const nextSteps: string[] = [];
  if (sources[0].score < 70) nextSteps.push("Finish more roadmap skills to strengthen your fundamentals.");
  if (sources[1].score < 50) nextSteps.push("Commit more often and publish a few public repos on GitHub.");
  if (sources[2].score < 60) nextSteps.push("Join a project team on the Partner page for real experience.");
  if (!input.cv.provided) nextSteps.push("Upload your CV so we can factor it into your progress.");
  if (nextSteps.length === 0) nextSteps.push("You're on a great track — start applying for internships!");

  return { readiness, level: levelFor(readiness), sources, strengths, nextSteps };
}

export const CAREER_SUGGESTIONS = [
  "How ready am I for an internship?",
  "What should I focus on next?",
  "What are my strengths?",
  "How is my roadmap progress?",
];
