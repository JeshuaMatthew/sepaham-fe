import type { AuthCredentials, AuthMode, AuthProvider } from "../../types/auth";
import type { AccountRole } from "../../utils/account";
import AuthCard from "./AuthCard";
import AuthCardSkeleton from "./AuthCardSkeleton";

interface AuthContainerProps {
  mode: AuthMode;
  role: AccountRole;
  values: AuthCredentials;
  providers: AuthProvider[];
  isLoadingProviders: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onModeChange: (mode: AuthMode) => void;
  onRoleChange: (role: AccountRole) => void;
  onFieldChange: (field: keyof AuthCredentials, value: string) => void;
  onSubmit: () => void;
  onSso: (providerId: string) => void;
}

function AuthContainer({
  mode,
  role,
  values,
  providers,
  isLoadingProviders,
  isSubmitting,
  errorMessage,
  onModeChange,
  onRoleChange,
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
          role={role}
          values={values}
          providers={providers}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onModeChange={onModeChange}
          onRoleChange={onRoleChange}
          onFieldChange={onFieldChange}
          onSubmit={onSubmit}
          onSso={onSso}
        />
      )}
    </div>
  );
}

export default AuthContainer;
