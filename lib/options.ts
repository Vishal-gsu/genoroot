/** Option lists — keep in lockstep with intake-schema.json */

export const DURATION_OPTIONS = [
  "Less than 6 months",
  "6-12 months",
  "Over a year",
] as const;

export const FAMILY_HISTORY_OPTIONS = [
  "Father had hair loss",
  "Mother had hair loss",
  "Siblings with thinning or baldness",
  "No known family history",
] as const;

export const FAMILY_HISTORY_NONE = "No known family history" as const;

export const PATTERN_OPTIONS = [
  "Receding hairline",
  "Thinning at crown",
  "Widening part line",
  "Diffuse thinning",
  "Patchy loss",
  "Sudden excessive shedding",
] as const;

export const CONDITION_OPTIONS = [
  "PCOS/PCOD",
  "Thyroid disorder",
  "Diabetes",
  "Autoimmune disease",
  "Anemia",
  "None",
] as const;

export const CONDITION_NONE = "None" as const;

export const MENSTRUAL_OPTIONS = [
  "Regular",
  "Irregular",
  "Menopausal",
  "Not applicable",
] as const;

export const PREGNANCY_OPTIONS = [
  "Currently pregnant",
  "Postpartum <1 year",
  "Not applicable",
] as const;

export const TRIGGER_OPTIONS = [
  "Crash dieting or major weight loss",
  "High stress or emotional trauma",
  "Fever with illness (COVID, Dengue, Typhoid)",
  "Recent surgery",
  "Change in location/water/air quality",
] as const;

export const SMOKING_SEVERITY_OPTIONS = [
  "Mild <5/day",
  "Moderate 5-10/day",
  "Severe >10/day",
] as const;

export const HAIR_WASH_OPTIONS = ["Daily", "Alternate Days", "Weekly"] as const;

export const PRODUCT_KEYS = [
  "OTC/Medicated Shampoos",
  "Hair Oils/Serums",
  "Topical Minoxidil",
  "Oral Minoxidil",
  "Supplements",
] as const;

export const PRODUCT_DURATION_OPTIONS = ["<3mo", "3-6mo", ">6mo"] as const;

export const PROCEDURE_KEYS = [
  "PRP/GFC/iPRF",
  "Stem Cells/Exosomes",
  "Hair Transplant",
  "Other",
] as const;

export const SESSION_OPTIONS = ["1-3", "4-6", ">6"] as const;

export const SAMPLE_OPTIONS = ["Saliva", "Blood", "Either"] as const;

export type Duration = (typeof DURATION_OPTIONS)[number];
export type FamilyHistory = (typeof FAMILY_HISTORY_OPTIONS)[number];
export type Pattern = (typeof PATTERN_OPTIONS)[number];
export type Condition = (typeof CONDITION_OPTIONS)[number];
export type MenstrualCycle = (typeof MENSTRUAL_OPTIONS)[number];
export type PregnancyRelated = (typeof PREGNANCY_OPTIONS)[number];
export type Trigger = (typeof TRIGGER_OPTIONS)[number];
export type SmokingSeverity = (typeof SMOKING_SEVERITY_OPTIONS)[number];
export type HairWashFrequency = (typeof HAIR_WASH_OPTIONS)[number];
export type ProductKey = (typeof PRODUCT_KEYS)[number];
export type ProductDuration = (typeof PRODUCT_DURATION_OPTIONS)[number];
export type ProcedureKey = (typeof PROCEDURE_KEYS)[number];
export type SessionCount = (typeof SESSION_OPTIONS)[number];
export type SampleType = (typeof SAMPLE_OPTIONS)[number];
