import { NextResponse } from "next/server";
import {
  checkChatLeadRateLimit,
  getClientIp,
  isChatOriginAllowed,
} from "@/lib/chatApiGuards";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const NAME_MAX = 120;
const EMAIL_MAX = 254;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const ip = getClientIp(req);

  if (!checkChatLeadRateLimit(ip)) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra qualche minuto." },
      { status: 429, headers: { "Retry-After": "300" } }
    );
  }

  if (!isChatOriginAllowed(req)) {
    return NextResponse.json({ error: "Richiesta non autorizzata." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo della richiesta non valido." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Dati non validi." }, { status: 400 });
  }

  const { name, email } = body as { name?: unknown; email?: unknown };

  if (typeof name !== "string" || typeof email !== "string") {
    return NextResponse.json({ error: "Nome ed email sono obbligatori." }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName || trimmedName.length > NAME_MAX) {
    return NextResponse.json(
      { error: `Il nome deve avere tra 1 e ${NAME_MAX} caratteri.` },
      { status: 400 }
    );
  }

  if (!trimmedEmail || trimmedEmail.length > EMAIL_MAX || !EMAIL_RE.test(trimmedEmail)) {
    return NextResponse.json({ error: "Inserisca un indirizzo email valido." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.error("[api/chat-lead] SUPABASE_SERVICE_ROLE_KEY or URL missing");
    return NextResponse.json(
      { error: "Servizio temporaneamente non disponibile." },
      { status: 503 }
    );
  }

  const { error } = await supabase
    .from("chat_leads")
    .upsert(
      { name: trimmedName, email: trimmedEmail },
      { onConflict: "email", ignoreDuplicates: true }
    );

  if (error) {
    console.error("[api/chat-lead] upsert error:", error);
    return NextResponse.json({ error: "Impossibile salvare i dati. Riprova." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
