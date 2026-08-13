import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRoleRecommendation, ROLES_QUERY_KEY } from "@/features/onboarding/services/roleService";
import { savePreference } from "@/features/onboarding/utils/preference";
import { pushPreference } from "@/features/onboarding/services/preferenceService";
import RoleRecommendationContainer from "@/features/onboarding/components/RoleRecommendationContainer";

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

  if (result == null) return <Navigate to="/onboarding" replace />;

  const activeRoleId = selectedRoleId ?? data?.recommendedId ?? null;

  const handleConfirm = () => {
    const role = data?.roles.find((item) => item.id === activeRoleId) ?? null;
    if (activeRoleId) {
      const preference = {
        roleId: activeRoleId,
        roleTitle: role?.title ?? activeRoleId,
        roleEmoji: role?.emoji ?? "",
        roleScores: result.roleScores ?? {},
      };
      savePreference(preference);
      void pushPreference(preference).catch(() => {});
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
      onRetry={() => { void refetch(); }}
    />
  );
}

export default RoleRecommendationPage;
