"use client";

import { useEffect, useState } from "react";
import { copy, displayClass, type Lang } from "@/lib/i18n";
import { finalizeDraft } from "@/lib/inference";
import { PRODUCT_KEYS, PROCEDURE_KEYS } from "@/lib/options";
import { parseIntake } from "@/lib/schema";
import { useIntakeStore } from "@/store/intake";
import { LangChoices } from "./LangSwitch";
import { GhostButton, PrimaryButton } from "./ui";

export function Summary() {
  const answers = useIntakeStore((state) => state.answers);
  const reset = useIntakeStore((state) => state.reset);
  const lang = useIntakeStore((state) => state.lang);
  const t = copy(lang);
  const r = t.report;
  const parsed = parseIntake(finalizeDraft(answers));
  const [copied, setCopied] = useState(false);
  const [pickLang, setPickLang] = useState(false);
  const [pendingPrint, setPendingPrint] = useState<Lang | null>(null);

  useEffect(() => {
    if (!parsed.success) return;
    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    }).catch(() => undefined);
  }, [parsed.success]);

  useEffect(() => {
    if (!pendingPrint) return;
    if (lang !== pendingPrint) return;
    const id = window.setTimeout(() => {
      const previous = document.title;
      document.title = "GenoRoot-hair-scalp-note";
      document.documentElement.classList.add("printing");
      const done = () => {
        document.documentElement.classList.remove("printing");
        document.title = previous;
        window.removeEventListener("afterprint", done);
      };
      window.addEventListener("afterprint", done);
      window.print();
      window.setTimeout(done, 1000);
      setPendingPrint(null);
    }, 80);
    return () => window.clearTimeout(id);
  }, [lang, pendingPrint]);

  if (!parsed.success) {
    return (
      <div className="space-y-4">
        <h1 className={`${displayClass(lang)} text-2xl`}>{r.incomplete}</h1>
        <GhostButton onClick={() => useIntakeStore.getState().goTo("q1")}>{r.goBack}</GhostButton>
      </div>
    );
  }

  const data = parsed.data;
  const usedProducts = PRODUCT_KEYS.filter((key) => data.products[key].used);
  const doneProcs = PROCEDURE_KEYS.filter((key) => data.procedures[key].done);
  const today = new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function runPrint() {
    const previous = document.title;
    document.title = "GenoRoot-hair-scalp-note";
    document.documentElement.classList.add("printing");
    const done = () => {
      document.documentElement.classList.remove("printing");
      document.title = previous;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    window.setTimeout(done, 1000);
  }

  function chooseDownloadLang(next: Lang) {
    setPickLang(false);
    if (lang === next) {
      runPrint();
      return;
    }
    useIntakeStore.getState().setLang(next);
    setPendingPrint(next);
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
      <div className="pb-6">
      <article className="print-sheet a4-report overflow-visible rounded-3xl border border-line bg-white px-4 pt-5 pb-4 shadow-[0_12px_40px_rgba(44,74,60,0.08)] md:px-8 md:pt-7 md:pb-6">
        <header className="flex items-start justify-between gap-3 pb-3">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-sage uppercase">
              {t.clinic}
            </p>
            <h1 className={`mt-1 ${displayClass(lang)} text-[1.45rem] leading-tight text-ink sm:text-[1.6rem]`}>
              {r.title}
            </h1>
            <p className="mt-1 text-[0.82rem] text-muted">{r.subtitle}</p>
          </div>
          <p className="shrink-0 pt-0.5 text-right text-xs text-muted">
            {r.date}
            <br />
            <span className="font-semibold text-ink">{today}</span>
          </p>
        </header>

        <div className="print-body space-y-4 pt-1">
          <div className="print-span-2 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Stat label={r.onset} value={`${data.age_hair_loss_began}`} />
            <Stat label={r.lasting} value={t.duration[data.duration]} />
            <Stat label={r.sample} value={t.sampleOpt[data.sample_type]} />
            <Stat
              label={r.consent}
              value={data.consent ? r.consented : r.declined}
              alert={!data.consent}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card title={r.pattern}>
              <Pills items={data.pattern.map((item) => t.pattern[item].title)} />
            </Card>
            <Card title={r.family}>
              <Pills items={data.family_history.map((item) => t.family[item])} />
            </Card>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
          <Card title={r.health}>
            <Pills items={data.diagnosed_conditions.map((item) => t.condition[item])} />
            <div className="mt-2">
              <Fact
                label={r.hormones}
                value={
                  data.pregnancy_related !== "Not applicable"
                    ? `${t.menstrual[data.menstrual_cycle]}\n${t.pregnancy[data.pregnancy_related]}`
                    : t.menstrual[data.menstrual_cycle]
                }
              />
              <Fact label={r.skin} value={data.adult_acne_oily_skin ? t.yes : t.no} />
              <Fact
                label={r.bodyHair}
                value={data.excess_body_facial_hair ? t.yes : t.no}
              />
            </div>
          </Card>

          <Card title={r.lifestyle}>
            <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-sage uppercase">
              {r.last6}
            </p>
            {data.past_6_months.length ? (
              <ul className="mt-1.5 space-y-1">
                {data.past_6_months.map((item) => (
                  <li key={item} className="text-sm leading-snug">
                    {t.trigger[item]}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-sm text-muted">{r.noneListed}</p>
            )}
            <div className="mt-3 border-t border-line pt-1">
              <Fact
                label={t.habits.smoke[0]}
                value={
                  data.habits.smoking
                    ? t.smoking[data.habits.smoking_severity ?? "Mild <5/day"]
                    : t.no
                }
              />
              <Fact label={t.habits.alcohol[0]} value={data.habits.alcohol ? t.yes : t.no} />
              <Fact label={t.habits.water[0]} value={data.habits.hard_water ? t.yes : t.no} />
              <Fact
                label={t.habits.wash[0]}
                value={t.wash[data.habits.hair_wash_frequency]}
              />
              <Fact
                label={t.habits.heat[0]}
                value={data.habits.heating_tools_styling_chemicals ? t.yes : t.no}
              />
              <Fact
                label={t.habits.salon[0]}
                value={
                  data.habits.salon_treatments
                    ? data.habits.salon_treatment_detail || t.yes
                    : t.no
                }
              />
            </div>
          </Card>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
          <Card title={r.usedNow}>
            {usedProducts.length === 0 ? (
              <p className="text-sm text-muted">{r.noneTried}</p>
            ) : (
              <ul className="space-y-1.5 text-sm leading-snug">
                {usedProducts.map((key) => {
                  const row = data.products[key];
                  if (!row.used) return null;
                  return (
                    <li key={key}>
                      <span className="font-semibold">{t.product[key]}</span>
                      {" — "}
                      {t.productDuration[row.duration]}, {row.helped ? r.helped : r.noHelp}
                      {row.side_effects ? `, ${r.sides.toLowerCase()}` : ""}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title={r.inClinic}>
            {doneProcs.length === 0 ? (
              <p className="text-sm text-muted">{r.noneTried}</p>
            ) : (
              <ul className="space-y-1.5 text-sm leading-snug">
                {doneProcs.map((key) => {
                  const row = data.procedures[key];
                  if (!row.done) return null;
                  return (
                    <li key={key}>
                      <span className="font-semibold">{t.procedure[key]}</span>
                      {" — "}
                      {t.sessions[row.sessions]}, {row.helped ? r.helped : r.noHelp}
                      {key === "Other" && data.other_clinic_treatment
                        ? ` · ${data.other_clinic_treatment}`
                        : ""}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
          </div>

          <div className="print-span-2">
          <Card title={r.sides} alert={Boolean(data.describe?.trim() || data.past_treatment_side_effects)}>
            {data.describe?.trim() ? (
              <p className="whitespace-pre-line text-sm leading-relaxed">{data.describe.trim()}</p>
            ) : data.past_treatment_side_effects ? (
              <p className="text-sm leading-relaxed">{t.yes}</p>
            ) : (
              <p className="text-sm text-muted">{r.noSides}</p>
            )}
          </Card>
          </div>

          <p className="print-span-2 px-1 pb-1 text-[0.68rem] leading-relaxed text-muted">
            {r.footer}
          </p>
        </div>
      </article>

      <div className="no-print mt-4 flex flex-col gap-2">
        {pickLang ? (
          <div className="space-y-3 rounded-2xl bg-paper-deep/50 px-3 py-3">
            <p className="text-sm font-medium text-ink">{r.downloadIn}</p>
            <LangChoices value={lang} onPick={chooseDownloadLang} />
            <GhostButton onClick={() => setPickLang(false)}>{t.cancel}</GhostButton>
          </div>
        ) : (
          <PrimaryButton onClick={() => setPickLang(true)}>{r.download}</PrimaryButton>
        )}
        <GhostButton onClick={copyJson}>{copied ? r.copied : r.copyJson}</GhostButton>
        <GhostButton onClick={reset}>{r.startOver}</GhostButton>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper/40 px-3 py-2.5">
      <p className="text-[0.62rem] font-semibold tracking-wide text-sage uppercase">{label}</p>
      <p
        className={`mt-0.5 text-sm font-semibold leading-snug ${alert ? "text-warn" : "text-ink"}`}
      >
        {value}
      </p>
    </div>
  );
}

function Card({
  title,
  children,
  alert,
}: {
  title: string;
  children: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white print:break-inside-avoid">
      <div className="border-b border-line bg-paper/50 px-3.5 py-2">
        <h2
          className={`text-[0.68rem] font-semibold tracking-[0.14em] uppercase ${alert ? "text-warn" : "text-sage"}`}
        >
          {title}
        </h2>
      </div>
      <div className="px-3.5 py-3 text-ink">{children}</div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/80 py-2 last:border-b-0 last:pb-0">
      <span className="text-[0.8rem] leading-snug text-muted">{label}</span>
      <span className="max-w-[58%] whitespace-pre-line text-right text-[0.8rem] font-medium leading-snug text-ink">
        {value}
      </span>
    </div>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-paper-deep px-2.5 py-1 text-xs font-semibold text-ink"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
