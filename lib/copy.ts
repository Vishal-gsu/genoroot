import type { Pattern, ProductKey, ProcedureKey, Trigger } from "./options";

export const PATTERN_COPY: Record<Pattern, { title: string; hint: string }> = {
  "Receding hairline": {
    title: "Hairline moving back",
    hint: "Temples or front",
  },
  "Thinning at crown": {
    title: "Thinning on top",
    hint: "The crown / vertex",
  },
  "Widening part line": {
    title: "Part looking wider",
    hint: "More scalp showing",
  },
  "Diffuse thinning": {
    title: "All-over thinning",
    hint: "Ponytail feels thinner",
  },
  "Patchy loss": {
    title: "Patches",
    hint: "Coin-sized bare spots",
  },
  "Sudden excessive shedding": {
    title: "Sudden shedding",
    hint: "Lots of hair in the drain",
  },
};

export const PRODUCT_COPY: Record<ProductKey, string> = {
  "OTC/Medicated Shampoos": "Medicated / anti-hair-loss shampoo",
  "Hair Oils/Serums": "Hair oils or serums",
  "Topical Minoxidil": "Minoxidil on the scalp",
  "Oral Minoxidil": "Minoxidil tablets",
  Supplements: "Hair supplements",
};

export const PROCEDURE_COPY: Record<ProcedureKey, string> = {
  "PRP/GFC/iPRF": "PRP / GFC / iPRF",
  "Stem Cells/Exosomes": "Stem cells or exosomes",
  "Hair Transplant": "Hair transplant",
  Other: "Something else in-clinic",
};

export const TRIGGER_COPY: Record<Trigger, string> = {
  "Crash dieting or major weight loss": "Crash diet or big weight loss",
  "High stress or emotional trauma": "High stress or a hard time",
  "Fever with illness (COVID, Dengue, Typhoid)": "Fever / COVID / dengue / typhoid",
  "Recent surgery": "Surgery",
  "Change in location/water/air quality": "Moved, or water/air changed",
};

export const DURATION_COPY = {
  "<3mo": "Under 3 months",
  "3-6mo": "3–6 months",
  ">6mo": "Over 6 months",
} as const;

export const SESSION_COPY = {
  "1-3": "1–3 sessions",
  "4-6": "4–6 sessions",
  ">6": "More than 6",
} as const;

export const SMOKING_COPY = {
  "Mild <5/day": "Less than 5 a day",
  "Moderate 5-10/day": "5 to 10 a day",
  "Severe >10/day": "More than 10 a day",
} as const;

export const HAIR_WASH_COPY = {
  Daily: "Every day",
  "Alternate Days": "Every other day",
  Weekly: "About once a week",
} as const;
