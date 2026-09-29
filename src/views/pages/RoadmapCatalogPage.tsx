import { Navigate, useNavigate } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  ROADMAP_CATALOG_QUERY_KEY,
  fetchRoadmapCatalog,
  fetchSubmissions,
  fetchRoadmapActivity,
} from "@/features/roadmap/services/roadmapService";
import type { RoadmapSummary, SubmissionState } from "@/features/roadmap/types/roadmap";
import { getPreference } from "@/features/onboarding/utils/preference";
import RoadmapCatalogContainer from "../components/RoadmapCatalogContainer";

/**
 * RoadmapCatalogPage — daftar semua roadmap, diurutkan sesuai preferensi user.
 *
 * Kalau user BELUM pernah mengisi kuis preferensi, arahkan ke onboarding dulu.
 * Urutan: roadmap yang role-nya sama dengan preferensi tampil paling atas,
 * sisanya berdasarkan irisan tag hobi. TIDAK ADA class Tailwind di sini.
 */

function scoreRoadmap(
  roadmap: RoadmapSummary,
  roleId: string,
  roleScores: Record<string, number>,
): number {
  const roleMatch = roadmap.roleId === roleId ? 100000 : 0;
  return roleMatch + (roleScores[roadmap.roleId] ?? 0);
}

function RoadmapCatalogPage() {
  const navigate = useNavigate();
  const preference = getPreference();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ROADMAP_CATALOG_QUERY_KEY,
    queryFn: fetchRoadmapCatalog,
    enabled: preference != null,
  });

  // Belum pernah isi kuis → tampilkan kuis dulu.
  if (preference == null) {
    return <Navigate to="/onboarding" replace />;
  }

  const ordered = [...(data ?? [])].sort(
    (a, b) =>
      scoreRoadmap(b, preference.roleId, preference.roleScores) -
      scoreRoadmap(a, preference.roleId, preference.roleScores),
  );

  const submissionQueries = useQueries({
    queries: ordered.map((roadmap) => ({
      queryKey: ["submissions", roadmap.id],
      queryFn: () => fetchSubmissions(roadmap.id),
    })),
  });
  const submissionsByRoadmap: Record<string, Record<string, SubmissionState>> = {};
  ordered.forEach((roadmap, i) => {
    submissionsByRoadmap[roadmap.id] = submissionQueries[i]?.data ?? {};
  });

  const activityQuery = useQuery({
    queryKey: ["roadmap-activity"],
    queryFn: fetchRoadmapActivity,
  });
  const activity = activityQuery.data ?? {};

  // Progres per roadmap (dari submission) + jejak aktivitas.
  const progressById: Record<string, { completed: number; total: number }> = {};
  let furthestId: string | null = null;
  let furthestRatio = 0;
  let recentId: string | null = null;
  let recentAt = 0;
  for (const roadmap of ordered) {
    const completed = Object.values(submissionsByRoadmap[roadmap.id] ?? {}).filter((s) => s.done).length;
    const total = roadmap.totalNodes;
    const lastActive = activity[roadmap.id] ?? null;
    // Tampilkan progress bar kalau roadmap sudah dikerjakan atau pernah dibuka.
    if (completed > 0 || lastActive != null) {
      progressById[roadmap.id] = { completed, total };
    }
    const ratio = total > 0 ? completed / total : 0;
    if (completed > 0 && ratio > furthestRatio) {
      furthestRatio = ratio;
      furthestId = roadmap.id;
    }
    if (lastActive != null && lastActive > recentAt) {
      recentAt = lastActive;
      recentId = roadmap.id;
    }
  }

  return (
    <RoadmapCatalogContainer
      roadmaps={ordered}
      recommendedId={ordered[0]?.id ?? null}
      preferenceRole={preference.roleTitle}
      progressById={progressById}
      furthestId={furthestId}
      recentId={recentId}
      isLoading={isLoading}
      isError={isError}
      onOpen={(id) => navigate(`/roadmap/${id}`)}
      onRedoQuiz={() => navigate("/onboarding")}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default RoadmapCatalogPage;
