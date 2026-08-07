import { useMemo } from "react";
import { ReactFlow, Background } from "@xyflow/react";
import type { Edge, Node, NodeMouseHandler } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { NodeStatus, Roadmap } from "../../types/roadmap";
import { getRoadmapEdges, toFlowPosition } from "../../utils/roadmapGraph";
import RoadmapFlowNode from "./RoadmapFlowNode";

interface RoadmapFlowProps {
  roadmap: Roadmap;
  statusById: Record<string, NodeStatus>;
  onSelectNode: (id: string) => void;
}

const nodeTypes = { roadmapNode: RoadmapFlowNode };

function RoadmapFlow({ roadmap, statusById, onSelectNode }: RoadmapFlowProps) {
  const nodes: Node[] = useMemo(
    () =>
      roadmap.nodes.map((node) => ({
        id: node.id,
        type: "roadmapNode",
        position: toFlowPosition(node.x, node.y),
        data: {
          title: node.title,
          emoji: node.emoji,
          status: statusById[node.id] ?? "locked",
          optional: node.optional,
        },
        draggable: false,
        connectable: false,
      })),
    [roadmap.nodes, statusById],
  );

  const edges: Edge[] = useMemo(
    () =>
      getRoadmapEdges(roadmap).map((edge) => {
        const active = statusById[edge.source] === "completed";
        const isDashed = edge.dashed || edge.optional;
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: edge.animated ?? false,
          label: edge.optional ? "opsional" : undefined,
          style: {
            stroke: active ? "var(--color-neon)" : "var(--color-line)",
            strokeWidth: 2,
            strokeDasharray: isDashed ? "6 4" : undefined,
          },
          labelStyle: { fill: "var(--color-muted)", fontSize: 10, fontWeight: 600 },
          labelBgStyle: { fill: "var(--color-surface)" },
          labelBgPadding: [4, 2] as [number, number],
          labelBgBorderRadius: 6,
        };
      }),
    [roadmap, statusById],
  );

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    if ((statusById[node.id] ?? "locked") === "locked") return;
    onSelectNode(node.id);
  };

  return (
    <div className="h-[560px] w-full overflow-hidden rounded-card border border-line bg-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnDrag={false}
        panOnScroll={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--color-line)" gap={22} />
      </ReactFlow>
    </div>
  );
}

export default RoadmapFlow;
