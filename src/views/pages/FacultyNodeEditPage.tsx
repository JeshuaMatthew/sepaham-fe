import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRoadmapTree,
  roadmapTreeQueryKey,
  saveRoadmapTree,
} from "@/features/roadmap/services/roadmapService";
import type { NodeSubmission } from "@/features/roadmap/types/roadmap";
import FacultyNodeEditContainer from "../components/FacultyNodeEditContainer";

/**
 * FacultyNodeEditPage — halaman terpisah untuk mengedit MATERI (markdown) &
 * submission sebuah node roadmap, lengkap dengan preview. Page mengurus data
 * & persistensi; container hanya render. TIDAK ADA class Tailwind di sini.
 */

function FacultyNodeEditPage() {
  const { roadmapId, nodeId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: roadmapTreeQueryKey(roadmapId ?? "none"),
    queryFn: () => fetchRoadmapTree(roadmapId as string),
    enabled: roadmapId != null,
  });

  const node = data?.nodes.find((item) => item.id === nodeId) ?? null;

  const [article, setArticle] = useState("");
  const [submission, setSubmission] = useState<NodeSubmission>({ type: "checkmark" });
  const [notice, setNotice] = useState<string | null>(null);

  // Inisialisasi draft saat node termuat (hanya saat id node berubah).
  useEffect(() => {
    if (node) {
      setArticle(node.article ?? "");
      setSubmission(node.submission ?? { type: "checkmark" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node?.id]);

  const handleSave = () => {
    if (!data || !node || !roadmapId) return;
    const nextNodes = data.nodes.map((item) =>
      item.id === nodeId ? { ...item, article, submission } : item,
    );
    saveRoadmapTree(roadmapId, { ...data, nodes: nextNodes });
    void queryClient.invalidateQueries({ queryKey: roadmapTreeQueryKey(roadmapId) });
    setNotice("Tersimpan");
    window.setTimeout(() => setNotice(null), 2500);
  };

  return (
    <FacultyNodeEditContainer
      roadmapId={roadmapId ?? ""}
      nodeTitle={node?.title ?? ""}
      article={article}
      submission={submission}
      notice={notice}
      isLoading={isLoading}
      isError={isError}
      notFound={!isLoading && !isError && node == null}
      onArticleChange={setArticle}
      onSubmissionChange={setSubmission}
      onSave={handleSave}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default FacultyNodeEditPage;
