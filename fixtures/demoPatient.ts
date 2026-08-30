import type { Intake } from "@/lib/schema";

/** Made-up patient used to verify Zod coverage and the clinician summary. */
export const demoPatient: Intake = {
  age_hair_loss_began: 28,
  duration: "Over a year",
  family_history: ["Mother had hair loss"],
  pattern: ["Widening part line", "Diffuse thinning"],
  diagnosed_conditions: ["PCOS/PCOD", "Thyroid disorder"],
  menstrual_cycle: "Irregular",
  pregnancy_related: "Not applicable",
  adult_acne_oily_skin: true,
  excess_body_facial_hair: true,
  past_6_months: ["High stress or emotional trauma"],
  habits: {
    smoking: false,
    alcohol: false,
    hard_water: true,
    hair_wash_frequency: "Alternate Days",
    heating_tools_styling_chemicals: false,
    salon_treatments: true,
    salon_treatment_detail: "Keratin once, 8 months ago",
  },
  products: {
    "OTC/Medicated Shampoos": {
      used: true,
      duration: "3-6mo",
      helped: false,
      side_effects: false,
    },
    "Hair Oils/Serums": { used: false },
    "Topical Minoxidil": {
      used: true,
      duration: ">6mo",
      helped: true,
      side_effects: true,
    },
    "Oral Minoxidil": { used: false },
    Supplements: {
      used: true,
      duration: "3-6mo",
      helped: false,
      side_effects: false,
    },
  },
  procedures: {
    "PRP/GFC/iPRF": { done: true, sessions: "1-3", helped: false },
    "Stem Cells/Exosomes": { done: false },
    "Hair Transplant": { done: false },
    Other: { done: false },
  },
  past_treatment_side_effects: true,
  describe: "Itchy, flaky scalp with topical minoxidil after a few weeks.",
  sample_type: "Saliva",
  consent: true,
};
