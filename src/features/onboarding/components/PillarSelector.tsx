import type { ComponentType } from "react";
import type { PillarItem } from "../services/onboardingService";
import {
  ChartIcon,
  CheckIcon,
  CodeIcon,
  EditIcon,
  MaskIcon,
  SparkleIcon,
  TargetIcon,
} from "@/shared/icons";

interface PillarSelectorProps {
  pillars: PillarItem[];
  suggestedIds: string[];
  selectedId: string | null;
  onSelect: (pillar: PillarItem) => void;
}

const PILLAR_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  software_dev: CodeIcon,
  data_ai: TargetIcon,
  infra_security: MaskIcon,
  design_ux: EditIcon,
  tech_management: ChartIcon,
};

export default function PillarSelector({
  pillars,
  suggestedIds,
  selectedId,
  onSelect,
}: PillarSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Pillar minat">
      {pillars.map((pillar) => {
        const isSuggested = suggestedIds.includes(pillar.id);
        const isSelected = selectedId === pillar.id;
        const IconComponent = PILLAR_ICONS[pillar.id] || SparkleIcon;

        return (
          <button
            key={pillar.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(pillar)}
            className={`cursor-pointer rounded-xl border p-4 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                : "border-line bg-surface hover:border-line-active hover:bg-elevate"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <IconComponent className="h-6 w-6" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-sm text-ink">{pillar.name}</h4>
                  {isSuggested && (
                    <span className="inline-block mt-0.5 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                      Direkomendasikan AI
                    </span>
                  )}
                </div>
              </div>
              <span
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${
                  isSelected ? "border-primary bg-primary text-white" : "border-line"
                }`}
              >
                {isSelected && <CheckIcon className="h-3 w-3" />}
              </span>
            </div>
            {pillar.description && (
              <p className="mt-2.5 text-xs text-muted leading-relaxed line-clamp-2">
                {pillar.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
