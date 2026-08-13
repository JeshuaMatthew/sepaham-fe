import AxiosInstance from "@/lib/axios";
import type { Roadmap, RoadmapSummary, SubmissionState } from "@/features/roadmap/types/roadmap";
import {
  CATALOG_KEY,
  readOverride,
  removeOverride,
  treeKey,
  writeOverride,
} from "@/features/roadmap/utils/contentStore";

export const ROADMAP_CATALOG_QUERY_KEY = ["roadmap", "catalog"] as const;
export const roadmapTreeQueryKey = (id: string) => ["roadmap", "tree", id] as const;

export async function fetchRoadmapCatalog(): Promise<RoadmapSummary[]> {
  const override = readOverride<RoadmapSummary[]>(CATALOG_KEY);
  if (override) return override;
  const { data } = await AxiosInstance.get<{ roadmaps: RoadmapSummary[] }>("/roadmaps");
  return data.roadmaps;
}

export function saveRoadmapCatalog(roadmaps: RoadmapSummary[]): void {
  writeOverride(CATALOG_KEY, roadmaps);
  roadmaps.forEach((roadmap) => {
    void AxiosInstance.put(`/roadmaps/${roadmap.id}`, {
      roleId: roadmap.roleId, title: roadmap.title, emoji: roadmap.emoji,
      color: roadmap.color, description: roadmap.description,
      difficulty: roadmap.difficulty, matchTags: roadmap.matchTags, author: roadmap.author,
    }).catch(() => {});
  });
}

export function resetRoadmapCatalog(): void {
  removeOverride(CATALOG_KEY);
}

export async function fetchRoadmapTree(id: string): Promise<Roadmap> {
  const override = readOverride<Roadmap>(treeKey(id));
  if (override) return override;
  try {
    const { data } = await AxiosInstance.get<Roadmap>(`/roadmaps/${id}`);
    return data;
  } catch {
    return { id, roleId: "", title: id, emoji: "", nodes: [] };
  }
}

export function saveRoadmapTree(id: string, tree: Roadmap): void {
  writeOverride(treeKey(id), tree);
  void AxiosInstance.put(`/roadmaps/${id}`, tree).catch(() => {});
}

export function resetRoadmapTree(id: string): void {
  removeOverride(treeKey(id));
}

export async function fetchSubmissions(
  roadmapId: string,
): Promise<Record<string, SubmissionState>> {
  const { data } = await AxiosInstance.get<Record<string, SubmissionState>>(
    `/roadmaps/${roadmapId}/submissions`,
  );
  return data;
}

export async function pushSubmission(
  roadmapId: string,
  nodeKey: string,
  state: SubmissionState,
): Promise<void> {
  await AxiosInstance.put(`/roadmaps/${roadmapId}/nodes/${nodeKey}/submission`, state);
}

export async function pushActivity(roadmapId: string): Promise<void> {
  await AxiosInstance.post(`/roadmaps/${roadmapId}/activity`);
}
