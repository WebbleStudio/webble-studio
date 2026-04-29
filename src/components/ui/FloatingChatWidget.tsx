"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { MAX_PROMPT_LENGTH } from "@/lib/chatLimits";

interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
}

const STORAGE_LEAD_OK = "webble_chat_lead_ok";
const STORAGE_LEAD_NAME = "webble_chat_lead_display_name";
const STORAGE_LEAD_EMAIL = "webble_chat_lead_email";
const SESSION_MSG_KEY = "webble_chat_user_messages";
const MAX_USER_MESSAGES_PER_SESSION = 20;
const STREAM_WORD_DELAY_MS = 38;

function makeWelcomeMessages(displayName: string): Message[] {
  const first = displayName.trim().split(/\s+/)[0] || "";
  const text = first
    ? `Grazie, ${first}! Sono l'assistente di Webble Studio. Come posso aiutarla oggi?`
    : "Grazie! Sono l'assistente di Webble Studio. Come posso aiutarla oggi?";
  return [{ id: 0, role: "ai", text }];
}

function getSessionUserMessageCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(SESSION_MSG_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function incrementSessionUserMessageCount(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_MSG_KEY, String(getSessionUserMessageCount() + 1));
}

/* ── Inline SVG icons ─────────────────────────────────────────────────── */
function IconChat() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ── Typing indicator — wave animation ───────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-[5px] px-4 py-3.5">
      <style>{`
        @keyframes chatDotWave {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-foreground block h-[6px] w-[6px] rounded-full"
          style={{ animation: `chatDotWave 1.3s ease-in-out ${i * 0.18}s infinite` }}
        />
      ))}
    </div>
  );
}

/* ── Blinking cursor shown while streaming ────────────────────────────── */
function StreamCursor() {
  return (
    <>
      <style>{`
        @keyframes chatCursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
      <span
        className="bg-foreground/70 ml-[1px] inline-block h-[13px] w-[2px] translate-y-[1px]"
        style={{ animation: "chatCursorBlink 0.8s step-end infinite" }}
        aria-hidden="true"
      />
    </>
  );
}

/* ── Main component ───────────────────────────────────────────────────── */
const INACTIVITY_MS = 20 * 60 * 1000; // 20 minuti

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasHydratedGate, setHasHydratedGate] = useState(false);
  const [leadGatePassed, setLeadGatePassed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState<number | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const streamingFullText = useRef("");

  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  // Telegram inactivity notification
  const leadNameRef = useRef("");
  const leadEmailRef = useRef("");
  const messagesRef = useRef<Message[]>([]);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifiedRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const isBusy = isTyping || streamingId !== null;

  // Keep messagesRef in sync so the timer callback always reads the latest messages
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendNotify = useCallback(() => {
    if (notifiedRef.current) return;
    const name = leadNameRef.current;
    const email = leadEmailRef.current;
    const msgs = messagesRef.current;
    const userTurns = msgs.filter((m) => m.role === "user").length;
    if (!name || !email || userTurns === 0) return;
    notifiedRef.current = true;
    fetch("/api/chat-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        messages: msgs.map((m) => ({ role: m.role, text: m.text })),
      }),
    }).catch(() => {});
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(sendNotify, INACTIVITY_MS);
  }, [sendNotify]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const ok = sessionStorage.getItem(STORAGE_LEAD_OK) === "1";
      if (ok) {
        const name = sessionStorage.getItem(STORAGE_LEAD_NAME) ?? "";
        const email = sessionStorage.getItem(STORAGE_LEAD_EMAIL) ?? "";
        leadNameRef.current = name;
        leadEmailRef.current = email;
        notifiedRef.current = false;
        setLeadGatePassed(true);
        setMessages(makeWelcomeMessages(name));
      }
      setHasHydratedGate(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => {
        if (leadGatePassed) inputRef.current?.focus();
        else nameInputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, leadGatePassed, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamingText, scrollToBottom]);

  /* ── Word-by-word streaming ──────────────────────────────────────────── */
  useEffect(() => {
    if (streamingId === null) return;
    const words = streamingFullText.current.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setStreamingText(words.slice(0, idx).join(" "));
      if (idx >= words.length) {
        clearInterval(interval);
        setStreamingId(null);
        setStreamingText("");
        // Reset inactivity timer after each AI response
        resetInactivityTimer();
      }
    }, STREAM_WORD_DELAY_MS);
    return () => clearInterval(interval);
  }, [streamingId, resetInactivityTimer]);

  const startStreaming = useCallback((fullText: string) => {
    const msgId = nextId.current++;
    streamingFullText.current = fullText;
    setMessages((prev) => [...prev, { id: msgId, role: "ai", text: fullText }]);
    setStreamingId(msgId);
    setStreamingText("");
  }, []);

  const handleLeadSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (leadSubmitting) return;
      setLeadError(null);
      const name = leadName.trim();
      const email = leadEmail.trim();
      if (!name || name.length > 120) {
        setLeadError("Inserisca un nome (max 120 caratteri).");
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setLeadError("Inserisca un indirizzo email valido.");
        return;
      }

      setLeadSubmitting(true);
      fetch("/api/chat-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })
        .then(async (res) => {
          const data = (await res.json()) as { ok?: boolean; error?: string };
          setLeadSubmitting(false);
          if (!res.ok) {
            setLeadError(
              typeof data.error === "string" ? data.error : "Si è verificato un errore. Riprova."
            );
            return;
          }
          sessionStorage.setItem(STORAGE_LEAD_OK, "1");
          sessionStorage.setItem(STORAGE_LEAD_NAME, name);
          sessionStorage.setItem(STORAGE_LEAD_EMAIL, email);
          leadNameRef.current = name;
          leadEmailRef.current = email;
          notifiedRef.current = false;
          setLeadGatePassed(true);
          setMessages(makeWelcomeMessages(name));
          setLeadName("");
          setLeadEmail("");
        })
        .catch(() => {
          setLeadSubmitting(false);
          setLeadError("Errore di rete. Riprova tra poco.");
        });
    },
    [leadName, leadEmail, leadSubmitting]
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isBusy || !leadGatePassed) return;

    if (getSessionUserMessageCount() >= MAX_USER_MESSAGES_PER_SESSION) {
      const userMsg: Message = { id: nextId.current++, role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      startStreaming(
        "Hai raggiunto il limite di messaggi per questa sessione. Per approfondire, scrivici a webblestudio.com@gmail.com o usa il pulsante «Prenota una call» nel sito."
      );
      return;
    }

    if (text.length > MAX_PROMPT_LENGTH) {
      startStreaming(
        `Il messaggio è troppo lungo (massimo ${MAX_PROMPT_LENGTH} caratteri). La prego di abbreviare.`
      );
      setInput("");
      return;
    }

    const userMsg: Message = { id: nextId.current++, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    resetInactivityTimer();

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    })
      .then(async (res) => {
        const data = (await res.json()) as { text?: string; error?: string };
        setIsTyping(false);
        if (!res.ok) {
          startStreaming(
            typeof data.error === "string"
              ? data.error
              : "Mi dispiace, si è verificato un errore. Riprova o contattaci direttamente."
          );
          return;
        }
        incrementSessionUserMessageCount();
        startStreaming(
          data.text ?? "Mi dispiace, si è verificato un errore. Riprova o contattaci direttamente."
        );
      })
      .catch(() => {
        setIsTyping(false);
        startStreaming("Errore di rete. Riprova tra poco.");
      });
  }, [input, isBusy, startStreaming, leadGatePassed]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <>
      <div
        className={`sm:border-foreground/20 fixed inset-0 z-[51] flex flex-col bg-[#0d0d0d] px-6 transition-all duration-300 sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[500px] sm:w-[360px] sm:origin-bottom-right sm:border sm:px-[20px] sm:shadow-2xl ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100 sm:scale-100"
            : "pointer-events-none translate-y-full opacity-0 sm:translate-y-4 sm:scale-95"
        } `}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Chat Webble AI"
      >
        <div className="border-foreground/20 flex items-center justify-between border-b px-0 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent flex h-9 w-9 items-center justify-center p-2">
              <img
                src="/img/layout/logo/webble-white-logo.svg"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-foreground font-sans text-sm leading-none font-semibold">
                Webble AI
              </p>
              <p className="text-foreground/50 mt-0.5 font-sans text-[11px] leading-none">
                Assistente virtuale
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-foreground/50 flex items-center gap-1.5 font-sans text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Online
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Chiudi chat"
              className="text-foreground/50 hover:text-foreground flex h-7 w-7 items-center justify-center transition-colors"
            >
              <IconClose />
            </button>
          </div>
        </div>

        {!hasHydratedGate ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-foreground/50 font-sans text-sm">Caricamento…</p>
          </div>
        ) : !leadGatePassed ? (
          <div className="flex flex-1 flex-col px-0 py-4 sm:py-5">
            <form className="flex flex-1 flex-col" onSubmit={handleLeadSubmit}>
              <div className="flex flex-col gap-5">
                <p className="text-foreground/80 font-sans text-sm leading-relaxed">
                  Per iniziare la conversazione con Webble AI, la preghiamo di lasciare nome e
                  indirizzo email. I dati saranno usati solo per ricontattarla in merito alla sua
                  richiesta.
                </p>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="webble-chat-lead-name"
                    className="text-foreground/60 font-sans text-xs font-medium"
                  >
                    Nome
                  </label>
                  <input
                    id="webble-chat-lead-name"
                    ref={nameInputRef}
                    type="text"
                    autoComplete="name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    maxLength={120}
                    className="border-foreground/20 text-foreground focus:border-foreground/40 border bg-[#171717] px-4 py-2.5 font-sans text-sm transition-colors outline-none"
                    placeholder="Il suo nome"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="webble-chat-lead-email"
                    className="text-foreground/60 font-sans text-xs font-medium"
                  >
                    Email
                  </label>
                  <input
                    id="webble-chat-lead-email"
                    type="email"
                    autoComplete="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    maxLength={254}
                    className="border-foreground/20 text-foreground focus:border-foreground/40 border bg-[#171717] px-4 py-2.5 font-sans text-sm transition-colors outline-none"
                    placeholder="nome@esempio.it"
                  />
                </div>
                {leadError && (
                  <p className="font-sans text-xs text-red-400" role="alert">
                    {leadError}
                  </p>
                )}
              </div>

              {/* Button pinned to bottom */}
              <div className="mt-auto border-t border-foreground/20 pt-4">
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="bg-accent text-foreground w-full px-4 py-3 font-sans text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {leadSubmitting ? "Invio in corso…" : "Continua alla chat"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="scrollbar-none flex flex-1 flex-col gap-4 overflow-y-auto px-0 py-4">
              {messages.map((msg) =>
                msg.role === "ai" ? (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="bg-accent mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center p-1.5">
                      <img
                        src="/img/layout/logo/webble-white-logo.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="border-foreground/20 max-w-[78%] border bg-[#171717] px-4 py-3">
                      <p className="text-foreground font-sans text-sm leading-relaxed">
                        {msg.id === streamingId ? streamingText : msg.text}
                        {msg.id === streamingId && <StreamCursor />}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-accent max-w-[78%] px-4 py-3">
                      <p className="text-foreground font-sans text-sm leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                )
              )}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="bg-accent mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center p-1.5">
                    <img
                      src="/img/layout/logo/webble-white-logo.svg"
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="border-foreground/20 border bg-[#171717]">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-foreground/20 border-t px-0 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:-mx-[20px] sm:px-[12px] sm:pt-3 sm:pb-3">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Reset inactivity only if conversation already started
                    if (messagesRef.current.some((m) => m.role === "user")) {
                      resetInactivityTimer();
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrivi un messaggio..."
                  className="border-foreground/20 text-foreground placeholder:text-foreground/30 focus:border-foreground/40 flex-1 border bg-[#171717] px-4 py-2.5 font-sans text-sm transition-colors outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isBusy}
                  aria-label="Invia messaggio"
                  className="bg-accent text-foreground flex h-10 w-10 shrink-0 items-center justify-center transition-opacity disabled:opacity-40"
                >
                  <IconSend />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <div className={`fixed right-6 bottom-6 z-50 ${isOpen ? "hidden sm:block" : "block"}`}>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Chiudi chat" : "Apri chat"}
          className="group bg-accent text-foreground relative flex h-14 w-14 items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <span className="bg-accent absolute inset-0 -z-10 opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
          <span
            className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
          >
            {isOpen ? (
              <IconClose />
            ) : (
              <img
                src="/img/layout/logo/webble-white-logo.svg"
                alt=""
                aria-hidden="true"
                className="h-7 w-7 object-contain"
              />
            )}
          </span>
        </button>
      </div>
    </>
  );
}
