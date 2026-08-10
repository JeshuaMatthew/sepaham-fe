import type { CareerProfile, CareerSource } from "../types/career";
import type { Role } from "../types/role";

export interface CareerMatch {
  role: Role;
  /** kecocokan 0–100 hasil analisis (skor kuesioner). */
  fitPercent: number;
}

/** Top-N karier paling cocok berdasarkan skor role dari kuesioner onboarding. */
export function topCareers(
  roles: Role[],
  roleScores: Record<string, number>,
  count = 3,
): CareerMatch[] {
  const scored = roles.map((role) => ({ role, score: roleScores[role.id] ?? 0 }));
  const hasScores = scored.some((entry) => entry.score > 0);
  const max = Math.max(1, ...scored.map((entry) => entry.score));
  const ranked = hasScores
    ? [...scored].sort((a, b) => b.score - a.score)
    : scored;
  const fallback = [92, 84, 76, 70, 64];
  return ranked.slice(0, count).map((entry, index) => ({
    role: entry.role,
    fitPercent: hasScores
      ? Math.max(40, Math.round((entry.score / max) * 95))
      : fallback[index] ?? 60,
  }));
}

/**
 * Career service — menghitung progres karier dari beberapa sumber data dan
 * menjawab pertanyaan konsultasi (mock AI, berbasis data user). Nanti bagian
 * jawaban bisa diganti call ke LLM/backend tanpa mengubah kontrak fungsi.
 */

export interface CareerInputs {
  roadmap: { completed: number; total: number; title: string };
  github: { commits: number; repos: number; topLanguages: string[] } | null;
  /** jumlah project/tim yang diikuti. */
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

/** Bangun profil karier dari sumber-sumber data. */
export function buildCareerProfile(input: CareerInputs): CareerProfile {
  const roadmapScore =
    input.roadmap.total > 0 ? (input.roadmap.completed / input.roadmap.total) * 100 : 0;
  const githubScore = input.github
    ? clamp(input.github.repos * 8 + Math.min(60, input.github.commits / 10))
    : 0;
  const projectsScore = clamp(input.projects * 30);
  const cvScore = input.cv.provided ? 70 : 0;

  const sources: CareerSource[] = [
    {
      key: "roadmap",
      label: "Learning roadmap",
      value: `${input.roadmap.completed}/${input.roadmap.total} skills`,
      detail: input.roadmap.title || "No roadmap picked yet",
      score: clamp(roadmapScore),
    },
    {
      key: "github",
      label: "GitHub activity",
      value: input.github ? `${input.github.repos} repos · ${input.github.commits} commits` : "Not connected",
      detail: input.github?.topLanguages.slice(0, 3).join(" · ") || "Connect GitHub on your profile",
      score: githubScore,
    },
    {
      key: "projects",
      label: "Projects joined",
      value: `${input.projects} ${input.projects === 1 ? "team" : "teams"}`,
      detail: input.projects > 0 ? "Real collaboration experience" : "Join a project team to gain experience",
      score: projectsScore,
    },
    {
      key: "cv",
      label: "CV / résumé",
      value: input.cv.provided ? "Uploaded" : "Not uploaded",
      detail: input.cv.fileName || "Add your CV during onboarding",
      score: cvScore,
    },
  ];

  const readiness = clamp(
    roadmapScore * 0.4 + githubScore * 0.3 + projectsScore * 0.2 + cvScore * 0.1,
  );

  const strengths = sources
    .filter((s) => s.score >= 60)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.label);

  const nextSteps: string[] = [];
  if (sources[0].score < 70) nextSteps.push("Finish more roadmap skills to strengthen your fundamentals.");
  if (sources[1].score < 50) nextSteps.push("Commit more often and publish a few public repos on GitHub.");
  if (sources[2].score < 60) nextSteps.push("Join a project team on the Partner page for real experience.");
  if (!input.cv.provided) nextSteps.push("Upload your CV so we can factor it into your progress.");
  if (nextSteps.length === 0) nextSteps.push("You're on a great track — start applying for internships!");

  return { readiness, level: levelFor(readiness), sources, strengths, nextSteps };
}

/** Saran pertanyaan awal untuk konsultasi. */
export const CAREER_SUGGESTIONS = [
  "How ready am I for an internship?",
  "What should I focus on next?",
  "What are my strengths?",
  "How is my roadmap progress?",
];

/** Jawaban konsultasi (mock, berbasis profil user). */
export function answerCareerQuestion(question: string, profile: CareerProfile): string {
  const q = question.toLowerCase();
  const src = (key: string) => profile.sources.find((s) => s.key === key)!;

  if (/intern|ready|siap|job|kerja/.test(q)) {
    return `Your overall career readiness is ${profile.readiness}% — that puts you at the "${profile.level}" stage. ${
      profile.readiness >= 78
        ? "You're ready to apply for internships and junior roles."
        : `Focus next on: ${profile.nextSteps[0]}`
    }`;
  }
  if (/roadmap|skill|belajar|learn/.test(q)) {
    const r = src("roadmap");
    return `On the learning roadmap you've completed ${r.value} (${r.score}%) — ${r.detail}. Keep completing nodes to raise this the most; roadmap progress carries the biggest weight in your readiness.`;
  }
  if (/github|repo|commit|code/.test(q)) {
    const g = src("github");
    return `Your GitHub signal is ${g.score}% — ${g.value}. ${
      g.score < 50
        ? "Commit consistently and publish a couple of polished public repos to boost this."
        : "Nice — a healthy GitHub presence shows employers real, consistent work."
    }`;
  }
  if (/project|team|tim|collab/.test(q)) {
    const p = src("projects");
    return `You've joined ${p.value}. ${
      p.score < 60
        ? "Joining more project teams gives you collaboration experience recruiters look for — check the Partner page."
        : "Collaboration experience like this is a strong differentiator."
    }`;
  }
  if (/cv|resume|résumé/.test(q)) {
    const c = src("cv");
    return c.score > 0
      ? `Your CV (${c.detail}) is on file and factored into your progress.`
      : "You haven't uploaded a CV yet — adding one lets us tailor advice and counts toward your progress.";
  }
  if (/strength|kelebihan|good at/.test(q)) {
    return profile.strengths.length
      ? `Your strengths right now: ${profile.strengths.join(", ")}. Lean into these when you present yourself.`
      : "You're still building your first strengths — completing roadmap skills is the fastest way to develop one.";
  }
  if (/next|langkah|improve|do/.test(q)) {
    return `Your top next steps:\n• ${profile.nextSteps.join("\n• ")}`;
  }
  return `Here's a snapshot: readiness ${profile.readiness}% ("${profile.level}"). Strengths: ${
    profile.strengths.join(", ") || "still forming"
  }. Next step: ${profile.nextSteps[0]} Ask me about your roadmap, GitHub, projects, or CV for detail.`;
}
