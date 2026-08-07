import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ACTIVE_COMMUNITY_QUERY_KEY,
  fetchActiveCommunities,
} from "../../services/activeCommunityService";
import ActiveCommunityContainer from "../components/ActiveCommunityContainer";

/**
 * ActiveCommunityPage — daftar komunitas beserta anggota yang sedang aktif.
 *
 * Page mengambil data presence (query) lalu meneruskannya ke container.
 * TIDAK ADA class Tailwind di sini.
 */

function ActiveCommunityPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ACTIVE_COMMUNITY_QUERY_KEY,
    queryFn: fetchActiveCommunities,
  });

  return (
    <ActiveCommunityContainer
      communities={data ?? []}
      isLoading={isLoading}
      isError={isError}
      onOpenCommunity={() => navigate("/community")}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default ActiveCommunityPage;
