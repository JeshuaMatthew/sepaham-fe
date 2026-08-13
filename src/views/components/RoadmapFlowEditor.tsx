import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  NodeToolbar,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import type { Connection, Edge, Node, OnNodesChange } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Roadmap, RoadmapEdge, RoadmapNode, RoadmapStyle } from "@/features/roadmap/types/roadmap";
import { fromFlowPosition, toFlowPosition } from "@/features/roadmap/utils/roadmapGraph";
import { computeGroupBoxes } from "@/features/roadmap/utils/flowGroups";
import { ROLE_OPTIONS } from "@/features/onboarding/utils/roleOptions";
import RoadmapFlowNode from "./RoadmapFlowNode";
import GroupBoxNode from "./GroupBoxNode";
import NodeAppearancePopup from "./NodeAppearancePopup";
import GroupPopup from "./GroupPopup";
import EdgeStyleControls from "./EdgeStyleControls";
import RoadmapStyleControls from "./RoadmapStyleControls";

interface RoadmapFlowEditorProps {
  initialRoadmap: Roadmap;
  notice: string | null;
  onSave: (roadmap: Roadmap) => void;
  onReset: () => void;
  /** buka halaman edit materi/markdown untuk sebuah node. */
  onOpenNodePage: (nodeId: string) => void;
}

interface EdgeFlags {
  dashed?: boolean;
  optional?: boolean;
  animated?: boolean;
}

/** Snap grid (px) untuk penempatan node — dipakai juga untuk garis background
 *  agar ukuran grid latar sama persis dengan grid snap node. */
const SNAP = 50;
/** Jarak minimum antar node & antar bounding-box grup (px). */
const NODE_GAP = 4;
const GROUP_GAP = 76;

const nodeTypes = { roadmapNode: RoadmapFlowNode, groupBox: GroupBoxNode };

/** Terapkan tampilan edge dari flag domain-nya (dashed/optional/animated). */
function applyEdgeStyle(edge: Edge): Edge {
  const flags = (edge.data ?? {}) as EdgeFlags;
  const dashed = flags.dashed || flags.optional;
  return {
    ...edge,
    animated: Boolean(flags.animated),
    label: flags.optional ? "opsional" : undefined,
    style: {
      stroke: "var(--rf-edge, var(--color-line))",
      strokeWidth: 2,
      strokeDasharray: dashed ? "6 4" : undefined,
    },
    labelStyle: { fill: "var(--color-muted)", fontSize: 10, fontWeight: 600 },
    labelBgStyle: { fill: "var(--color-surface)" },
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 6,
  };
}

function nodeGroupOf(node: Node): string {
  return (node.data as { group?: string }).group?.trim() ?? "";
}

/** Ukuran terukur node (fallback perkiraan bila belum terukur). */
function nodeSize(node: Node): { w: number; h: number } {
  return { w: node.measured?.width ?? 112, h: node.measured?.height ?? 100 };
}

function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  gap: number,
): boolean {
  return ax < bx + bw + gap && ax + aw + gap > bx && ay < by + bh + gap && ay + ah + gap > by;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Bounding-box (px) sebuah grup; abaikan node `exceptId`, opsional tambah `cand`. */
function groupBox(nodes: Node[], group: string, exceptId: string, cand?: Box): Box | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let found = false;
  const acc = (x: number, y: number, w: number, h: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
    found = true;
  };
  for (const node of nodes) {
    if (node.id === exceptId) continue;
    if (nodeGroupOf(node) !== group) continue;
    const s = nodeSize(node);
    acc(node.position.x, node.position.y, s.w, s.h);
  }
  if (cand) acc(cand.x, cand.y, cand.w, cand.h);
  return found ? { x: minX, y: minY, w: maxX - minX, h: maxY - minY } : null;
}

/** Posisi valid: node tak menabrak node lain & grupnya tak overlap grup lain. */
function isPosValid(x: number, y: number, dragged: Node, nodes: Node[]): boolean {
  const ds = nodeSize(dragged);
  for (const node of nodes) {
    if (node.id === dragged.id) continue;
    const s = nodeSize(node);
    if (rectsOverlap(x, y, ds.w, ds.h, node.position.x, node.position.y, s.w, s.h, NODE_GAP)) {
      return false;
    }
  }
  const group = nodeGroupOf(dragged);
  if (!group) return true;
  const mine = groupBox(nodes, group, dragged.id, { x, y, w: ds.w, h: ds.h });
  if (!mine) return true;
  const others = new Set(
    nodes
      .filter((node) => node.id !== dragged.id)
      .map(nodeGroupOf)
      .filter((g) => g && g !== group),
  );
  for (const g of others) {
    const gb = groupBox(nodes, g, dragged.id);
    if (gb && rectsOverlap(mine.x, mine.y, mine.w, mine.h, gb.x, gb.y, gb.w, gb.h, GROUP_GAP)) {
      return false;
    }
  }
  return true;
}

/** Posisi valid terdekat (spiral pada langkah SNAP). */
function nearestValidPos(
  x: number,
  y: number,
  dragged: Node,
  nodes: Node[],
): { x: number; y: number } {
  if (isPosValid(x, y, dragged, nodes)) return { x, y };
  for (let radius = 1; radius < 60; radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
        const cx = x + dx * SNAP;
        const cy = y + dy * SNAP;
        if (cx < 0 || cy < 0) continue;
        if (isPosValid(cx, cy, dragged, nodes)) return { x: cx, y: cy };
      }
    }
  }
  return { x, y };
}

/** Posisi kosong pertama untuk node baru (scan berjarak agar tak menumpuk). */
function findFreePos(nodes: Node[]): { x: number; y: number } {
  const size = { w: 112, h: 100 };
  for (let row = 0; row < 40; row++) {
    for (let col = 0; col < 24; col++) {
      const x = col * (SNAP * 2);
      const y = row * (SNAP * 2);
      const clash = nodes.some((node) => {
        const s = nodeSize(node);
        return rectsOverlap(x, y, size.w, size.h, node.position.x, node.position.y, s.w, s.h, NODE_GAP);
      });
      if (!clash) return { x, y };
    }
  }
  return { x: 0, y: 0 };
}

function RoadmapFlowEditor({
  initialRoadmap,
  notice,
  onSave,
  onReset,
  onOpenNodePage,
}: RoadmapFlowEditorProps) {
  const [title, setTitle] = useState(initialRoadmap.title);
  const emoji = initialRoadmap.emoji;
  const [roleId, setRoleId] = useState(initialRoadmap.roleId);
  const [style, setStyle] = useState<RoadmapStyle>(initialRoadmap.style ?? {});

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    initialRoadmap.nodes.map((node) => ({
      id: node.id,
      type: "roadmapNode",
      position: toFlowPosition(node.x, node.y),
      zIndex: 1,
      data: {
        title: node.title,
        emoji: node.emoji,
        status: "available",
        group: node.group,
        image: node.image,
        titleInside: node.titleInside,
        alwaysUnlocked: node.alwaysUnlocked,
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
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  // Node yang sedang di-drag ke posisi yang akan overlap (untuk warning).
  const [warningNodeId, setWarningNodeId] = useState<string | null>(null);
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;


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
        position: findFreePos(nds),
        zIndex: 1,
        data: {
          title: "Skill Baru",
          emoji: "",
          status: "available",
          group: "",
          image: "",
          titleInside: false,
          alwaysUnlocked: false,
          optional: false,
          article: "",
          submission: { type: "checkmark" },
        },
      },
    ]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
    setSelectedGroup(null);
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

  // Saat drag: tandai warning kalau posisi sekarang akan overlap node/grup lain.
  const onNodeDrag = useCallback((_event: MouseEvent | TouchEvent, dragged: Node) => {
    if (dragged.type === "groupBox") return;
    const valid = isPosValid(dragged.position.x, dragged.position.y, dragged, nodesRef.current);
    setWarningNodeId((prev) => {
      const next = valid ? null : dragged.id;
      return prev === next ? prev : next;
    });
  }, []);

  // Cegah overlap node & overlap antar-grup: dorong node ke posisi valid terdekat.
  const onNodeDragStop = useCallback(
    (_event: MouseEvent | TouchEvent, dragged: Node) => {
      setWarningNodeId(null);
      if (dragged.type === "groupBox") return;
      setNodes((nds) => {
        const target = nearestValidPos(dragged.position.x, dragged.position.y, dragged, nds);
        if (target.x === dragged.position.x && target.y === dragged.position.y) return nds;
        return nds.map((node) =>
          node.id === dragged.id ? { ...node, position: target } : node,
        );
      });
    },
    [setNodes],
  );

  const nodeGroup = (node: Node) => (node.data as { group?: string }).group?.trim() ?? "";

  const renameGroup = (oldName: string, newName: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        nodeGroup(node) === oldName ? { ...node, data: { ...node.data, group: newName } } : node,
      ),
    );
    setSelectedGroup(newName);
  };

  const ungroup = (name: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        nodeGroup(node) === name ? { ...node, data: { ...node.data, group: "" } } : node,
      ),
    );
    setSelectedGroup(null);
  };

  const handleSave = () => {
    const outNodes: RoadmapNode[] = nodes.map((node) => {
      const pos = fromFlowPosition(node.position.x, node.position.y);
      const data = node.data as {
        title: string;
        emoji: string;
        group?: string;
        image?: string;
        titleInside?: boolean;
        alwaysUnlocked?: boolean;
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
        group: data.group?.trim() || undefined,
        image: data.image || undefined,
        titleInside: data.titleInside || undefined,
        alwaysUnlocked: data.alwaysUnlocked || undefined,
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
    onSave({ id: initialRoadmap.id, roleId, title, emoji, style, nodes: outNodes, edges: outEdges });
  };

  // Simpan dulu (agar layout & appearance ter-persist), lalu buka halaman materi.
  const handleEditPage = (nodeId: string) => {
    handleSave();
    onOpenNodePage(nodeId);
  };

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId) ?? null;
  const nodeTitle = (id: string) =>
    (nodes.find((node) => node.id === id)?.data as { title?: string })?.title ?? id;

  // Suntikkan styling roadmap + flag warning ke tiap node.
  const styledNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: { ...node.data, style, warning: node.id === warningNodeId },
      })),
    [nodes, style, warningNodeId],
  );

  // Kotak grup (backdrop) diturunkan dari node; digambar di belakang node skill.
  const groupBoxes = useMemo(() => computeGroupBoxes(styledNodes, style), [styledNodes, style]);
  const displayNodes = useMemo(() => [...groupBoxes, ...styledNodes], [groupBoxes, styledNodes]);

  // Nama grup yang sudah ada (untuk autocomplete di popup node).
  const groupNames = useMemo(() => {
    const set = new Set<string>();
    for (const node of nodes) {
      const name = nodeGroup(node);
      if (name) set.add(name);
    }
    return [...set];
  }, [nodes]);

  const groupMemberCount = selectedGroup
    ? nodes.filter((node) => nodeGroup(node) === selectedGroup).length
    : 0;

  // Abaikan perubahan yang menyasar kotak grup (derived, non-interaktif).
  const handleNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      onNodesChange(
        changes.filter((change) => !("id" in change) || !change.id.startsWith("grp-")),
      );
    },
    [onNodesChange],
  );

  const selectedNodeForPopup: RoadmapNode | null = selectedNode
    ? {
        id: selectedNode.id,
        x: 0,
        y: 0,
        title: (selectedNode.data as { title: string }).title,
        emoji: (selectedNode.data as { emoji: string }).emoji,
        group: (selectedNode.data as { group?: string }).group,
        image: (selectedNode.data as { image?: string }).image,
        titleInside: (selectedNode.data as { titleInside?: boolean }).titleInside,
        alwaysUnlocked: (selectedNode.data as { alwaysUnlocked?: boolean }).alwaysUnlocked,
        optional: (selectedNode.data as { optional?: boolean }).optional,
      }
    : null;

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
          Node di-snap ke grid (tak menumpuk) ·{" "}
          <span className="text-ink">
            tarik dari titik biru di bawah node ke node lain untuk menghubungkan
          </span>{" "}
          · klik node/label grup untuk edit tampilan lewat popup · Grup opsional · pilih koneksi
          lalu tekan Delete untuk menghapus.
        </span>
      </div>

      {/* Styling roadmap (node & vertex) */}
      <RoadmapStyleControls style={style} onChange={setStyle} />

      {/* Kanvas React Flow */}
      <div
        className="h-[720px] w-full overflow-hidden rounded-card border border-line bg-canvas"
        style={{ "--rf-edge": style.edgeColor ?? "var(--color-line)" } as CSSProperties}
      >
        <ReactFlow
          nodes={displayNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          snapToGrid
          snapGrid={[SNAP, SNAP]}
          onNodeClick={(event, node) => {
            if (node.type === "groupBox") {
              // Popup grup hanya terbuka bila NAMA grup yang diklik, bukan area/border.
              const onLabel = (event.target as HTMLElement).closest("[data-group-label]");
              setSelectedNodeId(null);
              setSelectedEdgeId(null);
              setSelectedGroup(onLabel ? ((node.data as { label?: string }).label ?? null) : null);
            } else {
              setSelectedNodeId(node.id);
              setSelectedGroup(null);
              setSelectedEdgeId(null);
            }
          }}
          onEdgeClick={(_event, edge) => {
            setSelectedEdgeId(edge.id);
            setSelectedNodeId(null);
            setSelectedGroup(null);
          }}
          onPaneClick={() => {
            setSelectedEdgeId(null);
            setSelectedNodeId(null);
            setSelectedGroup(null);
          }}
          deleteKeyCode={["Delete"]}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Lines} color="var(--color-line)" gap={SNAP} />
          <Controls showInteractive={false} />

          {/* Popup edit tampilan node — muncul di samping node */}
          {selectedNodeForPopup ? (
            <NodeToolbar nodeId={selectedNodeForPopup.id} isVisible position={Position.Right} offset={14}>
              <NodeAppearancePopup
                node={selectedNodeForPopup}
                groups={groupNames}
                onChange={updateNode}
                onDelete={deleteNode}
                onEditPage={handleEditPage}
              />
            </NodeToolbar>
          ) : null}

          {/* Popup edit grup — muncul di samping grup */}
          {selectedGroup ? (
            <NodeToolbar nodeId={`grp-${selectedGroup}`} isVisible position={Position.Top} offset={14}>
              <GroupPopup
                name={selectedGroup}
                memberCount={groupMemberCount}
                onRename={renameGroup}
                onUngroup={ungroup}
              />
            </NodeToolbar>
          ) : null}
        </ReactFlow>
      </div>

      {/* Panel edge terpilih (node & grup pakai popup di kanvas) */}
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
      ) : (
        <p className="rounded-card p-4 text-center text-sm text-muted">
          Klik sebuah node untuk mengatur tampilannya (popup), klik label grup untuk mengedit grup,
          atau klik koneksi untuk mengatur garis putus-putus / opsional / animasi.
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
