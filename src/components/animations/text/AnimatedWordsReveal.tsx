"use client";

import { motion } from "framer-motion";

interface AnimatedWordsRevealProps {
  text: string;
  className?: string;
  /** If true, animate immediately on mount (hero above fold) */
  immediate?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveals text word-by-word with a fade+rise stagger.
 * Supports {italic} wrapping for serif-italic styling.
 * Supports [\n] for line breaks.
 */
export default function AnimatedWordsReveal({
  text,
  className,
  immediate = false,
}: AnimatedWordsRevealProps) {
  // Split preserving {italic} markers and [\n] line breaks
  const tokens = tokenize(text);

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.05,
      },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };

  const motionProps = immediate
    ? ({ initial: "hidden", animate: "visible" } as const)
    : ({
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.3 },
      } as const);

  return (
    <motion.span
      {...motionProps}
      variants={container}
      className={`inline ${className ?? ""}`}
      aria-label={text.replace(/\{([^}]+)\}|\[\\n\]/g, (_, g) => g ?? " ")}
    >
      {tokens.map((token, i) => {
        if (token.type === "break") {
          return <br key={i} />;
        }
        return (
          <motion.span
            key={i}
            variants={word}
            className={`inline-block ${token.italic ? "italic" : ""}`}
            style={{ marginRight: "0.25em" }}
          >
            {token.value}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

type Token =
  | { type: "word"; value: string; italic: boolean }
  | { type: "break" };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // Split on line break markers first
  const lines = text.split(/\[\\n\]/);
  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) tokens.push({ type: "break" });
    // Match {italic words} or normal words
    const re = /\{([^}]+)\}|(\S+)/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(line)) !== null) {
      if (match[1] !== undefined) {
        // italic group — split into words
        match[1].split(/\s+/).filter(Boolean).forEach((w) => {
          tokens.push({ type: "word", value: w, italic: true });
        });
      } else if (match[2] !== undefined) {
        tokens.push({ type: "word", value: match[2], italic: false });
      }
    }
  });
  return tokens;
}
