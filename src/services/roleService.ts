import axios from "axios";
import type { Role, RoleRecommendation } from "../types/role";

/**
 * Service Role IT.
 *
 * Rekomendasi role kini datang dari hasil kuesioner Likert onboarding
 * (recommendedRoleId dihitung di page). Di sini tetap ada jeda buatan
 * supaya animasi "AI meracik roadmap" sempat tampil.
 */

export const ROLES_QUERY_KEY = ["onboarding", "roles"] as const;

const MOCK_ENDPOINT = "/mocks/roles.json";
const AI_THINKING_MS = 2400;

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await axios.get<{ roles: Role[] }>(MOCK_ENDPOINT);
  return data.roles;
}

export async function fetchRoleRecommendation(
  recommendedRoleId: string,
): Promise<RoleRecommendation> {
  const roles = await fetchRoles();

  // Simulasi proses "AI meracik roadmap..." (nanti diganti call ke Axum).
  await new Promise((resolve) => setTimeout(resolve, AI_THINKING_MS));

  const recommendedId = roles.some((role) => role.id === recommendedRoleId)
    ? recommendedRoleId
    : roles[0]?.id ?? "";

  // Taruh role rekomendasi paling depan.
  const ranked = [...roles].sort(
    (a, b) => (b.id === recommendedId ? 1 : 0) - (a.id === recommendedId ? 1 : 0),
  );

  return { recommendedId, roles: ranked };
}
