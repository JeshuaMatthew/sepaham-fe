import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  COLLAB_QUERY_KEY,
  MY_TEAMS_QUERY_KEY,
  createCollabRequest,
  fetchCollabRequests,
} from "../../services/collabService";
import {
  MY_COMMUNITIES_QUERY_KEY,
  fetchMyCommunities,
} from "../../services/communityService";
import type { CollabRequest, NewCollabInput } from "../../types/collab";
import CollabContainer from "../components/CollabContainer";

/**
 * CollabPage — "Cari Tim": request mengajak user lain bikin aplikasi bareng.
 *
 * Data dari backend Axum (list + create). Tombol "Gabung via DM" mengarahkan ke
 * chat untuk DM langsung dengan penulis. TIDAK ADA class Tailwind di sini.
 */

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CollabPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: COLLAB_QUERY_KEY,
    queryFn: fetchCollabRequests,
  });
  const communitiesQuery = useQuery({
    queryKey: MY_COMMUNITIES_QUERY_KEY,
    queryFn: fetchMyCommunities,
  });

  const [roleFilter, setRoleFilter] = useState("semua");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Komunitas yang bisa dipilih di modal = komunitas milik user (tim).
  const communities = useMemo(
    () =>
      (communitiesQuery.data ?? []).map((item) => ({
        id: item.server.id,
        name: item.server.name,
      })),
    [communitiesQuery.data],
  );

  const allRequests = data ?? [];

  // Semua tag role unik untuk opsi filter.
  const availableRoles = Array.from(
    new Set(allRequests.flatMap((request) => request.neededRoles)),
  );

  const requests =
    roleFilter === "semua"
      ? allRequests
      : allRequests.filter((request) => request.neededRoles.includes(roleFilter));

  const createMutation = useMutation({
    mutationFn: (input: NewCollabInput) => createCollabRequest(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COLLAB_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: MY_TEAMS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: MY_COMMUNITIES_QUERY_KEY });
      setIsCreateOpen(false);
      void navigate("/partner/teams");
    },
  });

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

  return (
    <CollabContainer
      requests={requests}
      availableRoles={availableRoles}
      roleFilter={roleFilter}
      communities={communities}
      isCreateOpen={isCreateOpen}
      isLoading={isLoading}
      isError={isError}
      onRoleFilterChange={setRoleFilter}
      onContact={handleContact}
      onOpenCreate={() => setIsCreateOpen(true)}
      onCloseCreate={() => setIsCreateOpen(false)}
      onCreate={(input) => createMutation.mutate(input)}
      onGoMyTeams={() => navigate("/partner/teams")}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default CollabPage;
