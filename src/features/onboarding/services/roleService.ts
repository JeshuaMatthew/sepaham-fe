import AxiosInstance from "@/lib/axios";
import type { Role } from "@/features/onboarding/types/role";

/**
 * Service Role IT (backend Axum: GET /api/roles).
 * `title`, `emoji`, dan `accent` di sini adalah sumber kebenaran tampilan nama
 * role — jangan dipetakan ulang dari id di frontend.
 */

export const ROLES_QUERY_KEY = ["onboarding", "roles"] as const;

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await AxiosInstance.get<{ roles: Role[] }>("/roles");
  return data.roles;
}
