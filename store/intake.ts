"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { visibleSteps, type StepId } from "@/lib/flow";
import { applyMenstrualAnswer, finalizeDraft } from "@/lib/inference";
import type { Lang } from "@/lib/i18n";
import { parseIntake, type Intake, type IntakeDraft } from "@/lib/schema";

type IntakeStore = {
  stepId: StepId;
  lang: Lang | null;
  answers: IntakeDraft;
  direction: 1 | -1;
  hydrated: boolean;
  setHydrated: () => void;
  setLang: (lang: Lang) => void;
  setAnswer: <K extends keyof Intake>(key: K, value: Intake[K]) => void;
  patchAnswers: (partial: IntakeDraft) => void;
  next: () => void;
  back: () => void;
  goTo: (id: StepId) => void;
  loadDemo: (answers: Intake) => void;
  reset: () => void;
  canSubmit: () => boolean;
};

function applyField<K extends keyof Intake>(
  answers: IntakeDraft,
  key: K,
  value: Intake[K],
): IntakeDraft {
  if (key === "menstrual_cycle") {
    return applyMenstrualAnswer(answers, value as Intake["menstrual_cycle"]);
  }
  return { ...answers, [key]: value };
}

export const useIntakeStore = create<IntakeStore>()(
  persist(
    (set, get) => ({
      stepId: "welcome",
      lang: null,
      answers: {},
      direction: 1,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setLang: (lang) => set({ lang }),
      setAnswer: (key, value) =>
        set({ answers: applyField(get().answers, key, value) }),
      patchAnswers: (partial) =>
        set({ answers: { ...get().answers, ...partial } }),
      next: () => {
        const { stepId, answers, lang } = get();
        if (stepId === "welcome" && !lang) return;
        const steps = visibleSteps(answers);
        const index = steps.findIndex((step) => step.id === stepId);
        const following = steps[index + 1];
        if (following) set({ stepId: following.id, direction: 1 });
      },
      back: () => {
        const { stepId, answers } = get();
        const steps = visibleSteps(answers);
        const index = steps.findIndex((step) => step.id === stepId);
        const previous = steps[index - 1];
        if (previous) set({ stepId: previous.id, direction: -1 });
      },
      goTo: (id) => {
        const steps = visibleSteps(get().answers);
        const current = steps.findIndex((step) => step.id === get().stepId);
        const target = steps.findIndex((step) => step.id === id);
        set({
          stepId: id,
          direction: target >= current ? 1 : -1,
        });
      },
      loadDemo: (answers) =>
        set({
          answers,
          stepId: "summary",
          direction: 1,
          lang: get().lang ?? "en",
        }),
      reset: () =>
        set({ stepId: "welcome", answers: {}, direction: 1, lang: null }),
      canSubmit: () => parseIntake(finalizeDraft(get().answers)).success,
    }),
    {
      name: "genoroot-intake",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        stepId: state.stepId,
        answers: state.answers,
        lang: state.lang,
      }),
      skipHydration: true,
    },
  ),
);
