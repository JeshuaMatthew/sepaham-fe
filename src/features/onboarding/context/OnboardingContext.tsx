import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  fetchAllPillars,
  analyzeEssay,
  fetchPillarQuestions,
  evaluateAssessment,
  type PillarItem,
  type LLMAnalysis,
  type QuestionItem,
  type AnswerValue,
  type EvaluateResponse,
} from "../services/onboardingService";
import { savePreference } from "../utils/preference";
import { pushPreference } from "../services/preferenceService";
import { reportError } from "@/shared/errors";

interface OnboardingContextType {
  step: number;
  essay: string;
  sessionId: string | null;
  llmAnalysis: LLMAnalysis | null;
  suggestedPillars: PillarItem[];
  allPillars: PillarItem[];
  selectedPillar: PillarItem | null;
  questions: QuestionItem[];
  /** Jawaban di-key dengan `question.id`, bukan `fact_id`. */
  answers: Record<string, AnswerValue>;
  evaluationResult: EvaluateResponse | null;
  isAnalyzing: boolean;
  isLoadingQuestions: boolean;
  isEvaluating: boolean;
  error: string | null;
  setEssay: (text: string) => void;
  submitEssay: () => Promise<void>;
  selectPillar: (pillar: PillarItem) => void;
  confirmPillar: () => Promise<void>;
  setAnswer: (questionId: string, value: AnswerValue) => void;
  submitAssessment: () => Promise<void>;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [essay, setEssay] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [llmAnalysis, setLlmAnalysis] = useState<LLMAnalysis | null>(null);
  const [suggestedPillars, setSuggestedPillars] = useState<PillarItem[]>([]);
  const [allPillars, setAllPillars] = useState<PillarItem[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<PillarItem | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [evaluationResult, setEvaluationResult] = useState<EvaluateResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPillars()
      .then((pillars) => setAllPillars(pillars))
      .catch((error) => {
        reportError("fetchAllPillars", error);
        setError("Gagal memuat daftar pilar. Coba muat ulang halaman.");
      });
  }, []);

  const submitEssay = async () => {
    if (essay.trim().length < 50) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await analyzeEssay(essay);
      setSessionId(res.session_id);
      setLlmAnalysis(res.analysis);
      setSuggestedPillars(res.suggested_pillars);
      if (res.suggested_pillars.length > 0) {
        setSelectedPillar(res.suggested_pillars[0]);
      }
      setStep(2);
    } catch (e: any) {
      setError(e?.message || "Gagal menganalisis essay. Silakan coba lagi.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectPillar = (pillar: PillarItem) => {
    setSelectedPillar(pillar);
  };

  const confirmPillar = async () => {
    if (!selectedPillar) return;
    setIsLoadingQuestions(true);
    setError(null);
    try {
      const qList = await fetchPillarQuestions(selectedPillar.id);
      setQuestions(qList);
      setStep(3);
    } catch (e: any) {
      setError(e?.message || "Gagal memuat pertanyaan asesmen.");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const setAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitAssessment = async () => {
    if (!selectedPillar) return;
    setIsEvaluating(true);
    setError(null);
    try {
      // Jawaban disimpan per `question.id`; backend hanya menerima daftar
      // {fact_id, value:boolean}, jadi petakan balik ke fact_id di sini.
      // - binary/scale -> fact_id milik soal itu
      // - choice       -> fact_id milik option yang dipilih (bukan fact_id soal)
      const answerList: Array<{ fact_id: string; value: boolean }> = [];
      for (const q of questions) {
        const raw = answers[q.id];
        if (raw === undefined) continue;
        if (q.question_type === "choice") {
          const picked = (q.options ?? []).find(
            (o) => (o.fact_id ?? o.label) === raw,
          );
          if (picked?.fact_id) {
            answerList.push({ fact_id: picked.fact_id, value: true });
          }
        } else if (q.fact_id) {
          answerList.push({ fact_id: q.fact_id, value: Boolean(raw) });
        }
      }

      const res = await evaluateAssessment({
        session_id: sessionId || undefined,
        pillar_id: selectedPillar.id,
        answers: answerList,
      });
      // Backend sudah menyimpan `user_preferences`, tapi HomePage membaca
      // preferensi dari localStorage. Tanpa baris ini user yang baru saja
      // menyelesaikan onboarding masih dianggap "belum onboarding" —
      // roadmap/internship/GitHub streak tidak pernah muncul sampai login
      // ulang (dan HomePage terus menampilkan CTA).
      const preference = {
        roleId: res.recommended_role,
        roleTitle: res.recommended_role_name,
        roleEmoji: res.recommended_role_emoji ?? "",
        roleScores: res.all_scores ?? {},
      };
      savePreference(preference);
      // Tulis juga ke server supaya cache lokal dan server tidak menyimpang.
      // Backend `/evaluate` sebenarnya sudah menyimpan, tapi pemanggilan
      // eksplisit ini mengunci kontraknya: hasil onboarding = tersimpan di
      // server, bukan cuma di browser ini. Gagal push tidak menggagalkan
      // onboarding — cache lokal tetap dipakai, dan login berikutnya
      // menyinkronkan ulang dari server.
      try {
        await pushPreference(preference);
      } catch {
        // abaikan — akan disinkronkan ulang saat login berikutnya
      }
      setEvaluationResult(res);
      setStep(4);
    } catch (e: any) {
      setError(e?.message || "Gagal mengevaluasi asesmen.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetOnboarding = () => {
    setStep(1);
    setEssay("");
    setSessionId(null);
    setLlmAnalysis(null);
    setSuggestedPillars([]);
    setSelectedPillar(null);
    setQuestions([]);
    setAnswers({});
    setEvaluationResult(null);
    setError(null);
  };

  return (
    <OnboardingContext.Provider
      value={{
        step,
        essay,
        sessionId,
        llmAnalysis,
        suggestedPillars,
        allPillars,
        selectedPillar,
        questions,
        answers,
        evaluationResult,
        isAnalyzing,
        isLoadingQuestions,
        isEvaluating,
        error,
        setEssay,
        submitEssay,
        selectPillar,
        confirmPillar,
        setAnswer,
        submitAssessment,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
