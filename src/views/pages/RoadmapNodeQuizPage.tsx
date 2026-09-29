import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRoadmapTree,
  fetchSubmissions,
  pushActivity,
  pushSubmission,
  roadmapTreeQueryKey,
} from "@/features/roadmap/services/roadmapService";
import {
  DEFAULT_PASSING_SCORE,
  buildSubmissionPayload,
  nodeSubmission,
} from "@/features/roadmap/utils/nodeContent";
import { computeStatuses } from "@/features/roadmap/utils/roadmapGraph";
import { reportError } from "@/shared/errors";
import RoadmapQuizContainer from "../components/RoadmapQuizContainer";

/**
 * RoadmapNodeQuizPage — HALAMAN SOAL terpisah untuk node bertipe kuis.
 * Diakses lewat tombol di halaman node (soal tidak tampil otomatis).
 * TIDAK ADA class Tailwind di sini.
 */

function RoadmapNodeQuizPage() {
  const navigate = useNavigate();
  const { roadmapId, nodeId } = useParams();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: roadmapTreeQueryKey(roadmapId ?? "none"),
    queryFn: () => fetchRoadmapTree(roadmapId as string),
    enabled: roadmapId != null,
  });

  const submissionsQuery = useQuery({
    queryKey: ["submissions", roadmapId],
    queryFn: () => fetchSubmissions(roadmapId as string),
    enabled: roadmapId != null,
  });
  const queryClient = useQueryClient();
  const submissions = submissionsQuery.data ?? {};

  const roadmap = data ?? null;
  const node = roadmap?.nodes.find((item) => item.id === nodeId) ?? null;
  const submission = node ? nodeSubmission(node) : { type: "checkmark" as const };
  const statusById = roadmap ? computeStatuses(roadmap, submissions).statusById : {};
  const status = nodeId ? statusById[nodeId] ?? "locked" : "locked";
  const state = nodeId ? submissions[nodeId] : undefined;

  // Penilaian terjadi di server: kita hanya mengirim jawaban, lalu memakai
  // apa yang server kembalikan. Nilai lama yang dihitung di browser tidak
  // dipakai, karena `correctIndex` sudah tidak lagi dikirim ke klien.
  // Hook harus dipanggil sebelum `return` kondisional di bawah.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Bukan node valid/terbuka → tree; bukan kuis → kembali ke halaman node.
  if (roadmap && (!node || status === "locked")) {
    return <Navigate to={`/roadmap/${roadmapId}`} replace />;
  }
  if (roadmap && node && submission.type !== "quiz") {
    return <Navigate to={`/roadmap/${roadmapId}/${nodeId}`} replace />;
  }

  const handleSubmit = async (answers: Record<string, number>) => {
    if (!node || !roadmapId) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = buildSubmissionPayload(submission, { quizAnswers: answers });
      const next = await pushSubmission(roadmapId, node.id, payload);
      queryClient.setQueryData(["submissions", roadmapId], { ...submissions, [node.id]: next });
      void pushActivity(roadmapId).catch((error) => reportError("pushActivity", error));
    } catch {
      setSubmitError("Gagal menyimpan jawaban. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoadmapQuizContainer
      roadmap={roadmap}
      node={node}
      questions={submission.questions ?? []}
      passingScore={submission.passingScore ?? DEFAULT_PASSING_SCORE}
      initialAnswers={state?.quizAnswers ?? {}}
      score={state?.score ?? undefined}
      passed={state?.done ?? false}
      isLoading={isLoading}
      isError={isError}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onBack={() => navigate(`/roadmap/${roadmapId}/${nodeId}`)}
      onSubmit={handleSubmit}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default RoadmapNodeQuizPage;
