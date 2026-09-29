import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ONBOARDING_QUESTIONS_QUERY_KEY,
  fetchQuestionBank,
  saveQuestionBank,
} from "@/features/onboarding/services/onboardingService";
import type { QuestionItem } from "@/features/onboarding/services/onboardingService";
import FacultyOnboardingContainer, {
  type PillarGroup,
} from "@/views/components/FacultyOnboardingContainer";

/**
 * FacultyOnboardingPage — dosen mengelola bank soal onboarding.
 *
 * Draft lokal di-commit ke backend lewat `PUT /onboarding/questions`, yang
 * mengganti seluruh isi tabel `questions` — tabel yang sama persis dibaca
 * wizard onboarding mahasiswa, jadi hasil suntingan di sini langsung terlihat.
 * TIDAK ADA class Tailwind di halaman ini; semuanya di container.
 */

type NoticeTone = "ok" | "error";

function FacultyOnboardingPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ONBOARDING_QUESTIONS_QUERY_KEY,
    queryFn: fetchQuestionBank,
  });

  const [draft, setDraft] = useState<QuestionItem[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeTone, setNoticeTone] = useState<NoticeTone>("ok");
  const [isSaving, setIsSaving] = useState(false);

  const pillars = data?.pillars ?? [];
  const facts = data?.facts ?? [];
  const list = draft ?? data?.questions ?? [];
  const dirty = draft !== null;

  // Cukup 30-an soal — tidak perlu useMemo, dan menghindari dependensi yang
  // berubah tiap render.
  const groups: PillarGroup[] = pillars.map((pillar) => ({
    pillar,
    questions: list.filter((question) => question.pillar_id === pillar.id),
  }));

  const flash = (message: string, tone: NoticeTone) => {
    setNotice(message);
    setNoticeTone(tone);
    window.setTimeout(() => setNotice(null), 5000);
  };

  /**
   * Aturan yang sama dengan validasi server. Dicek di sini supaya kesalahan
   * ketik tidak sampai jadi toast 422 yang membingungkan, dan supaya
   *ibernate lebih jelas di soal mana.
   */
  const validate = (questions: QuestionItem[]): string | null => {
    for (const [index, question] of questions.entries()) {
      const label = `Soal #${index + 1} ("${question.question_text.slice(0, 30)}…")`;
      if (question.question_text.trim().length < 3) {
        return `${label}: teks soal masih kosong.`;
      }
      if (question.question_type === "choice") {
        const options = question.options ?? [];
        if (options.length < 2) {
          return `${label}: tipe Pilihan ganda butuh minimal 2 opsi (sekarang ${options.length}).`;
        }
        if (options.some((option) => !option.label.trim())) {
          return `${label}: ada opsi yang labelnya masih kosong.`;
        }
        if (options.some((option) => !option.fact_id)) {
          return `${label}: ada opsi yang fact-nya belum dipilih.`;
        }
      }
    }
    return null;
  };

  const handleChange = (id: string, patch: Partial<QuestionItem>) => {
    setDraft(
      list.map((question) => (question.id === id ? { ...question, ...patch } : question)),
    );
  };

  const handleAdd = (pillarId: string) => {
    const factId = facts[0]?.id ?? "";
    setDraft([
      ...list,
      {
        // UUID dibuat di sisi klien supaya bisa jadi React key yang unik;
        // server menerimanya sebagai id tetap untuk soal baru.
        id: crypto.randomUUID(),
        pillar_id: pillarId,
        fact_id: factId,
        question_text: "",
        question_type: "binary",
        options: null,
        sort_order: list.filter((question) => question.pillar_id === pillarId).length,
        weight: 1.0,
      },
    ]);
  };

  const handleDelete = (id: string) => {
    setDraft(list.filter((question) => question.id !== id));
  };

  const handleMove = (pillarId: string, id: string, direction: -1 | 1) => {
    // Posisi tiap soal pillar ini di dalam draft datar, lalu tukar dua slot.
    const slots = list
      .map((question, index) => (question.pillar_id === pillarId ? index : -1))
      .filter((index) => index >= 0);
    const slot = slots.findIndex((index) => list[index].id === id);
    const target = slot + direction;
    if (slot < 0 || target < 0 || target >= slots.length) return;
    const next = [...list];
    const a = slots[slot];
    const b = slots[target];
    [next[a], next[b]] = [next[b], next[a]];
    setDraft(next);
  };

  const handleSave = async () => {
    // Kumpulkan ulang per pillar supaya urutan di payload = urutan di layar.
    const ordered = pillars.flatMap((pillar) =>
      list.filter((question) => question.pillar_id === pillar.id),
    );
    const problem = validate(ordered);
    if (problem) {
      flash(problem, "error");
      return;
    }
    setIsSaving(true);
    try {
      await saveQuestionBank(ordered);
      await queryClient.invalidateQueries({ queryKey: ONBOARDING_QUESTIONS_QUERY_KEY });
      setDraft(null);
      flash(`Tersimpan — ${ordered.length} soal aktif untuk mahasiswa.`, "ok");
    } catch (error) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Gagal menyimpan. Coba lagi.";
      flash(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FacultyOnboardingContainer
      groups={groups}
      facts={facts}
      dirty={dirty}
      notice={notice}
      noticeTone={noticeTone}
      isSaving={isSaving}
      isLoading={isLoading}
      isError={isError}
      onChange={handleChange}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onMove={handleMove}
      onSave={() => {
        void handleSave();
      }}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default FacultyOnboardingPage;
