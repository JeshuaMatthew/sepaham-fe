import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRoleRecommendation,
  ROLES_QUERY_KEY,
} from "../../services/roleService";
import { savePreference } from "../../utils/preference";
import RoleRecommendationContainer from "../components/RoleRecommendationContainer";

/**
 * RoleRecommendationPage — penentuan role IT.
 *
 * Membaca hasil kuesioner Likert (recommendedRoleId + roleScores) dari router
 * state, menampilkan "AI meracik roadmap", lalu menyimpan preferensi. TIDAK
 * ADA class Tailwind di sini.
 */

interface LikertResult {
  recommendedRoleId: string | null;
  roleScores: Record<string, number>;
}

function RoleRecommendationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as LikertResult | null;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [...ROLES_QUERY_KEY, result?.recommendedRoleId],
    queryFn: () => fetchRoleRecommendation(result?.recommendedRoleId ?? ""),
    enabled: result != null,
  });

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Diakses langsung tanpa mengisi kuesioner → kembalikan ke onboarding.
  if (result == null) {
    return <Navigate to="/onboarding" replace />;
  }

  const activeRoleId = selectedRoleId ?? data?.recommendedId ?? null;

  const handleConfirm = () => {
    const role = data?.roles.find((item) => item.id === activeRoleId) ?? null;
    if (activeRoleId) {
      savePreference({
        roleId: activeRoleId,
        roleTitle: role?.title ?? activeRoleId,
        roleEmoji: role?.emoji ?? "",
        roleScores: result.roleScores ?? {},
      });
    }
    void navigate("/roadmap");
  };

  return (
    <RoleRecommendationContainer
      roles={data?.roles ?? []}
      recommendedId={data?.recommendedId ?? null}
      selectedRoleId={activeRoleId}
      isLoading={isLoading}
      isError={isError}
      onSelectRole={setSelectedRoleId}
      onConfirm={handleConfirm}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default RoleRecommendationPage;
