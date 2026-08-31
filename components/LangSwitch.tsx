"use client";

import { LANGS, type Lang } from "@/lib/i18n";
import { useIntakeStore } from "@/store/intake";

export function HeaderLang({ className }: { className?: string }) {
  const lang = useIntakeStore((state) => state.lang);
  const setLang = useIntakeStore((state) => state.setLang);

  return (
    <div className={["flex items-center gap-0.5", className].filter(Boolean).join(" ")}>
      {LANGS.map((item) => {
        const selected = lang === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLang(item.id as Lang)}
            className={[
              "min-h-11 min-w-11 rounded-full px-2.5 text-xs font-semibold tracking-wide transition-colors md:min-h-9 md:min-w-0 md:px-3 md:text-sm",
              selected ? "bg-sage text-paper" : "text-muted hover:text-ink",
            ].join(" ")}
          >
            {item.short}
          </button>
        );
      })}
    </div>
  );
}

export function LangChoices({
  value,
  onPick,
}: {
  value?: Lang | null;
  onPick: (lang: Lang) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {LANGS.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onPick(item.id as Lang)}
            className={[
              "min-h-12 rounded-2xl border px-1 text-sm font-semibold transition-colors",
              selected
                ? "border-sage bg-sage text-paper"
                : "border-line bg-white text-ink hover:border-sage-mid/40",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
