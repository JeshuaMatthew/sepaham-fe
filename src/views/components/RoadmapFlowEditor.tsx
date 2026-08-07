import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import type { Connection, Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Roadmap, RoadmapEdge, RoadmapNode } from "../../types/roadmap";
import { fromFlowPosition, toFlowPosition } from "../../utils/roadmapGraph";
import { ROLE_OPTIONS } from "../../utils/roleOptions";
import RoadmapFlowNode from "./RoadmapFlowNode";
import NodeEditorCard from "./NodeEditorCard";
import EdgeStyleControls from "./EdgeStyleControls";

interface RoadmapFlowEditorProps {
  initialRoadmap: Roadmap;
  notice: string | null;
  onSave: (roadmap: Roadmap) => void;
  onReset: () => void;
}

interface EdgeFlags {
  dashed?: boolean;
  optional?: boolean;
  animated?: boolean;
}

const nodeTypes = { roadmapNode: RoadmapFlowNode };

/** Terapkan tampilan edge dari flag domain-nya (dashed/optional/animated). */
function applyEdgeStyle(edge: Edge): Edge {
  const flags = (edge.data ?? {}) as EdgeFlags;
  const dashed = flags.dashed || flags.optional;
  return {
    ...edge,
    animated: Boolean(flags.animated),
    label: flags.optional ? "opsional" : undefined,
    style: {
      stroke: "var(--color-line)",
      strokeWidth: 2,
      strokeDasharray: dashed ? "6 4" : undefined,
    },
    labelStyle: { fill: "var(--color-muted)", fontSize: 10, fontWeight: 600 },
    labelBgStyle: { fill: "var(--color-surface)" },
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 6,
  };
}

function RoadmapFlowEditor({ initialRoadmap, notice, onSave, onReset }: RoadmapFlowEditorProps) {
  const [title, setTitle] = useState(initialRoadmap.title);
  const emoji = initialRoadmap.emoji;
  const [roleId, setRoleId] = useState(initialRoadmap.roleId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    initialRoadmap.nodes.map((node) => ({
      id: node.id,
      type: "roadmapNode",
      position: toFlowPosition(node.x, node.y),
      data: {
        title: node.title,
        emoji: node.emoji,
        status: "available",
        optional: node.optional,
        article: node.article,
        submission: node.submission,
      },
    })),
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    (initialRoadmap.edges ?? []).map((edge) =>
      applyEdgeStyle({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        data: { dashed: edge.dashed, optional: edge.optional, animated: edge.animated },
      }),
    ),
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const id = `e-${crypto.randomUUID().slice(0, 6)}`;
      setEdges((eds) =>
        addEdge(
          applyEdgeStyle({
            id,
            source: connection.source as string,
            target: connection.target as string,
            data: {},
          }),
          eds,
        ),
      );
    },
    [setEdges],
  );

  const updateNode = (nodeId: string, patch: Partial<RoadmapNode>) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...patch } } : node)),
    );
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNodeId(null);
  };

  const addNode = () => {
    const id = crypto.randomUUID().slice(0, 8);
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "roadmapNode",
        position: { x: 120, y: 120 },
        data: {
          title: "Skill Baru",
          emoji: "",
          status: "available",
          optional: false,
          article: "",
          submission: { type: "checkmark" },
        },
      },
    ]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  };

  const toggleEdgeFlag = (edgeId: string, key: keyof EdgeFlags) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id !== edgeId) return edge;
        const flags = (edge.data ?? {}) as EdgeFlags;
        return applyEdgeStyle({ ...edge, data: { ...flags, [key]: !flags[key] } });
      }),
    );
  };

  const deleteEdge = (edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    setSelectedEdgeId(null);
  };

  const handleSave = () => {
    const outNodes: RoadmapNode[] = nodes.map((node) => {
      const pos = fromFlowPosition(node.position.x, node.position.y);
      const data = node.data as {
        title: string;
        emoji: string;
        optional?: boolean;
        article?: string;
        submission?: RoadmapNode["submission"];
      };
      return {
        id: node.id,
        title: data.title,
        emoji: data.emoji,
        x: pos.x,
        y: pos.y,
        optional: data.optional || undefined,
        article: data.article,
        submission: data.submission,
      };
    });
    const outEdges: RoadmapEdge[] = edges.map((edge) => {
      const flags = (edge.data ?? {}) as EdgeFlags;
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        dashed: flags.dashed || undefined,
        optional: flags.optional || undefined,
        animated: flags.animated || undefined,
      };
    });
    onSave({ id: initialRoadmap.id, roleId, title, emoji, nodes: outNodes, edges: outEdges });
  };

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId) ?? null;
  const nodeTitle = (id: string) =>
    (nodes.find((node) => node.id === id)?.data as { title?: string })?.title ?? id;

  return (
    <div className="flex flex-col gap-4">
      {/* Meta roadmap */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Judul roadmap"
          className="flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-sm font-semibold text-ink focus:border-primary focus:outline-none"
        />
        <select
          value={roleId}
          onChange={(event) => setRoleId(event.target.value)}
          className="rounded-lg border border-line bg-canvas px-2 py-2 text-xs text-ink focus:border-primary focus:outline-none"
        >
          <option value="">(role)</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role.id} value={role.id}>{role.label}</option>
          ))}
        </select>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <button
          type="button"
          onClick={addNode}
          className="cursor-pointer rounded-full bg-primary/15 px-4 py-2 font-semibold text-primary transition-colors hover:bg-primary/25"
        >
          + Tambah node
        </button>
        <span>
          Seret node untuk memindah · tarik dari titik bawah ke node lain untuk membuat koneksi ·
          pilih node/koneksi lalu tekan Delete untuk menghapus.
        </span>
      </div>

      {/* Kanvas React Flow */}
      <div className="h-[520px] w-full overflow-hidden rounded-card border border-line bg-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_event, node) => {
            setSelectedNodeId(node.id);
            setSelectedEdgeId(null);
          }}
          onEdgeClick={(_event, edge) => {
            setSelectedEdgeId(edge.id);
            setSelectedNodeId(null);
          }}
          onPaneClick={() => {
            setSelectedEdgeId(null);
            setSelectedNodeId(null);
          }}
          deleteKeyCode={["Backspace", "Delete"]}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="var(--color-line)" gap={22} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {/* Panel edge / node terpilih */}
      {selectedEdge ? (
        <EdgeStyleControls
          dashed={Boolean((selectedEdge.data as EdgeFlags)?.dashed)}
          optional={Boolean((selectedEdge.data as EdgeFlags)?.optional)}
          animated={Boolean((selectedEdge.data as EdgeFlags)?.animated)}
          sourceTitle={nodeTitle(selectedEdge.source)}
          targetTitle={nodeTitle(selectedEdge.target)}
          onToggle={(key) => toggleEdgeFlag(selectedEdge.id, key)}
          onDelete={() => deleteEdge(selectedEdge.id)}
        />
      ) : selectedNode ? (
        <NodeEditorCard
          node={{
            id: selectedNode.id,
            title: (selectedNode.data as { title: string }).title,
            emoji: (selectedNode.data as { emoji: string }).emoji,
            x: 0,
            y: 0,
            optional: (selectedNode.data as { optional?: boolean }).optional,
            article: (selectedNode.data as { article?: string }).article,
            submission: (selectedNode.data as { submission?: RoadmapNode["submission"] }).submission,
          }}
          index={nodes.findIndex((node) => node.id === selectedNode.id)}
          selected
          onChange={updateNode}
          onDelete={deleteNode}
        />
      ) : (
        <p className="rounded-card  p-4 text-center text-sm text-muted">
          Klik sebuah node untuk mengedit materi & submission-nya, atau klik koneksi untuk mengatur
          garis putus-putus / opsional / animasi.
        </p>
      )}

      {/* Aksi */}
      <div className="flex items-center justify-end gap-3">
        <span className="mr-auto text-sm text-neon">{notice}</span>
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
        >
          Reset ke default
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="cursor-pointer rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105 active:scale-95"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}

export default RoadmapFlowEditor;
