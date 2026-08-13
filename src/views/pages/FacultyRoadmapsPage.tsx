import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ROADMAP_CATALOG_QUERY_KEY,
  fetchRoadmapCatalog,
  resetRoadmapCatalog,
  saveRoadmapCatalog,
  saveRoadmapTree,
} from "@/features/roadmap/services/roadmapService";
import type { RoadmapSummary } from "@/features/roadmap/types/roadmap";
import { getAccount } from "@/features/auth/utils/account";
import FacultyRoadmapsContainer from "../components/FacultyRoadmapsContainer";

/**
 * FacultyRoadmapsPage — dosen mengelola DAFTAR roadmap (katalog).
 * "Edit isi" membuka editor skill tree per roadmap. TIDAK ADA Tailwind.
 */

function FacultyRoadmapsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ROADMAP_CATALOG_QUERY_KEY,
    queryFn: fetchRoadmapCatalog,
  });

  const [draft, setDraft] = useState<RoadmapSummary[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const list = draft ?? data ?? [];
  const dirty = draft !== null;

  const flashNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const commit = (next: RoadmapSummary[]) => {
    saveRoadmapCatalog(next);
    void queryClient.invalidateQueries({ queryKey: ROADMAP_CATALOG_QUERY_KEY });
    setDraft(null);
  };

  const handleChange = (id: string, patch: Partial<RoadmapSummary>) => {
    setDraft(list.map((roadmap) => (roadmap.id === id ? { ...roadmap, ...patch } : roadmap)));
  };

  const handleAdd = () => {
    const id = `custom-${crypto.randomUUID().slice(0, 8)}`;
    const roadmap: RoadmapSummary = {
      id,
      roleId: "frontend-engineer",
      title: "New Roadmap",
      emoji: "",
      color: "#e5e5e5",
      description: "",
      difficulty: "Beginner",
      matchTags: [],
      totalNodes: 0,
      author: getAccount().name,
    };
    // Siapkan tree kosong supaya "Edit isi" bisa langsung dibuka.
    saveRoadmapTree(id, { id, roleId: roadmap.roleId, title: roadmap.title, emoji: roadmap.emoji, nodes: [] });
    setDraft([...list, roadmap]);
  };

  const handleDelete = (id: string) => {
    setDraft(list.filter((roadmap) => roadmap.id !== id));
  };

  const handleEditContent = (id: string) => {
    // Simpan dulu perubahan katalog biar tidak hilang saat pindah halaman.
    if (dirty) commit(list);
    void navigate(`/faculty/roadmaps/${id}`);
  };

  const handleSave = () => {
    commit(list);
    flashNotice("Tersimpan");
  };

  const handleReset = () => {
    resetRoadmapCatalog();
    void queryClient.invalidateQueries({ queryKey: ROADMAP_CATALOG_QUERY_KEY });
    setDraft(null);
    flashNotice("Direset ke default");
  };

  return (
    <FacultyRoadmapsContainer
      roadmaps={list}
      dirty={dirty}
      notice={notice}
      isLoading={isLoading}
      isError={isError}
      onChange={handleChange}
      onAdd={handleAdd}
      onEditContent={handleEditContent}
      onDelete={handleDelete}
      onSave={handleSave}
      onReset={handleReset}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default FacultyRoadmapsPage;
