import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ROADMAP_CATALOG_QUERY_KEY,
  fetchRoadmapTree,
  resetRoadmapTree,
  roadmapTreeQueryKey,
  saveRoadmapCatalog,
  saveRoadmapTree,
} from "../../services/roadmapService";
import type { Roadmap, RoadmapSummary } from "../../types/roadmap";
import { getRoadmapEdges } from "../../utils/roadmapGraph";
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

  const { data, dataUpdatedAt, isLoading, isError, refetch } = useQuery({
    queryKey: roadmapTreeQueryKey(roadmapId ?? "none"),
    queryFn: () => fetchRoadmapTree(roadmapId as string),
    enabled: roadmapId != null,
  });

  const [notice, setNotice] = useState<string | null>(null);

  // Materialisasi edges (dari roadmap.edges atau turunan prereqs) untuk editor.
  const initialRoadmap = useMemo<Roadmap | null>(
    () => (data ? { ...data, edges: getRoadmapEdges(data) } : null),
    [data],
  );

  const flashNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const handleSave = (roadmap: Roadmap) => {
    if (!roadmapId) return;
    saveRoadmapTree(roadmapId, roadmap);

    // Sinkronkan jumlah node ke katalog (kalau ada di cache).
    const catalog = queryClient.getQueryData<RoadmapSummary[]>(ROADMAP_CATALOG_QUERY_KEY);
    if (catalog) {
      const updated = catalog.map((item) =>
        item.id === roadmapId ? { ...item, totalNodes: roadmap.nodes.length } : item,
      );
      saveRoadmapCatalog(updated);
      void queryClient.invalidateQueries({ queryKey: ROADMAP_CATALOG_QUERY_KEY });
    }

    void queryClient.invalidateQueries({ queryKey: roadmapTreeQueryKey(roadmapId) });
    flashNotice("Tersimpan");
  };

  const handleReset = () => {
    if (!roadmapId) return;
    resetRoadmapTree(roadmapId);
    void queryClient.invalidateQueries({ queryKey: roadmapTreeQueryKey(roadmapId) });
    flashNotice("Direset ke default");
  };

  return (
    <FacultyRoadmapEditContainer
      initialRoadmap={initialRoadmap}
      editorKey={`${roadmapId}-${dataUpdatedAt}`}
      notice={notice}
      isLoading={isLoading}
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
