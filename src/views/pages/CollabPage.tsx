import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  COLLAB_QUERY_KEY,
  MY_TEAMS_QUERY_KEY,
  createCollabRequest,
  fetchCollabRequests,
} from "@/features/collab/services/collabService";
import {
  MY_COMMUNITIES_QUERY_KEY,
  fetchMyCommunities,
  openDm,
} from "@/features/chat/services/communityService";
import type { CollabRequest, NewCollabInput } from "@/features/collab/types/collab";
import CollabContainer from "../components/CollabContainer";

/**
 * CollabPage — "Cari Tim": request mengajak user lain bikin aplikasi bareng.
 *
 * Data dari backend (list + create). Tombol "Gabung via DM" membuka DM
 * sungguhan lewat `POST /api/dms` lalu navigasi ke chat. TIDAK ADA class
 * Tailwind di sini.
 */

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
  const [contactError, setContactError] = useState<string | null>(null);

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

  // Buka DM dengan penulis request.
  //
  // Sebelumnya userId dibuat dari slug NAMA penulis lalu halamannya membuat
  // percakapan palsu di browser. Sekarang id diambil dari `author.id` milik
  // server, dan percakapan benar-benar dibuat lewat API. Kalau `author.id`
  // kosong (request lama yang penulisnya sudah tidak ada di database),
  // percakapan tidak bisa dibuat dan itu harus detto, bukan ditebak.
  const contactMutation = useMutation({
    mutationFn: (request: CollabRequest) => {
      if (!request.author.id) {
        return Promise.reject(new Error("AUTHOR_ID_MISSING"));
      }
      return openDm(request.author.id);
    },
    onSuccess: (dm) => {
      setContactError(null);
      void navigate("/community", {
        state: {
          dmWith: {
            userId: dm.userId,
            userName: dm.userName,
            avatar: dm.avatar,
            role: dm.role,
          },
        },
      });
    },
    onError: (error) => {
      setContactError(
        error instanceof Error && error.message === "AUTHOR_ID_MISSING"
          ? "Penulis request ini tidak punya akun, jadi DM tidak bisa dibuka."
          : "Gagal membuka DM. Coba lagi.",
      );
    },
  });

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
      onContact={(request) => contactMutation.mutate(request)}
      contactError={contactError}
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
