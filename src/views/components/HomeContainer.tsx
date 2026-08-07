import type { AiFeed } from "../../types/ai";
import type { CollabRequest } from "../../types/collab";
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
import { ActivityIcon, AlertIcon, ChatIcon, SmileIcon, TargetIcon, UsersIcon } from "../icons";

interface HomeContainerProps {
  userName: string;
  roadmap: RoadmapHeroData | null;
  roadmapLoading: boolean;
  community: { channels: number; servers: number };
  collab: { openRequests: number };
  active: { online: number; communities: number };
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
  onGoActive: () => void;
  onRetry: () => void;
}

function HomeContainer({
  userName,
  roadmap,
  roadmapLoading,
  community,
  collab,
  active,
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
  onGoActive,
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
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {/* Hero gradient — sapaan + daily quote + streak + roadmap utama */}
        <section className="flex flex-col bg-[linear-gradient(135deg,#3358e0_0%,#243b9c_50%,#141c52_100%)]">
          {/* Baris atas: sapaan + daily quote | daily streak (diperlebar) */}
          <div className="flex flex-col divide-y divide-white/15 lg:flex-row lg:divide-x lg:divide-y-0">
            <header className="flex flex-1 flex-col justify-center gap-3 p-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Home
              </span>
              <h1 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                Hi, {userName} <SmileIcon className="h-5 w-5 text-accent" />
              </h1>
              {ready ? (
                <div className="flex flex-col gap-1">
                  <p className="font-display text-lg font-semibold italic leading-snug text-ink">
                    “{feed.quotes[0].text}”
                  </p>
                  <p className="text-sm text-muted">— {feed.quotes[0].author}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="h-4 w-3/4 bg-white/10" />
                  <div className="h-4 w-2/5 bg-white/10" />
                </div>
              )}
            </header>

            {/* Daily streak — diperlebar */}
            <div className="lg:w-[44%] lg:shrink-0">
              {ready ? <GithubNudgeCard nudge={feed.nudge} /> : <GithubNudgeCardSkeleton />}
            </div>
          </div>

          {/* Roadmap utama — di dalam gradient */}
          <div className="border-t border-white/15 p-6">
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

        {/* Ringkasan area lain */}
        <section className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-3">
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
                  icon={ActivityIcon}
                  value={`${active.online} online`}
                  label="Active Community"
                  hint={`in ${active.communities} communities`}
                  onClick={onGoActive}
                />
              </div>
            </>
          )}
        </section>

        {/* Internship matcher */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <TargetIcon className="h-5 w-5 text-accent" /> Internships that fit you
            </h2>
            <p className="text-sm text-muted">
              Matched from your role & tech stack.
            </p>
          </div>
          <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
            {ready
              ? feed.internships.map((internship) => (
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

        {/* Cari tim proyek yang cocok */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <UsersIcon className="h-5 w-5 text-accent" /> Find a project team that fits you
            </h2>
            <p className="text-sm text-muted">
              Student projects looking for teammates in your field.
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
            <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
              {collabLoading
                ? Array.from({ length: 4 }).map((_, index) => (
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
  );
}

export default HomeContainer;
