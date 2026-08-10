import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRoadmapTree,
  fetchSubmissions,
  pushActivity,
  roadmapTreeQueryKey,
} from "../../services/roadmapService";
import {
  INTERNSHIP_CONTACTS_QUERY_KEY,
  INTERNSHIP_UNLOCK_PERCENT,
  fetchInternshipContacts,
} from "../../services/internshipService";
import type { SubmissionState } from "../../types/roadmap";
import { computeStatuses } from "../../utils/roadmapGraph";
import { getSubmissions, saveSubmission } from "../../utils/submissionStore";
import { markRoadmapActive } from "../../utils/roadmapActivity";
import RoadmapContainer from "../components/RoadmapContainer";

/**
 * RoadmapPage — skill tree satu roadmap (React Flow).
 *
 * Klik node → buka HALAMAN materi node (bukan modal). Status tiap node
 * diturunkan dari progres submission (localStorage per roadmap). TIDAK ADA
 * class Tailwind di sini.
 */

function RoadmapPage() {
  const navigate = useNavigate();
  const { roadmapId } = useParams();

  // Catat roadmap ini sebagai "baru dibuka" untuk sorotan di katalog.
  useEffect(() => {
    if (!roadmapId) return;
    markRoadmapActive(roadmapId);
    void pushActivity(roadmapId).catch(() => {});
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

  // Progres dibaca dari store saat mount (halaman ini remount ketika kembali
  // dari halaman node, sehingga progresnya selalu segar).
  const [submissions, setSubmissions] = useState<Record<string, SubmissionState>>(() =>
    getSubmissions(roadmapId ?? ""),
  );

  // Hidrasi progres dari backend: yang lokal (lebih segar) menang, server
  // mengisi node yang belum ada di localStorage.
  useEffect(() => {
    if (!roadmapId) return;
    let cancelled = false;
    void fetchSubmissions(roadmapId)
      .then((remote) => {
        if (cancelled) return;
        const local = getSubmissions(roadmapId);
        Object.entries(remote).forEach(([nodeKey, state]) => {
          if (!(nodeKey in local)) saveSubmission(roadmapId, nodeKey, state);
        });
        setSubmissions(getSubmissions(roadmapId));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [roadmapId]);

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
