import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AI_FEED_QUERY_KEY, fetchAiFeed } from "@/features/home/services/aiService";
import { PROFILE_QUERY_KEY, fetchProfile } from "@/features/profile/services/profileService";
import {
  ROADMAP_CATALOG_QUERY_KEY,
  fetchRoadmapCatalog,
  fetchRoadmapTree,
  roadmapTreeQueryKey,
  fetchSubmissions,
} from "@/features/roadmap/services/roadmapService";
import {
  MY_COMMUNITIES_QUERY_KEY,
  fetchMyCommunities,
} from "@/features/chat/services/communityService";
import { COLLAB_QUERY_KEY, fetchCollabRequests } from "@/features/collab/services/collabService";
import { GITHUB_QUERY_KEY, fetchGithubStats } from "@/features/profile/services/githubService";
import { buildCareerProfile } from "@/features/career/services/careerService";
import type { RoadmapHeroData } from "../components/HomeRoadmapHero";
import type { CollabRequest } from "@/features/collab/types/collab";
import { getPreference } from "@/features/onboarding/utils/preference";
import { getAccount } from "@/features/auth/utils/account";
import { computeStatuses } from "@/features/roadmap/utils/roadmapGraph";
import HomeContainer from "../components/HomeContainer";
import FacultyDashboardContainer from "../components/FacultyDashboardContainer";
import OnboardingCTA from "../components/OnboardingCTA";

/**
 * HomePage — beranda/dashboard: ringkasan semua halaman dengan roadmap sebagai
 * sorotan utama. Selain roadmap (progress), menampilkan ringkasan komunitas,
 * Cari Tim, Hack Time, plus quote/nudge/magang harian.
 *
 * Page mengambil semua data (query) + menghitung ringkasan, lalu meneruskannya
 * ke container. TIDAK ADA class Tailwind di sini.
 */

/** 1 kalau role yang dibutuhkan request cocok dengan preferensi user. */
function rankFit(request: CollabRequest, roleKeyword: string): number {
  if (!roleKeyword) return 0;
  return request.neededRoles.some((role) => role.toLowerCase().includes(roleKeyword)) ? 1 : 0;
}

function HomePage() {
  const navigate = useNavigate();
  const preference = getPreference();
  const isFaculty = getAccount().role === "faculty";

  const feedQuery = useQuery({ queryKey: AI_FEED_QUERY_KEY, queryFn: fetchAiFeed });
  const profileQuery = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: fetchProfile });
  const catalogQuery = useQuery({
    queryKey: ROADMAP_CATALOG_QUERY_KEY,
    queryFn: fetchRoadmapCatalog,
  });
  const serversQuery = useQuery({
    queryKey: MY_COMMUNITIES_QUERY_KEY,
    queryFn: fetchMyCommunities,
  });
  const collabQuery = useQuery({ queryKey: COLLAB_QUERY_KEY, queryFn: fetchCollabRequests });
  const githubQuery = useQuery({ queryKey: GITHUB_QUERY_KEY, queryFn: fetchGithubStats });

  // Roadmap utama: role-match dari preferensi, fallback item pertama katalog.
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

  const roadmap = useMemo<RoadmapHeroData | null>(() => {
    if (!primary) return null;
    const tree = treeQuery.data ?? null;
    const completedCount = tree
      ? computeStatuses(tree, submissionsQuery.data ?? {}).completedCount
      : 0;
    return {
      id: primary.id,
      title: primary.title,
      emoji: primary.emoji,
      color: primary.color,
      difficulty: primary.difficulty,
      completedCount,
      totalCount: tree?.nodes.length ?? primary.totalNodes,
    };
  }, [primary, treeQuery.data, submissionsQuery.data]);

  const firstName = (profileQuery.data?.name ?? "Dev").split(" ")[0];

  // Ringkasan kesiapan karier (dari roadmap, GitHub, project, CV).
  const careerReadiness = useMemo(() => {
    const github = githubQuery.data;
    return buildCareerProfile({
      roadmap: {
        completed: roadmap?.completedCount ?? 0,
        total: roadmap?.totalCount ?? 0,
        title: roadmap?.title ?? "",
      },
      github:
        profileQuery.data?.githubConnected && github
          ? {
              commits: github.stats.totalCommits,
              repos: github.stats.publicRepos,
              topLanguages: github.topLanguages.map((lang) => lang.name),
            }
          : null,
      projects: serversQuery.data?.length ?? 0,
      cv: profileQuery.data?.cvFileName ? { provided: true, fileName: profileQuery.data.cvFileName } : { provided: false },
    }).readiness;
  }, [roadmap, githubQuery.data, profileQuery.data, serversQuery.data]);

  // "Cari Tim" yang cocok: request terbuka, diurutkan yang match role user dulu.
  const roleKeyword = (preference?.roleTitle ?? "").split(" ")[0].toLowerCase();
  const fittingCollab = [...(collabQuery.data ?? []).filter((request) => request.status === "open")]
    .sort((a, b) => rankFit(b, roleKeyword) - rankFit(a, roleKeyword))
    .slice(0, 4);

  // Faculty melihat dashboard dosen, bukan konten mahasiswa.
  if (isFaculty) {
    return <FacultyDashboardContainer />;
  }

  // Mahasiswa yang belum onboarding tidak melihat konten khusus student
  // (internships, GitHub streak, roadmap progress) — hanya CTA untuk memulai.
  if (preference === null) {
    return <OnboardingCTA />;
  }

  return (
    <HomeContainer
      userName={firstName}
      isFaculty={isFaculty}
      roadmap={roadmap}
      roadmapLoading={catalogQuery.isLoading || (primary != null && treeQuery.isLoading)}
      community={{
        channels: (serversQuery.data ?? []).reduce((sum, c) => sum + (c.channels?.length ?? 0), 0),
        servers: serversQuery.data?.length ?? 0,
      }}
      collab={{
        openRequests: (collabQuery.data ?? []).filter((request) => request.status === "open").length,
      }}
      career={{ readiness: careerReadiness }}
      summaryLoading={
        serversQuery.isLoading ||
        collabQuery.isLoading ||
        githubQuery.isLoading
      }
      feed={feedQuery.data ?? null}
      collabRequests={fittingCollab}
      collabLoading={collabQuery.isLoading}
      isLoading={feedQuery.isLoading}
      isError={feedQuery.isError}
      onOpenRoadmap={(id) => navigate(`/roadmap/${id}`)}
      onBrowseRoadmap={() => navigate("/roadmap")}
      onGoCommunity={() => navigate("/community")}
      onGoCollab={() => navigate("/partner")}
      onGoCareer={() => navigate("/career")}
      onRetry={() => {
        void feedQuery.refetch();
      }}
    />
  );
}

export default HomePage;
