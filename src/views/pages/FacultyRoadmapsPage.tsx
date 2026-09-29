import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ROADMAP_CATALOG_QUERY_KEY,
  createRoadmap,
  deleteRoadmap,
  fetchRoadmapCatalog,
  saveRoadmapCatalog,
} from "@/features/roadmap/services/roadmapService";
import type { RoadmapSummary } from "@/features/roadmap/types/roadmap";
import { useRoleOptions } from "@/features/onboarding/utils/roleOptions";
import { getAccount } from "@/features/auth/utils/account";
import FacultyRoadmapsContainer from "../components/FacultyRoadmapsContainer";

/**
 * FacultyRoadmapsPage — dosen mengelola DAFTAR roadmap (katalog).
 * "Edit isi" membuka editor skill tree per roadmap. TIDAK ADA Tailwind.
 */

function FacultyRoadmapsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { options: roleOptions } = useRoleOptions();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ROADMAP_CATALOG_QUERY_KEY,
    queryFn: fetchRoadmapCatalog,
  });

  const [draft, setDraft] = useState<RoadmapSummary[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const list = draft ?? data ?? [];
  const dirty = draft !== null;

  const flashNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const invalidateCatalog = () => {
    void queryClient.invalidateQueries({ queryKey: ROADMAP_CATALOG_QUERY_KEY });
  };

  const saveMutation = useMutation({
    mutationFn: (next: RoadmapSummary[]) => saveRoadmapCatalog(next),
    onSuccess: (_, next) => {
      // Server tidak mengembalikan katalog baru, jadi tulis hasil yang
      // dikirim sebagai cache lalu segarkan dari server.
      queryClient.setQueryData(ROADMAP_CATALOG_QUERY_KEY, next);
      invalidateCatalog();
      setDraft(null);
      setError(null);
      flashNotice("Tersimpan");
    },
    onError: () => setError("Gagal menyimpan. Coba lagi."),
  });

  const addMutation = useMutation({
    mutationFn: () =>
      createRoadmap({
        roleId: roleOptions[0]?.id ?? "",
        title: "New Roadmap",
        author: getAccount().name,
      }),
    onSuccess: () => {
      invalidateCatalog();
      setError(null);
      flashNotice("Roadmap baru dibuat");
    },
    onError: () => setError("Gagal membuat roadmap. Coba lagi."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRoadmap(id),
    onSuccess: () => {
      invalidateCatalog();
      setDraft(null);
      setError(null);
      flashNotice("Roadmap dihapus");
    },
    onError: () => setError("Gagal menghapus roadmap. Coba lagi."),
  });

  const handleChange = (id: string, patch: Partial<RoadmapSummary>) => {
    setDraft(list.map((roadmap) => (roadmap.id === id ? { ...roadmap, ...patch } : roadmap)));
  };

  const handleAdd = () => {
    addMutation.mutate();
  };

  const handleDelete = (id: string) => {
    // Hapus di server. Draft lokal ikut dibuang supaya daftar tidak
    // menampilkan roadmap yang sudah tidak ada.
    setDraft((prev) => (prev ?? data ?? []).filter((roadmap) => roadmap.id !== id));
    deleteMutation.mutate(id);
  };

  const handleEditContent = (id: string) => {
    // Simpan dulu perubahan katalog biar tidak hilang saat pindah halaman.
    if (dirty) saveMutation.mutate(list);
    void navigate(`/faculty/roadmaps/${id}`);
  };

  const handleSave = () => {
    saveMutation.mutate(list);
  };

  const handleReset = () => {
    // "Reset" = buang draft lokal dan ambil ulang dari server. Sebelumnya ini
    // menghapus override localStorage, yang artinya kembali ke server juga —
    // tapi sekarang tidak ada lagi override, jadi cukup buang draft.
    setDraft(null);
    invalidateCatalog();
    flashNotice("Perubahan dibatalkan, data diambil ulang dari server");
  };

  return (
    <FacultyRoadmapsContainer
      roadmaps={list}
      dirty={dirty}
      notice={notice}
      error={error}
      isLoading={isLoading}
      isSaving={saveMutation.isPending || addMutation.isPending || deleteMutation.isPending}
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
