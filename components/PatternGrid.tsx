import type { Pattern } from "@/lib/options";
import { PATTERN_OPTIONS } from "@/lib/options";
import { copy } from "@/lib/i18n";
import { useIntakeStore } from "@/store/intake";

function Scalp({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]" aria-hidden>
      <ellipse cx="40" cy="42" rx="26" ry="30" fill="#f4efe6" stroke="#2c4a3c" strokeWidth="2" />
      {children}
    </svg>
  );
}

const ICONS: Record<Pattern, React.ReactNode> = {
  "Receding hairline": (
    <Scalp>
      <path d="M18 28c8 10 36 10 44 0" fill="none" stroke="#2c4a3c" strokeWidth="2" />
      <path d="M22 22c6 6 30 6 36 0" fill="none" stroke="#2c4a3c" strokeWidth="1.5" opacity="0.45" />
    </Scalp>
  ),
  "Thinning at crown": (
    <Scalp>
      <circle cx="40" cy="36" r="8" fill="none" stroke="#2c4a3c" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="40" cy="36" r="3" fill="#2c4a3c" opacity="0.35" />
    </Scalp>
  ),
  "Widening part line": (
    <Scalp>
      <path d="M40 14v54" stroke="#2c4a3c" strokeWidth="4" strokeLinecap="round" />
      <path d="M34 18v46" stroke="#2c4a3c" strokeWidth="1.5" opacity="0.4" />
      <path d="M46 18v46" stroke="#2c4a3c" strokeWidth="1.5" opacity="0.4" />
    </Scalp>
  ),
  "Diffuse thinning": (
    <Scalp>
      {Array.from({ length: 18 }, (_, i) => {
        const x = 24 + (i % 6) * 7;
        const y = 26 + Math.floor(i / 6) * 12;
        return <circle key={i} cx={x} cy={y} r="1.4" fill="#2c4a3c" opacity={0.45} />;
      })}
    </Scalp>
  ),
  "Patchy loss": (
    <Scalp>
      <circle cx="32" cy="34" r="6" fill="#f4efe6" stroke="#2c4a3c" strokeWidth="1.5" />
      <circle cx="50" cy="48" r="5" fill="#f4efe6" stroke="#2c4a3c" strokeWidth="1.5" />
    </Scalp>
  ),
  "Sudden excessive shedding": (
    <Scalp>
      <path d="M28 22c2 8 4 16 2 28" fill="none" stroke="#2c4a3c" strokeWidth="1.6" strokeDasharray="2 3" />
      <path d="M40 18c0 10 2 20 0 34" fill="none" stroke="#2c4a3c" strokeWidth="1.6" strokeDasharray="2 3" />
      <path d="M52 22c-1 9 1 18-1 28" fill="none" stroke="#2c4a3c" strokeWidth="1.6" strokeDasharray="2 3" />
    </Scalp>
  ),
};

export function PatternGrid({
  value,
  onToggle,
}: {
  value: Pattern[];
  onToggle: (pattern: Pattern) => void;
}) {
  const t = copy(useIntakeStore((state) => state.lang));
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {PATTERN_OPTIONS.map((pattern) => {
        const selected = value.includes(pattern);
        const copy = t.pattern[pattern];
        return (
          <button
            key={pattern}
            type="button"
            onClick={() => onToggle(pattern)}
            className={[
              "flex min-h-[9.5rem] flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-center transition-colors md:min-h-[10.5rem]",
              selected
                ? "border-sage bg-sage-soft shadow-[inset_0_0_0_1px_var(--sage)]"
                : "border-line bg-white/70 hover:border-sage-mid/40",
            ].join(" ")}
          >
            {ICONS[pattern]}
            <span className="text-sm font-semibold leading-tight">{copy.title}</span>
            <span className="text-xs text-muted">{copy.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
