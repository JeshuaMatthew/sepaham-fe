import type { Node } from "@xyflow/react";
import type { RoadmapStyle } from "../types/roadmap";

/**
 * Grouping node roadmap: node dengan `data.group` yang sama dibungkus dalam satu
 * "area" (node tipe `groupBox`) yang digambar di belakang node anggotanya.
 * Kotak dihitung dari bounding-box posisi anggota (pakai ukuran terukur bila ada).
 */

/** Perkiraan ukuran node kalau belum terukur React Flow. */
const NODE_W = 112;
const NODE_H = 104;
/** Padding kotak grup di sekeliling anggota + ruang untuk label di atas. */
const GROUP_PAD = 26;
const GROUP_LABEL_H = 20;

/** Bangun node `groupBox` (backdrop) untuk tiap grup dari node-node skill. */
export function computeGroupBoxes(nodes: Node[], style?: RoadmapStyle): Node[] {
  const groups = new Map<string, Node[]>();
  for (const node of nodes) {
    const raw = (node.data as { group?: unknown }).group;
    const name = typeof raw === "string" ? raw.trim() : "";
    if (!name) continue;
    const members = groups.get(name) ?? [];
    members.push(node);
    groups.set(name, members);
  }

  const boxes: Node[] = [];
  for (const [name, members] of groups) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const member of members) {
      const width = member.measured?.width ?? NODE_W;
      const height = member.measured?.height ?? NODE_H;
      minX = Math.min(minX, member.position.x);
      minY = Math.min(minY, member.position.y);
      maxX = Math.max(maxX, member.position.x + width);
      maxY = Math.max(maxY, member.position.y + height);
    }
    const width = maxX - minX + GROUP_PAD * 2;
    const height = maxY - minY + GROUP_PAD * 2 + GROUP_LABEL_H;
    boxes.push({
      id: `grp-${name}`,
      type: "groupBox",
      position: { x: minX - GROUP_PAD, y: minY - GROUP_PAD - GROUP_LABEL_H },
      data: { label: name, style },
      width,
      height,
      // React Flow menyembunyikan node sampai "measured"; kotak ini derived &
      // tidak pernah terukur lewat onNodesChange, jadi set measured manual.
      measured: { width, height },
      style: { width, height },
      // selectable=true supaya wrapper interaktif & onNodeClick jalan (buka popup).
      draggable: false,
      selectable: true,
      connectable: false,
      deletable: false,
      focusable: false,
      zIndex: 0,
    });
  }
  return boxes;
}
