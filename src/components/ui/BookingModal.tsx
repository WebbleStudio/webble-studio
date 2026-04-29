"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import gsap from "gsap";
import { useBooking } from "@/context/BookingContext";
import { CALL_TYPES, type CallType } from "@/lib/callTypes";
import AnimatedBookingModal from "@/components/animations/layout/AnimatedBookingModal";
import type { Dictionary } from "@/lib/getDictionary";

type Step = "type" | "date" | "slot" | "form" | "confirm";
const STEP_ORDER: Step[] = ["type", "date", "slot", "form", "confirm"];

interface TimeSlot {
  start: string;
  end: string;
}

const MONTH_NAMES_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];
const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const DAY_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Mon = 0
}

function formatDateDisplay(dateStr: string, locale: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* ── Icons ────────────────────────────────────────────────────────────── */
function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

/* ── Headline component (left column) ────────────────────────────────── */
function HeadlineContent({ dict }: { dict: Dictionary }) {
  const lines = dict.booking.headline.split("\n");
  return (
    <div>
      <h2 className="font-hero text-[28px] uppercase tracking-[-1.5px] text-foreground leading-tight">
        {lines.map((line, i) => (
          <span key={i} className="block">{line}</span>
        ))}
        {/* Accent word inline with last headline line */}
        {dict.booking.headlineAccent && (
          <span className="block">
            <em className="not-italic text-accent">{dict.booking.headlineAccent}</em>
          </span>
        )}
      </h2>
    </div>
  );
}

interface BookingModalProps {
  dict: Dictionary;
}

export default function BookingModal({ dict }: BookingModalProps) {
  const { isOpen, closeBooking, locale } = useBooking();
  const b = dict.booking;
  const isEN = locale === "en";

  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState<CallType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");

  // Calendar nav
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const contentRef = useRef<HTMLDivElement>(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep("type");
        setSelectedType(null);
        setSelectedDate("");
        setSelectedSlot(null);
        setSlots([]);
        setMeetLink("");
        setSubmitError("");
        setFormName("");
        setFormEmail("");
        setFormMessage("");
        const now = new Date();
        setCalYear(now.getFullYear());
        setCalMonth(now.getMonth());
      }, 500);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const animateStepChange = useCallback((newStep: Step) => {
    const el = contentRef.current;
    if (!el) { setStep(newStep); return; }
    gsap.to(el, {
      opacity: 0, x: -20, duration: 0.15, ease: "power2.in",
      onComplete: () => {
        setStep(newStep);
        gsap.fromTo(el, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.2, ease: "power2.out" });
      },
    });
  }, []);

  const goBack = useCallback(() => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) animateStepChange(STEP_ORDER[idx - 1]);
  }, [step, animateStepChange]);

  const handleTypeSelect = useCallback((ct: CallType) => {
    setSelectedType(ct);
    animateStepChange("date");
  }, [animateStepChange]);

  const handleDateSelect = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setLoadingSlots(true);
    animateStepChange("slot");
    fetch(`/api/booking/slots?date=${dateStr}&type=${selectedType?.id ?? ""}`)
      .then((r) => r.json() as Promise<{ slots: TimeSlot[] }>)
      .then((data) => { setSlots(data.slots ?? []); })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedType, animateStepChange]);

  const handleSlotSelect = useCallback((slot: TimeSlot) => {
    setSelectedSlot(slot);
    animateStepChange("form");
  }, [animateStepChange]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          callType: selectedType.id,
          date: selectedDate,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          message: formMessage || undefined,
        }),
      });
      const data = (await res.json()) as { success?: boolean; meetLink?: string; error?: string };
      if (!res.ok) {
        setSubmitError(res.status === 409 ? b.slotTaken : (data.error ?? b.error));
        return;
      }
      setMeetLink(data.meetLink ?? "");
      animateStepChange("confirm");
    } catch {
      setSubmitError(b.error);
    } finally {
      setSubmitting(false);
    }
  }, [selectedType, selectedDate, selectedSlot, formName, formEmail, formMessage, animateStepChange, b]);

  const stepIndex = STEP_ORDER.indexOf(step);
  const STEP_LABELS: Record<Step, string> = {
    type: b.stepType,
    date: b.stepDate,
    slot: b.stepSlot,
    form: b.stepForm,
    confirm: b.stepConfirm,
  };

  const todayStr = today.toISOString().split("T")[0];
  const monthNames = isEN ? MONTH_NAMES_EN : MONTH_NAMES_IT;
  const dayLabels = isEN ? DAY_LABELS_EN : DAY_LABELS_IT;

  /* ── Calendar rendering ─────────────────────────────────────────────── */
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfWeek(calYear, calMonth);

  const calCells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  /* ── Step content ────────────────────────────────────────────────────── */
  function renderStep() {
    if (step === "type") {
      return (
        <div className="flex flex-col gap-3">
          <p className="font-sans text-sm font-medium text-foreground/60 mb-1">{b.stepType}</p>
          {CALL_TYPES.map((ct) => (
            <button
              key={ct.id}
              type="button"
              onClick={() => handleTypeSelect(ct)}
              className="group flex items-start justify-between border border-foreground/15 bg-[#1a1a1a] p-5 text-left transition-colors hover:border-accent hover:bg-accent/5"
            >
              <div>
                <p className="font-sans text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {isEN ? ct.label.en : ct.label.it}
                </p>
                <p className="mt-1 font-sans text-xs text-foreground/50">
                  {isEN ? ct.description.en : ct.description.it}
                </p>
              </div>
              <span className="ml-4 shrink-0 font-sans text-xs text-foreground/40 mt-0.5 whitespace-nowrap">
                {ct.duration} {b.duration}
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (step === "date") {
      return (
        <div className="flex flex-col gap-4">
          <p className="font-sans text-sm font-medium text-foreground/60">{b.stepDate}</p>
          {/* Calendar header */}
          <div className="flex items-center justify-between">
            <button type="button" onClick={prevMonth} className="flex h-8 w-8 items-center justify-center border border-foreground/15 text-foreground/60 hover:text-foreground transition-colors">
              <IconChevron dir="left" />
            </button>
            <span className="font-sans text-sm font-semibold text-foreground">
              {monthNames[calMonth]} {calYear}
            </span>
            <button type="button" onClick={nextMonth} className="flex h-8 w-8 items-center justify-center border border-foreground/15 text-foreground/60 hover:text-foreground transition-colors">
              <IconChevron dir="right" />
            </button>
          </div>
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1">
            {dayLabels.map((d) => (
              <div key={d} className="text-center font-sans text-[10px] font-medium uppercase tracking-wide text-foreground/30 py-1">
                {d}
              </div>
            ))}
            {calCells.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const jsDate = new Date(dateStr + "T12:00:00Z");
              const dow = jsDate.getUTCDay();
              const isWeekend = dow === 0 || dow === 6;
              const isPast = dateStr < todayStr;
              const disabled = isWeekend || isPast;
              const isSelected = dateStr === selectedDate;
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDateSelect(dateStr)}
                  className={`aspect-square flex items-center justify-center font-sans text-sm transition-colors
                    ${disabled ? "text-foreground/20 cursor-not-allowed" : "hover:bg-accent hover:text-background cursor-pointer"}
                    ${isSelected ? "bg-accent text-background font-semibold" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (step === "slot") {
      return (
        <div className="flex flex-col gap-4">
          <p className="font-sans text-sm font-medium text-foreground/60">{b.stepSlot}</p>
          {loadingSlots ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-sans text-sm text-foreground/40">{b.loading}</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="font-sans text-sm text-foreground/50">{b.noSlots}</p>
              <button type="button" onClick={goBack} className="font-sans text-sm text-accent hover:underline">
                {b.back}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={`${slot.start}-${slot.end}`}
                  type="button"
                  onClick={() => handleSlotSelect(slot)}
                  className="flex flex-col items-center justify-center border border-foreground/15 px-2 py-3 font-sans text-sm transition-colors hover:border-accent hover:bg-accent/5"
                >
                  <span className="font-semibold text-foreground">{slot.start}</span>
                  <span className="text-[11px] text-foreground/40">–{slot.end}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (step === "form") {
      return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Summary pill */}
          {selectedType && selectedDate && selectedSlot && (
            <div className="flex flex-wrap gap-2">
              {[
                isEN ? selectedType.label.en : selectedType.label.it,
                formatDateDisplay(selectedDate, locale),
                `${selectedSlot.start}–${selectedSlot.end}`,
              ].map((v) => (
                <span key={v} className="inline-flex items-center border border-foreground/15 px-3 py-1 font-sans text-xs text-foreground/60">
                  {v}
                </span>
              ))}
            </div>
          )}

          <p className="font-sans text-sm font-medium text-foreground/60">{b.stepForm}</p>

          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs text-foreground/50">{b.nameLabel}</label>
            <input
              required
              type="text"
              maxLength={100}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder={b.namePlaceholder}
              className="border border-foreground/15 bg-[#1a1a1a] px-4 py-2.5 font-sans text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground/40 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs text-foreground/50">{b.emailLabel}</label>
            <input
              required
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder={b.emailPlaceholder}
              className="border border-foreground/15 bg-[#1a1a1a] px-4 py-2.5 font-sans text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground/40 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs text-foreground/50">{b.messageLabel}</label>
            <textarea
              maxLength={1000}
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              placeholder={b.messagePlaceholder}
              rows={3}
              className="border border-foreground/15 bg-[#1a1a1a] px-4 py-2.5 font-sans text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground/40 transition-colors resize-none"
            />
          </div>

          {submitError && (
            <p className="font-sans text-xs text-red-400" role="alert">{submitError}</p>
          )}

          {/* Hidden submit — triggered by bottom bar button */}
          <button id="booking-form-submit" type="submit" className="hidden" />
        </form>
      );
    }

    if (step === "confirm") {
      return (
        <div className="flex flex-col items-center gap-6 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center bg-accent text-background">
            <IconCheck />
          </div>
          <div>
            <p className="font-hero text-[20px] uppercase tracking-[-1px] text-foreground">
              {b.stepConfirm}
            </p>
            <p className="mt-2 font-sans text-sm text-foreground/60">{b.confirmed}</p>
          </div>
          {meetLink && (
            <a
              href={meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-foreground/20 bg-[#1a1a1a] px-6 py-3 font-sans text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>
              {b.meetLink}
            </a>
          )}
          <button
            type="button"
            onClick={closeBooking}
            className="font-sans text-sm text-foreground/40 hover:text-foreground transition-colors"
          >
            {b.close}
          </button>
        </div>
      );
    }

    return null;
  }

  return (
    <AnimatedBookingModal>
      {/* Close button */}
      <button
        type="button"
        onClick={closeBooking}
        aria-label="Chiudi"
        className="absolute top-5 right-5 z-10 flex h-8 w-8 items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
      >
        <IconClose />
      </button>

      {/* Layout wrapper */}
      <div className="flex flex-1 flex-col 2xl:flex-row 2xl:overflow-hidden">
        {/* Left column — 2xl only */}
        <div className="hidden 2xl:flex 2xl:w-[360px] 2xl:shrink-0 2xl:flex-col 2xl:justify-between 2xl:border-r 2xl:border-foreground/10 2xl:p-10">
          <HeadlineContent dict={dict} />
          <div>
            <p className="font-sans text-xs text-foreground/30 uppercase tracking-widest mb-1">
              {stepIndex + 1} / {STEP_ORDER.length} · {STEP_LABELS[step]}
            </p>
            <p className="font-sans text-xs text-foreground/40 mt-4">{b.contactLabel} <a href={`mailto:${b.contactEmail}`} className="text-foreground/60 hover:text-foreground transition-colors">{b.contactEmail}</a></p>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Headline — visible < 2xl */}
          <div className="border-b border-foreground/10 px-6 pt-16 pb-6 md:px-8 2xl:hidden">
            <HeadlineContent dict={dict} />
            <p className="mt-3 font-sans text-[11px] uppercase tracking-widest text-foreground/30">
              {stepIndex + 1} / {STEP_ORDER.length} · {STEP_LABELS[step]}
            </p>
          </div>

          {/* Content area */}
          <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
            {renderStep()}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-foreground/10 px-6 py-4 md:px-8 flex items-center justify-between">
            <div>
              {stepIndex > 0 && step !== "confirm" ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-2 font-sans text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  <IconArrowLeft /> {b.back}
                </button>
              ) : (
                <a href={`mailto:${b.contactEmail}`} className="hidden 2xl:block font-sans text-xs text-foreground/30 hover:text-foreground transition-colors">
                  {b.contactEmail}
                </a>
              )}
            </div>
            <div>
              {step === "form" && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => document.getElementById("booking-form-submit")?.click()}
                  className="bg-accent px-6 py-2.5 font-sans text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? b.loading : b.submit}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedBookingModal>
  );
}
