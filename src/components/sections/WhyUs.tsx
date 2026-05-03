import type { Dictionary, WhyUsKind } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";

interface WhyUsProps {
  dict: Dictionary["whyUs"];
}

function KindIcon({ kind }: { kind: WhyUsKind }) {
  if (kind === "check") {
    return (
      <span className="text-white" aria-label="Yes">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2.5 7.5L5.5 10.5L11.5 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (kind === "warn") {
    return (
      <span className="text-silver" aria-label="Caution">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M7 1.5L13 12H1L7 1.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M7 6V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="7" cy="10.25" r="0.6" fill="currentColor" />
        </svg>
      </span>
    );
  }
  return (
    <span className="text-silver" aria-label="No">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M3 3L11 11M11 3L3 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/**
 * "Why us" comparison table.
 * Mobile : stacked card per row.
 * md+    : 4-column table (criterion + 3 columns).
 */
export default function WhyUs({ dict }: WhyUsProps) {
  return (
    <section
      aria-label="Why us"
      className="relative mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]"
    >
      <header className="mx-auto flex max-w-[600px] flex-col items-center gap-4 text-center">
        <Eyebrow>{dict.eyebrow}</Eyebrow>
        <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
        <p className="text-fig-body text-silver">{dict.body}</p>
      </header>

      {/* Desktop / tablet table */}
      <div className="mt-10 hidden overflow-hidden rounded-[8px] border border-white/10 md:block">
        <div className="text-fig-eyebrow text-silver bg-shark grid grid-cols-[1.1fr_1.4fr_1.2fr_1.2fr]">
          <div className="px-5 py-4" />
          <div className="border-l border-white/10 bg-white/[0.04] px-5 py-4 text-white">
            {dict.columns[0]}
          </div>
          <div className="border-l border-white/10 px-5 py-4">{dict.columns[1]}</div>
          <div className="border-l border-white/10 px-5 py-4">{dict.columns[2]}</div>
        </div>

        <div className="divide-y divide-white/10">
          {dict.rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1.1fr_1.4fr_1.2fr_1.2fr] items-stretch"
            >
              <div className="text-fig-body text-silver px-5 py-5">{row.label}</div>

              {row.values.map((value, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 border-l border-white/10 px-5 py-5 ${
                    i === 0 ? "bg-white/[0.04]" : ""
                  }`}
                >
                  <KindIcon kind={value.kind} />
                  <span
                    className={`text-fig-body ${i === 0 ? "text-white" : "text-silver"}`}
                  >
                    {value.text}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile stacked cards */}
      <div className="mt-10 flex flex-col gap-4 md:hidden">
        {dict.rows.map((row) => (
          <div
            key={row.label}
            className="bg-shark overflow-hidden rounded-[8px] border border-white/10"
          >
            <p className="text-fig-eyebrow text-silver border-b border-white/10 bg-white/[0.04] px-4 py-3">
              {row.label}
            </p>
            <div className="divide-y divide-white/10">
              {row.values.map((value, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <KindIcon kind={value.kind} />
                  <p className="text-fig-eyebrow text-silver">{dict.columns[i]}</p>
                  <span className="text-fig-body ml-auto text-white">{value.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
