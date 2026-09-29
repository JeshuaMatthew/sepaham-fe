import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFacultyRoadmapTree,
  roadmapTreeQueryKey,
  saveRoadmapTree,
} from "@/features/roadmap/services/roadmapService";
import type {
  EditableNodeSubmission,
  EditableRoadmap,
} from "@/features/roadmap/types/roadmap";
import FacultyNodeEditContainer from "../components/FacultyNodeEditContainer";

/**
 * FacultyNodeEditPage — halaman terpisah untuk mengedit MATERI (markdown) &
 * submission sebuah node roadmap, lengkap dengan preview. Page mengurus data
 * & persistensi; container hanya render. TIDAK ADA class Tailwind di sini.
 */

function FacultyNodeEditPage() {
  const { roadmapId, nodeId } = useParams();
  const queryClient = useQueryClient();

  // Endpoint faculty: editor soal harus melihat kunci jawaban, yang sengaja
  // dibuang dari payload yang dikirim ke mahasiswa.
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: roadmapTreeQueryKey(roadmapId ?? "none"),
    queryFn: () => fetchFacultyRoadmapTree(roadmapId as string),
    enabled: roadmapId != null,
  });

  // `fetchFacultyRoadmapTree` mengembalikan node yang submission-nya boleh
  // punya kunci jawaban, jadi tipe roadmap di sini yang dipakai, bukan
  // `Roadmap` biasa.
  const source = data as EditableRoadmap | undefined;
  const node = source?.nodes.find((item) => item.id === nodeId) ?? null;

  const [article, setArticle] = useState("");
  const [submission, setSubmission] = useState<EditableNodeSubmission>({ type: "checkmark" });
  const [notice, setNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Inisialisasi draft saat node termuat (hanya saat id node berubah).
  useEffect(() => {
    if (node) {
      setArticle(node.article ?? "");
      setSubmission(node.submission ?? { type: "checkmark" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node?.id]);

  const saveMutation = useMutation({
    mutationFn: (tree: EditableRoadmap) =>
      saveRoadmapTree(roadmapId as string, tree as never),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: roadmapTreeQueryKey(roadmapId as string) });
      setSaveError(null);
      setNotice("Tersimpan");
      window.setTimeout(() => setNotice(null), 2500);
    },
    onError: () => setSaveError("Gagal menyimpan. Coba lagi."),
  });

  const handleSave = () => {
    if (!source || !node || !roadmapId) return;
    const nextNodes = source.nodes.map((item) =>
      item.id === nodeId ? { ...item, article, submission } : item,
    );
    saveMutation.mutate({ ...source, nodes: nextNodes });
  };

  return (
    <FacultyNodeEditContainer
      roadmapId={roadmapId ?? ""}
      nodeTitle={node?.title ?? ""}
      article={article}
      submission={submission}
      notice={saveError ?? notice}
      isLoading={isLoading}
      isSaving={saveMutation.isPending}
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
