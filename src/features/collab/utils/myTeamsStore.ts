import type { ApplicantStatus, CollabApplicant, CollabRequest } from "@/features/collab/types/collab";

/**
 * Project team yang DIBUAT oleh user (localStorage), beserta daftar pendaftar.
 */

export interface MyTeam {
  request: CollabRequest;
  applicants: CollabApplicant[];
  communityServerId: string;
}

const STORAGE_KEY = "sepaham:myTeams";

export function getMyTeams(): MyTeam[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MyTeam[]) : [];
  } catch {
    return [];
  }
}

function writeMyTeams(teams: MyTeam[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  } catch {}
}

export function addMyTeam(team: MyTeam): void {
  writeMyTeams([team, ...getMyTeams()]);
}

export function setApplicantStatus(
  requestId: string,
  applicantId: string,
  status: ApplicantStatus,
): MyTeam[] {
  const next = getMyTeams().map((team) =>
    team.request.id !== requestId
      ? team
      : {
          ...team,
          applicants: team.applicants.map((applicant) =>
            applicant.id === applicantId ? { ...applicant, status } : applicant,
          ),
        },
  );
  writeMyTeams(next);
  return next;
}

const APPLICANT_POOL: { name: string; avatar: string; role: string }[] = [
  { name: "Aditya Nugroho", avatar: "https://i.pravatar.cc/64?img=11", role: "Backend" },
  { name: "Putri Ananda", avatar: "https://i.pravatar.cc/64?img=20", role: "UI/UX" },
  { name: "Reza Fauzan", avatar: "https://i.pravatar.cc/64?img=33", role: "Frontend" },
  { name: "Melati Sari", avatar: "https://i.pravatar.cc/64?img=25", role: "Mobile" },
  { name: "Yoga Pratama", avatar: "https://i.pravatar.cc/64?img=52", role: "Data/ML" },
  { name: "Citra Dewi", avatar: "https://i.pravatar.cc/64?img=48", role: "Fullstack" },
];

export function mockApplicants(count: number): CollabApplicant[] {
  const shuffled = [...APPLICANT_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((person, index) => ({
    id: crypto.randomUUID().slice(0, 8),
    name: person.name,
    avatar: person.avatar,
    role: person.role,
    message: "Tertarik ikut, aku bisa bantu di bagian ini!",
    status: "pending" as ApplicantStatus,
    appliedMinutesAgo: (index + 1) * 12,
  }));
}
