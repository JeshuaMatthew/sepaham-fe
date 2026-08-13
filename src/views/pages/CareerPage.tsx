import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ROADMAP_CATALOG_QUERY_KEY,
  fetchRoadmapCatalog,
  fetchRoadmapTree,
  roadmapTreeQueryKey,
} from "@/features/roadmap/services/roadmapService";
import { GITHUB_QUERY_KEY, fetchGithubStats } from "@/features/profile/services/githubService";
import { ROLES_QUERY_KEY, fetchRoles } from "@/features/onboarding/services/roleService";
import {
  INTERNSHIP_CONTACTS_QUERY_KEY,
  fetchInternshipContacts,
} from "@/features/career/services/internshipService";
import { buildCareerProfile, topCareers } from "@/features/career/services/careerService";
import { getPreference } from "@/features/onboarding/utils/preference";
import { getSubmissions } from "@/features/roadmap/utils/submissionStore";
import { computeStatuses } from "@/features/roadmap/utils/roadmapGraph";
import { getStoredCommunities } from "@/features/chat/utils/communityStore";
import { getCv, saveCv } from "@/features/profile/utils/cv";
import { isGithubConnected, setGithubConnected } from "@/features/profile/utils/githubConnection";
import { connectGithub } from "@/features/profile/services/githubService";
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

  const projects = getStoredCommunities().length;
  const [cvName, setCvName] = useState<string | null>(getCv()?.fileName ?? null);
  const [connected, setConnected] = useState<boolean>(isGithubConnected());
  const cvProvided = cvName != null;

  const handleUploadCv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    saveCv(file.name);
    setCvName(file.name);
    event.target.value = "";
  };

  const handleConnectGithub = () => {
    setGithubConnected(true);
    setConnected(true);
    void connectGithub().catch(() => {});
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
      primary && tree ? computeStatuses(tree, getSubmissions(primary.id)).completedCount : 0;
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
      githubConnected={connected}
      onUploadCv={handleUploadCv}
      onConnectGithub={handleConnectGithub}
      onGoConsult={() => navigate("/career/consult")}
      onGoRoadmap={() => navigate("/roadmap")}
      onGoPartner={() => navigate("/partner")}
    />
  );
}

export default CareerPage;
