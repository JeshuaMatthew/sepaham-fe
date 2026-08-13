import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRoadmapTree,
  pushActivity,
  pushSubmission,
  roadmapTreeQueryKey,
} from "@/features/roadmap/services/roadmapService";
import type { SubmissionPayload, SubmissionState } from "@/features/roadmap/types/roadmap";
import { evaluateSubmission, nodeArticle, nodeSubmission } from "@/features/roadmap/utils/nodeContent";
import { computeStatuses } from "@/features/roadmap/utils/roadmapGraph";
import { getSubmissions, saveSubmission } from "@/features/roadmap/utils/submissionStore";
import { markRoadmapActive } from "@/features/roadmap/utils/roadmapActivity";
import RoadmapNodeContainer from "../components/RoadmapNodeContainer";

/**
 * RoadmapNodePage — isi satu node roadmap di HALAMAN TERPISAH (bukan modal).
 * Menampilkan artikel + submission; untuk kuis, soal disembunyikan dan dibuka
 * lewat tombol ke halaman soal. TIDAK ADA class Tailwind di sini.
 */

function RoadmapNodePage() {
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
  const statusById = roadmap ? computeStatuses(roadmap, submissions).statusById : {};
  const status = nodeId ? statusById[nodeId] ?? "locked" : "locked";

  // Node terkunci / tidak ada → kembali ke tree.
  if (roadmap && (!node || status === "locked")) {
    return <Navigate to={`/roadmap/${roadmapId}`} replace />;
  }

  const submission = node ? nodeSubmission(node) : { type: "checkmark" as const };

  const handleSubmit = (payload: SubmissionPayload) => {
    if (!node || !roadmapId) return;
    const next = evaluateSubmission(submission, payload);
    saveSubmission(roadmapId, node.id, next);
    markRoadmapActive(roadmapId);
    setSubmissions((prev) => ({ ...prev, [node.id]: next }));
    // Sinkronkan ke backend (best-effort).
    void pushSubmission(roadmapId, node.id, next).catch(() => {});
    void pushActivity(roadmapId).catch(() => {});
  };

  return (
    <RoadmapNodeContainer
      roadmap={roadmap}
      node={node}
      status={status}
      article={node ? nodeArticle(node) : ""}
      submission={submission}
      submissionState={nodeId ? submissions[nodeId] : undefined}
      isLoading={isLoading}
      isError={isError}
      onBack={() => navigate(`/roadmap/${roadmapId}`)}
      onSubmit={handleSubmit}
      onStartQuiz={() => navigate(`/roadmap/${roadmapId}/${nodeId}/quiz`)}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default RoadmapNodePage;
