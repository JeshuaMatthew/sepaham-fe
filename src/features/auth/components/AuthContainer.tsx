import type { AuthCredentials, AuthMode, AuthProvider } from "@/features/auth/types/auth";
import AuthCard from "@/features/auth/components/AuthCard";
import AuthCardSkeleton from "@/features/auth/components/AuthCardSkeleton";

interface AuthContainerProps {
  mode: AuthMode;
  values: AuthCredentials;
  providers: AuthProvider[];
  isLoadingProviders: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onModeChange: (mode: AuthMode) => void;
  onFieldChange: (field: keyof AuthCredentials, value: string) => void;
  onSubmit: () => void;
  onSso: (providerId: string) => void;
}

function AuthContainer({
  mode,
  values,
  providers,
  isLoadingProviders,
  isSubmitting,
  errorMessage,
  onModeChange,
  onFieldChange,
  onSubmit,
  onSso,
}: AuthContainerProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6 py-12">
      {isLoadingProviders ? (
        <AuthCardSkeleton />
      ) : (
        <AuthCard
          mode={mode}
          values={values}
          providers={providers}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onModeChange={onModeChange}
          onFieldChange={onFieldChange}
          onSubmit={onSubmit}
          onSso={onSso}
        />
      )}
    </div>
  );
}

export default AuthContainer;
