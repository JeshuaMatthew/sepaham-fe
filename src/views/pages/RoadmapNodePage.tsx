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
import type { SubmissionPayload, SubmissionState } from "@/features/roadmap/types/roadmap";
import { nodeArticle, nodeSubmission } from "@/features/roadmap/utils/nodeContent";
import { computeStatuses } from "@/features/roadmap/utils/roadmapGraph";
import { reportError } from "@/shared/errors";
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

  const queryClient = useQueryClient();

  const submissionsQuery = useQuery({
    queryKey: ["submissions", roadmapId],
    queryFn: () => fetchSubmissions(roadmapId as string),
    enabled: roadmapId != null,
  });
  const submissions = submissionsQuery.data ?? {};

  const roadmap = data ?? null;
  const node = roadmap?.nodes.find((item) => item.id === nodeId) ?? null;
  const statusById = roadmap ? computeStatuses(roadmap, submissions).statusById : {};
  const status = nodeId ? statusById[nodeId] ?? "locked" : "locked";

  // Hook harus di atas `return` kondisional di bawah.
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Node terkunci / tidak ada → kembali ke tree.
  if (roadmap && (!node || status === "locked")) {
    return <Navigate to={`/roadmap/${roadmapId}`} replace />;
  }

  const submission = node ? nodeSubmission(node) : { type: "checkmark" as const };

  // Kirim bukti ke server dan pakai penilaian yang dikembalikannya. Node
  // `file` harus sudah mengunggah berkasnya lewat `uploadSubmissionFile`
  // sebelum payload ini dikirim, kalau tidak server tidak akan menandai selesai.
  const handleSubmit = (payload: SubmissionPayload) => {
    if (!node || !roadmapId) return;
    setSubmitError(null);
    void pushSubmission(roadmapId, node.id, payload)
      .then((next) => {
        queryClient.setQueryData<Record<string, SubmissionState>>(
          ["submissions", roadmapId],
          (prev = {}) => ({ ...prev, [node.id]: next }),
        );
        void pushActivity(roadmapId).catch((error) => reportError("pushActivity", error));
      })
      .catch((error) => {
        reportError("pushSubmission", error);
        setSubmitError("Gagal menyimpan. Periksa koneksimu lalu coba lagi.");
      });
  };

  return (
    <RoadmapNodeContainer
      roadmap={roadmap}
      node={node}
      status={status}
      article={node ? nodeArticle(node) : ""}
      submission={submission}
      submissionState={nodeId ? submissions[nodeId] : undefined}
      submitError={submitError}
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
