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

Optional — only for “type what you’ve tried” on treatments:

```bash
# .env.local
GEMINI_API_KEY=your_key
```

The tap path works with no key.

```bash
npm run build
```

## What to try

1. **Never asking sex.** On hormones, pick “doesn’t apply” — pregnancy is filled as N/A and skipped. Or pick PCOS and notice the copy order changes, not a hidden gender field.
2. **Language in the header.** Nothing selected until you tap EN / हिं / Hinglish. Start stays off until then. Download asks which language the note should use.
3. **Q13 Other.** Tick “something else at a clinic” — a 40-word box opens for what they actually tried.
4. **Matrices aren’t spreadsheets.** Tick what you used; only those rows get duration / helped / side effects. Unused rows store as `used: false`.
5. **Infer-and-confirm.** Mark a product with side effects; Q14 arrives already on Yes. (Optional) type a ramble on Q12 if `GEMINI_API_KEY` is set — boxes prefill after Zod; you still confirm.

Welcome → **See a sample** jumps to a made-up completed note.

## Stack

| | We used | Why |
| --- | --- | --- |
| App | Next.js App Router | One repo, API routes, easy Vercel link |
| UI | Tailwind + Framer Motion | Fast visual system; respects `prefers-reduced-motion` |
| State | Zustand + sessionStorage | Survive a refresh in the waiting room; no database |
| Contract | Zod, aligned to `intake-schema.json` | `/api/submit` only accepts a full parse. Gemini **cannot** write the store |
| Model | Gemini 2.0 Flash (optional) | Only the typed treatments shortcut. Taps if the key is missing |
| Art | Hand-drawn SVG scalp diagrams | No stock photos of scalps |

There is **no separate backend**. `POST /api/submit` validates and logs. `POST /api/extract` is optional Gemini. Patient data is not stored.
