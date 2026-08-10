import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MOD_SERVERS_QUERY_KEY,
  fetchModServers,
  toggleBanServer,
} from "../../services/facultyService";
import FacultyGroupsContainer from "../components/FacultyGroupsContainer";

/**
 * FacultyGroupsPage — dosen memoderasi grup (chat/call): bisa mem-ban, TAPI
 * tidak bisa membaca isinya. State ban dipersist ke backend. Page mengurus
 * data/query; container render. TIDAK ADA class Tailwind di sini.
 */

function FacultyGroupsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: MOD_SERVERS_QUERY_KEY,
    queryFn: fetchModServers,
  });

  const banMutation = useMutation({
    mutationFn: toggleBanServer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MOD_SERVERS_QUERY_KEY }),
  });

  return (
    <FacultyGroupsContainer
      groups={data?.servers ?? []}
      bannedIds={data?.bannedIds ?? []}
      isLoading={isLoading}
      isError={isError}
      onToggleBan={(id) => banMutation.mutate(id)}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default FacultyGroupsPage;
