import type { Badge, Profile } from "../../types/profile";
import type { GithubStats } from "../../types/github";
import ProfileHeader from "./ProfileHeader";
import ProfileHeaderSkeleton from "./ProfileHeaderSkeleton";
import ProfileActions from "./ProfileActions";
import ProfileEditModal from "./ProfileEditModal";
import SectionCard from "./SectionCard";
import LanguageChart from "./LanguageChart";
import LanguageChartSkeleton from "./LanguageChartSkeleton";
import CommitStreak from "./CommitStreak";
import CommitStreakSkeleton from "./CommitStreakSkeleton";
import RepoCard from "./RepoCard";
import RepoCardSkeleton from "./RepoCardSkeleton";
import BadgeItem from "./BadgeItem";
import { AlertIcon } from "../icons";
import BadgeItemSkeleton from "./BadgeItemSkeleton";

interface DevCardContainerProps {
  profile: Profile | null;
  github: GithubStats | null;
  badges: Badge[];
  githubConnected: boolean;
  githubUsername: string;
  isEditOpen: boolean;
  isProfileLoading: boolean;
  isGithubLoading: boolean;
  isBadgesLoading: boolean;
  isError: boolean;
  onConnectGithub: () => void;
  onDisconnectGithub: () => void;
  onOpenEdit: () => void;
  onCloseEdit: () => void;
  onSaveProfile: (patch: Partial<Profile>) => void;
  onLogout: () => void;
  onRetry: () => void;
}

function DevCardContainer({
  profile,
  github,
  badges,
  githubConnected,
  githubUsername,
  isEditOpen,
  isProfileLoading,
  isGithubLoading,
  isBadgesLoading,
  isError,
  onConnectGithub,
  onDisconnectGithub,
  onOpenEdit,
  onCloseEdit,
  onSaveProfile,
  onLogout,
  onRetry,
}: DevCardContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Couldn't load Dev-Card
          </h2>
          <p className="text-sm text-muted">
            Couldn't fetch profile data. Please reload.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer py-2 text-sm font-semibold text-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const showProfile = !isProfileLoading && profile !== null;
  const showGithub = !isGithubLoading && github !== null;

  return (
    <div className="min-h-screen bg-canvas px-6 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {/* Profil */}
        {showProfile ? <ProfileHeader profile={profile} /> : <ProfileHeaderSkeleton />}

        {/* Aksi akun */}
        <ProfileActions
          githubConnected={githubConnected}
          githubUsername={githubUsername}
          onConnectGithub={onConnectGithub}
          onDisconnectGithub={onDisconnectGithub}
          onEdit={onOpenEdit}
          onLogout={onLogout}
        />

        {/* Top languages + Badges */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard title="Top Languages" subtitle="Language breakdown from public repos">
            {showGithub ? (
              <LanguageChart languages={github.topLanguages} />
            ) : (
              <LanguageChartSkeleton />
            )}
          </SectionCard>

          <SectionCard title="Badges" subtitle="Gamified achievements">
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {isBadgesLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <BadgeItemSkeleton key={index} />
                  ))
                : badges.map((badge) => <BadgeItem key={badge.id} badge={badge} />)}
            </div>
          </SectionCard>
        </div>

        {/* Commit streak */}
        <SectionCard title="Commit Activity" subtitle="Contributions over the last 12 months">
          {showGithub ? (
            <CommitStreak weeks={github.weeks} summary={github.stats} />
          ) : (
            <CommitStreakSkeleton />
          )}
        </SectionCard>

        {/* Top repos */}
        <SectionCard title="Top Repositories" subtitle="3 hand-picked top repos">
          <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-3">
            {showGithub
              ? github.topRepos.map((repo) => (
                  <div key={repo.id} className="border-r border-b border-line">
                    <RepoCard repo={repo} />
                  </div>
                ))
              : Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border-r border-b border-line">
                    <RepoCardSkeleton />
                  </div>
                ))}
          </div>
        </SectionCard>
      </div>

      {/* Modal edit profil */}
      {isEditOpen && profile ? (
        <ProfileEditModal profile={profile} onClose={onCloseEdit} onSave={onSaveProfile} />
      ) : null}
    </div>
  );
}

export default DevCardContainer;
