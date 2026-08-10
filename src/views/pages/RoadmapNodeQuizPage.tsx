import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRoadmapTree,
  pushActivity,
  pushSubmission,
  roadmapTreeQueryKey,
} from "../../services/roadmapService";
import type { SubmissionState } from "../../types/roadmap";
import {
  DEFAULT_PASSING_SCORE,
  evaluateSubmission,
  nodeSubmission,
} from "../../utils/nodeContent";
import { computeStatuses } from "../../utils/roadmapGraph";
import { getSubmissions, saveSubmission } from "../../utils/submissionStore";
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

  const [submissions, setSubmissions] = useState<Record<string, SubmissionState>>(() =>
    getSubmissions(roadmapId ?? ""),
  );

  const roadmap = data ?? null;
  const node = roadmap?.nodes.find((item) => item.id === nodeId) ?? null;
  const submission = node ? nodeSubmission(node) : { type: "checkmark" as const };
  const statusById = roadmap ? computeStatuses(roadmap, submissions).statusById : {};
  const status = nodeId ? statusById[nodeId] ?? "locked" : "locked";

  // Bukan node valid/terbuka → tree; bukan kuis → kembali ke halaman node.
  if (roadmap && (!node || status === "locked")) {
    return <Navigate to={`/roadmap/${roadmapId}`} replace />;
  }
  if (roadmap && node && submission.type !== "quiz") {
    return <Navigate to={`/roadmap/${roadmapId}/${nodeId}`} replace />;
  }

  const state = nodeId ? submissions[nodeId] : undefined;

  const handleSubmit = (answers: Record<string, number>) => {
    if (!node || !roadmapId) return;
    const next = evaluateSubmission(submission, { quizAnswers: answers });
    saveSubmission(roadmapId, node.id, next);
    setSubmissions((prev) => ({ ...prev, [node.id]: next }));
    // Sinkronkan ke backend (best-effort).
    void pushSubmission(roadmapId, node.id, next).catch(() => {});
    void pushActivity(roadmapId).catch(() => {});
  };

  return (
    <RoadmapQuizContainer
      roadmap={roadmap}
      node={node}
      questions={submission.questions ?? []}
      passingScore={submission.passingScore ?? DEFAULT_PASSING_SCORE}
      initialAnswers={state?.quizAnswers ?? {}}
      score={state?.score}
      passed={state?.done ?? false}
      isLoading={isLoading}
      isError={isError}
      onBack={() => navigate(`/roadmap/${roadmapId}/${nodeId}`)}
      onSubmit={handleSubmit}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default RoadmapNodeQuizPage;
