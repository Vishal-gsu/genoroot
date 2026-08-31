"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { displayClass } from "@/lib/i18n";
import { useIntakeStore } from "@/store/intake";

export function Question({
  kicker,
  title,
  hint,
  dense,
  children,
}: {
  kicker?: string;
  title: string;
  hint?: string;
  dense?: boolean;
  children: ReactNode;
}) {
  const lang = useIntakeStore((state) => state.lang);
  return (
    <div className={dense ? "flex flex-1 flex-col gap-4" : "flex flex-1 flex-col gap-6"}>
      <header className={dense ? "space-y-1.5" : "space-y-2"}>
        {kicker ? (
          <p className="text-xs font-semibold tracking-[0.16em] text-sage-mid uppercase">
            {kicker}
          </p>
        ) : null}
        <h1
          className={[
            displayClass(lang),
            "leading-[1.15] tracking-tight text-ink",
            dense ? "text-[1.4rem] sm:text-[1.7rem] lg:text-[1.85rem]" : "text-[1.75rem] sm:text-[2.05rem] lg:text-[2.25rem]",
          ].join(" ")}
        >
          {title}
        </h1>
        {hint ? (
          <p className={dense ? "text-[0.95rem] leading-relaxed text-muted" : "text-[1.05rem] leading-relaxed text-muted"}>
            {hint}
          </p>
        ) : null}
      </header>
      <div className="flex flex-1 flex-col gap-3">{children}</div>
    </div>
  );
}

export function ChoiceButton({
  selected,
  onClick,
  children,
  subtitle,
  large,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  subtitle?: string;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-full w-full rounded-2xl border px-4 text-left transition-colors",
        large ? "min-h-16 py-4" : "min-h-14 py-3.5",
        selected
          ? "border-sage bg-sage-soft text-ink shadow-[inset_0_0_0_1px_var(--sage)]"
          : "border-line bg-white/70 text-ink hover:border-sage-mid/40",
      ].join(" ")}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-[1.05rem] font-medium leading-snug">{children}</span>
          {subtitle ? (
            <span className="mt-0.5 block text-sm text-muted">{subtitle}</span>
          ) : null}
        </span>
        <span
          className={[
            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs",
            selected
              ? "border-sage bg-sage text-paper"
              : "border-line bg-white text-transparent",
          ].join(" ")}
          aria-hidden
        >
          ✓
        </span>
      </span>
    </button>
  );
}

export function YesNo({
  value,
  onChange,
  yes = "Yes",
  no = "No",
}: {
  value: boolean | undefined;
  onChange: (next: boolean) => void;
  yes?: string;
  no?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ChoiceButton selected={value === true} onClick={() => onChange(true)} large>
        {yes}
      </ChoiceButton>
      <ChoiceButton selected={value === false} onClick={() => onChange(false)} large>
        {no}
      </ChoiceButton>
    </div>
  );
}

/** Left = No, right = Yes. Words sit on the switch. Use `full` on phones. */
export function YesNoSwitch({
  value,
  onChange,
  labelledBy,
  full,
  yesLabel = "Yes",
  noLabel = "No",
}: {
  value: boolean | undefined;
  onChange: (next: boolean) => void;
  labelledBy?: string;
  full?: boolean;
  yesLabel?: string;
  noLabel?: string;
}) {
  const on = value === true;
  const off = value === false;
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className={[
        "relative grid h-12 grid-cols-2 rounded-full bg-[#e4dbcf] p-1 shadow-inner",
        full ? "w-full" : "w-[9.25rem] shrink-0",
      ].join(" ")}
    >
      {value !== undefined ? (
        <motion.span
          layout
          className="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-sage shadow-sm"
          style={{ left: on ? "calc(50% - 0.125rem)" : "0.25rem" }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      ) : null}
      <button
        type="button"
        role="radio"
        aria-checked={off}
        onClick={() => onChange(false)}
          className={[
            "relative z-10 rounded-full px-1 text-sm font-semibold transition-colors",
            off ? "text-paper" : "text-muted",
          ].join(" ")}
      >
        {noLabel}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={on}
        onClick={() => onChange(true)}
        className={[
          "relative z-10 rounded-full text-sm font-semibold transition-colors",
          on ? "text-paper" : "text-muted",
        ].join(" ")}
      >
        {yesLabel}
      </button>
    </div>
  );
}

export function ChoiceStack({
  children,
  cols = 2,
}: {
  children: ReactNode;
  cols?: 2 | 3;
}) {
  return (
    <div
      className={
        cols === 3
          ? "flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-3"
          : "flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3"
      }
    >
      {children}
    </div>
  );
}

export function ChipWrap({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-h-11 shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
        selected
          ? "border-sage bg-sage text-paper"
          : "border-line bg-white/80 text-ink hover:border-sage-mid/40",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="min-h-14 w-full rounded-full bg-sage px-6 text-base font-semibold text-paper transition-opacity disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-h-11 text-sm font-medium text-sage-mid underline-offset-4 hover:underline disabled:opacity-40 disabled:no-underline"
    >
      {children}
    </button>
  );
}

export function Slide({
  stepKey,
  direction,
  children,
}: {
  stepKey: string;
  direction: 1 | -1;
  children: ReactNode;
}) {
  return (
    <motion.div
      key={stepKey}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      variants={{
        enter: (dir: 1 | -1) => ({ x: dir * 56, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: 1 | -1) => ({ x: dir * -56, opacity: 0 }),
      }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
