import { ExtractPatchSchema } from "@/lib/schema";

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json(
      {
        error:
          "Typing shortcut isn’t set up on this deploy (no API key). Please use the taps — they always work.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { text?: string };
  const text = body.text?.trim() ?? "";
  if (text.length < 8) {
    return Response.json({ error: "A little more detail would help." }, { status: 400 });
  }

  const prompt = `Extract a hair-clinic treatment history from the patient's words.
Return JSON only, no markdown, matching this shape (omit keys you are not sure about):
{
  "products": {
    "OTC/Medicated Shampoos"?: { "used": false } | { "used": true, "duration": "<3mo"|"3-6mo"|">6mo", "helped": boolean, "side_effects": boolean },
    "Hair Oils/Serums"?: same,
    "Topical Minoxidil"?: same,
    "Oral Minoxidil"?: same,
    "Supplements"?: same
  },
  "procedures": {
    "PRP/GFC/iPRF"?: { "done": false } | { "done": true, "sessions": "1-3"|"4-6"|">6", "helped": boolean },
    "Stem Cells/Exosomes"?: same,
    "Hair Transplant"?: same,
    "Other"?: same
  },
  "past_treatment_side_effects"?: boolean,
  "describe"?: string
}
Rules: do not invent treatments they did not mention. Do not diagnose. duration buckets only as given.
Patient: """${text}"""`;

  const gemini = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!gemini.ok) {
    return Response.json(
      { error: "The reading service is busy. Use the taps instead." },
      { status: 502 },
    );
  }

  const payload = (await gemini.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const raw = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Couldn’t parse that. Try the taps." }, { status: 422 });
  }

  const parsed = ExtractPatchSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "That didn’t match the form. Please tap the answers." },
      { status: 422 },
    );
  }

  return Response.json({ patch: parsed.data });
}
