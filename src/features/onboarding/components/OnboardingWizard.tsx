import { Fragment } from "react";
import { useOnboarding } from "../context/OnboardingContext";
import EssayStep from "./EssayStep";
import PillarValidationStep from "./PillarValidationStep";
import AssessmentStep from "./AssessmentStep";
import ResultRevealStep from "./ResultRevealStep";
import { CheckIcon } from "@/shared/icons";

const STEP_LABELS = [
  "Esai",
  "Pilih Pilar",
  "Asesmen",
  "Hasil",
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <Fragment key={stepNum}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isDone
                    ? "bg-primary text-white"
                    : isActive
                    ? "border-2 border-primary bg-primary/10 text-primary"
                    : "border border-line bg-canvas text-muted"
                }`}
              >
                {isDone ? (
                  <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`mb-5 h-px w-8 transition-colors ${
                  isDone ? "bg-primary" : "bg-line"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export default function OnboardingWizard() {
  const { step } = useOnboarding();

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator current={step} />

      <div className="min-h-[300px]">
        {step === 1 && <EssayStep />}
        {step === 2 && <PillarValidationStep />}
        {step === 3 && <AssessmentStep />}
        {step === 4 && <ResultRevealStep />}
      </div>
    </div>
  );
}
