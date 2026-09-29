import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROLES_QUERY_KEY, fetchRoles } from "../services/roleService";
import type { Role } from "../types/role";
import { useOnboarding } from "../context/OnboardingContext";
import { ArrowRightIcon, SparkleIcon } from "@/shared/icons";

/**
 * Warna bar kecocokan. Token `success`/`warning` TIDAK ada di `@theme`
 * (lihat index.css), jadi kelas seperti `bg-success` tidak menghasilkan CSS
 * apa pun dan bar-nya jadi tak terlihat. Pakai token yang benar-benar ada.
 */
const MATCH_BAR_CLASS = {
  high: "bg-neon",
  mid: "bg-accent",
  low: "bg-danger",
} as const;

function matchBarClass(pct: number): string {
  if (pct >= 70) return MATCH_BAR_CLASS.high;
  if (pct >= 45) return MATCH_BAR_CLASS.mid;
  return MATCH_BAR_CLASS.low;
}

function MatchBar({
  percentage,
  accent,
}: {
  percentage: number;
  accent?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full transition-all duration-700 ${matchBarClass(pct)}`}
          // Kalau role-nya ketemu di katalog, pakai accent role itu sebagai warna
          // personal; kalau tidak, tetap pakai token tema lewat className.
          style={accent ? { backgroundColor: accent } : undefined}
        />
      </div>
      <span className="shrink-0 text-sm font-bold text-ink">{pct}%</span>
    </div>
  );
}

export default function ResultRevealStep() {
  const navigate = useNavigate();
  const { evaluationResult, resetOnboarding } = useOnboarding();

  // Nama, emoji, dan warna role datang dari tabel `roles` — bukan peta ikon
  // hardcoded di frontend. Peta itu memakai kunci snake_case (`frontend_developer`)
  // sementara `recommended_role` dari API berbentuk kebab-case (`frontend-engineer`),
  // jadi ikon tidak pernah cocok dan selalu jatuh ke fallback.
  const { data: roles } = useQuery({ queryKey: ROLES_QUERY_KEY, queryFn: fetchRoles });

  const rolesById = useMemo(() => {
    const map = new Map<string, Role>();
    for (const role of roles ?? []) map.set(role.id, role);
    return map;
  }, [roles]);

  if (!evaluationResult) return null;

  const {
    recommended_role: recommendedRoleId,
    recommended_role_name: recommendedRoleName,
    match_percentage: matchPercentage,
    roadmap_slug: roadmapSlug,
    all_scores: allScores,
  } = evaluationResult;

  const recommendedRole = rolesById.get(recommendedRoleId);
  const emoji = recommendedRole?.emoji;
  const accent = recommendedRole?.accent;
  const roleName = recommendedRole?.title || recommendedRoleName;

  const topScores = Object.entries(allScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const handleStart = () => {
    if (roadmapSlug) {
      void navigate(`/roadmap/${roadmapSlug}`);
    } else {
      void navigate("/career");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            4
          </span>
          <h2 className="font-display text-xl font-bold text-ink">
            Hasil Rekomendasi
          </h2>
        </div>
        <p className="text-sm text-muted">
          Berdasarkan esai dan asesmen yang kamu kerjakan, AI kami merekomendasikan jalur karir berikut.
        </p>
      </div>

      {/* Main recommendation card */}
      <div
        className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-6 flex flex-col gap-4"
        style={accent ? { borderColor: `${accent}4d` } : undefined}
      >
        <div className="flex items-center gap-4">
          {emoji ? (
            <span className="text-4xl" aria-hidden="true">
              {emoji}
            </span>
          ) : (
            <SparkleIcon className="h-10 w-10" aria-hidden="true" />
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
              Rekomendasi Karir
            </p>
            <h3
              className="font-display text-2xl font-bold"
              style={{ color: accent || undefined }}
              // Tanpa accent dari katalog, kembali ke warna teks tema.
              {...(accent ? {} : { className: "font-display text-2xl font-bold text-ink" })}
            >
              {roleName}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-muted">
            <span>Tingkat kecocokan</span>
            <span className="font-semibold text-primary">
              {Math.round(matchPercentage)}%
            </span>
          </div>
          <MatchBar percentage={matchPercentage} accent={accent} />
        </div>
      </div>

      {/* All scores breakdown */}
      {topScores.length > 1 && (
        <div className="rounded-xl border border-line bg-surface p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            Perbandingan Skor
          </p>
          <div className="flex flex-col gap-2.5">
            {topScores.map(([roleId, score]) => {
              const role = rolesById.get(roleId);
              return (
                <div key={roleId} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink">
                      {role ? (
                        <>
                          <span aria-hidden="true">{role.emoji} </span>
                          {role.title}
                        </>
                      ) : (
                        roleId
                      )}
                    </span>
                    <span className="text-muted font-medium">
                      {Math.round(score)}%
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-primary/50 transition-all"
                      style={{ width: `${Math.max(0, Math.min(100, Math.round(score)))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleStart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-lg shadow-primary/20"
        >
          <span>Mulai Belajar Sekarang</span>
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={resetOnboarding}
          className="rounded-xl border border-line py-2.5 text-sm text-muted hover:border-line-active hover:text-ink cursor-pointer transition-colors"
        >
          Ulangi Asesmen
        </button>
      </div>
    </div>
  );
}
