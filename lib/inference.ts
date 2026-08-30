import { PRODUCT_COPY } from "./copy";
import {
  CONDITION_NONE,
  FAMILY_HISTORY_NONE,
  PROCEDURE_KEYS,
  PRODUCT_KEYS,
  type Condition,
  type FamilyHistory,
  type ProcedureKey,
  type ProductKey,
} from "./options";
import type { Intake, IntakeDraft, ProductDraft } from "./schema";

export function toggleExclusiveNone<T extends string>(
  current: T[],
  option: T,
  noneValue: T,
): T[] {
  if (option === noneValue) return [noneValue];
  const withoutNone = current.filter((value) => value !== noneValue);
  if (withoutNone.includes(option)) {
    return withoutNone.filter((value) => value !== option);
  }
  return [...withoutNone, option];
}

export function toggleFamilyHistory(
  current: FamilyHistory[],
  option: FamilyHistory,
) {
  return toggleExclusiveNone(current, option, FAMILY_HISTORY_NONE);
}

export function toggleCondition(current: Condition[], option: Condition) {
  return toggleExclusiveNone(current, option, CONDITION_NONE);
}

export function mentionsPcos(answers: IntakeDraft) {
  return answers.diagnosed_conditions?.includes("PCOS/PCOD") ?? false;
}

export function shouldAskPregnancy(answers: IntakeDraft) {
  return answers.menstrual_cycle !== "Not applicable";
}

export function applyMenstrualAnswer(
  answers: IntakeDraft,
  menstrual_cycle: Intake["menstrual_cycle"],
): IntakeDraft {
  if (menstrual_cycle === "Not applicable") {
    return { ...answers, menstrual_cycle, pregnancy_related: "Not applicable" };
  }
  return { ...answers, menstrual_cycle };
}

export function inferSideEffectsYesNo(
  answers: IntakeDraft,
): boolean | undefined {
  const products = answers.products;
  if (!products) return undefined;

  const rows = Object.values(products) as (ProductDraft | undefined)[];
  const used = rows.filter((row): row is ProductDraft & { used: true } =>
    Boolean(row && row.used),
  );

  if (used.some((row) => row.side_effects === true)) return true;
  if (used.length > 0 && used.every((row) => row.side_effects === false)) {
    return false;
  }
  if (rows.length > 0 && rows.every((row) => row && row.used === false)) {
    return false;
  }
  return undefined;
}

/** One line per product note, e.g. "Minoxidil on the scalp — itchy". */
export function composeSideEffectLines(answers: IntakeDraft): string[] {
  const lines: string[] = [];
  for (const key of PRODUCT_KEYS) {
    const row = answers.products?.[key];
    if (!row?.used || row.side_effects !== true) continue;
    const notes = (row.side_effect_notes ?? []).map((note) => note.trim()).filter(Boolean);
    for (const note of notes) {
      lines.push(`${PRODUCT_COPY[key]} — ${note}`);
    }
  }
  for (const extra of answers.extra_side_effects ?? []) {
    const note = extra.trim();
    if (note) lines.push(note);
  }
  return lines;
}

function cleanProduct(row: ProductDraft | undefined): Intake["products"][ProductKey] | undefined {
  if (!row) return undefined;
  if (!row.used) return { used: false };
  if (!row.duration || typeof row.helped !== "boolean" || typeof row.side_effects !== "boolean") {
    return undefined;
  }
  return {
    used: true,
    duration: row.duration,
    helped: row.helped,
    side_effects: row.side_effects,
  };
}

/** Strip UI-only notes and fold them into Q14 `describe` for Zod. */
export function finalizeDraft(draft: IntakeDraft): unknown {
  const products = Object.fromEntries(
    PRODUCT_KEYS.map((key) => [key, cleanProduct(draft.products?.[key])]),
  ) as Intake["products"];

  const procedures = Object.fromEntries(
    PROCEDURE_KEYS.map((key) => {
      const row = draft.procedures?.[key as ProcedureKey];
      if (!row) return [key, undefined];
      if (!row.done) return [key, { done: false as const }];
      if (!row.sessions || typeof row.helped !== "boolean") return [key, undefined];
      return [key, { done: true as const, sessions: row.sessions, helped: row.helped }];
    }),
  );

  const otherDetail = draft.procedures?.Other?.done
    ? draft.procedures.Other.other_detail?.trim()
    : undefined;

  const inferred = inferSideEffectsYesNo(draft);
  const past = draft.past_treatment_side_effects ?? inferred;
  const fromNotes = composeSideEffectLines(draft).join("\n");
  const describe = past
    ? fromNotes || draft.describe?.trim() || undefined
    : undefined;

  const { extra_side_effects: _extra, ...rest } = draft;
  return {
    ...rest,
    products,
    procedures,
    past_treatment_side_effects: past,
    describe,
    other_clinic_treatment: otherDetail || undefined,
  };
}
