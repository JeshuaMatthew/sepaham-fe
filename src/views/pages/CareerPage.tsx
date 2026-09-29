import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ROADMAP_CATALOG_QUERY_KEY,
  fetchRoadmapCatalog,
  fetchRoadmapTree,
  roadmapTreeQueryKey,
  fetchSubmissions,
} from "@/features/roadmap/services/roadmapService";
import { GITHUB_QUERY_KEY, fetchGithubStats } from "@/features/profile/services/githubService";
import { ROLES_QUERY_KEY, fetchRoles } from "@/features/onboarding/services/roleService";
import {
  INTERNSHIP_CONTACTS_QUERY_KEY,
  fetchInternshipContacts,
} from "@/features/career/services/internshipService";
import { buildCareerProfile, topCareers } from "@/features/career/services/careerService";
import { getPreference } from "@/features/onboarding/utils/preference";
import { computeStatuses } from "@/features/roadmap/utils/roadmapGraph";
import { PROFILE_QUERY_KEY, fetchProfile } from "@/features/profile/services/profileService";
import { MY_COMMUNITIES_QUERY_KEY, fetchMyCommunities } from "@/features/chat/services/communityService";
import AxiosInstance from "@/lib/axios";
import { reportError } from "@/shared/errors";
import CareerContainer from "../components/CareerContainer";

/**
 * CareerPage — top-3 karier hasil analisis AI, kontak perusahaan berdasarkan
 * top-3 itu, dan ringkasan kesiapan karier. Konsultasi AI ada di subhalaman
 * terpisah (/career/consult). TIDAK ADA class Tailwind di sini.
 */

function CareerPage() {
  const navigate = useNavigate();
  const preference = getPreference();

  const catalogQuery = useQuery({
    queryKey: ROADMAP_CATALOG_QUERY_KEY,
    queryFn: fetchRoadmapCatalog,
  });
  const githubQuery = useQuery({ queryKey: GITHUB_QUERY_KEY, queryFn: fetchGithubStats });
  const rolesQuery = useQuery({ queryKey: ROLES_QUERY_KEY, queryFn: fetchRoles });
  const contactsQuery = useQuery({
    queryKey: INTERNSHIP_CONTACTS_QUERY_KEY,
    queryFn: fetchInternshipContacts,
  });

  const queryClient = useQueryClient();

  const catalog = catalogQuery.data ?? [];
  const primary =
    (preference != null ? catalog.find((item) => item.roleId === preference.roleId) : undefined) ??
    catalog[0] ??
    null;

  const treeQuery = useQuery({
    queryKey: roadmapTreeQueryKey(primary?.id ?? "none"),
    queryFn: () => fetchRoadmapTree(primary!.id),
    enabled: primary != null,
  });

  const submissionsQuery = useQuery({
    queryKey: ["submissions", primary?.id],
    queryFn: () => fetchSubmissions(primary!.id),
    enabled: primary != null,
  });

  const communitiesQuery = useQuery({ queryKey: MY_COMMUNITIES_QUERY_KEY, queryFn: fetchMyCommunities });
  const projects = communitiesQuery.data?.length ?? 0;

  const profileQuery = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: fetchProfile });
  const cvName = profileQuery.data?.cvFileName ?? null;
  const connected = profileQuery.data?.githubConnected ?? false;
  const cvProvided = cvName != null;

  const [cvError, setCvError] = useState<string | null>(null);

  const handleUploadCv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setCvError(null);
    void AxiosInstance.post("/profile/cv", formData)
      .then(() => queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }))
      .catch((error) => {
        reportError("uploadCv", error);
        setCvError("Gagal mengunggah CV. Coba lagi.");
      });
    event.target.value = "";
  };

  const topMatches = useMemo(
    () => topCareers(rolesQuery.data ?? [], preference?.roleScores ?? {}, 3),
    [rolesQuery.data, preference?.roleScores],
  );

  const contacts = useMemo(() => {
    const topRoleIds = new Set(topMatches.map((match) => match.role.id));
    return (contactsQuery.data ?? []).filter((contact) => topRoleIds.has(contact.roleId));
  }, [contactsQuery.data, topMatches]);

  const profile = useMemo(() => {
    if (catalogQuery.isLoading || githubQuery.isLoading) return null;
    const tree = treeQuery.data ?? null;
    const completed =
      primary && tree ? computeStatuses(tree, submissionsQuery.data ?? {}).completedCount : 0;
    const github = githubQuery.data;
    return buildCareerProfile({
      roadmap: {
        completed,
        total: tree?.nodes.length ?? primary?.totalNodes ?? 0,
        title: primary?.title ?? "",
      },
      github:
        connected && github
          ? {
              commits: github.stats.totalCommits,
              repos: github.stats.publicRepos,
              topLanguages: github.topLanguages.map((lang) => lang.name),
            }
          : null,
      projects,
      cv: { provided: cvProvided, fileName: cvName ?? undefined },
    });
  }, [
    catalogQuery.isLoading,
    githubQuery.isLoading,
    githubQuery.data,
    treeQuery.data,
    submissionsQuery.data,
    primary,
    projects,
    cvProvided,
    cvName,
    connected,
  ]);

  const isLoading =
    catalogQuery.isLoading ||
    githubQuery.isLoading ||
    rolesQuery.isLoading ||
    (primary != null && treeQuery.isLoading);

  return (
    <CareerContainer
      topMatches={topMatches}
      contacts={contacts}
      profile={profile}
      isLoading={isLoading}
      hasCv={cvProvided}
      cvName={cvName}
      cvError={cvError}
      githubConnected={connected}
      onUploadCv={handleUploadCv}
      onGoConsult={() => navigate("/career/consult")}
      onGoRoadmap={() => navigate("/roadmap")}
      onGoPartner={() => navigate("/partner")}
    />
  );
}

export default CareerPage;
