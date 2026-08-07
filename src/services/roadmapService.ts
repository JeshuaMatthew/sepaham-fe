import axios from "axios";
import type { Roadmap, RoadmapSummary } from "../types/roadmap";
import {
  CATALOG_KEY,
  readOverride,
  removeOverride,
  treeKey,
  writeOverride,
} from "../utils/contentStore";

/**
 * Service Roadmap (multi-roadmap, bisa diedit dosen).
 * Membaca override dosen (localStorage) dulu; kalau kosong pakai mock JSON.
 */

export const ROADMAP_CATALOG_QUERY_KEY = ["roadmap", "catalog"] as const;
export const roadmapTreeQueryKey = (id: string) => ["roadmap", "tree", id] as const;

export async function fetchRoadmapCatalog(): Promise<RoadmapSummary[]> {
  const override = readOverride<RoadmapSummary[]>(CATALOG_KEY);
  if (override) return override;
  const { data } = await axios.get<{ roadmaps: RoadmapSummary[] }>("/mocks/roadmaps.json");
  return data.roadmaps;
}

export function saveRoadmapCatalog(roadmaps: RoadmapSummary[]): void {
  writeOverride(CATALOG_KEY, roadmaps);
}

export function resetRoadmapCatalog(): void {
  removeOverride(CATALOG_KEY);
}

export async function fetchRoadmapTree(id: string): Promise<Roadmap> {
  const override = readOverride<Roadmap>(treeKey(id));
  if (override) return override;
  try {
    const { data } = await axios.get<Roadmap>(`/mocks/roadmap-${id}.json`);
    return data;
  } catch {
    // Roadmap baru buatan dosen yang belum punya mock default.
    return { id, roleId: "", title: id, emoji: "", nodes: [] };
  }
}

export function saveRoadmapTree(id: string, tree: Roadmap): void {
  writeOverride(treeKey(id), tree);
}

export function resetRoadmapTree(id: string): void {
  removeOverride(treeKey(id));
}
