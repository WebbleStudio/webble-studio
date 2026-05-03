import { NextResponse } from "next/server";
import { z } from "zod";
import { getCallType } from "@/lib/callTypes";
import { isSlotAvailable, createCalendarEvent } from "@/lib/google-calendar";
import { sendBookingConfirmation, sendBookingNotification } from "@/lib/email";

const bodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  callType: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  message: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, email, callType: callTypeId, date, startTime, endTime, message } = parsed.data;

  const callType = getCallType(callTypeId);
  if (!callType) {
    return NextResponse.json({ error: "Tipo di call non trovato." }, { status: 400 });
  }

  // Race condition guard: verify slot still available
  let available: boolean;
  try {
    available = await isSlotAvailable(date, startTime, endTime);
  } catch (err) {
    console.error("[api/booking/confirm] isSlotAvailable error:", err);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }

  if (!available) {
    return NextResponse.json(
      { error: "Lo slot non è più disponibile, scegline un altro." },
      { status: 409 }
    );
  }

  // Create calendar event with Google Meet
  let meetLink: string;
  let eventId: string;
  try {
    const result = await createCalendarEvent({
      summary: `${callType.label.it} — ${name}`,
      description: [
        `Cliente: ${name}`,
        `Email: ${email}`,
        `Tipo: ${callType.label.it} (${callType.duration} min)`,
        message ? `\nMessaggio: ${message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      date,
      startTime,
      endTime,
      attendeeEmail: email,
    });
    meetLink = result.meetLink;
    eventId = result.eventId;
  } catch (err) {
    console.error("[api/booking/confirm] createCalendarEvent error:", err);
    return NextResponse.json(
      { error: "Impossibile creare l'evento. Riprova." },
      { status: 500 }
    );
  }

  // Send emails (non-blocking — failure doesn't prevent confirmation)
  const emailParams = {
    to: email,
    name,
    callType: callType.label.it,
    date,
    startTime,
    endTime,
    meetLink,
    message,
  };

  try {
    await Promise.all([
      sendBookingConfirmation(emailParams),
      sendBookingNotification(emailParams),
    ]);
  } catch (err) {
    console.error("[api/booking/confirm] email error (non-fatal):", err);
  }

  return NextResponse.json({ success: true, meetLink, eventId });
}
