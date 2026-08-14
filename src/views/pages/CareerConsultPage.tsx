import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ROADMAP_CATALOG_QUERY_KEY,
  fetchRoadmapCatalog,
  fetchRoadmapTree,
  roadmapTreeQueryKey,
} from "@/features/roadmap/services/roadmapService";
import { GITHUB_QUERY_KEY, fetchGithubStats } from "@/features/profile/services/githubService";
import {
  CAREER_SUGGESTIONS,
  buildCareerProfile,
} from "@/features/career/services/careerService";
import { callAiAssist } from "@/features/home/services/aiService";
import type { CareerMessage } from "@/features/career/types/career";
import { getPreference } from "@/features/onboarding/utils/preference";
import { getSubmissions } from "@/features/roadmap/utils/submissionStore";
import { computeStatuses } from "@/features/roadmap/utils/roadmapGraph";
import { getStoredCommunities } from "@/features/chat/utils/communityStore";
import { getCv } from "@/features/profile/utils/cv";
import { isGithubConnected } from "@/features/profile/utils/githubConnection";
import CareerConsultContainer from "../components/CareerConsultContainer";

/**
 * CareerConsultPage — subhalaman konsultasi AI karier (chat). Menghitung profil
 * yang sama dengan halaman Career, lalu menjawab pertanyaan berdasarkan data.
 * TIDAK ADA class Tailwind di sini.
 */

function CareerConsultPage() {
  const preference = getPreference();

  const catalogQuery = useQuery({
    queryKey: ROADMAP_CATALOG_QUERY_KEY,
    queryFn: fetchRoadmapCatalog,
  });
  const githubQuery = useQuery({ queryKey: GITHUB_QUERY_KEY, queryFn: fetchGithubStats });

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
  const cv = getCv();
  const cvProvided = cv != null;
  const cvName = cv?.fileName;
  const connected = isGithubConnected();

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
      cv: { provided: cvProvided, fileName: cvName },
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

  const [messages, setMessages] = useState<CareerMessage[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hi! I'm your career AI. Ask me anything about your progress, or tap a suggestion below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleSend = async (text: string) => {
    if (!profile || isAiTyping) return;

    const userMessage: CareerMessage = { id: crypto.randomUUID().slice(0, 8), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsAiTyping(true);

    try {
      const responseText = await callAiAssist(text, "career_path");
      const aiMessage: CareerMessage = {
        id: crypto.randomUUID().slice(0, 8),
        role: "ai",
        text: responseText,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: CareerMessage = {
        id: crypto.randomUUID().slice(0, 8),
        role: "ai",
        text: "Sorry, I couldn't reach the AI service right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const isLoading =
    catalogQuery.isLoading || githubQuery.isLoading || (primary != null && treeQuery.isLoading);

  return (
    <CareerConsultContainer
      profile={profile}
      isLoading={isLoading}
      isAiTyping={isAiTyping}
      messages={messages}
      input={input}
      suggestions={CAREER_SUGGESTIONS}
      onInputChange={setInput}
      onSend={handleSend}
    />
  );
}

export default CareerConsultPage;
