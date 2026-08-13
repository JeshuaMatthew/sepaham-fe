import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApplicantStatus } from "@/features/collab/types/collab";
import {
  MY_TEAMS_QUERY_KEY,
  fetchMyTeams,
  setApplicantStatus,
} from "@/features/collab/services/collabService";
import MyTeamsContainer from "../components/MyTeamsContainer";

/**
 * MyTeamsPage — tim project yang DIBUAT user: lihat pendaftar (accept/reject)
 * dan bagikan invite link komunitas. Data dari backend Axum. Page mengurus
 * state/query; container render. TIDAK ADA class Tailwind di sini.
 */

function MyTeamsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: teams } = useQuery({
    queryKey: MY_TEAMS_QUERY_KEY,
    queryFn: fetchMyTeams,
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const statusMutation = useMutation({
    mutationFn: (vars: {
      requestId: string;
      applicantId: string;
      status: ApplicantStatus;
    }) => setApplicantStatus(vars.requestId, vars.applicantId, vars.status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_TEAMS_QUERY_KEY });
    },
  });

  const handleSetStatus = (
    requestId: string,
    applicantId: string,
    status: ApplicantStatus,
  ) => {
    statusMutation.mutate({ requestId, applicantId, status });
  };

  const handleCopyInvite = (serverId: string) => {
    const link = `${window.location.origin}/community?join=${serverId}`;
    void navigator.clipboard?.writeText(link);
    setCopiedId(serverId);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <MyTeamsContainer
      teams={teams ?? []}
      copiedId={copiedId}
      onSetStatus={handleSetStatus}
      onCopyInvite={handleCopyInvite}
      onBack={() => navigate("/partner")}
    />
  );
}

export default MyTeamsPage;
