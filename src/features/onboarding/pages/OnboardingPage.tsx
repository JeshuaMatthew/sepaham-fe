import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ONBOARDING_QUESTIONS_QUERY_KEY,
  fetchOnboardingQuestions,
} from "@/features/onboarding/services/onboardingService";
import { computeRoleScores, topRoleId } from "@/features/onboarding/utils/likert";
import { clearCv, getCv, saveCv } from "@/features/profile/utils/cv";
import { isGithubConnected, setGithubConnected } from "@/features/profile/utils/githubConnection";
import { connectGithub } from "@/features/profile/services/githubService";
import OnboardingContainer from "@/features/onboarding/components/OnboardingContainer";

const PER_PAGE = 5;

function OnboardingPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ONBOARDING_QUESTIONS_QUERY_KEY,
    queryFn: fetchOnboardingQuestions,
  });

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [cvName, setCvName] = useState<string | null>(getCv()?.fileName ?? null);
  const [githubConnected, setGithubConnectedState] = useState<boolean>(isGithubConnected());
  const [phase, setPhase] = useState<"cv" | "github" | "questions">("cv");
  const [page, setPage] = useState(0);

  const questions = data ?? [];
  const pageCount = Math.max(1, Math.ceil(questions.length / PER_PAGE));
  const start = page * PER_PAGE;
  const pageQuestions = questions.slice(start, start + PER_PAGE);
  const answeredTotal = questions.filter((q) => answers[q.id]).length;
  const currentPageAnswered = pageQuestions.length > 0 && pageQuestions.every((q) => answers[q.id]);
  const isLastPage = page >= pageCount - 1;

  const handleAnswer = (id: string, value: number) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleCvUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    saveCv(file.name);
    setCvName(file.name);
    event.target.value = "";
  };

  const handleCvRemove = () => { clearCv(); setCvName(null); };

  const handleConnectGithub = () => {
    setGithubConnected(true);
    setGithubConnectedState(true);
    void connectGithub().catch(() => {});
  };

  const finish = () => {
    const roleScores = computeRoleScores(questions, answers);
    const recommendedRoleId = topRoleId(roleScores);
    void navigate("/onboarding/role", { state: { recommendedRoleId, roleScores } });
  };

  const handleNext = () => { if (isLastPage) finish(); else setPage((prev) => prev + 1); };
  const handleBack = () => { if (page === 0) setPhase("github"); else setPage((prev) => prev - 1); };

  return (
    <OnboardingContainer
      phase={phase} page={page} pageCount={pageCount} startIndex={start}
      questions={pageQuestions} answers={answers} cvName={cvName}
      githubConnected={githubConnected} answeredTotal={answeredTotal}
      totalQuestions={questions.length} currentPageAnswered={currentPageAnswered}
      isLastPage={isLastPage} isLoading={isLoading} isError={isError}
      onAnswer={handleAnswer} onCvUpload={handleCvUpload} onCvRemove={handleCvRemove}
      onConnectGithub={handleConnectGithub} onCvContinue={() => setPhase("github")}
      onGithubContinue={() => setPhase("questions")} onGithubBack={() => setPhase("cv")}
      onNext={handleNext} onBack={handleBack}
      onRetry={() => { void refetch(); }}
    />
  );
}

export default OnboardingPage;
