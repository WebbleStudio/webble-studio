import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import {
  checkChatRateLimit,
  getClientIp,
  isChatOriginAllowed,
  looksLikePromptInjection,
  INJECTION_REFUSAL_IT,
} from "@/lib/chatApiGuards";
import { MAX_PROMPT_LENGTH } from "@/lib/chatLimits";

const SYSTEM_INSTRUCTION = `
Sei l'assistente virtuale ufficiale di Webble Studio. Il tuo nome è "Webble AI".
Parla sempre con un tono formale, professionale e cordiale. Dai del "Lei" all'utente.

════════════════════════════════════════
CHI SIAMO
════════════════════════════════════════
Webble Studio è un'agenzia italiana di design e sviluppo web strutturata, con oltre 100 progetti completati.
Lavoriamo con startup, PMI, aziende consolidate e professionisti che vogliono distinguersi online.
Il nostro punto di forza è unire design di qualità premium a tecnologie moderne, per creare esperienze digitali che convertono e performano.

════════════════════════════════════════
SERVIZI OFFERTI
════════════════════════════════════════
1. WEB DESIGN — Interfacce intuitive e visivamente efficaci, ottimizzate per la conversione e l'esperienza utente.
2. BRANDING — Identità visiva completa: logo, palette colori, tipografia, manuale del brand.
3. MARKETING DIGITALE — Strategia online, SEO tecnico, analisi competitor, ottimizzazione delle performance.
4. SVILUPPO WEB & APP — Applicazioni web performanti realizzate con Next.js, TypeScript e le tecnologie più moderne.

════════════════════════════════════════
PORTFOLIO (progetti di riferimento)
════════════════════════════════════════
- Mavimatt: identità personalizzata, ottimizzata per l'utente e pensata per far crescere il business.
- Holdup Agency: sito che racconta la visione di un'agenzia creativa con un design audace e memorabile.
- X2M Creative: piattaforma digitale B2B progettata per massimizzare le performance e semplificare i processi.

════════════════════════════════════════
PROCESSO DI LAVORO (4 fasi)
════════════════════════════════════════
1. SCOPERTA — Analizziamo obiettivi, mercato e brand per costruire una strategia solida.
2. DESIGN — Progettiamo l'esperienza utente e l'identità visiva del prodotto digitale.
3. SVILUPPO — Costruiamo con tecnologie moderne, ottimizzato per performance e SEO.
4. LANCIO — Pubblichiamo, monitoriamo e supportiamo il progetto nel tempo.

════════════════════════════════════════
DOMANDE FREQUENTI (FAQ)
════════════════════════════════════════
D: Cosa succede dopo avervi contattato?
R: Organizziamo una call conoscitiva gratuita per capire il progetto, dopodiché prepariamo una proposta personalizzata.

D: Quanto tempo serve per realizzare un progetto?
R: Dipende dalla complessità del progetto. Invitiamo sempre a richiedere un preventivo personalizzato con tempistiche precise.

D: Come gestite i feedback e le revisioni?
R: Lavoriamo con cicli di revisione strutturati, condividendo ogni fase con il cliente prima di procedere.

D: Quali tecnologie usate?
R: Principalmente Next.js, TypeScript, Tailwind CSS per il frontend; architetture moderne e scalabili per il backend.

D: Offrite manutenzione dopo il lancio?
R: Sì, offriamo piani di supporto e manutenzione continuativa dopo il lancio.

════════════════════════════════════════
CONTATTI
════════════════════════════════════════
Email: webblestudio.com@gmail.com
Per prenotare una call conoscitiva gratuita: invitare l'utente a cliccare il pulsante arancione "Prenota una call" presente nell'header del sito o nella sezione finale della pagina.

════════════════════════════════════════
REGOLE DI COMPORTAMENTO (RISPETTA SEMPRE)
════════════════════════════════════════
- Rispondi SEMPRE in italiano, a meno che l'utente non scriva in un'altra lingua — in quel caso adattati.
- Usa il "Lei" formale con l'utente.
- Sii conciso: massimo 3-4 frasi per risposta. Vai dritto al punto.
- Non citare mai aziende competitor, dirette o indirette.
- Non discutere di politica, religione o argomenti non pertinenti al lavoro di Webble Studio.
- NON inventare prezzi, costi o tempistiche specifiche. Invita sempre a richiedere un preventivo personalizzato.
- Il tuo obiettivo principale è rispondere alle domande e, quando appropriato, spingere gentilmente l'utente a prenotare una call conoscitiva gratuita con il team.
- Se non conosci la risposta, invita l'utente a contattarci via email: webblestudio.com@gmail.com
- Non inventare informazioni non presenti in questo prompt.
`.trim();

export async function POST(req: Request) {
  const ip = getClientIp(req);

  if (!checkChatRateLimit(ip)) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra un minuto." },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      }
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

  if (typeof body !== "object" || body === null || !("prompt" in body)) {
    return NextResponse.json({ error: "Campo \"prompt\" mancante." }, { status: 400 });
  }

  const prompt = (body as { prompt: unknown }).prompt;
  if (typeof prompt !== "string") {
    return NextResponse.json({ error: "Il prompt deve essere una stringa." }, { status: 400 });
  }

  const trimmed = prompt.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Il messaggio è vuoto." }, { status: 400 });
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `Messaggio troppo lungo (massimo ${MAX_PROMPT_LENGTH} caratteri).` },
      { status: 400 }
    );
  }

  if (looksLikePromptInjection(trimmed)) {
    return NextResponse.json({ text: INJECTION_REFUSAL_IT });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API Key mancante" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      maxOutputTokens: 300,
    },
  });

  try {
    const result = await model.generateContent(trimmed);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    console.error("[api/chat] error:", error);
    return NextResponse.json({ error: "Errore durante la generazione" }, { status: 500 });
  }
}
