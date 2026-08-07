/**
 * Opsi role IT (id konsisten dengan roles.json & roadmaps roleId).
 * Dipakai di editor pertanyaan onboarding (dosen) dan editor roadmap.
 */

export interface RoleOption {
  id: string;
  label: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  { id: "frontend-engineer", label: "Frontend Engineer" },
  { id: "backend-engineer", label: "Backend Engineer" },
  { id: "ml-engineer", label: "ML / AI Engineer" },
  { id: "mobile-developer", label: "Mobile Developer" },
  { id: "data-analyst", label: "Data Analyst" },
  { id: "devops-engineer", label: "DevOps / Cloud" },
  { id: "security-engineer", label: "Security Engineer" },
  { id: "ui-ux-designer", label: "UI/UX Designer" },
];

export function roleLabel(id: string): string {
  return ROLE_OPTIONS.find((role) => role.id === id)?.label ?? id;
}
