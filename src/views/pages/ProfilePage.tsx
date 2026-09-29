import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BADGES_QUERY_KEY,
  PROFILE_QUERY_KEY,
  fetchBadges,
  fetchProfile,
  updateProfile,
} from "@/features/profile/services/profileService";
import {
  GITHUB_QUERY_KEY,
  fetchGithubStats,
  disconnectGithub,
} from "@/features/profile/services/githubService";
import type { Profile } from "@/features/profile/types/profile";
import { reportError } from "@/shared/errors";
import { endSession } from "@/features/auth/utils/session";
import DevCardContainer from "../components/DevCardContainer";

/**
 * ProfilePage — Tahap 2 (Dev-Card).
 *
 * Menggabungkan 3 query (profil, github, badges) + aksi akun (hubungkan GitHub,
 * edit profil, logout). State interaksi ada di sini. TIDAK ADA class Tailwind.
 */

function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
  });
  const githubQuery = useQuery({
    queryKey: GITHUB_QUERY_KEY,
    queryFn: fetchGithubStats,
  });
  const badgesQuery = useQuery({
    queryKey: BADGES_QUERY_KEY,
    queryFn: fetchBadges,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // GitHub connected state comes from the real profile API, not localStorage.
  const githubConnected = profileQuery.data?.githubConnected ?? false;

  const disconnectMutation = useMutation({
    mutationFn: () => disconnectGithub(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: GITHUB_QUERY_KEY });
    },
  });

  // Tidak ada aksi "connect GitHub": backend butuh username GitHub dan tidak ada
  // alur OAuth di produk, jadi tombolnya disembunyikan. Yang tersisa hanya
  // memutus sambungan untuk akun yang datanya sudah ada.
  const handleDisconnectGithub = () => void disconnectMutation.mutate();

  const handleSaveProfile = (patch: Partial<Profile>) => {
    // Modal hanya ditutup kalau penyimpanan berhasil. Menutup saat gagal
    // membuat user mengira perubahannya tersimpan padahal tidak.
    setSaveError(null);
    void updateProfile(patch)
      .then(() => {
        void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        setIsEditOpen(false);
      })
      .catch((error) => {
        reportError("updateProfile", error);
        setSaveError("Gagal menyimpan profil. Coba lagi.");
      });
  };

  const handleLogout = () => {
    // endSession() menghapus JWT + akun + preferensi, lalu emit "auth-expired"
    // yang ditangani App.tsx untuk redirect ke /login. Wajib clearToken():
    // hanya clearAccount() menyisakan token valid yang tetap lolos guard.
    queryClient.clear();
    endSession();
    void navigate("/login", { replace: true });
  };

  return (
    <DevCardContainer
      profile={profileQuery.data ?? null}
      github={githubQuery.data ?? null}
      badges={badgesQuery.data ?? []}
      githubConnected={githubConnected}
      githubUsername={githubQuery.data?.username ?? profileQuery.data?.username ?? ""}
      isEditOpen={isEditOpen}
      saveError={saveError}
      isProfileLoading={profileQuery.isLoading}
      isGithubLoading={githubQuery.isLoading}
      isGithubError={githubQuery.isError}
      isBadgesLoading={badgesQuery.isLoading}
      isError={profileQuery.isError}
      onDisconnectGithub={handleDisconnectGithub}
      onOpenEdit={() => {
        setSaveError(null);
        setIsEditOpen(true);
      }}
      onCloseEdit={() => setIsEditOpen(false)}
      onSaveProfile={handleSaveProfile}
      onLogout={handleLogout}
      onRetry={() => {
        void profileQuery.refetch();
        void githubQuery.refetch();
        void badgesQuery.refetch();
      }}
    />
  );
}

export default ProfilePage;
