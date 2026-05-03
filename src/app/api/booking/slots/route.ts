import { NextResponse } from "next/server";
import { z } from "zod";
import { getCallType } from "@/lib/callTypes";
import { getAvailableSlots } from "@/lib/google-calendar";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida"),
  type: z.string().min(1, "Tipo richiesto"),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = {
    date: url.searchParams.get("date") ?? "",
    type: url.searchParams.get("type") ?? "",
  };

  const parsed = querySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parametri non validi.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { date, type } = parsed.data;

  // Reject weekends
  const dayOfWeek = new Date(date + "T12:00:00Z").getUTCDay(); // 0=Sun, 6=Sat
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return NextResponse.json({ slots: [] });
  }

  // Reject past dates
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (new Date(date + "T00:00:00Z") < today) {
    return NextResponse.json({ slots: [] });
  }

  const callType = getCallType(type);
  if (!callType) {
    return NextResponse.json({ error: "Tipo di call non trovato." }, { status: 400 });
  }

  try {
    const slots = await getAvailableSlots(date, callType.duration);
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("[api/booking/slots]", err);
    return NextResponse.json(
      { error: "Errore nel recupero degli slot." },
      { status: 500 }
    );
  }
}
