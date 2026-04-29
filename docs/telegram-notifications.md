# Notifiche Telegram — Webble AI Chat

Quando un utente chiude la chat con Webble AI, ricevi su Telegram l'intera cronologia della conversazione, formattata in modo leggibile.

---

## Architettura

```
Utente chatfa con Webble AI
         │
         │  dopo ogni risposta AI
         ▼
  Timer inattività (15 min)
  [si resetta ad ogni nuova risposta AI]
         │
         │  scaduto senza nuovi messaggi
         ▼
FloatingChatWidget  ──POST──▶  /api/chat-notify
                                      │
                                      ▼
                              Telegram Bot API
                                      │
                                      ▼
                              Il tuo chat Telegram
```

> La notifica parte **una sola volta per sessione**, 15 minuti dopo l'ultimo messaggio AI.
> Se l'utente ricomincia a chattare, il timer si azzera e la notifica *non* viene reinviata.

---

## Step 1 — Crea il bot Telegram

1. Apri Telegram e cerca **@BotFather**
2. Invia `/newbot`
3. Scegli un nome visualizzato (es. `Webble Studio Notifiche`)
4. Scegli uno username che termina in `bot` (es. `webble_notify_bot`)
5. BotFather ti risponde con il **token**, formato:

```
123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Salvalo — ti serve al prossimo step.

---

## Step 2 — Ottieni il tuo Chat ID

Il bot deve sapere *a chi* inviare i messaggi. Hai bisogno del tuo Chat ID personale (o di un gruppo).

**Metodo semplice:**

1. Su Telegram cerca **@userinfobot**
2. Invia `/start`
3. Ti risponde con il tuo `Id:` numerico (es. `987654321`)

**Alternativa (chat di gruppo):**

1. Crea un gruppo Telegram, aggiungici il tuo bot
2. Invia un messaggio qualsiasi nel gruppo
3. Apri nel browser:
   ```
   https://api.telegram.org/bot<IL_TUO_TOKEN>/getUpdates
   ```
4. Nel JSON cerca `"chat":{"id":` — quel numero (negativo per i gruppi) è il Chat ID

---

## Step 3 — Aggiungi le variabili d'ambiente

Nel file `.env.local` del progetto aggiungi:

```env
TELEGRAM_BOT_TOKEN=123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_CHAT_ID=987654321
```

Su **Vercel** (produzione):
- Dashboard → Settings → Environment Variables
- Aggiungi `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID`
- Scope: **Production** (e Preview se vuoi)

---

## Step 4 — Route API `/api/chat-notify`

Il file `src/app/api/chat-notify/route.ts` è già implementato nel progetto.

```ts
import { NextResponse } from "next/server";
import { isChatOriginAllowed, getClientIp } from "@/lib/chatApiGuards";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

function formatConversation(
  name: string,
  email: string,
  messages: ChatMessage[]
): string {
  const header =
    `🤖 *Nuova conversazione Webble AI*\n` +
    `👤 *Nome:* ${escape(name)}\n` +
    `📧 *Email:* ${escape(email)}\n` +
    `🕐 *Data:* ${new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" })}\n` +
    `──────────────────────\n\n`;

  const body = messages
    .map((m) => {
      const prefix = m.role === "user" ? "👤 *Utente*" : "🤖 *Webble AI*";
      return `${prefix}\n${escape(m.text)}`;
    })
    .join("\n\n");

  return header + body;
}

// Escapa caratteri speciali MarkdownV2
function escape(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

export async function POST(req: Request) {
  if (!isChatOriginAllowed(req)) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 403 });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("[chat-notify] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID mancanti");
    return NextResponse.json({ ok: true }); // fail silently in dev
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido." }, { status: 400 });
  }

  const { name, email, messages } = body as {
    name?: string;
    email?: string;
    messages?: ChatMessage[];
  };

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    !Array.isArray(messages) ||
    messages.length === 0
  ) {
    return NextResponse.json({ error: "Dati incompleti." }, { status: 400 });
  }

  // Filtra il messaggio di benvenuto automatico (opzionale)
  const humanMessages = messages.filter((m) => !(m.role === "ai" && m === messages[0]));
  if (humanMessages.length < 2) {
    // Nessuna vera conversazione, non notificare
    return NextResponse.json({ ok: true });
  }

  const text = formatConversation(name, email, messages);

  const tgRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "MarkdownV2",
      }),
    }
  );

  if (!tgRes.ok) {
    const err = await tgRes.text();
    console.error("[chat-notify] Telegram error:", err);
  }

  return NextResponse.json({ ok: true });
}
```

---

## Step 5 — FloatingChatWidget (già aggiornato)

Il widget gestisce automaticamente il timer di inattività.  
Logica implementata:

- Dopo ogni risposta AI completa → il timer di 15 min si **resetta**
- Se non arrivano nuovi messaggi entro 15 min → `sendNotify()` chiama `/api/chat-notify`
- Il flag `notifiedRef` garantisce che la notifica parta **una sola volta per sessione**
- I ref `leadNameRef` / `leadEmailRef` sono popolati sia al primo accesso che al ricaricamento della pagina (da sessionStorage)

---

## Esempio di messaggio ricevuto

```
🤖 Nuova conversazione Webble AI
👤 Nome: Mario Rossi
📧 Email: mario@esempio.it
🕐 Data: 29/04/2026, 14:32:10
──────────────────────

👤 Utente
Ciao, vorrei sapere quanto costa un sito web

🤖 Webble AI
Buongiorno! I nostri pacchetti partono da...

👤 Utente
Avete anche servizi di SEO?

🤖 Webble AI
Sì, offriamo servizi SEO integrati...
```

---

## Note

- La notifica viene inviata **solo quando l'utente chiude il widget**, non ad ogni messaggio (evita spam).
- Se non ci sono messaggi utente (solo benvenuto AI), la notifica non viene inviata.
- Se le variabili d'ambiente Telegram mancano, l'API fallisce silenziosamente senza errori visibili all'utente.
- Per ricevere notifiche su un **canale Telegram**: aggiungi il bot come admin del canale e usa `@nome_canale` come `TELEGRAM_CHAT_ID`.
