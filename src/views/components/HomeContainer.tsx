import type { AiFeed, Internship } from "@/features/home/types/ai";
import type { CollabRequest } from "@/features/collab/types/collab";
import type { RoadmapHeroData } from "./HomeRoadmapHero";
import HomeRoadmapHero from "./HomeRoadmapHero";
import HomeRoadmapHeroSkeleton from "./HomeRoadmapHeroSkeleton";
import HomeSummaryCard from "./HomeSummaryCard";
import HomeSummaryCardSkeleton from "./HomeSummaryCardSkeleton";
import GithubNudgeCard from "./GithubNudgeCard";
import GithubNudgeCardSkeleton from "./GithubNudgeCardSkeleton";
import InternshipCard from "./InternshipCard";
import InternshipCardSkeleton from "./InternshipCardSkeleton";
import HomeCollabCard from "./HomeCollabCard";
import HomeCollabCardSkeleton from "./HomeCollabCardSkeleton";
import { AlertIcon, ChatIcon, CompassIcon, SmileIcon, TargetIcon, UsersIcon } from "@/shared/icons";

interface HomeContainerProps {
  userName: string;
  roadmap: RoadmapHeroData | null;
  roadmapLoading: boolean;
  community: { channels: number; servers: number };
  collab: { openRequests: number };
  career: { readiness: number };
  summaryLoading: boolean;
  feed: AiFeed | null;
  collabRequests: CollabRequest[];
  collabLoading: boolean;
  isLoading: boolean;
  isError: boolean;
  onOpenRoadmap: (id: string) => void;
  onBrowseRoadmap: () => void;
  onGoCommunity: () => void;
  onGoCollab: () => void;
  onGoCareer: () => void;
  onRetry: () => void;
}

function HomeContainer({
  userName,
  roadmap,
  roadmapLoading,
  community,
  collab,
  career,
  summaryLoading,
  feed,
  collabRequests,
  collabLoading,
  isLoading,
  isError,
  onOpenRoadmap,
  onBrowseRoadmap,
  onGoCommunity,
  onGoCollab,
  onGoCareer,
  onRetry,
}: HomeContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Couldn't load your home</h2>
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

  const ready = !isLoading && feed !== null;

  return (
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Main Content (Hero & Internships) */}
        <div className="flex flex-col gap-8 lg:col-span-8">
          {/* Hero gradient — sapaan + roadmap utama */}
          <section className="grad-blue flex flex-col">
            <header className="flex flex-col justify-center gap-3 p-6 sm:p-8">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Home
              </span>
              <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Hi, {userName} <SmileIcon className="h-6 w-6 text-accent" />
              </h1>
              {ready ? (
                <div className="flex flex-col gap-1 pt-2">
                  <p className="font-display text-lg font-semibold italic leading-snug text-ink sm:text-xl">
                    “{feed.quotes[0].text}”
                  </p>
                  <p className="text-sm text-muted">— {feed.quotes[0].author}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-3">
                  <div className="h-4 w-3/4 bg-ink/10" />
                  <div className="h-4 w-2/5 bg-ink/10" />
                </div>
              )}
            </header>

            {/* Roadmap utama — di dalam gradient */}
            <div className="border-t border-line/20 p-6 sm:p-8">
              {roadmapLoading ? (
                <HomeRoadmapHeroSkeleton />
              ) : (
                <HomeRoadmapHero
                  roadmap={roadmap}
                  onOpen={onOpenRoadmap}
                  onBrowse={onBrowseRoadmap}
                />
              )}
            </div>
          </section>

          {/* Internship matcher */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                <TargetIcon className="h-6 w-6 text-accent" /> Internships that fit you
              </h2>
              <p className="text-sm text-muted">
                Matched from your role & tech stack.
              </p>
            </div>
            <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
              {ready
                ? feed.internships.map((internship: Internship) => (
                    <div key={internship.id} className="border-r border-b border-line">
                      <InternshipCard internship={internship} />
                    </div>
                  ))
                : Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="border-r border-b border-line">
                      <InternshipCardSkeleton />
                    </div>
                  ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sidebar (Streak, Summaries, Collab Requests) */}
        <div className="flex flex-col gap-8 lg:col-span-4">
          
          {/* Daily streak */}
          <section>
            {ready ? <GithubNudgeCard nudge={feed.nudge} /> : <GithubNudgeCardSkeleton />}
          </section>

          {/* Ringkasan area lain (Stacked vertically on sidebar) */}
          <section className="flex flex-col border-l border-t border-line">
            {summaryLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border-r border-b border-line">
                  <HomeSummaryCardSkeleton />
                </div>
              ))
            ) : (
              <>
                <div className="border-r border-b border-line">
                  <HomeSummaryCard
                    icon={ChatIcon}
                    value={`${community.channels} channels`}
                    label="Community"
                    hint={`${community.servers} discussion servers`}
                    onClick={onGoCommunity}
                  />
                </div>
                <div className="border-r border-b border-line">
                  <HomeSummaryCard
                    icon={UsersIcon}
                    value={`${collab.openRequests} teams`}
                    label="Find a Team"
                    hint="requests need members"
                    onClick={onGoCollab}
                  />
                </div>
                <div className="border-r border-b border-line">
                  <HomeSummaryCard
                    icon={CompassIcon}
                    value={`${career.readiness}%`}
                    label="Career"
                    hint="AI insights & progress"
                    onClick={onGoCareer}
                  />
                </div>
              </>
            )}
          </section>

          {/* Cari tim proyek yang cocok */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <UsersIcon className="h-5 w-5 text-accent" /> Need teammates?
              </h2>
              <p className="text-sm text-muted">
                Student projects looking for you.
              </p>
            </div>
            {!collabLoading && collabRequests.length === 0 ? (
              <p className="text-sm text-muted">
                No matching project teams right now.{" "}
                <button
                  type="button"
                  onClick={onGoCollab}
                  className="cursor-pointer font-semibold text-primary"
                >
                  Browse all
                </button>
              </p>
            ) : (
              <div className="flex flex-col border-l border-t border-line">
                {collabLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="border-r border-b border-line">
                        <HomeCollabCardSkeleton />
                      </div>
                    ))
                  : collabRequests.map((request) => (
                      <div key={request.id} className="border-r border-b border-line">
                        <HomeCollabCard request={request} onOpen={onGoCollab} />
                      </div>
                    ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

export default HomeContainer;
