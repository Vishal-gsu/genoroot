export type Lang = "en" | "hi" | "hinglish";

export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: "en", label: "English", short: "EN" },
  { id: "hi", label: "हिंदी", short: "हिं" },
  { id: "hinglish", label: "Hinglish", short: "Hing." },
];

export function wordCount(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export const OTHER_WORD_LIMIT = 40;

type Dict = {
  clinic: string;
  loading: string;
  back: string;
  continue: string;
  start: string;
  yes: string;
  no: string;
  welcomeKicker: string;
  welcomeTitle: string;
  welcomeWhy: string;
  welcomeBullets: [string, string, string];
  sample: string;
  langHint: string;
  langNeed: string;
  cancel: string;
  sections: { A: string; B: string; C: string; D: string; E: string };
  q: Record<string, { title: string; hint?: string; kicker: string }>;
  duration: Record<string, string>;
  family: Record<string, string>;
  pattern: Record<string, { title: string; hint: string }>;
  condition: Record<string, string>;
  menstrual: Record<string, string>;
  pregnancy: Record<string, string>;
  trigger: Record<string, string>;
  product: Record<string, string>;
  procedure: Record<string, string>;
  productDuration: Record<string, string>;
  sessions: Record<string, string>;
  smoking: Record<string, string>;
  wash: Record<string, string>;
  sampleOpt: Record<string, string>;
  sampleHint: Record<string, string>;
  habits: {
    smoke: [string, string];
    smokeHow: string;
    alcohol: [string, string];
    water: [string, string];
    wash: [string, string];
    heat: [string, string];
    salon: [string, string];
    salonWhich: string;
  };
  q6na: string;
  q6meno: string;
  q6pcos: string;
  q6hint: string;
  q12hint: string;
  q13hint: string;
  howLong: string;
  didHelp: string;
  anySide: string;
  sessionAsk: string;
  sideOptional: string;
  addMore: string;
  typeInstead: string;
  typePlaceholder: string;
  sideNote: string;
  anotherNote: string;
  typeHelp: string;
  fillBoxes: string;
  reading: string;
  tapsInstead: string;
  otherWhat: string;
  otherPlaceholder: string;
  wordsLeft: string;
  q14fromProducts: string;
  q14marked: string;
  q14none: string;
  q14ask: string;
  q14optional: string;
  anythingElse: string;
  q14example: string;
  yearsOld: string;
  agree: string;
  disagree: string;
  report: {
    kicker: string;
    title: string;
    subtitle: string;
    notDx: string;
    snapshot: string;
    onset: string;
    lasting: string;
    pattern: string;
    family: string;
    health: string;
    hormones: string;
    skin: string;
    bodyHair: string;
    lifestyle: string;
    last6: string;
    noneListed: string;
    usedNow: string;
    unused: string;
    inClinic: string;
    noneTried: string;
    sides: string;
    noSides: string;
    sample: string;
    consent: string;
    consented: string;
    declined: string;
    download: string;
    downloadIn: string;
    copyJson: string;
    copied: string;
    startOver: string;
    incomplete: string;
    goBack: string;
    footer: string;
    helped: string;
    noHelp: string;
    other: string;
    date: string;
  };
};

export function displayClass(lang: Lang | null | undefined) {
  return lang === "hi"
    ? "font-[family-name:var(--font-hindi)]"
    : "font-[family-name:var(--font-display)]";
}

const en: Dict = {
  clinic: "GenoRoot",
  loading: "Loading…",
  back: "Back",
  continue: "Continue",
  start: "Start",
  yes: "Yes",
  no: "No",
  welcomeKicker: "Before you see the doctor",
  welcomeTitle: "A few taps so your doctor already knows.",
  welcomeWhy:
    "Hair loss has many causes. Answer what fits — we’ll skip the rest. You get a one-page note to take in.",
  welcomeBullets: [
    "Tap what fits. Nothing extra.",
    "About 4 minutes. No login.",
    "Keep a copy on your phone.",
  ],
  sample: "See a sample",
  langHint: "Language",
  langNeed: "Choose a language above to begin",
  cancel: "Cancel",
  sections: {
    A: "Your hair",
    B: "Health",
    C: "Lifestyle",
    D: "Treatments",
    E: "Sample",
  },
  q: {
    q1: { kicker: "1 of 16", title: "About what age did hair loss start?", hint: "A guess is fine." },
    q2: { kicker: "2 of 16", title: "How long has this been going on?" },
    q3: { kicker: "3 of 16", title: "Anyone in the family with thinning or baldness?", hint: "Tap all that fit." },
    q4: { kicker: "4 of 16", title: "Where do you notice it most?", hint: "Tap every picture that fits." },
    q5: { kicker: "5 of 16", title: "Has a doctor named any of these?", hint: "Only a real diagnosis — not a guess." },
    q6: { kicker: "6 of 16", title: "Periods or pregnancy — does this apply to you?" },
    q7: { kicker: "7 of 16", title: "Any pregnancy-related hair change?" },
    q8: { kicker: "8 of 16", title: "As an adult, acne or very oily skin?" },
    q9: { kicker: "9 of 16", title: "Extra hair on the face or body?" },
    q10: { kicker: "10 of 16", title: "In the last 6 months, did any of these happen?", hint: "Tap all that fit. Continue if none." },
    q11: { kicker: "11 of 16", title: "Daily habits", hint: "No is left. Yes is right. Extra questions open under Yes." },
    q12: { kicker: "12 of 16", title: "Which of these have you used?" },
    q13: { kicker: "13 of 16", title: "Any clinic treatments?" },
    q14: { kicker: "14 of 16", title: "Any side effects or a poor response to treatment?" },
    q15: { kicker: "15 of 16", title: "If we need a sample, what do you prefer?" },
    q16: {
      kicker: "16 of 16",
      title: "Do you agree to a sample and genetic analysis?",
      hint: "You can say no. The doctor still sees the rest of this note.",
    },
  },
  duration: {
    "Less than 6 months": "Under 6 months",
    "6-12 months": "6–12 months",
    "Over a year": "Over a year",
  },
  family: {
    "Father had hair loss": "Father",
    "Mother had hair loss": "Mother",
    "Siblings with thinning or baldness": "Brother or sister",
    "No known family history": "No one I know of",
  },
  pattern: {
    "Receding hairline": { title: "Hairline moving back", hint: "Temples or front" },
    "Thinning at crown": { title: "Thinning on top", hint: "The crown" },
    "Widening part line": { title: "Wider part", hint: "More scalp showing" },
    "Diffuse thinning": { title: "All-over thinning", hint: "Ponytail feels thinner" },
    "Patchy loss": { title: "Patches", hint: "Coin-sized spots" },
    "Sudden excessive shedding": { title: "Sudden shedding", hint: "Lots in the drain" },
  },
  condition: {
    "PCOS/PCOD": "PCOS / PCOD",
    "Thyroid disorder": "Thyroid",
    Diabetes: "Diabetes",
    "Autoimmune disease": "Autoimmune",
    Anemia: "Anaemia",
    None: "None of these",
  },
  menstrual: {
    Regular: "Regular periods",
    Irregular: "Irregular periods",
    Menopausal: "Menopause",
    "Not applicable": "Doesn’t apply to me",
  },
  pregnancy: {
    "Currently pregnant": "Pregnant now",
    "Postpartum <1 year": "Had a baby in the last year",
    "Not applicable": "Doesn’t apply",
  },
  trigger: {
    "Crash dieting or major weight loss": "Crash diet or big weight loss",
    "High stress or emotional trauma": "High stress or a hard time",
    "Fever with illness (COVID, Dengue, Typhoid)": "High fever (COVID, dengue, typhoid)",
    "Recent surgery": "Surgery",
    "Change in location/water/air quality": "Moved, or water / air changed",
  },
  product: {
    "OTC/Medicated Shampoos": "Hair-loss shampoo",
    "Hair Oils/Serums": "Oil or serum",
    "Topical Minoxidil": "Minoxidil on the scalp",
    "Oral Minoxidil": "Minoxidil tablets",
    Supplements: "Hair supplements",
  },
  procedure: {
    "PRP/GFC/iPRF": "PRP / GFC / iPRF",
    "Stem Cells/Exosomes": "Stem cells or exosomes",
    "Hair Transplant": "Hair transplant",
    Other: "Something else at a clinic",
  },
  productDuration: { "<3mo": "Under 3 months", "3-6mo": "3–6 months", ">6mo": "Over 6 months" },
  sessions: { "1-3": "1–3 sessions", "4-6": "4–6 sessions", ">6": "More than 6" },
  smoking: {
    "Mild <5/day": "Under 5 a day",
    "Moderate 5-10/day": "5–10 a day",
    "Severe >10/day": "Over 10 a day",
  },
  wash: { Daily: "Every day", "Alternate Days": "Every other day", Weekly: "Once a week" },
  sampleOpt: { Saliva: "Saliva", Blood: "Blood", Either: "Either is fine" },
  sampleHint: {
    Saliva: "A spit sample",
    Blood: "A small blood draw",
    Either: "Whatever the clinic prefers",
  },
  habits: {
    smoke: ["Smoking", "Cigarettes, beedi, or vape"],
    smokeHow: "How many a day?",
    alcohol: ["Alcohol", "Beer, wine, or spirits — even occasionally is Yes"],
    water: ["Hard water", "White scale on taps, or stiff hair after a wash"],
    wash: ["Hair wash", "How often do you wash it?"],
    heat: ["Heat & colour", "Straightener, dryer, dye, bleach, or home keratin"],
    salon: ["Salon treatments", "Keratin, rebonding, or smoothening"],
    salonWhich: "Which one? Optional.",
  },
  q6na: "Doesn’t apply to me",
  q6meno: "Menopause",
  q6pcos: "You mentioned PCOS — this often matters.",
  q6hint: "We don’t ask gender. If this isn’t you, say it doesn’t apply.",
  q12hint: "Tick what you’ve used. Details open underneath.",
  q13hint: "Tick any you’ve had. Details open on this page.",
  howLong: "For how long?",
  didHelp: "Did it help?",
  anySide: "Any side effects?",
  sessionAsk: "How many sessions?",
  sideOptional: "Optional — this goes on the doctor’s page.",
  addMore: "+ Add more",
  typeInstead: "Easier to type it?",
  typePlaceholder:
    "e.g. minoxidil foam for 8 months, helped a bit, scalp got itchy; 3 PRP last year…",
  sideNote: "e.g. itchy scalp…",
  anotherNote: "Another side effect",
  typeHelp: "Write it like you’d tell the nurse. We’ll tick the boxes.",
  fillBoxes: "Fill the boxes",
  reading: "Reading…",
  tapsInstead: "Use taps instead",
  otherWhat: "What else did you try at a clinic?",
  otherPlaceholder: "e.g. mesotherapy, laser cap…",
  wordsLeft: "words left",
  q14fromProducts: "We kept the notes from products you used. They stay even if you say No here.",
  q14marked: "You marked side effects on a product. Confirm Yes or No below.",
  q14none: "Nothing on the products page was marked. Still right?",
  q14ask: "Any side effects or a poor response to treatment?",
  q14optional: "A short note is enough if you say Yes.",
  anythingElse: "Anything else?",
  q14example: "e.g. Minoxidil — itchy scalp",
  yearsOld: "years old",
  agree: "I agree",
  disagree: "I do not agree",
  report: {
    kicker: "Pre-consult note",
    title: "Hair & scalp intake",
    subtitle: "Patient-completed. Facts only — not a diagnosis.",
    notDx: "For the consulting doctor. Print or save as PDF (A4).",
    snapshot: "At a glance",
    onset: "Age at onset",
    lasting: "Duration",
    pattern: "Pattern",
    family: "Family history",
    health: "Diagnosed conditions",
    hormones: "Periods / pregnancy",
    skin: "Adult acne or oily skin",
    bodyHair: "Excess body or facial hair",
    lifestyle: "Lifestyle & triggers",
    last6: "Last 6 months",
    noneListed: "None of the listed events",
    usedNow: "Products used",
    unused: "Not used",
    inClinic: "In-clinic procedures",
    noneTried: "None reported",
    sides: "Side effects / poor response",
    noSides: "None reported",
    sample: "Preferred sample",
    consent: "Consent for sample & genetic analysis",
    consented: "Yes",
    declined: "Declined",
    download: "Download",
    downloadIn: "Download in",
    copyJson: "Copy JSON",
    copied: "Copied",
    startOver: "Start over",
    incomplete: "A few answers still need a look before we can make the note.",
    goBack: "Back to the questions",
    footer: "Generated from the clinic intake. No patient database. Not a prescription.",
    helped: "helped",
    noHelp: "no clear help",
    other: "Other",
    date: "Date",
  },
};

const hi: Dict = {
  ...en,
  loading: "लोड हो रहा है…",
  back: "वापस",
  continue: "जारी रखें",
  start: "शुरू करें",
  yes: "हाँ",
  no: "नहीं",
  welcomeKicker: "डॉक्टर से मिलने से पहले",
  welcomeTitle: "कुछ टैप, ताकि डॉक्टर पहले से जानें।",
  welcomeWhy:
    "बाल झड़ने की कई वजहें होती हैं। जो सही लगे, वही बताएँ — बाकी छूट जाएगा। एक पन्ने का नोट आपके फ़ोन पर रहेगा।",
  welcomeBullets: [
    "जो सही लगे, टैप करें। कुछ अतिरिक्त नहीं।",
    "लगभग 4 मिनट। लॉगिन नहीं।",
    "कॉपी आपके फ़ोन पर रहेगी।",
  ],
  sample: "नमूना देखें",
  langHint: "भाषा",
  langNeed: "ऊपर भाषा चुनकर शुरू करें",
  cancel: "रद्द करें",
  sections: {
    A: "आपके बाल",
    B: "सेहत",
    C: "रोज़मर्रा",
    D: "इलाज",
    E: "सैंपल",
  },
  q: {
    q1: { kicker: "1 / 16", title: "बाल झड़ना लगभग किस उम्र में शुरू हुआ?", hint: "अनुमान पर्याप्त है।" },
    q2: { kicker: "2 / 16", title: "यह कितने समय से हो रहा है?" },
    q3: { kicker: "3 / 16", title: "परिवार में किसी के बाल पतले हुए हैं, या गंजापन है?", hint: "जितने सही लगें, चुनें।" },
    q4: { kicker: "4 / 16", title: "सबसे अधिक कहाँ दिखता है?", hint: "हर सही चित्र पर टैप करें।" },
    q5: { kicker: "5 / 16", title: "डॉक्टर ने इनमें से कोई रोग बताया है?", hint: "केवल पक्का निदान — अनुमान नहीं।" },
    q6: { kicker: "6 / 16", title: "मासिक धर्म या गर्भावस्था — क्या यह आप पर लागू होता है?" },
    q7: { kicker: "7 / 16", title: "गर्भावस्था से जुड़ा बालों में कोई बदलाव?" },
    q8: { kicker: "8 / 16", title: "वयस्क उम्र में मुँहासे या बहुत तैलीय त्वचा?" },
    q9: { kicker: "9 / 16", title: "चेहरे या शरीर पर सामान्य से अधिक बाल?" },
    q10: { kicker: "10 / 16", title: "पिछले 6 महीनों में इनमें से कुछ हुआ?", hint: "जो सही लगे, चुनें। कुछ नहीं तो आगे बढ़ें।" },
    q11: { kicker: "11 / 16", title: "रोज़मर्रा की आदतें", hint: "बाएँ — नहीं, दाएँ — हाँ। हाँ पर नीचे और सवाल खुलते हैं।" },
    q12: { kicker: "12 / 16", title: "इनमें से क्या इस्तेमाल किया है?" },
    q13: { kicker: "13 / 16", title: "क्लिनिक में कोई इलाज कराया?" },
    q14: { kicker: "14 / 16", title: "इलाज से कोई दुष्प्रभाव या कम फ़ायदा हुआ?" },
    q15: { kicker: "15 / 16", title: "यदि सैंपल चाहिए, तो आपकी पसंद?" },
    q16: {
      kicker: "16 / 16",
      title: "सैंपल और आनुवंशिक जाँच की सहमति देते हैं?",
      hint: "ना भी कह सकते हैं। शेष नोट डॉक्टर को दिखेगा।",
    },
  },
  duration: {
    "Less than 6 months": "6 महीने से कम",
    "6-12 months": "6–12 महीने",
    "Over a year": "एक साल से ज़्यादा",
  },
  family: {
    "Father had hair loss": "पिता",
    "Mother had hair loss": "माता",
    "Siblings with thinning or baldness": "भाई या बहन",
    "No known family history": "परिवार में कोई नहीं",
  },
  pattern: {
    "Receding hairline": { title: "हेयरलाइन पीछे", hint: "कनपटी या आगे" },
    "Thinning at crown": { title: "ऊपर से पतले", hint: "ताज / क्राउन" },
    "Widening part line": { title: "माँग चौड़ी", hint: "ज़्यादा स्कैल्प दिखे" },
    "Diffuse thinning": { title: "सब जगह पतले", hint: "चोटी पतली लगे" },
    "Patchy loss": { title: "धब्बे", hint: "सिक्के जितने गोल" },
    "Sudden excessive shedding": { title: "अचानक झड़ना", hint: "नाली में बहुत बाल" },
  },
  condition: {
    "PCOS/PCOD": "PCOS / PCOD",
    "Thyroid disorder": "थायरॉइड",
    Diabetes: "डायबिटीज़",
    "Autoimmune disease": "ऑटोइम्यून",
    Anemia: "एनीमिया",
    None: "इनमें से कोई नहीं",
  },
  menstrual: {
    Regular: "नियमित मासिक धर्म",
    Irregular: "अनियमित मासिक धर्म",
    Menopausal: "रजोनिवृत्ति",
    "Not applicable": "मुझ पर लागू नहीं",
  },
  pregnancy: {
    "Currently pregnant": "अभी गर्भवती",
    "Postpartum <1 year": "पिछले साल में बच्चा हुआ",
    "Not applicable": "लागू नहीं",
  },
  trigger: {
    "Crash dieting or major weight loss": "सख़्त डाइट या तेज़ वजन घटना",
    "High stress or emotional trauma": "ज़्यादा तनाव या मुश्किल समय",
    "Fever with illness (COVID, Dengue, Typhoid)": "तेज़ बुखार (कोविड, डेंगू, टाइफ़ॉइड)",
    "Recent surgery": "सर्जरी",
    "Change in location/water/air quality": "शहर बदला, या पानी / हवा बदली",
  },
  product: {
    "OTC/Medicated Shampoos": "हेयर-लॉस शैम्पू",
    "Hair Oils/Serums": "तेल या सीरम",
    "Topical Minoxidil": "स्कैल्प पर मिनोक्सिडिल",
    "Oral Minoxidil": "मिनोक्सिडिल गोली",
    Supplements: "हेयर सप्लीमेंट",
  },
  procedure: {
    "PRP/GFC/iPRF": "PRP / GFC / iPRF",
    "Stem Cells/Exosomes": "स्टेम सेल या एक्सोसोम",
    "Hair Transplant": "हेयर ट्रांसप्लांट",
    Other: "क्लिनिक में कुछ और",
  },
  productDuration: { "<3mo": "3 महीने से कम", "3-6mo": "3–6 महीने", ">6mo": "6 महीने से ज़्यादा" },
  sessions: { "1-3": "1–3 सेशन", "4-6": "4–6 सेशन", ">6": "6 से ज़्यादा" },
  smoking: {
    "Mild <5/day": "दिन में 5 से कम",
    "Moderate 5-10/day": "दिन में 5–10",
    "Severe >10/day": "दिन में 10 से ज़्यादा",
  },
  wash: { Daily: "रोज़", "Alternate Days": "एक दिन छोड़कर", Weekly: "हफ़्ते में एक बार" },
  sampleOpt: { Saliva: "लार", Blood: "खून", Either: "कोई भी चले" },
  sampleHint: {
    Saliva: "थूक का सैंपल",
    Blood: "थोड़ा खून",
    Either: "क्लिनिक जो कहे",
  },
  habits: {
    smoke: ["धूम्रपान", "सिगरेट, बीड़ी या वेप"],
    smokeHow: "दिन में कितनी?",
    alcohol: ["शराब", "बीयर, वाइन या स्पिरिट — कभी-कभार भी हाँ"],
    water: ["कठोर पानी", "नल पर सफ़ेद परत, या धोने के बाद बाल सख्त"],
    wash: ["बाल धोना", "कितनी बार धोते हैं?"],
    heat: ["गर्मी और रंग", "स्ट्रेटनर, ड्रायर, डाई, ब्लीच या घर पर केराटिन"],
    salon: ["सैलून ट्रीटमेंट", "केराटिन, रीबॉन्डिंग या स्मूदनिंग"],
    salonWhich: "कौन सा? ज़रूरी नहीं।",
  },
  q6na: "मुझ पर लागू नहीं",
  q6meno: "रजोनिवृत्ति",
  q6pcos: "आपने PCOS बताया — यह अक्सर मायने रखता है।",
  q6hint: "लिंग नहीं पूछा जाता। यदि यह आप पर लागू न हो, तो वह विकल्प चुनें।",
  q12hint: "जो इस्तेमाल किया, उस पर निशान लगाएँ। विवरण नीचे खुलता है।",
  q13hint: "जो करवाया हो, उस पर निशान। विवरण इसी पृष्ठ पर।",
  howLong: "कितने समय से?",
  didHelp: "फ़ायदा हुआ?",
  anySide: "कोई साइड इफ़ेक्ट?",
  sessionAsk: "कितने सेशन?",
  sideOptional: "ज़रूरी नहीं — डॉक्टर के पन्ने पर जाएगा।",
  addMore: "+ और जोड़ें",
  typeInstead: "टाइप करना आसान लगे?",
  typePlaceholder:
    "जैसे 8 महीने मिनोक्सिडिल फोम, थोड़ा फ़ायदा, स्कैल्प खुजली; पिछले साल 3 PRP…",
  sideNote: "जैसे स्कैल्प में खुजली…",
  anotherNote: "एक और साइड इफ़ेक्ट",
  typeHelp: "जैसे नर्स को बताते, वैसे लिखें। हम बॉक्स भर देंगे।",
  fillBoxes: "बॉक्स भरें",
  reading: "पढ़ रहे हैं…",
  tapsInstead: "टैप से भरें",
  otherWhat: "क्लिनिक में और क्या आज़माया?",
  otherPlaceholder: "जैसे मेसोथेरेपी, लेज़र कैप…",
  wordsLeft: "शब्द बाकी",
  q14fromProducts: "उत्पाद वाले पेज की नोट्स रखी हैं। यहाँ नहीं कहें, तब भी डॉक्टर को दिखेंगी।",
  q14marked: "किसी उत्पाद पर साइड इफ़ेक्ट चुना है। नीचे हाँ या नहीं पक्का करें।",
  q14none: "उत्पादों में साइड इफ़ेक्ट नहीं चुना। यही सही है?",
  q14ask: "इलाज से कोई दुष्प्रभाव या कम फ़ायदा हुआ?",
  q14optional: "हाँ कहें तो एक छोटी नोट काफ़ी है।",
  anythingElse: "कुछ और?",
  q14example: "जैसे मिनोक्सिडिल — स्कैल्प में खुजली",
  yearsOld: "साल की उम्र",
  agree: "सहमत हूँ",
  disagree: "सहमत नहीं",
  report: {
    ...en.report,
    kicker: "डॉक्टर के लिए नोट",
    title: "बाल और स्कैल्प इनटेक",
    subtitle: "रोगी ने भरा। केवल तथ्य — निदान नहीं।",
    notDx: "डॉक्टर के लिए। प्रिंट करें या PDF सेव करें (A4)।",
    snapshot: "एक नज़र में",
    onset: "शुरुआत की उम्र",
    lasting: "अवधि",
    pattern: "पैटर्न",
    family: "पारिवारिक इतिहास",
    health: "निदान की गई स्थितियाँ",
    hormones: "मासिक धर्म / गर्भावस्था",
    skin: "वयस्क मुँहासे या तैलीय त्वचा",
    bodyHair: "चेहरे या शरीर पर ज़्यादा बाल",
    lifestyle: "आदतें और ट्रिगर",
    last6: "पिछले 6 महीने",
    noneListed: "सूची में से कुछ नहीं",
    usedNow: "इस्तेमाल किए उत्पाद",
    unused: "इस्तेमाल नहीं",
    inClinic: "क्लिनिक प्रक्रियाएँ",
    noneTried: "कुछ नहीं बताया",
    sides: "साइड इफ़ेक्ट / कम असर",
    noSides: "कुछ नहीं बताया",
    sample: "पसंदीदा सैंपल",
    consent: "सैंपल और जेनेटिक जाँच की सहमति",
    consented: "हाँ",
    declined: "मना किया",
    download: "डाउनलोड",
    downloadIn: "इस भाषा में डाउनलोड करें",
    copyJson: "JSON कॉपी करें",
    copied: "कॉपी हो गया",
    startOver: "फिर से शुरू",
    incomplete: "नोट बनाने से पहले कुछ जवाब पूरे करें।",
    goBack: "सवालों पर वापस",
    footer: "क्लिनिक इनटेक से बना। कोई रोगी डेटाबेस नहीं। यह पर्ची नहीं है।",
    helped: "फ़ायदा",
    noHelp: "साफ़ फ़ायदा नहीं",
    other: "अन्य",
    date: "तारीख",
  },
};

const hinglish: Dict = {
  ...en,
  welcomeKicker: "Doctor se milne se pehle",
  welcomeTitle: "A few taps so the doctor already knows.",
  welcomeWhy:
    "Hair loss ki kai wajah ho sakti hain. Jo fit kare, woh batao — baaki skip. Ek page ki note aapke phone pe rehti hai.",
  welcomeBullets: [
    "Jo fit kare, tap. Extra kuch nahi.",
    "About 4 minutes. No login.",
    "Copy aapke phone pe rehti hai.",
  ],
  sample: "See a sample",
  langHint: "Language",
  langNeed: "Upar language choose karke start karo",
  sections: {
    A: "Your hair",
    B: "Health",
    C: "Lifestyle",
    D: "Treatments",
    E: "Sample",
  },
  q: {
    q1: { kicker: "1 of 16", title: "Hair loss kis umar ke around shuru hua?", hint: "Andaaza theek hai." },
    q2: { kicker: "2 of 16", title: "Ye kitne time se ho raha hai?" },
    q3: { kicker: "3 of 16", title: "Family mein kisi ke baal patle hue, ya baldness?", hint: "Jo fit kare, tap karo." },
    q4: { kicker: "4 of 16", title: "Sabse zyada kahaan notice hota hai?", hint: "Har sahi picture pe tap." },
    q5: { kicker: "5 of 16", title: "Doctor ne inme se kuch diagnose kiya hai?", hint: "Sirf pakka diagnosis — guess nahi." },
    q6: { kicker: "6 of 16", title: "Periods ya pregnancy — kya ye aap pe apply hota hai?" },
    q7: { kicker: "7 of 16", title: "Pregnancy se related koi hair change?" },
    q8: { kicker: "8 of 16", title: "Adults mein acne, ya bahut oily skin?" },
    q9: { kicker: "9 of 16", title: "Chehre ya body pe extra hair?" },
    q10: { kicker: "10 of 16", title: "Last 6 months mein inme se kuch hua?", hint: "Jo fit kare, tap. Kuch nahi to Continue." },
    q11: { kicker: "11 of 16", title: "Daily habits", hint: "Left is No, right is Yes. Yes pe extra sawaal khulte hain." },
    q12: { kicker: "12 of 16", title: "Inme se kya use kiya hai?" },
    q13: { kicker: "13 of 16", title: "Clinic mein koi treatment?" },
    q14: { kicker: "14 of 16", title: "Koi side effects, ya treatment se kam fayda?" },
    q15: { kicker: "15 of 16", title: "Agar sample chahiye, to kya prefer karoge?" },
    q16: {
      kicker: "16 of 16",
      title: "Sample aur genetic test ke liye consent?",
      hint: "No bhi keh sakte ho. Baaki note doctor ko dikhegi.",
    },
  },
  family: {
    "Father had hair loss": "Papa",
    "Mother had hair loss": "Mummy",
    "Siblings with thinning or baldness": "Bhai ya behen",
    "No known family history": "Family mein koi nahi",
  },
  pattern: {
    "Receding hairline": { title: "Hairline peeche", hint: "Temples ya front" },
    "Thinning at crown": { title: "Upar se patle", hint: "Crown" },
    "Widening part line": { title: "Maang chaudi", hint: "Zyada scalp dikhe" },
    "Diffuse thinning": { title: "Har jagah patle", hint: "Pony thin lage" },
    "Patchy loss": { title: "Patches", hint: "Coin-size spots" },
    "Sudden excessive shedding": { title: "Achanak shedding", hint: "Drain mein bahut baal" },
  },
  menstrual: {
    Regular: "Regular periods",
    Irregular: "Irregular periods",
    Menopausal: "Menopause",
    "Not applicable": "Doesn’t apply to me",
  },
  pregnancy: {
    "Currently pregnant": "Abhi pregnant",
    "Postpartum <1 year": "Last year mein baby hua",
    "Not applicable": "Doesn’t apply",
  },
  q6pcos: "Aapne PCOS mention kiya — ye aksar matter karta hai.",
  q6hint: "Hum gender nahi poochte. Agar ye aap nahi, Doesn’t apply choose karo.",
  q12hint: "Jo use kiya, tick karo. Details neeche khulte hain.",
  q13hint: "Jo karwaya ho, tick. Details isi page pe.",
  howLong: "Kitne time se?",
  didHelp: "Did it help?",
  anySide: "Koi side effects?",
  sessionAsk: "Kitne sessions?",
  otherWhat: "Clinic mein aur kya try kiya?",
  otherPlaceholder: "e.g. mesotherapy, laser cap…",
  q14fromProducts: "Products page ki notes save hain. Yahan No kaho, tab bhi doctor ko dikhengi.",
  q14marked: "Kisi product pe side effects tick kiye. Neeche Yes ya No confirm karo.",
  q14none: "Products pe side effects nahi. Yehi sahi hai?",
  q14ask: "Koi side effects, ya treatment se kam fayda?",
  yearsOld: "years old",
  report: {
    ...en.report,
    kicker: "Pre-consult note",
    title: "Hair & scalp intake",
    subtitle: "Patient-completed. Facts only — diagnosis nahi.",
    notDx: "Doctor ke liye. Print or save as PDF (A4).",
  },
};

export const I18N: Record<Lang, Dict> = { en, hi, hinglish };

export function copy(lang: Lang | null | undefined) {
  return I18N[lang ?? "en"];
}
