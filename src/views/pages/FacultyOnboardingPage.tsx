import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ONBOARDING_QUESTIONS_QUERY_KEY,
  fetchOnboardingQuestions,
  resetOnboardingQuestions,
  saveOnboardingQuestions,
} from "@/features/onboarding/services/onboardingService";
import type { LikertQuestion } from "@/features/onboarding/types/onboarding";
import FacultyOnboardingContainer from "../components/FacultyOnboardingContainer";

/**
 * FacultyOnboardingPage — dosen mengelola pertanyaan onboarding (Likert).
 * Draft lokal di-commit ke override localStorage saat "Simpan".
 * TIDAK ADA class Tailwind di sini.
 */

function FacultyOnboardingPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ONBOARDING_QUESTIONS_QUERY_KEY,
    queryFn: fetchOnboardingQuestions,
  });

  const [draft, setDraft] = useState<LikertQuestion[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const list = draft ?? data ?? [];
  const dirty = draft !== null;

  const flashNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const handleChange = (index: number, patch: Partial<LikertQuestion>) => {
    setDraft(list.map((question, idx) => (idx === index ? { ...question, ...patch } : question)));
  };

  const handleAdd = () => {
    setDraft([...list, { id: crypto.randomUUID(), text: "", roleId: "frontend-engineer" }]);
  };

  const handleDelete = (index: number) => {
    setDraft(list.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    const cleaned = list.filter((question) => question.text.trim().length > 0);
    saveOnboardingQuestions(cleaned);
    void queryClient.invalidateQueries({ queryKey: ONBOARDING_QUESTIONS_QUERY_KEY });
    setDraft(null);
    flashNotice("Tersimpan");
  };

  const handleReset = () => {
    resetOnboardingQuestions();
    void queryClient.invalidateQueries({ queryKey: ONBOARDING_QUESTIONS_QUERY_KEY });
    setDraft(null);
    flashNotice("Direset ke default");
  };

  return (
    <FacultyOnboardingContainer
      questions={list}
      dirty={dirty}
      notice={notice}
      isLoading={isLoading}
      isError={isError}
      onChange={handleChange}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onSave={handleSave}
      onReset={handleReset}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default FacultyOnboardingPage;
