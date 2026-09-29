import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRoadmapTree,
  fetchSubmissions,
  pushActivity,
  roadmapTreeQueryKey,
} from "@/features/roadmap/services/roadmapService";
import {
  INTERNSHIP_CONTACTS_QUERY_KEY,
  INTERNSHIP_UNLOCK_PERCENT,
  fetchInternshipContacts,
} from "@/features/career/services/internshipService";
import { computeStatuses } from "@/features/roadmap/utils/roadmapGraph";
import { reportError } from "@/shared/errors";
import RoadmapContainer from "../components/RoadmapContainer";

/**
 * RoadmapPage — skill tree satu roadmap (React Flow).
 *
 * Klik node → buka HALAMAN materi node (bukan modal). Status tiap node
 * diturunkan dari progres submission di server. TIDAK ADA
 * class Tailwind di sini.
 */

function RoadmapPage() {
  const navigate = useNavigate();
  const { roadmapId } = useParams();

  // Catat roadmap ini sebagai "baru dibuka" untuk sorotan di katalog.
  useEffect(() => {
    if (!roadmapId) return;
    void pushActivity(roadmapId).catch((error) => reportError("pushActivity", error));
  }, [roadmapId]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: roadmapTreeQueryKey(roadmapId ?? "none"),
    queryFn: () => fetchRoadmapTree(roadmapId as string),
    enabled: roadmapId != null,
  });

  const internshipQuery = useQuery({
    queryKey: INTERNSHIP_CONTACTS_QUERY_KEY,
    queryFn: fetchInternshipContacts,
  });

  const submissionsQuery = useQuery({
    queryKey: ["submissions", roadmapId],
    queryFn: () => fetchSubmissions(roadmapId as string),
    enabled: roadmapId != null,
  });
  const submissions = submissionsQuery.data ?? {};

  const roadmap = data ?? null;
  const { statusById, completedCount } = roadmap
    ? computeStatuses(roadmap, submissions)
    : { statusById: {}, completedCount: 0 };

  const totalCount = roadmap?.nodes.length ?? 0;
  const currentPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const internshipUnlocked = currentPercent >= INTERNSHIP_UNLOCK_PERCENT;
  const internshipContacts = (internshipQuery.data ?? []).filter(
    (contact) => contact.roleId === (roadmap?.roleId ?? ""),
  );

  return (
    <RoadmapContainer
      roadmap={roadmap}
      statusById={statusById}
      completedCount={completedCount}
      totalCount={totalCount}
      internshipContacts={internshipContacts}
      internshipUnlocked={internshipUnlocked}
      internshipUnlockPercent={INTERNSHIP_UNLOCK_PERCENT}
      internshipCurrentPercent={currentPercent}
      internshipLoading={internshipQuery.isLoading}
      isLoading={isLoading}
      isError={isError}
      onBack={() => navigate("/roadmap")}
      onSelectNode={(id) => navigate(`/roadmap/${roadmapId}/${id}`)}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default RoadmapPage;
