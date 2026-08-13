import type { ApplicantStatus } from "@/features/collab/types/collab";
import type { MyTeam } from "@/features/collab/utils/myTeamsStore";
import { ArrowLeftIcon, CheckIcon, CloseIcon, LinkIcon, UsersIcon } from "@/shared/icons";

interface MyTeamsContainerProps {
  teams: MyTeam[];
  copiedId: string | null;
  onSetStatus: (requestId: string, applicantId: string, status: ApplicantStatus) => void;
  onCopyInvite: (serverId: string) => void;
  onBack: () => void;
}

const STATUS_LABEL: Record<ApplicantStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

function MyTeamsContainer({
  teams,
  copiedId,
  onSetStatus,
  onCopyInvite,
  onBack,
}: MyTeamsContainerProps) {
  return (
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {/* Header — bagian penting, gradient biru */}
        <header className="grad-blue flex flex-col gap-2 p-6 sm:p-7">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Find a team
          </button>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
            <UsersIcon className="h-6 w-6" /> My teams
          </h1>
          <p className="text-sm text-muted">
            Your project team requests — review who applied, and share your community invite link.
          </p>
        </header>

        {teams.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <UsersIcon className="h-10 w-10 text-muted" />
            <p className="text-sm text-muted">
              You haven't created a project team yet. Create a request on the Find a team page.
            </p>
          </div>
        ) : (
          teams.map(({ request, applicants, communityServerId }) => (
            <section key={request.id} className="flex flex-col gap-4 border border-line bg-surface p-5">
              {/* Judul + komunitas + invite link */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold text-ink">{request.title}</h2>
                  <span className="shrink-0 text-[11px] uppercase tracking-wide text-muted">
                    {request.membersCurrent}/{request.membersNeeded} members
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted">{request.description}</p>

                {/* Gambar project */}
                {request.images && request.images.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {request.images.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt=""
                        className="h-20 w-20 border border-line object-cover"
                      />
                    ))}
                  </div>
                ) : null}

                {/* Community + share invite link */}
                <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
                  <span className="text-xs text-muted">
                    Community: <span className="text-ink">{request.communityName}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopyInvite(communityServerId)}
                    className="ml-auto inline-flex cursor-pointer items-center gap-1.5 border border-blue px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    {copiedId === communityServerId ? "Invite link copied!" : "Copy invite link"}
                  </button>
                </div>
              </div>

              {/* Pendaftar */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-ink">
                  Applicants ({applicants.length})
                </span>
                {applicants.length === 0 ? (
                  <p className="text-sm text-muted">No one has applied yet.</p>
                ) : (
                  <div className="grid grid-cols-1 border-l border-t border-line">
                    {applicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center gap-3 border-r border-b border-line p-3"
                      >
                        <img
                          src={applicant.avatar}
                          alt={applicant.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-semibold text-ink">
                            {applicant.name}
                          </span>
                          <span className="text-xs text-muted">{applicant.role}</span>
                        </div>
                        {applicant.status === "pending" ? (
                          <div className="ml-auto flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onSetStatus(request.id, applicant.id, "accepted")}
                              className="inline-flex cursor-pointer items-center gap-1 border border-line px-2.5 py-1 text-xs font-semibold text-primary hover:bg-elevate"
                            >
                              <CheckIcon className="h-3.5 w-3.5" /> Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => onSetStatus(request.id, applicant.id, "rejected")}
                              className="inline-flex cursor-pointer items-center gap-1 px-2.5 py-1 text-xs font-semibold text-muted hover:text-ink"
                            >
                              <CloseIcon className="h-3.5 w-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`ml-auto shrink-0 text-xs font-semibold ${
                              applicant.status === "accepted" ? "text-primary" : "text-muted"
                            }`}
                          >
                            {STATUS_LABEL[applicant.status]}
                            {applicant.status === "accepted" ? " · invited to community" : ""}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTeamsContainer;
