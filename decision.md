# Decisions

Patient-facing screens stay quiet. This file is why the product looks the way it does.

Judged in order: Feel → Taste → Ideas → Resourcefulness. The output is still the 16-field intake, filled, as structured data.

---

## Taps, not a chatbot

**Chose:** one question at a time, tap what fits, skip what doesn’t.

**Skipped:** a waiting-room chatbot that “fills the form for you.”

A chat in a clinic lobby is slow to type, easy to abandon, and bad at coverage. Sixteen fields need sixteen confirmed answers. A model that skips PCOS or invents a side effect is worse than a blank — the doctor reads it as fact. The brief also asked for per-question design, not one prompt that poisons the whole record.

The software still *helps*: unused products store as `used: false`, Q6 “doesn’t apply” fills pregnancy and skips that screen, product side-effects arrive on Q14 already on Yes. Infer, then confirm. That is the “fills itself” idea without handing the doctor’s page to an LLM.

## LLM

**Chose:** no model on the default path. Optional typed extract only on treatments (`POST /api/extract` → Zod patch → UI). Gemini never writes the store.

**Skipped:** LLM-written summary, diagnosis, or a model that fills all 16.

Hair history is not a creative task. Hallucinated symptoms on a clinician note is a miss. If the patient would rather *type* “minoxidil foam eight months, itchy, three PRP,” we tick boxes — they still confirm. No `GEMINI_API_KEY` → taps still work. The form does not need an LLM to be complete.

## Microphone

**Skipped.** A waiting room is noisy. Browser speech-to-text without noise reduction fails in the environment we’re designing for. Keyboard + taps this week; paid STT later.

## Language

**Chose:** English / हिंदी / Hinglish, first screen only, nothing selected until they tap. Start stays off until then.

**Skipped:** a language switcher on every question. Once they begin, switching mid-form is a novelty, not a need. Hindi is written as Hindi, not calqued English. Hinglish keeps English on buttons (Continue, Start, Yes) and mixes only in the questions — people don’t say “aage” for Continue.

## Sex, DOB, profile

**Skipped.** Extra questions beyond the 16-field output. We never store sex. Q6 is shown to everyone, with “doesn’t apply” first unless they already named PCOS. We don’t infer gender from hairline or diagnosis.

## Last page

**Chose:** a one-page clinician note the patient can download, plus **Copy JSON** for the structured handoff the brief asked for.

**Skipped:** dumping JSON on the doctor-facing layout. A doctor should read pattern, habits, and what was tried — not a schema. JSON is one tap below Download for whoever needs the 16 fields raw. Print/Save as PDF is the download path (no extra PDF library in this window).

## Q12 / Q13 matrices

**Chose:** tick what you used; details open on the same page. Unused rows are `used: false` / `done: false`.

**Skipped:** a spreadsheet of every product, and a swipe-card mini-game that turns 16 beats into 30 screens. Q13 Other is a short text box (40 words) for “what else at the clinic.”

## Visual patterns (Q4)

**Chose:** small SVG scalp diagrams, not stock photos. Licensing, diversity, and clinic creepiness.

## Stack

Next.js App Router (one repo, API route for the key, easy live link). Zustand + sessionStorage (survive a refresh; no database — forbidden). Zod aligned to `intake-schema.json` so submit only accepts a full parse. Framer Motion for 280ms slides; respects `prefers-reduced-motion`.

## Also skipped

Login, admin, database. WhatsApp share. Nurse large-type mode. A one-box chat that fills all 16. AI diagnosis on the summary.
