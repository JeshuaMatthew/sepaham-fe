import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
} from "@/features/profile/services/githubService";
import type { Profile } from "@/features/profile/types/profile";
import { clearAccount } from "@/features/auth/utils/account";
import { isGithubConnected, setGithubConnected } from "@/features/profile/utils/githubConnection";
import { connectGithub } from "@/features/profile/services/githubService";
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
  const [githubConnected, setConnected] = useState(() => isGithubConnected());

  const handleConnectGithub = () => {
    setGithubConnected(true);
    setConnected(true);
    void connectGithub().catch(() => {});
  };

  const handleDisconnectGithub = () => {
    setGithubConnected(false);
    setConnected(false);
  };

  const handleSaveProfile = (patch: Partial<Profile>) => {
    void updateProfile(patch)
      .then(() => queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }))
      .catch(() => {});
    setIsEditOpen(false);
  };

  const handleLogout = () => {
    clearAccount();
    void navigate("/login");
  };

  return (
    <DevCardContainer
      profile={profileQuery.data ?? null}
      github={githubQuery.data ?? null}
      badges={badgesQuery.data ?? []}
      githubConnected={githubConnected}
      githubUsername={githubQuery.data?.username ?? profileQuery.data?.username ?? ""}
      isEditOpen={isEditOpen}
      isProfileLoading={profileQuery.isLoading}
      isGithubLoading={githubQuery.isLoading}
      isBadgesLoading={badgesQuery.isLoading}
      isError={profileQuery.isError}
      onConnectGithub={handleConnectGithub}
      onDisconnectGithub={handleDisconnectGithub}
      onOpenEdit={() => setIsEditOpen(true)}
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
