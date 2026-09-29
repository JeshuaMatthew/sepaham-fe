import { useQuery } from "@tanstack/react-query";
import { ROLES_QUERY_KEY, fetchRoles } from "@/features/onboarding/services/roleService";

/**
 * Opsi role IT — SELALU dari API (`GET /api/roles`), bukan konstanta.
 *
 * Sebelumnya ada `ROLE_OPTIONS` berisi 8 role hardcoded, termasuk
 * `devops-engineer` yang sudah tidak ada di database. Akibatnya role hasil
 * CRUD dosen tidak bisa dipilih di editor roadmap, dan role yang sudah
 * dihapus tetap muncul di dropdown.
 */

export interface RoleOption {
  id: string;
  label: string;
}

export function useRoleOptions(): { options: RoleOption[]; isLoading: boolean } {
  const { data, isLoading } = useQuery({ queryKey: ROLES_QUERY_KEY, queryFn: fetchRoles });
  return {
    options: (data ?? []).map((role) => ({ id: role.id, label: role.title })),
    isLoading,
  };
}

export function roleLabel(id: string, options: RoleOption[] = []): string {
  return options.find((role) => role.id === id)?.label ?? id;
}
