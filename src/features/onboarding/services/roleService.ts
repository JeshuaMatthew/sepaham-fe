import AxiosInstance from "@/lib/axios";
import type { Role, RoleRecommendation } from "@/features/onboarding/types/role";

/**
 * Service Role IT (backend Axum: GET /api/roles).
 * Ada jeda buatan supaya animasi "AI meracik roadmap" sempat tampil.
 */

export const ROLES_QUERY_KEY = ["onboarding", "roles"] as const;

const AI_THINKING_MS = 2400;

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await AxiosInstance.get<{ roles: Role[] }>("/roles");
  return data.roles;
}

export async function fetchRoleRecommendation(
  recommendedRoleId: string,
): Promise<RoleRecommendation> {
  const roles = await fetchRoles();

  await new Promise((resolve) => setTimeout(resolve, AI_THINKING_MS));

  const recommendedId = roles.some((role) => role.id === recommendedRoleId)
    ? recommendedRoleId
    : roles[0]?.id ?? "";

  const ranked = [...roles].sort(
    (a, b) => (b.id === recommendedId ? 1 : 0) - (a.id === recommendedId ? 1 : 0),
  );

  return { recommendedId, roles: ranked };
}
