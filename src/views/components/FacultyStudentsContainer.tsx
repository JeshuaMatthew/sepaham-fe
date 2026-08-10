import { Link } from "react-router-dom";
import type { FacultyStudent } from "../../types/student";
import { AlertIcon, ArrowLeftIcon, DocIcon, CloseIcon, UsersIcon } from "../icons";

interface StudentRow {
  student: FacultyStudent;
  readiness: number;
  level: string;
}

interface FacultyStudentsContainerProps {
  rows: StudentRow[];
  isLoading: boolean;
  isError: boolean;
  cvStudent: FacultyStudent | null;
  onViewCv: (student: FacultyStudent) => void;
  onCloseCv: () => void;
  onRetry: () => void;
}

function FacultyStudentsContainer({
  rows,
  isLoading,
  isError,
  cvStudent,
  onViewCv,
  onCloseCv,
  onRetry,
}: FacultyStudentsContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Couldn't load students</h2>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-ink"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="grad-blue flex flex-col gap-2 p-6 sm:p-7">
          <Link
            to="/faculty"
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Faculty panel
          </Link>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
            <UsersIcon className="h-6 w-6" /> Student progress
          </h1>
          <p className="text-sm text-muted">
            Track each student's career progress (roadmap, GitHub, projects, CV) and open their CV.
          </p>
        </header>

        {isLoading ? (
          <div className="h-64 rounded-card border border-line bg-surface animate-shimmer" />
        ) : (
          <div className="grid grid-cols-1 border-l border-t border-line">
            {rows.map(({ student, readiness, level }) => (
              <div key={student.id} className="flex flex-col gap-3 border-r border-b border-line p-5">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-display text-sm font-semibold text-ink">
                      {student.name}
                    </span>
                    <span className="text-xs text-muted">{student.role}</span>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <span className="font-display text-lg font-bold text-ink">{readiness}%</span>
                    <span className="text-[11px] text-muted">{level}</span>
                  </div>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevate">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${readiness}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <span>
                    Roadmap:{" "}
                    <span className="text-ink">
                      {student.roadmap.completed}/{student.roadmap.total}
                    </span>{" "}
                    · {student.roadmap.title}
                  </span>
                  <span>
                    GitHub:{" "}
                    <span className="text-ink">
                      {student.github.repos} repos · {student.github.commits} commits
                    </span>
                  </span>
                  <span>
                    Projects: <span className="text-ink">{student.projects}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {student.cvFileName ? (
                    <button
                      type="button"
                      onClick={() => onViewCv(student)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary"
                    >
                      <DocIcon className="h-3.5 w-3.5" /> View CV
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                      <DocIcon className="h-3.5 w-3.5" /> No CV uploaded
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal preview CV (metadata + placeholder) */}
      {cvStudent ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onCloseCv}
        >
          <div
            className="flex w-full max-w-md flex-col gap-4 border border-line bg-canvas p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="font-display text-base font-semibold text-ink">
                  {cvStudent.name}'s CV
                </span>
                <span className="text-xs text-muted">{cvStudent.role}</span>
              </div>
              <button
                type="button"
                onClick={onCloseCv}
                className="cursor-pointer text-muted hover:text-ink"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1 border border-line bg-surface p-3 text-xs">
              <span className="text-muted">
                File: <span className="text-ink">{cvStudent.cvFileName}</span>
              </span>
              {cvStudent.cvUploadedAt ? (
                <span className="text-muted">
                  Uploaded: <span className="text-ink">{cvStudent.cvUploadedAt}</span>
                </span>
              ) : null}
            </div>

            {/* Placeholder preview */}
            <div className="flex h-48 flex-col items-center justify-center gap-2 border border-dashed border-line text-center">
              <DocIcon className="h-8 w-8 text-muted" />
              <span className="text-xs text-muted">
                CV preview isn't available in this demo.
                <br />
                {cvStudent.cvFileName}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default FacultyStudentsContainer;
