import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AUTH_PROVIDERS_QUERY_KEY,
  fetchAuthProviders,
  submitAuth,
} from "@/features/auth/services/authService";
import type { AuthCredentials, AuthMode } from "@/features/auth/types/auth";
import type { AccountRole } from "@/features/auth/utils/account";
import { saveAccount } from "@/features/auth/utils/account";
import AuthContainer from "@/features/auth/components/AuthContainer";
import PageTransition from "@/components/animations/PageTransition";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode = (location.state as { mode?: AuthMode } | null)?.mode ?? "login";

  const { data: providers, isLoading } = useQuery({
    queryKey: AUTH_PROVIDERS_QUERY_KEY,
    queryFn: fetchAuthProviders,
  });

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<AccountRole>("student");
  const [values, setValues] = useState<AuthCredentials>({ email: "", password: "" });

  const goToApp = (accountRole: AccountRole) => {
    void navigate(accountRole === "faculty" ? "/faculty" : "/onboarding");
  };

  const enterAppMock = () => {
    saveAccount({ role, name: role === "faculty" ? "Dosen" : "Mahasiswa" });
    goToApp(role);
  };

  const mutation = useMutation({
    mutationFn: () => submitAuth(mode, values, role),
    onSuccess: (session) => goToApp(session.role),
  });

  const handleFieldChange = (field: keyof AuthCredentials, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleModeChange = (next: AuthMode) => {
    setMode(next);
    mutation.reset();
  };

  const handleSso = (providerId: string) => {
    console.log("sso login", providerId);
    enterAppMock();
  };

  return (
    <PageTransition className="h-full">
      <AuthContainer
        mode={mode}
        role={role}
        values={values}
        providers={providers ?? []}
        isLoadingProviders={isLoading}
        isSubmitting={mutation.isPending}
        errorMessage={mutation.error?.message ?? null}
        onModeChange={handleModeChange}
        onRoleChange={setRole}
        onFieldChange={handleFieldChange}
        onSubmit={() => mutation.mutate()}
        onSso={handleSso}
      />
    </PageTransition>
  );
}

export default AuthPage;
