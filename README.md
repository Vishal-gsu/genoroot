# GenoRoot — hair & scalp intake

Clinic waiting-room intake for [GenoRoot](https://github.com/Vishal-gsu/genoroot). One question at a time. The software infers what it can; the patient confirms. The last screen is a one-page doctor note (**Download**, pick a language) plus **Copy JSON** for the 16 fields.

English / हिंदी / Hinglish in the header. No login, no database — answers stay on the phone until they download or copy.

**Why taps, not a chatbot, not a default LLM:** [decision.md](./decision.md)

Live: *(paste Vercel URL after deploy)*

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Phone or laptop.

There is a `GEMINI_API_KEY` slot (`.env.example`, `POST /api/extract`) for an optional “type what you’ve tried” shortcut on treatments. **I did not set a key or test that path in this time window** — the form does not need it. Taps are the product; they work with no API key.

```bash
npm run build
```

## What to try

1. **Never asking sex.** On hormones, pick “doesn’t apply” — pregnancy is filled as N/A and skipped. Or pick PCOS and notice the copy order changes, not a hidden gender field.
2. **Language in the header.** Nothing selected until you tap EN / हिं / Hinglish. Start stays off until then. Download asks which language the note should use.
3. **Q13 Other.** Tick “something else at a clinic” — a 40-word box opens for what they actually tried.
4. **Matrices aren’t spreadsheets.** Tick what you used; only those rows get duration / helped / side effects. Unused rows store as `used: false`.
5. **Infer-and-confirm.** Mark a product with side effects; Q14 arrives already on Yes. (A typed Gemini extract exists in the codebase; it was not enabled or tested here.)

Welcome → **See a sample** jumps to a made-up completed note.

## Stack

| | We used | Why |
| --- | --- | --- |
| App | Next.js App Router | One repo, API routes, easy Vercel link |
| UI | Tailwind + Framer Motion | Fast visual system; respects `prefers-reduced-motion` |
| State | Zustand + sessionStorage | Survive a refresh in the waiting room; no database |
| Contract | Zod, aligned to `intake-schema.json` | `/api/submit` only accepts a full parse. Gemini **cannot** write the store |
| Model | Gemini 2.0 Flash (optional, **not set up / not tested**) | Code is there for typed treatments. No key in this deploy; taps only |
| Art | Hand-drawn SVG scalp diagrams | No stock photos of scalps |

There is **no separate backend**. `POST /api/submit` validates and logs. `POST /api/extract` would call Gemini if a key existed — it does not on this submission. Patient data is not stored.
