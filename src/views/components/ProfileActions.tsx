import { EditIcon, GithubIcon, LogoutIcon } from "../icons";

interface ProfileActionsProps {
  githubConnected: boolean;
  githubUsername: string;
  onConnectGithub: () => void;
  onDisconnectGithub: () => void;
  onEdit: () => void;
  onLogout: () => void;
}

function ProfileActions({
  githubConnected,
  githubUsername,
  onConnectGithub,
  onDisconnectGithub,
  onEdit,
  onLogout,
}: ProfileActionsProps) {
  return (
    <section className="flex flex-wrap items-center gap-6  p-4">
      {/* Connect / GitHub status */}
      {githubConnected ? (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon">
            <GithubIcon className="h-4 w-4" /> GitHub connected
            {githubUsername ? ` · @${githubUsername}` : ""}
          </span>
          <button
            type="button"
            onClick={onDisconnectGithub}
            className="cursor-pointer text-xs font-semibold text-muted hover:text-danger"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onConnectGithub}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary"
        >
          <GithubIcon className="h-4 w-4" /> Connect GitHub account
        </button>
      )}

      {/* Edit profile */}
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary"
      >
        <EditIcon className="h-4 w-4" /> Edit profile
      </button>

      {/* Log out */}
      <button
        type="button"
        onClick={onLogout}
        className="ml-auto inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-danger"
      >
        <LogoutIcon className="h-4 w-4" /> Log out
      </button>
    </section>
  );
}

export default ProfileActions;
