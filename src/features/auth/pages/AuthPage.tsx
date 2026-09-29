import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import {
  AUTH_PROVIDERS_QUERY_KEY,
  fetchAuthProviders,
  submitAuth,
  submitGoogleAuth,
} from "@/features/auth/services/authService";
import type { AuthCredentials, AuthMode } from "@/features/auth/types/auth";
import type { AccountRole } from "@/features/auth/utils/account";
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
  const [values, setValues] = useState<AuthCredentials>({ email: "", password: "" });

  // Tidak ada pilihan peran di form. Server yang menentukan peran dari akun
  // yang dibuat, dan pendaftaran baru selalu menghasilkan akun mahasiswa.
  // Tab "Sign in as Faculty" yang pernah ada di sini hanya mengirim
  // `role: "faculty"` ke API yang sekarang mengabaikannya, jadi menampilkan
  // pilihan itu hanya menjanjikan sesuatu yang tidak terjadi.
  const goToApp = (accountRole: AccountRole) => {
    void navigate(accountRole === "faculty" ? "/faculty" : "/home");
  };

  const mutation = useMutation({
    mutationFn: () => submitAuth(mode, values),
    onSuccess: (session) => goToApp(session.role),
  });

  const googleMutation = useMutation({
    mutationFn: (accessToken: string) => submitGoogleAuth(accessToken),
    onSuccess: (session) => goToApp(session.role),
  });

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // `useGoogleLogin` mengembalikan OAuth ACCESS token, bukan ID token JWT.
      // Kirim ke field `access_token`; backend menukaranya ke endpoint
      // userinfo Google untuk memverifikasi identitas.
      googleMutation.mutate(tokenResponse.access_token);
    },
    onError: () => {
      // diamkan — user membatalkan atau popup diblokir
    },
  });

  const handleFieldChange = (field: keyof AuthCredentials, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleModeChange = (next: AuthMode) => {
    setMode(next);
    mutation.reset();
  };

  const handleSso = (providerId: string) => {
    // Hanya Google yang didukung — satu-satunya provider di PROVIDERS yang
    // punya implementasi OAuth (kredensial + package `@react-oauth/google`).
    if (providerId === "google") {
      googleLogin();
    }
  };

  return (
    <PageTransition className="h-full">
      <AuthContainer
        mode={mode}
        values={values}
        providers={providers ?? []}
        isLoadingProviders={isLoading}
        isSubmitting={mutation.isPending || googleMutation.isPending}
        errorMessage={mutation.error?.message ?? googleMutation.error?.message ?? null}
        onModeChange={handleModeChange}
        onFieldChange={handleFieldChange}
        onSubmit={() => mutation.mutate()}
        onSso={handleSso}
      />
    </PageTransition>
  );
}

export default AuthPage;
