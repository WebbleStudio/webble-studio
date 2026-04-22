interface ProblemStripeProps {
  label: string;
  className?: string;
}

export default function ProblemStripe({ label, className = "" }: ProblemStripeProps) {
  return (
    <div
      className={`text-foreground inline-flex w-fit items-center gap-3 bg-[#121212] px-10 py-4 font-sans text-sm font-medium ${className}`}
    >
      <img
        src="/img/homepage/problems/layers-icon.svg"
        alt=""
        aria-hidden="true"
        width={16}
        height={16}
      />
      <span>{label}</span>
    </div>
  );
}
