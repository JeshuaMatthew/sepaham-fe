import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ROADMAP_CATALOG_QUERY_KEY,
  fetchFacultyRoadmapTree,
  roadmapTreeQueryKey,
  saveRoadmapCatalog,
  saveRoadmapTree,
} from "@/features/roadmap/services/roadmapService";
import type { Roadmap, RoadmapSummary } from "@/features/roadmap/types/roadmap";
import { getRoadmapEdges } from "@/features/roadmap/utils/roadmapGraph";
import { reportError } from "@/shared/errors";
import FacultyRoadmapEditContainer from "../components/FacultyRoadmapEditContainer";

/**
 * FacultyRoadmapEditPage — dosen mengedit tampilan skill tree (React Flow).
 * Page mengurus data (query) + persistensi; editor mengelola interaksi kanvas
 * dan mengirim balik roadmap final saat "Simpan". TIDAK ADA class Tailwind.
 */

function FacultyRoadmapEditPage() {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Pakai endpoint faculty, bukan endpoint mahasiswa: editor soal butuh
  // kunci jawaban yang sengaja dibuang dari payload yang dikirim ke student.
  const { data, dataUpdatedAt, isLoading, isError, refetch } = useQuery({
    queryKey: roadmapTreeQueryKey(roadmapId ?? "none"),
    queryFn: () => fetchFacultyRoadmapTree(roadmapId as string),
    enabled: roadmapId != null,
  });

  const [notice, setNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Materialisasi edges (dari roadmap.edges atau turunan prereqs) untuk editor.
  const initialRoadmap = useMemo<Roadmap | null>(
    () => (data ? { ...data, edges: getRoadmapEdges(data) } : null),
    [data],
  );

  const flashNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const saveMutation = useMutation({
    mutationFn: (roadmap: Roadmap) => saveRoadmapTree(roadmapId as string, roadmap),
    onSuccess: (_, roadmap) => {
      // Sinkronkan jumlah node ke katalog (kalau ada di cache).
      const catalog = queryClient.getQueryData<RoadmapSummary[]>(ROADMAP_CATALOG_QUERY_KEY);
      if (catalog) {
        const updated = catalog.map((item) =>
          item.id === roadmapId ? { ...item, totalNodes: roadmap.nodes.length } : item,
        );
        void saveRoadmapCatalog(updated)
          .then(() => queryClient.invalidateQueries({ queryKey: ROADMAP_CATALOG_QUERY_KEY }))
          .catch((error) => reportError("saveRoadmapCatalog", error));
      }
      void queryClient.invalidateQueries({ queryKey: roadmapTreeQueryKey(roadmapId as string) });
      setSaveError(null);
      flashNotice("Tersimpan");
    },
    onError: () => setSaveError("Gagal menyimpan. Coba lagi."),
  });

  const handleSave = (roadmap: Roadmap) => {
    if (!roadmapId) return;
    saveMutation.mutate(roadmap);
  };

  const handleReset = () => {
    if (!roadmapId) return;
    // Buang perubahan lokal dengan mengambil ulang dari server.
    void queryClient.invalidateQueries({ queryKey: roadmapTreeQueryKey(roadmapId) });
    flashNotice("Perubahan dibatalkan, data diambil ulang dari server");
  };

  return (
    <FacultyRoadmapEditContainer
      initialRoadmap={initialRoadmap}
      editorKey={`${roadmapId}-${dataUpdatedAt}`}
      notice={saveError ?? notice}
      isLoading={isLoading}
      isSaving={saveMutation.isPending}
      isError={isError}
      onSave={handleSave}
      onReset={handleReset}
      onRetry={() => {
        void refetch();
      }}
      onOpenNodePage={(nodeId) => navigate(`/faculty/roadmaps/${roadmapId}/${nodeId}`)}
    />
  );
}

export default FacultyRoadmapEditPage;
