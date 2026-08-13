import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MOD_REQUESTS_QUERY_KEY,
  fetchModRequests,
  toggleCloseRequest,
} from "@/features/faculty/services/facultyService";
import FacultyRequestsContainer from "../components/FacultyRequestsContainer";

/**
 * FacultyRequestsPage — dosen bisa menutup request "Cari Tim" supaya tak ada
 * lagi yang bisa bergabung. State closed dipersist ke backend. Page mengurus
 * data/query; container render. TIDAK ADA class Tailwind di sini.
 */

function FacultyRequestsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: MOD_REQUESTS_QUERY_KEY,
    queryFn: fetchModRequests,
  });

  const closeMutation = useMutation({
    mutationFn: toggleCloseRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MOD_REQUESTS_QUERY_KEY }),
  });

  return (
    <FacultyRequestsContainer
      requests={data?.requests ?? []}
      closedIds={data?.closedIds ?? []}
      isLoading={isLoading}
      isError={isError}
      onToggleClose={(id) => closeMutation.mutate(id)}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default FacultyRequestsPage;
