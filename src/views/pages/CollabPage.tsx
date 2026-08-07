import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { COLLAB_QUERY_KEY, fetchCollabRequests } from "../../services/collabService";
import { PROFILE_QUERY_KEY, fetchProfile } from "../../services/profileService";
import type { CollabRequest, NewCollabInput } from "../../types/collab";
import { addStoredCommunity } from "../../utils/communityStore";
import CollabContainer from "../components/CollabContainer";

/**
 * CollabPage — "Cari Tim": request mengajak user lain bikin aplikasi bareng.
 *
 * Page mengurus data (query) + state: filter tag role, modal buat request,
 * dan request baru (overlay lokal). Tombol "Gabung via DM" mengarahkan ke
 * chat untuk DM langsung dengan penulis. TIDAK ADA class Tailwind di sini.
 */

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const COMMUNITY_COLORS = ["#e5e5e5"];

/** Inisial 2 huruf untuk badge komunitas. */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase() || "TM";
}

function colorFor(seed: string): string {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COMMUNITY_COLORS[hash % COMMUNITY_COLORS.length];
}

function CollabPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: COLLAB_QUERY_KEY,
    queryFn: fetchCollabRequests,
  });
  const profileQuery = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: fetchProfile });

  const [roleFilter, setRoleFilter] = useState("semua");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [created, setCreated] = useState<CollabRequest[]>([]);

  const allRequests = [...created, ...(data ?? [])];

  // Semua tag role unik untuk opsi filter.
  const availableRoles = Array.from(
    new Set(allRequests.flatMap((request) => request.neededRoles)),
  );

  const requests =
    roleFilter === "semua"
      ? allRequests
      : allRequests.filter((request) => request.neededRoles.includes(roleFilter));

  const handleContact = (request: CollabRequest) => {
    // Integrasi DM: buka chat 1-on-1 dengan penulis request.
    void navigate("/community", {
      state: {
        dmWith: {
          userId: slug(request.author.name),
          userName: request.author.name,
          avatar: request.author.avatar,
          role: request.author.role,
        },
      },
    });
  };

  const handleCreate = (input: NewCollabInput) => {
    const roles = input.neededRoles
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);

    const request: CollabRequest = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description || "Belum ada deskripsi.",
      neededRoles: roles.length > 0 ? roles : ["Umum"],
      techStack: [],
      tags: ["Baru"],
      repoUrl: input.repoUrl.trim() || undefined,
      author: {
        name: profileQuery.data?.name ?? "Kamu",
        avatar: profileQuery.data?.avatarUrl ?? "https://i.pravatar.cc/64?img=13",
        role: profileQuery.data?.role ?? "-",
      },
      membersCurrent: 1,
      membersNeeded: Math.max(input.membersNeeded, 2),
      interested: 0,
      status: "open",
      postedMinutesAgo: 0,
    };
    setCreated((prev) => [request, ...prev]);

    // Buatkan komunitasnya di halaman Komunitas (chat) untuk tim ini.
    const serverId = `tim-${request.id.slice(0, 8)}`;
    addStoredCommunity({
      server: {
        id: serverId,
        name: request.title,
        initial: initialsOf(request.title),
        color: colorFor(serverId),
      },
      channels: [
        {
          id: `${serverId}-general`,
          serverId,
          name: "general",
          topic: `Diskusi tim: ${request.title}`,
          kind: "text",
        },
        {
          id: `${serverId}-progress`,
          serverId,
          name: "progress",
          topic: "Update progres & to-do proyek",
          kind: "text",
        },
      ],
    });

    setIsCreateOpen(false);
    void navigate("/community");
  };

  return (
    <CollabContainer
      requests={requests}
      availableRoles={availableRoles}
      roleFilter={roleFilter}
      isCreateOpen={isCreateOpen}
      isLoading={isLoading}
      isError={isError}
      onRoleFilterChange={setRoleFilter}
      onContact={handleContact}
      onOpenCreate={() => setIsCreateOpen(true)}
      onCloseCreate={() => setIsCreateOpen(false)}
      onCreate={handleCreate}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default CollabPage;
