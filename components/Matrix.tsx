"use client";

import { useMemo, useState } from "react";
import {
  PROCEDURE_KEYS,
  PRODUCT_KEYS,
  PRODUCT_DURATION_OPTIONS,
  SESSION_OPTIONS,
  type ProcedureKey,
  type ProductKey,
} from "@/lib/options";
import { copy, OTHER_WORD_LIMIT, wordCount } from "@/lib/i18n";
import type { ExtractPatch, ProcedureDraft, ProductDraft } from "@/lib/schema";
import { useIntakeStore } from "@/store/intake";
import { Chip, ChipWrap, GhostButton, PrimaryButton, YesNoSwitch } from "./ui";

type ProductMap = Partial<Record<ProductKey, ProductDraft>>;
type ProcedureMap = Partial<Record<ProcedureKey, ProcedureDraft>>;

export function ProductMatrix({
  value,
  onChange,
  onDone,
}: {
  value: ProductMap;
  onChange: (next: ProductMap) => void;
  onDone: () => void;
}) {
  const t = copy(useIntakeStore((state) => state.lang));
  const yn = { yesLabel: t.yes, noLabel: t.no };
  const toggle = (key: ProductKey) => {
    const current = value[key];
    onChange({
      ...value,
      [key]: current?.used ? { used: false } : { used: true },
    });
  };

  const finish = () => {
    const next: ProductMap = { ...value };
    for (const key of PRODUCT_KEYS) {
      if (!next[key]?.used) next[key] = { used: false };
    }
    onChange(next);
    onDone();
  };

  const canContinue = PRODUCT_KEYS.every((key) => {
    const row = value[key];
    if (!row?.used) return true;
    return (
      Boolean(row.duration) &&
      typeof row.helped === "boolean" &&
      typeof row.side_effects === "boolean"
    );
  });

  return (
    <>
      <p className="text-sm text-muted">{t.q12hint}</p>
      <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2 md:items-start">
        {PRODUCT_KEYS.map((key) => {
          const row = value[key];
          const open = Boolean(row?.used);
          return (
            <div
              key={key}
              className={[
                "rounded-2xl border bg-white transition-colors",
                open ? "border-sage/40" : "border-line",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => toggle(key)}
                className="flex min-h-14 w-full items-center gap-3 px-3.5 py-3 text-left"
              >
                <Tick checked={open} />
                <span className="flex-1 text-[1.02rem] font-semibold leading-snug">
                  {t.product[key]}
                </span>
              </button>
              {open && row?.used ? (
                <div className="space-y-3 border-t border-line px-3.5 py-3">
                  <div>
                    <p className="mb-2 text-[0.8rem] font-medium text-sage-mid">{t.howLong}</p>
                    <ChipWrap>
                      {PRODUCT_DURATION_OPTIONS.map((option) => (
                        <Chip
                          key={option}
                          selected={row.duration === option}
                          onClick={() =>
                            onChange({ ...value, [key]: { ...row, duration: option } })
                          }
                        >
                          {t.productDuration[option]}
                        </Chip>
                      ))}
                    </ChipWrap>
                  </div>
                  <div>
                    <p className="mb-2 text-[0.8rem] font-medium text-sage-mid">{t.didHelp}</p>
                    <YesNoSwitch
                      full
                      {...yn}
                      value={row.helped}
                      onChange={(helped) =>
                        onChange({ ...value, [key]: { ...row, helped } })
                      }
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-[0.8rem] font-medium text-sage-mid">{t.anySide}</p>
                    <YesNoSwitch
                      full
                      {...yn}
                      value={row.side_effects}
                      onChange={(side_effects) =>
                        onChange({
                          ...value,
                          [key]: {
                            ...row,
                            side_effects,
                            side_effect_notes: side_effects
                              ? row.side_effect_notes?.length
                                ? row.side_effect_notes
                                : [""]
                              : undefined,
                          },
                        })
                      }
                    />
                  </div>
                  {row.side_effects ? (
                    <div className="space-y-2">
                      <p className="text-[0.8rem] text-muted">{t.sideOptional}</p>
                      {(row.side_effect_notes ?? [""]).map((note, index) => (
                        <input
                          key={index}
                          value={note}
                          onChange={(event) => {
                            const notes = [...(row.side_effect_notes ?? [""])];
                            notes[index] = event.target.value;
                            onChange({
                              ...value,
                              [key]: { ...row, side_effect_notes: notes },
                            });
                          }}
                          placeholder={index === 0 ? t.sideNote : t.anotherNote}
                          className="min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-base outline-none ring-sage/30 focus:ring-2"
                        />
                      ))}
                      <button
                        type="button"
                        className="text-sm font-semibold text-sage-mid"
                        onClick={() =>
                          onChange({
                            ...value,
                            [key]: {
                              ...row,
                              side_effect_notes: [...(row.side_effect_notes ?? [""]), ""],
                            },
                          })
                        }
                      >
                        {t.addMore}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <PrimaryButton disabled={!canContinue} onClick={finish}>
        {t.continue}
      </PrimaryButton>
    </>
  );
}

export function ProcedureMatrix({
  value,
  onChange,
  onDone,
}: {
  value: ProcedureMap;
  onChange: (next: ProcedureMap) => void;
  onDone: () => void;
}) {
  const t = copy(useIntakeStore((state) => state.lang));
  const yn = { yesLabel: t.yes, noLabel: t.no };
  const toggle = (key: ProcedureKey) => {
    const current = value[key];
    onChange({
      ...value,
      [key]: current?.done ? { done: false } : { done: true },
    });
  };

  const finish = () => {
    const next: ProcedureMap = { ...value };
    for (const key of PROCEDURE_KEYS) {
      if (!next[key]?.done) next[key] = { done: false };
    }
    onChange(next);
    onDone();
  };

  const canContinue = PROCEDURE_KEYS.every((key) => {
    const row = value[key];
    if (!row?.done) return true;
    const core = Boolean(row.sessions) && typeof row.helped === "boolean";
    if (key !== "Other") return core;
    const detail = row.other_detail?.trim() ?? "";
    const words = wordCount(detail);
    return core && detail.length >= 2 && words <= OTHER_WORD_LIMIT;
  });

  return (
    <>
      <p className="text-sm text-muted">{t.q13hint}</p>
      <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2 md:items-start">
        {PROCEDURE_KEYS.map((key) => {
          const row = value[key];
          const open = Boolean(row?.done);
          const otherWords = wordCount(row?.other_detail ?? "");
          return (
            <div
              key={key}
              className={[
                "rounded-2xl border bg-white transition-colors",
                open ? "border-sage/40" : "border-line",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => toggle(key)}
                className="flex min-h-14 w-full items-center gap-3 px-3.5 py-3 text-left"
              >
                <Tick checked={open} />
                <span className="flex-1 text-[1.02rem] font-semibold leading-snug">
                  {t.procedure[key]}
                </span>
              </button>
              {open && row?.done ? (
                <div className="space-y-3 border-t border-line px-3.5 py-3">
                  {key === "Other" ? (
                    <div>
                      <p className="mb-2 text-[0.8rem] font-medium text-sage-mid">{t.otherWhat}</p>
                      <textarea
                        value={row.other_detail ?? ""}
                        onChange={(event) => {
                          const next = event.target.value;
                          if (wordCount(next) > OTHER_WORD_LIMIT) return;
                          onChange({ ...value, [key]: { ...row, other_detail: next } });
                        }}
                        rows={3}
                        placeholder={t.otherPlaceholder}
                        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-base outline-none ring-sage/30 focus:ring-2"
                      />
                      <p className="mt-1 text-right text-xs text-muted">
                        {OTHER_WORD_LIMIT - otherWords} {t.wordsLeft}
                      </p>
                    </div>
                  ) : null}
                  <div>
                    <p className="mb-2 text-[0.8rem] font-medium text-sage-mid">{t.sessionAsk}</p>
                    <ChipWrap>
                      {SESSION_OPTIONS.map((option) => (
                        <Chip
                          key={option}
                          selected={row.sessions === option}
                          onClick={() =>
                            onChange({ ...value, [key]: { ...row, sessions: option } })
                          }
                        >
                          {t.sessions[option]}
                        </Chip>
                      ))}
                    </ChipWrap>
                  </div>
                  <div>
                    <p className="mb-2 text-[0.8rem] font-medium text-sage-mid">{t.didHelp}</p>
                    <YesNoSwitch
                      full
                      {...yn}
                      value={row.helped}
                      onChange={(helped) =>
                        onChange({ ...value, [key]: { ...row, helped } })
                      }
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <PrimaryButton disabled={!canContinue} onClick={finish}>
        {t.continue}
      </PrimaryButton>
    </>
  );
}

function Tick({ checked }: { checked: boolean }) {
  return (
    <span
      className={[
        "grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-sm font-bold",
        checked ? "border-sage bg-sage text-paper" : "border-line bg-paper text-transparent",
      ].join(" ")}
      aria-hidden
    >
      ✓
    </span>
  );
}

export function TypeTreatments({
  onApplied,
}: {
  onApplied: (patch: ExtractPatch) => void;
}) {
  const t = copy(useIntakeStore((state) => state.lang));
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const canSend = useMemo(() => text.trim().length > 12, [text]);

  async function submit() {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error ?? "Couldn’t read that. Try the taps instead.");
      }
      onApplied(body.patch);
      setOpen(false);
      setText("");
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (!open) {
    return (
      <GhostButton onClick={() => setOpen(true)}>
        {t.typeInstead}
      </GhostButton>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="mb-2 text-sm text-muted">{t.typeHelp}</p>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={4}
        placeholder={t.typePlaceholder}
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-base outline-none ring-sage/30 focus:ring-2"
      />
      {error ? <p className="mt-2 text-sm text-warn">{error}</p> : null}
      <div className="mt-3 flex gap-3">
        <PrimaryButton disabled={!canSend || status === "loading"} onClick={submit}>
          {status === "loading" ? t.reading : t.fillBoxes}
        </PrimaryButton>
      </div>
      <GhostButton onClick={() => setOpen(false)}>{t.tapsInstead}</GhostButton>
    </div>
  );
}
