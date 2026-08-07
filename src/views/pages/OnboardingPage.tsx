import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ONBOARDING_QUESTIONS_QUERY_KEY,
  fetchOnboardingQuestions,
} from "../../services/onboardingService";
import { computeRoleScores, topRoleId } from "../../utils/likert";
import OnboardingContainer from "../components/OnboardingContainer";

/**
 * OnboardingPage — kuesioner Likert (pertanyaan dibuat oleh dosen).
 *
 * Page mengambil pertanyaan (query), menyimpan jawaban Likert, lalu
 * menghitung skor per-role & role rekomendasi, dan meneruskannya ke
 * halaman penentuan role. TIDAK ADA class Tailwind di sini.
 */

function OnboardingPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ONBOARDING_QUESTIONS_QUERY_KEY,
    queryFn: fetchOnboardingQuestions,
  });

  const [answers, setAnswers] = useState<Record<string, number>>({});

  const questions = data ?? [];

  const handleAnswer = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleContinue = () => {
    const roleScores = computeRoleScores(questions, answers);
    const recommendedRoleId = topRoleId(roleScores);
    void navigate("/onboarding/role", {
      state: { recommendedRoleId, roleScores },
    });
  };

  return (
    <OnboardingContainer
      questions={questions}
      answers={answers}
      isLoading={isLoading}
      isError={isError}
      onAnswer={handleAnswer}
      onContinue={handleContinue}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default OnboardingPage;
