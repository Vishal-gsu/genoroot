import { shouldAskPregnancy } from "./inference";
import { habitsSchema, type IntakeDraft } from "./schema";
import { PROCEDURE_KEYS, PRODUCT_KEYS } from "./options";

export type SectionId = "A" | "B" | "C" | "D" | "E";

export type StepId =
  | "welcome"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "q10"
  | "q11"
  | "q12"
  | "q13"
  | "q14"
  | "q15"
  | "q16"
  | "summary";

export type StepDef = {
  id: StepId;
  section: SectionId | null;
  label: string;
};

export const STEPS: StepDef[] = [
  { id: "welcome", section: null, label: "Welcome" },
  { id: "q1", section: "A", label: "When it started" },
  { id: "q2", section: "A", label: "How long" },
  { id: "q3", section: "A", label: "Family" },
  { id: "q4", section: "A", label: "Pattern" },
  { id: "q5", section: "B", label: "Conditions" },
  { id: "q6", section: "B", label: "Periods" },
  { id: "q7", section: "B", label: "Pregnancy" },
  { id: "q8", section: "B", label: "Skin" },
  { id: "q9", section: "B", label: "Body hair" },
  { id: "q10", section: "C", label: "Last 6 months" },
  { id: "q11", section: "C", label: "Habits" },
  { id: "q12", section: "D", label: "Products" },
  { id: "q13", section: "D", label: "Procedures" },
  { id: "q14", section: "D", label: "Side effects" },
  { id: "q15", section: "E", label: "Sample" },
  { id: "q16", section: "E", label: "Consent" },
  { id: "summary", section: null, label: "Summary" },
];

export const SECTION_TITLES: Record<SectionId, string> = {
  A: "Hair history",
  B: "Hormones & health",
  C: "Lifestyle",
  D: "Treatments",
  E: "Sample & consent",
};

export function isStepVisible(id: StepId, answers: IntakeDraft) {
  if (id === "q7") return shouldAskPregnancy(answers);
  return true;
}

export function visibleSteps(answers: IntakeDraft) {
  return STEPS.filter((step) => isStepVisible(step.id, answers));
}

export function isStepComplete(id: StepId, answers: IntakeDraft): boolean {
  switch (id) {
    case "welcome":
    case "summary":
      return true;
    case "q1":
      return typeof answers.age_hair_loss_began === "number";
    case "q2":
      return Boolean(answers.duration);
    case "q3":
      return (answers.family_history?.length ?? 0) > 0;
    case "q4":
      return (answers.pattern?.length ?? 0) > 0;
    case "q5":
      return (answers.diagnosed_conditions?.length ?? 0) > 0;
    case "q6":
      return Boolean(answers.menstrual_cycle);
    case "q7":
      return Boolean(answers.pregnancy_related);
    case "q8":
      return typeof answers.adult_acne_oily_skin === "boolean";
    case "q9":
      return typeof answers.excess_body_facial_hair === "boolean";
    case "q10":
      return answers.past_6_months !== undefined;
    case "q11":
      return habitsSchema.safeParse(answers.habits).success;
    case "q12":
      return PRODUCT_KEYS.every((key) => {
        const row = answers.products?.[key];
        if (!row) return false;
        if (!row.used) return true;
        return (
          Boolean(row.duration) &&
          typeof row.helped === "boolean" &&
          typeof row.side_effects === "boolean"
        );
      });
    case "q13":
      return PROCEDURE_KEYS.every((key) => {
        const row = answers.procedures?.[key];
        if (!row) return false;
        if (!row.done) return true;
        const core = Boolean(row.sessions) && typeof row.helped === "boolean";
        if (key !== "Other") return core;
        const detail = row.other_detail?.trim() ?? "";
        const words = detail ? detail.split(/\s+/).length : 0;
        return core && detail.length >= 2 && words <= 40;
      });
    case "q14":
      return typeof answers.past_treatment_side_effects === "boolean";
    case "q15":
      return Boolean(answers.sample_type);
    case "q16":
      return typeof answers.consent === "boolean";
  }
}
