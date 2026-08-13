import type { NodeStatus, Roadmap, RoadmapEdge, SubmissionState } from "@/features/roadmap/types/roadmap";

export const FLOW_SCALE_X = 8;
export const FLOW_SCALE_Y = 9;

export function toFlowPosition(x: number, y: number): { x: number; y: number } {
  return { x: x * FLOW_SCALE_X, y: y * FLOW_SCALE_Y };
}

export function fromFlowPosition(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.round((x / FLOW_SCALE_X) * 10) / 10,
    y: Math.round((y / FLOW_SCALE_Y) * 10) / 10,
  };
}

export function getRoadmapEdges(roadmap: Roadmap): RoadmapEdge[] {
  if (roadmap.edges && roadmap.edges.length > 0) return roadmap.edges;
  const edges: RoadmapEdge[] = [];
  for (const node of roadmap.nodes) {
    for (const prereqId of node.prereqs ?? []) {
      edges.push({ id: `${prereqId}-${node.id}`, source: prereqId, target: node.id });
    }
  }
  return edges;
}

export function requiredPrereqs(edges: RoadmapEdge[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const edge of edges) {
    if (edge.optional) continue;
    (map[edge.target] ??= []).push(edge.source);
  }
  return map;
}

export function computeStatuses(
  roadmap: Roadmap,
  submissions: Record<string, SubmissionState>,
): { statusById: Record<string, NodeStatus>; completedCount: number } {
  const completed = new Set(
    roadmap.nodes.filter((node) => submissions[node.id]?.done).map((node) => node.id),
  );
  const required = requiredPrereqs(getRoadmapEdges(roadmap));
  const statusById: Record<string, NodeStatus> = {};
  for (const node of roadmap.nodes) {
    if (completed.has(node.id)) statusById[node.id] = "completed";
    else if (
      node.alwaysUnlocked ||
      (required[node.id] ?? []).every((prereqId) => completed.has(prereqId))
    )
      statusById[node.id] = "available";
    else statusById[node.id] = "locked";
  }
  return { statusById, completedCount: completed.size };
}
