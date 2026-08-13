import type {
  NodeSubmission,
  QuizQuestion,
  RoadmapNode,
  SubmissionPayload,
  SubmissionState,
} from "@/features/roadmap/types/roadmap";

export const DEFAULT_PASSING_SCORE = 60;

/** Artikel Markdown node; fallback dari resources/missions jika artikel kosong. */
export function nodeArticle(node: RoadmapNode): string {
  if (node.article && node.article.trim()) return node.article;
  const lines: string[] = [`## ${node.title}`, ""];
  if (node.resources && node.resources.length > 0) {
    lines.push("### Materi belajar", "");
    for (const resource of node.resources) lines.push(`- [${resource.label}](${resource.url})`);
    lines.push("");
  }
  if (node.missions && node.missions.length > 0) {
    lines.push("### Latihan", "");
    for (const mission of node.missions) lines.push(`- ${mission.text}`);
    lines.push("");
  }
  if (lines.length <= 2) lines.push("_Belum ada materi untuk skill ini._");
  return lines.join("\n");
}

/** Submission node; default checkmark kalau belum dikonfigurasi. */
export function nodeSubmission(node: RoadmapNode): NodeSubmission {
  return node.submission ?? { type: "checkmark" };
}

/** Nilai quiz 0–100 dari jawaban mahasiswa. */
export function gradeQuiz(
  questions: QuizQuestion[],
  answers: Record<string, number>,
): number {
  if (questions.length === 0) return 0;
  const correct = questions.reduce(
    (total, question) => total + (answers[question.id] === question.correctIndex ? 1 : 0),
    0,
  );
  return Math.round((correct / questions.length) * 100);
}

/** Hitung status submission dari payload yang dikumpulkan mahasiswa. */
export function evaluateSubmission(
  submission: NodeSubmission,
  payload: SubmissionPayload,
): SubmissionState {
  if (submission.type === "checkmark") return { done: true };
  if (submission.type === "file") {
    return { done: Boolean(payload.fileName), fileName: payload.fileName };
  }
  if (submission.type === "text") {
    const value = payload.text?.trim() ?? "";
    return { done: value.length > 0, text: value };
  }
  const questions = submission.questions ?? [];
  const answers = payload.quizAnswers ?? {};
  const score = gradeQuiz(questions, answers);
  const passing = submission.passingScore ?? DEFAULT_PASSING_SCORE;
  return { done: score >= passing, score, quizAnswers: answers };
}
