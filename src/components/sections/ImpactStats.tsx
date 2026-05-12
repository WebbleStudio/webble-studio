"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dictionary } from "@/lib/getDictionary";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Observer);
}

interface ImpactStatsProps {
  dict: Dictionary["impactStats"];
}

/**
 * Pinned full-viewport stats section with **scroll hijacking**.
 *
 *  - `ScrollTrigger` pins the section visually for `total * 100vh` of scroll
 *    range and creates the pin-spacer that the rest of the page expects.
 *  - `Observer` captures wheel + touch input *while the section is pinned*
 *    and translates each input gesture into exactly one step (forward or
 *    backward). During the spring animation any extra inputs are ignored,
 *    so a fast wheel can no longer skip stats.
 *  - When the user is on the first/last stat and tries to go further, we
 *    disable the Observer and programmatically scroll past the pin range:
 *    the page resumes natural scrolling immediately, no awkward "stuck"
 *    feeling.
 *  - The text transitions themselves are driven by framer-motion
 *    `AnimatePresence` in `mode="wait"`, with per-character spring rise +
 *    exit (the same vibe as the `TextRotate` component used elsewhere).
 *
 *   ┌─────────────────────────────┐
 *   │   150+ Progetti completati  │   ← number bone, label bone @ 60%
 *   │   Dall'identità di brand …  │   ← description, color: bone @ 60%
 *   └─────────────────────────────┘
 */

const SPRING: Transition = { type: "spring", damping: 25, stiffness: 300 };
const STAGGER = 0.014;
/**
 * How long we lock further scroll inputs after a transition starts. Slightly
 * longer than the worst-case spring + stagger duration so the next stat
 * always fully renders before the user can advance again.
 */
const LOCK_MS = 1000;

/** Unicode-safe split — keeps multi-codepoint graphemes intact. */
function splitIntoCharacters(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
}

export default function ImpactStats({ dict }: ImpactStatsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Drives the first-arrival fade-in. Flipped to true the moment the pin
  // engages, so the headline appears exactly when it's centered on screen
  // rather than as soon as the section enters the viewport (which felt like
  // an abrupt "snap" coming out of the previous section).
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const total = dict.items.length;
    if (total === 0) return;

    const ctx = gsap.context(() => {
      // Mutable state lives outside React so we don't trigger renders on
      // every wheel tick.
      const state = {
        idx: 0,
        animating: false,
        lockUntil: 0,
        releasePending: false,
      };

      // Track every pending setTimeout so ctx.revert() can clear them and
      // we don't get zombie callbacks firing after unmount / HMR.
      const timeouts = new Set<number>();
      const setTimer = (fn: () => void, ms: number) => {
        const id = window.setTimeout(() => {
          timeouts.delete(id);
          fn();
        }, ms);
        timeouts.add(id);
        return id;
      };

      // 1) Capture wheel / touch — disabled until the section is pinned.
      const observer = Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        tolerance: 10,
        // Restrict to vertical so horizontal trackpad nudges don't trigger
        // stat changes.
        lockAxis: true,
        // Required so iOS / trackpads don't accidentally double-fire.
        wheelSpeed: -1,
        preventDefault: true,
        onUp: () => attemptStep(1), // user wants the next stat
        onDown: () => attemptStep(-1), // user wants the previous stat
      });
      observer.disable();

      // 2) Pin the section. Pin range is generous — Observer prevents
      //    default on most events while the section is active, so the
      //    user only "consumes" scroll budget once they reach a boundary
      //    and the Observer steps aside.
      let trigger: ScrollTrigger | null = null;

      function releasePin(dir: 1 | -1) {
        observer.disable();
        if (!trigger) return;
        const target =
          dir === 1 ? trigger.end + 1 : Math.max(0, trigger.start - 1);
        window.scrollTo({ top: target, behavior: "auto" });
      }

      function startLock() {
        state.animating = true;
        state.lockUntil = Date.now() + LOCK_MS;
        setTimer(() => {
          state.animating = false;
        }, LOCK_MS);
      }

      function attemptStep(dir: 1 | -1) {
        if (state.releasePending) return; // already on our way out, ignore inputs

        const next = state.idx + dir;

        // Boundary case — user wants to exit the pinned section.
        if (next < 0 || next >= total) {
          // If a stat transition is still mid-flight, defer the release
          // until the lock ends so the last stat actually shows in full
          // before we scroll past the pin. Otherwise a fast scroll would
          // exit before the last stat finishes animating in.
          const remaining = Math.max(0, state.lockUntil - Date.now());
          if (remaining === 0) {
            releasePin(dir);
            return;
          }
          state.releasePending = true;
          setTimer(() => {
            state.releasePending = false;
            releasePin(dir);
          }, remaining);
          return;
        }

        if (state.animating) return; // ignore mid-animation steps inside the section

        state.idx = next;
        setActiveIndex(next);
        startLock();
      }

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${total * 100}%`,
        pin: true,
        pinSpacing: true,
        // Helps when the user enters the pinned section with a fast scroll,
        // avoiding a 1-frame "jump" of the section before pinning engages.
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Entered from above → first stat, capture input.
        onEnter: () => {
          state.idx = 0;
          state.releasePending = false;
          setActiveIndex(0);
          setHasEntered(true);
          observer.enable();
          // Grace period: lock immediately on entry so the leftover momentum
          // from the gesture that brought the user here doesn't skip past
          // the first stat before they can read it.
          startLock();
        },
        // Entered from below (scrolling up) → land on the last stat so the
        // user sees a natural reverse experience.
        onEnterBack: () => {
          state.idx = total - 1;
          state.releasePending = false;
          setActiveIndex(total - 1);
          setHasEntered(true);
          observer.enable();
          startLock();
        },
        onLeave: () => observer.disable(),
        onLeaveBack: () => observer.disable(),
      });

      // Cleanup: clear any in-flight timers when the gsap context reverts
      // (component unmount / HMR). Without this, a deferred releasePin can
      // fire after the section is gone and call window.scrollTo on stale
      // trigger coordinates.
      return () => {
        timeouts.forEach((id) => window.clearTimeout(id));
        timeouts.clear();
      };
    }, section);

    return () => ctx.revert();
  }, [dict.items.length]);

  const item = dict.items[activeIndex];
  const valueText = `${item.value}${item.suffix}`;
  const labelText = item.label;
  const headlineChars = splitIntoCharacters(`${valueText} ${labelText}`);
  const valueLen = splitIntoCharacters(valueText).length;
  const totalChars = headlineChars.length;

  return (
    <div className="relative">
      <section
        ref={sectionRef}
        aria-label="Impact in numbers"
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="relative mx-auto flex h-full w-full max-w-[1140px] items-center justify-center px-6 md:px-8 2xl:max-w-[1340px]">
          {/* Outer wrapper handles the *first* arrival reveal — same simple
              fade-and-rise as the Bottlenecks headline. The inner
              AnimatePresence (with `initial={false}`) runs only on
              subsequent stat changes, so the first stat doesn't get the
              per-character spring stagger — it just fades in.
              The reveal is driven by `hasEntered`, which flips on the
              ScrollTrigger pin's `onEnter` — so the text fades in exactly
              when it lands centered on screen, not when the section first
              pokes into the viewport. */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-8 text-center md:gap-10"
          >
            {/* Headline: number + label on the same line. Sized like the
                Bottlenecks H1, wraps on mobile, locked to one line on md+. */}
            <div className="text-fig-h1 leading-[1] tracking-[-0.05em] md:whitespace-nowrap">
              <span className="sr-only">{`${valueText} ${labelText}`}</span>

              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeIndex}
                  className="inline-flex overflow-hidden align-baseline"
                  aria-hidden="true"
                >
                  {headlineChars.map((char, i) => {
                    const isValue = i < valueLen;
                    const visibleChar = char === " " ? "\u00A0" : char;
                    return (
                      <motion.span
                        key={`${activeIndex}-${i}`}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-120%", opacity: 0 }}
                        transition={{ ...SPRING, delay: i * STAGGER }}
                        className={`inline-block ${
                          isValue ? "text-bone" : "text-bone/60"
                        }`}
                      >
                        {visibleChar}
                      </motion.span>
                    );
                  })}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Description: animates as a single block, lands just after
                the headline finishes its stagger. */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-120%", opacity: 0 }}
                  transition={{
                    ...SPRING,
                    delay: Math.min(0.2, totalChars * STAGGER * 0.6),
                  }}
                  className="text-fig-body text-bone/60 max-w-[560px]"
                >
                  {item.description}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
