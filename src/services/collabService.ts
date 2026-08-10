import AxiosInstance from "../utils/Axiosinstance";
import type {
  ApplicantStatus,
  CollabApplicant,
  CollabRequest,
  NewCollabInput,
} from "../types/collab";
import type { MyTeam } from "../utils/myTeamsStore";

/**
 * Service "Cari Tim" (backend Axum, /api/collab/*).
 */

export const COLLAB_QUERY_KEY = ["collab", "requests"] as const;
export const MY_TEAMS_QUERY_KEY = ["collab", "my-teams"] as const;

export async function fetchCollabRequests(): Promise<CollabRequest[]> {
  const { data } = await AxiosInstance.get<{ requests: CollabRequest[] }>("/collab/requests");
  return data.requests;
}

/** Tim yang DIBUAT user + pendaftarnya. */
export async function fetchMyTeams(): Promise<MyTeam[]> {
  const { data } = await AxiosInstance.get<{ teams: MyTeam[] }>("/collab/my-teams");
  return data.teams;
}

export async function createCollabRequest(input: NewCollabInput): Promise<CollabRequest> {
  const neededRoles = input.neededRoles
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

  const { data } = await AxiosInstance.post<CollabRequest>("/collab/requests", {
    title: input.title,
    description: input.description,
    neededRoles,
    membersNeeded: input.membersNeeded,
    images: input.images,
    repoUrl: input.repoUrl.trim() || undefined,
    communityId: input.communityId || undefined,
    newCommunityName: input.newCommunityName || undefined,
  });
  return data;
}

export async function applyToRequest(
  requestId: string,
  message?: string,
): Promise<CollabApplicant> {
  const { data } = await AxiosInstance.post<CollabApplicant>(
    `/collab/requests/${requestId}/apply`,
    { message },
  );
  return data;
}

export async function setApplicantStatus(
  requestId: string,
  applicantId: string,
  status: ApplicantStatus,
): Promise<CollabApplicant> {
  const { data } = await AxiosInstance.patch<CollabApplicant>(
    `/collab/requests/${requestId}/applicants/${applicantId}`,
    { status },
  );
  return data;
}
