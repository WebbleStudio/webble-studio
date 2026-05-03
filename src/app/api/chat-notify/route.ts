import { NextResponse } from "next/server";
import { isChatOriginAllowed } from "@/lib/chatApiGuards";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

// Escapa caratteri speciali MarkdownV2
function esc(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

function formatConversation(name: string, email: string, messages: ChatMessage[]): string {
  const date = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });

  const header =
    `🤖 *Nuova conversazione Webble AI*\n` +
    `👤 *Nome:* ${esc(name)}\n` +
    `📧 *Email:* ${esc(email)}\n` +
    `🕐 *Data:* ${esc(date)}\n` +
    `${"─".repeat(26)}\n\n`;

  const body = messages
    .map((m) => {
      const prefix = m.role === "user" ? "👤 *Utente*" : "🤖 *Webble AI*";
      return `${prefix}\n${esc(m.text)}`;
    })
    .join("\n\n");

  return header + body;
}

export async function POST(req: Request) {
  if (!isChatOriginAllowed(req)) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 403 });
  }

  // Fail silently if env vars missing (dev without Telegram configured)
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("[chat-notify] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID mancanti — skip");
    return NextResponse.json({ ok: true });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido." }, { status: 400 });
  }

  const { name, email, messages } = body as {
    name?: unknown;
    email?: unknown;
    messages?: unknown;
  };

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    !Array.isArray(messages) ||
    messages.length === 0
  ) {
    return NextResponse.json({ error: "Dati incompleti." }, { status: 400 });
  }

  const typedMessages = messages as ChatMessage[];

  // Non notificare se l'utente non ha mai scritto nulla (solo welcome AI)
  const userTurns = typedMessages.filter((m) => m.role === "user").length;
  if (userTurns === 0) {
    return NextResponse.json({ ok: true });
  }

  const text = formatConversation(name, email, typedMessages);

  // Telegram ha limite 4096 caratteri per messaggio
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += 4000) {
    chunks.push(text.slice(i, i + 4000));
  }

  for (const chunk of chunks) {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: chunk, parse_mode: "MarkdownV2" }),
      }
    );

    if (!tgRes.ok) {
      const err = await tgRes.text();
      console.error("[chat-notify] Telegram API error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
