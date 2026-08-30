import { z } from "zod";
import {
  CONDITION_NONE,
  CONDITION_OPTIONS,
  DURATION_OPTIONS,
  FAMILY_HISTORY_NONE,
  FAMILY_HISTORY_OPTIONS,
  HAIR_WASH_OPTIONS,
  MENSTRUAL_OPTIONS,
  PATTERN_OPTIONS,
  PREGNANCY_OPTIONS,
  PROCEDURE_KEYS,
  PRODUCT_DURATION_OPTIONS,
  PRODUCT_KEYS,
  SAMPLE_OPTIONS,
  SESSION_OPTIONS,
  SMOKING_SEVERITY_OPTIONS,
  TRIGGER_OPTIONS,
} from "./options";

export const productRowSchema = z.discriminatedUnion("used", [
  z.object({ used: z.literal(false) }),
  z.object({
    used: z.literal(true),
    duration: z.enum(PRODUCT_DURATION_OPTIONS),
    helped: z.boolean(),
    side_effects: z.boolean(),
  }),
]);

export const procedureRowSchema = z.discriminatedUnion("done", [
  z.object({ done: z.literal(false) }),
  z.object({
    done: z.literal(true),
    sessions: z.enum(SESSION_OPTIONS),
    helped: z.boolean(),
  }),
]);

export const habitsSchema = z
  .object({
    smoking: z.boolean(),
    smoking_severity: z.enum(SMOKING_SEVERITY_OPTIONS).optional(),
    alcohol: z.boolean(),
    hard_water: z.boolean(),
    hair_wash_frequency: z.enum(HAIR_WASH_OPTIONS),
    heating_tools_styling_chemicals: z.boolean(),
    salon_treatments: z.boolean(),
    salon_treatment_detail: z.string().optional(),
  })
  .superRefine((habits, ctx) => {
    if (habits.smoking && !habits.smoking_severity) {
      ctx.addIssue({
        code: "custom",
        message: "How much do you smoke?",
        path: ["smoking_severity"],
      });
    }
    if (!habits.smoking && habits.smoking_severity) {
      ctx.addIssue({
        code: "custom",
        message: "Severity only applies if you smoke.",
        path: ["smoking_severity"],
      });
    }
    if (habits.salon_treatments && !habits.salon_treatment_detail?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Which salon treatment?",
        path: ["salon_treatment_detail"],
      });
    }
  });

export const productsSchema = z.object({
  "OTC/Medicated Shampoos": productRowSchema,
  "Hair Oils/Serums": productRowSchema,
  "Topical Minoxidil": productRowSchema,
  "Oral Minoxidil": productRowSchema,
  Supplements: productRowSchema,
});

export const proceduresSchema = z.object({
  "PRP/GFC/iPRF": procedureRowSchema,
  "Stem Cells/Exosomes": procedureRowSchema,
  "Hair Transplant": procedureRowSchema,
  Other: procedureRowSchema,
});

/**
 * Complete intake. Coverage matches intake-schema.json.
 *
 * Biological sex is not a field. Q6/Q7 are asked of everyone;
 * "Not applicable" is a first-class answer. If Q6 is N/A, Q7 must
 * also be N/A (the UI skips Q7 and writes that).
 */
export const IntakeSchema = z
  .object({
    age_hair_loss_began: z.number().int().min(5).max(90),
    duration: z.enum(DURATION_OPTIONS),
    family_history: z
      .array(z.enum(FAMILY_HISTORY_OPTIONS))
      .min(1)
      .refine(
        (values) => !(values.includes(FAMILY_HISTORY_NONE) && values.length > 1),
        "Choose family members or “no known history”, not both.",
      ),
    pattern: z.array(z.enum(PATTERN_OPTIONS)).min(1),
    diagnosed_conditions: z
      .array(z.enum(CONDITION_OPTIONS))
      .min(1)
      .refine(
        (values) => !(values.includes(CONDITION_NONE) && values.length > 1),
        "Choose conditions or “None”, not both.",
      ),
    menstrual_cycle: z.enum(MENSTRUAL_OPTIONS),
    pregnancy_related: z.enum(PREGNANCY_OPTIONS),
    adult_acne_oily_skin: z.boolean(),
    excess_body_facial_hair: z.boolean(),
    past_6_months: z.array(z.enum(TRIGGER_OPTIONS)),
    habits: habitsSchema,
    products: productsSchema,
    procedures: proceduresSchema,
    past_treatment_side_effects: z.boolean(),
    describe: z.string().optional(),
    other_clinic_treatment: z.string().optional(),
    sample_type: z.enum(SAMPLE_OPTIONS),
    consent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      data.menstrual_cycle === "Not applicable" &&
      data.pregnancy_related !== "Not applicable"
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Pregnancy is N/A when periods/pregnancy don’t apply.",
        path: ["pregnancy_related"],
      });
    }
  });

export type Intake = z.infer<typeof IntakeSchema>;
export type ProductRow = z.infer<typeof productRowSchema>;
export type ProcedureRow = z.infer<typeof procedureRowSchema>;
export type Habits = z.infer<typeof habitsSchema>;

export type ProductDraft = {
  used: boolean;
  duration?: (typeof PRODUCT_DURATION_OPTIONS)[number];
  helped?: boolean;
  side_effects?: boolean;
  /** Optional notes. Folded into Q14 `describe` on submit — not a schema field. */
  side_effect_notes?: string[];
};

export type ProcedureDraft = {
  done: boolean;
  sessions?: (typeof SESSION_OPTIONS)[number];
  helped?: boolean;
  other_detail?: string;
};

export type IntakeDraft = Omit<Partial<Intake>, "products" | "procedures" | "habits"> & {
  habits?: Partial<Habits>;
  products?: Partial<Record<(typeof PRODUCT_KEYS)[number], ProductDraft>>;
  procedures?: Partial<Record<(typeof PROCEDURE_KEYS)[number], ProcedureDraft>>;
  /** Extra Q14 lines the patient adds on top of product notes. */
  extra_side_effects?: string[];
};

export function parseIntake(data: unknown) {
  return IntakeSchema.safeParse(data);
}

/** Gemini may only produce this. Never write the store until this parses. */
export const ExtractPatchSchema = z.object({
  products: productsSchema.partial().optional(),
  procedures: proceduresSchema.partial().optional(),
  past_treatment_side_effects: z.boolean().optional(),
  describe: z.string().min(1).optional(),
});

export type ExtractPatch = z.infer<typeof ExtractPatchSchema>;
