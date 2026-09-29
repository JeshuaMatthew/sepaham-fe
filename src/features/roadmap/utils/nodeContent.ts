import type {
  NodeSubmission,
  RoadmapNode,
  SubmissionPayload,
} from "@/features/roadmap/types/roadmap";

/**
 * Ambang kelulusan fallback, dipakai hanya kalau node tidak menyatakannya.
 * Penilaiannya sendiri tetap di server.
 */
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

/**
 * Susun payload yang dikirim ke server dari input mahasiswa.
 *
 * Fungsi ini TIDAK lagi menentukan `done` atau `score`. Sebelumnya
 * `evaluateSubmission` menghitung nilai quiz di browser memakai
 * `correctIndex` yang ikut terkirim, lalu mengirim skor itu sendiri ke server
 * yang menyimpannya apa adanya. Sekarang frontend hanya collects jawaban;
 * server yang menilai dan yang memutuskan node selesai atau belum.
 */
export function buildSubmissionPayload(
  submission: NodeSubmission,
  input: SubmissionPayload,
): SubmissionPayload {
  if (submission.type === "quiz") {
    return { quizAnswers: input.quizAnswers ?? {} };
  }
  if (submission.type === "text") {
    return { text: input.text?.trim() ?? "" };
  }
  if (submission.type === "file") {
    // `fileName` di sini bukan lagi nama berkas yang diketik. UI harus
    // menjalankan `uploadSubmissionFile` lebih dulu supaya berkasnya benar
    // ada di server sebelum payload ini dikirim.
    return { fileName: input.fileName };
  }
  return {};
}
