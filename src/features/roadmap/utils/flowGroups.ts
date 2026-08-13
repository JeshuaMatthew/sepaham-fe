import type { Node } from "@xyflow/react";
import type { RoadmapStyle } from "@/features/roadmap/types/roadmap";

/**
 * Grouping node roadmap: node dengan `data.group` yang sama dibungkus dalam
 * satu "area" (node tipe `groupBox`) yang digambar di belakang node anggotanya.
 */

const NODE_W = 112;
const NODE_H = 104;
const GROUP_PAD = 26;
const GROUP_LABEL_H = 20;

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
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
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
      measured: { width, height },
      style: { width, height },
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
