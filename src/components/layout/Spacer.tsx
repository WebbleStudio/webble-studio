interface SpacerProps {
  /**
   * Override the default vertical height with any Tailwind height classes
   * (e.g. "h-16", "h-32 md:h-48"). When omitted, the default rhythm is used.
   */
  className?: string;
}

const DEFAULT_CLASS = "h-50 md:h-32";

export default function Spacer({ className }: SpacerProps) {
  return <div aria-hidden="true" className={className ?? DEFAULT_CLASS} />;
}
