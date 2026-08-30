import { IntakeSchema } from "@/lib/schema";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = IntakeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, issues: parsed.error.issues },
      { status: 400 },
    );
  }

  console.log("[intake]", JSON.stringify(parsed.data, null, 2));
  return Response.json({ ok: true });
}
