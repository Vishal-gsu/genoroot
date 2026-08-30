"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { demoPatient } from "@/fixtures/demoPatient";
import {
  CONDITION_OPTIONS,
  DURATION_OPTIONS,
  FAMILY_HISTORY_OPTIONS,
  PREGNANCY_OPTIONS,
  SAMPLE_OPTIONS,
  TRIGGER_OPTIONS,
  type Condition,
  type FamilyHistory,
  type MenstrualCycle,
  type Pattern,
  type PregnancyRelated,
  type SampleType,
  type Trigger,
} from "@/lib/options";
import { copy, displayClass } from "@/lib/i18n";
import { isStepComplete, visibleSteps, type StepId } from "@/lib/flow";
import {
  composeSideEffectLines,
  inferSideEffectsYesNo,
  mentionsPcos,
  toggleCondition,
  toggleFamilyHistory,
} from "@/lib/inference";
import type { ExtractPatch } from "@/lib/schema";
import { parseIntake } from "@/lib/schema";
import { useIntakeStore } from "@/store/intake";
import { HabitsList } from "./HabitsList";
import { HeaderLang } from "./LangSwitch";
import { ProcedureMatrix, ProductMatrix, TypeTreatments } from "./Matrix";
import { PatternGrid } from "./PatternGrid";
import { Summary } from "./Summary";
import { ChoiceButton, GhostButton, PrimaryButton, Question, Slide, YesNo } from "./ui";

export function Wizard() {
  const stepId = useIntakeStore((state) => state.stepId);
  const answers = useIntakeStore((state) => state.answers);
  const direction = useIntakeStore((state) => state.direction);
  const hydrated = useIntakeStore((state) => state.hydrated);
  const next = useIntakeStore((state) => state.next);
  const back = useIntakeStore((state) => state.back);
  const lang = useIntakeStore((state) => state.lang);
  const t = copy(lang);

  useEffect(() => {
    void Promise.resolve(useIntakeStore.persist.rehydrate()).finally(() => {
      useIntakeStore.getState().setHydrated();
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }, [lang]);

  const steps = visibleSteps(answers);
  const index = Math.max(0, steps.findIndex((step) => step.id === stepId));
  const current = steps[index] ?? steps[0];
  const questionSteps = steps.filter((step) => step.section);
  const questionIndex = questionSteps.findIndex((step) => step.id === current.id);
  const complete = isStepComplete(current.id, answers);

  if (!hydrated) {
    return (
      <Shell>
        <div className="flex flex-1 items-center justify-center text-muted">{t.loading}</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="no-print">
        <div className="flex items-center gap-2">
          {current.id !== "welcome" ? (
            <button
              type="button"
              onClick={back}
              className="grid h-9 w-9 shrink-0 place-items-center text-lg text-sage-mid"
              aria-label={t.back}
            >
              ←
            </button>
          ) : null}
          <p className="min-w-0 flex-1 text-[0.8rem] font-semibold tracking-[0.16em] text-sage uppercase">
            {t.clinic}
          </p>
          <HeaderLang />
        </div>
        {current.section ? (
          <div className="mt-3">
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="font-medium text-muted">{t.sections[current.section]}</span>
              <span className="tabular-nums text-muted">
                {questionIndex + 1} / {questionSteps.length}
              </span>
            </div>
            <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-paper-deep">
              <div
                className="h-full rounded-full bg-sage transition-[width] duration-300"
                style={{
                  width: `${((questionIndex + 1) / questionSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pt-6">
        <AnimatePresence mode="wait" custom={direction}>
          <Slide key={current.id} stepKey={current.id} direction={direction}>
            <StepBody
              stepId={current.id}
              complete={complete}
              onNext={next}
              onAuto={(fn) => {
                fn();
                window.setTimeout(() => useIntakeStore.getState().next(), 140);
              }}
            />
          </Slide>
        </AnimatePresence>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center">
      <div className="phone-shell flex min-h-dvh w-full max-w-md flex-col bg-paper px-5 pt-5 pb-4 shadow-[0_0_80px_rgba(28,22,18,0.08)] sm:my-6 sm:min-h-[min(100dvh-3rem,860px)] sm:rounded-[2rem] sm:px-6 sm:pt-6 sm:pb-6">
        {children}
      </div>
    </div>
  );
}

function StepBody({
  stepId,
  complete,
  onNext,
  onAuto,
}: {
  stepId: StepId;
  complete: boolean;
  onNext: () => void;
  onAuto: (fn: () => void) => void;
}) {
  const answers = useIntakeStore((state) => state.answers);
  const setAnswer = useIntakeStore((state) => state.setAnswer);
  const patchAnswers = useIntakeStore((state) => state.patchAnswers);
  const loadDemo = useIntakeStore((state) => state.loadDemo);
  const lang = useIntakeStore((state) => state.lang);
  const t = copy(lang);

  useEffect(() => {
    if (stepId !== "q14") return;
    const current = useIntakeStore.getState().answers;
    const inferred = inferSideEffectsYesNo(current);
    const patch: Parameters<typeof patchAnswers>[0] = {};
    if (current.past_treatment_side_effects === undefined && inferred !== undefined) {
      patch.past_treatment_side_effects = inferred;
    }
    const fromProducts = composeSideEffectLines({ ...current, extra_side_effects: [] });
    const yes = (patch.past_treatment_side_effects ?? current.past_treatment_side_effects) === true;
    if (yes && fromProducts.length === 0 && !current.extra_side_effects?.length) {
      patch.extra_side_effects = [""];
    }
    if (Object.keys(patch).length > 0) patchAnswers(patch);
  }, [stepId, patchAnswers]);

  switch (stepId) {
    case "welcome":
      return (
        <WelcomeScreen
          onStart={onNext}
          onSample={() => {
            const parsed = parseIntake(demoPatient);
            if (parsed.success) loadDemo(parsed.data);
          }}
        />
      );

    case "q1":
      return (
        <Question kicker={t.q.q1.kicker} title={t.q.q1.title} hint={t.q.q1.hint}>
          <NumberStepper
            value={answers.age_hair_loss_began}
            onChange={(age) => setAnswer("age_hair_loss_began", age)}
            yearsOld={t.yearsOld}
          />
          <div className="mt-auto pt-6">
            <PrimaryButton
              onClick={() => {
                setAnswer("age_hair_loss_began", answers.age_hair_loss_began ?? 30);
                onNext();
              }}
            >
              {t.continue}
            </PrimaryButton>
          </div>
        </Question>
      );

    case "q2":
      return (
        <Question kicker={t.q.q2.kicker} title={t.q.q2.title}>
          <div className="flex flex-col gap-2">
            {DURATION_OPTIONS.map((option) => (
              <ChoiceButton
                key={option}
                large
                selected={answers.duration === option}
                onClick={() => onAuto(() => setAnswer("duration", option))}
              >
                {t.duration[option]}
              </ChoiceButton>
            ))}
          </div>
        </Question>
      );

    case "q3":
      return (
        <Question kicker={t.q.q3.kicker} title={t.q.q3.title} hint={t.q.q3.hint}>
          <div className="flex flex-col gap-2">
            {FAMILY_HISTORY_OPTIONS.map((option) => (
              <ChoiceButton
                key={option}
                selected={answers.family_history?.includes(option) ?? false}
                onClick={() =>
                  setAnswer(
                    "family_history",
                    toggleFamilyHistory(answers.family_history ?? [], option as FamilyHistory),
                  )
                }
              >
                {t.family[option]}
              </ChoiceButton>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <PrimaryButton disabled={!complete} onClick={onNext}>
              {t.continue}
            </PrimaryButton>
          </div>
        </Question>
      );

    case "q4":
      return (
        <Question kicker={t.q.q4.kicker} title={t.q.q4.title} hint={t.q.q4.hint}>
          <PatternGrid
            value={answers.pattern ?? []}
            onToggle={(pattern: Pattern) => {
              const current = answers.pattern ?? [];
              setAnswer(
                "pattern",
                current.includes(pattern)
                  ? current.filter((item) => item !== pattern)
                  : [...current, pattern],
              );
            }}
          />
          <div className="mt-auto pt-4">
            <PrimaryButton disabled={!complete} onClick={onNext}>
              {t.continue}
            </PrimaryButton>
          </div>
        </Question>
      );

    case "q5":
      return (
        <Question kicker={t.q.q5.kicker} title={t.q.q5.title} hint={t.q.q5.hint}>
          <div className="flex flex-col gap-2">
            {CONDITION_OPTIONS.map((option) => (
              <ChoiceButton
                key={option}
                selected={answers.diagnosed_conditions?.includes(option) ?? false}
                onClick={() =>
                  setAnswer(
                    "diagnosed_conditions",
                    toggleCondition(answers.diagnosed_conditions ?? [], option as Condition),
                  )
                }
              >
                {t.condition[option]}
              </ChoiceButton>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <PrimaryButton disabled={!complete} onClick={onNext}>
              {t.continue}
            </PrimaryButton>
          </div>
        </Question>
      );

    case "q6": {
      const pcos = mentionsPcos(answers);
      const order: MenstrualCycle[] = pcos
        ? ["Regular", "Irregular", "Menopausal", "Not applicable"]
        : ["Not applicable", "Regular", "Irregular", "Menopausal"];
      return (
        <Question
          kicker={t.q.q6.kicker}
          title={t.q.q6.title}
          hint={pcos ? t.q6pcos : t.q6hint}
        >
          <div className="flex flex-col gap-2">
            {order.map((option) => (
              <ChoiceButton
                key={option}
                large
                selected={answers.menstrual_cycle === option}
                onClick={() => onAuto(() => setAnswer("menstrual_cycle", option))}
              >
                {t.menstrual[option]}
              </ChoiceButton>
            ))}
          </div>
        </Question>
      );
    }

    case "q7":
      return (
        <Question kicker={t.q.q7.kicker} title={t.q.q7.title}>
          <div className="flex flex-col gap-2">
            {(PREGNANCY_OPTIONS as readonly PregnancyRelated[]).map((option) => (
              <ChoiceButton
                key={option}
                large
                selected={answers.pregnancy_related === option}
                onClick={() => onAuto(() => setAnswer("pregnancy_related", option))}
              >
                {t.pregnancy[option]}
              </ChoiceButton>
            ))}
          </div>
        </Question>
      );

    case "q8":
      return (
        <Question kicker={t.q.q8.kicker} title={t.q.q8.title}>
          <YesNo
            value={answers.adult_acne_oily_skin}
            yes={t.yes}
            no={t.no}
            onChange={(value) => onAuto(() => setAnswer("adult_acne_oily_skin", value))}
          />
        </Question>
      );

    case "q9":
      return (
        <Question kicker={t.q.q9.kicker} title={t.q.q9.title}>
          <YesNo
            value={answers.excess_body_facial_hair}
            yes={t.yes}
            no={t.no}
            onChange={(value) => onAuto(() => setAnswer("excess_body_facial_hair", value))}
          />
        </Question>
      );

    case "q10":
      return (
        <Question kicker={t.q.q10.kicker} title={t.q.q10.title} hint={t.q.q10.hint}>
          <div className="flex flex-col gap-2">
            {TRIGGER_OPTIONS.map((option) => {
              const selected = answers.past_6_months?.includes(option) ?? false;
              return (
                <ChoiceButton
                  key={option}
                  selected={selected}
                  onClick={() => {
                    const current = answers.past_6_months ?? [];
                    setAnswer(
                      "past_6_months",
                      selected
                        ? current.filter((item) => item !== option)
                        : [...current, option as Trigger],
                    );
                  }}
                >
                  {t.trigger[option]}
                </ChoiceButton>
              );
            })}
          </div>
          <div className="mt-auto pt-6">
            <PrimaryButton
              onClick={() => {
                if (answers.past_6_months === undefined) setAnswer("past_6_months", []);
                onNext();
              }}
            >
              {t.continue}
            </PrimaryButton>
          </div>
        </Question>
      );

    case "q11":
      return (
        <Question dense kicker={t.q.q11.kicker} title={t.q.q11.title} hint={t.q.q11.hint}>
          <HabitsList
            value={answers.habits ?? {}}
            onChange={(habits) => patchAnswers({ habits })}
          />
          <div className="pt-3">
            <PrimaryButton disabled={!complete} onClick={onNext}>
              {t.continue}
            </PrimaryButton>
          </div>
        </Question>
      );

    case "q12":
      return (
        <Question dense kicker={t.q.q12.kicker} title={t.q.q12.title}>
          <TypeTreatments onApplied={(patch) => applyExtract(patch)} />
          <ProductMatrix
            value={answers.products ?? {}}
            onChange={(products) => patchAnswers({ products })}
            onDone={onNext}
          />
        </Question>
      );

    case "q13":
      return (
        <Question dense kicker={t.q.q13.kicker} title={t.q.q13.title}>
          <ProcedureMatrix
            value={answers.procedures ?? {}}
            onChange={(procedures) => patchAnswers({ procedures })}
            onDone={onNext}
          />
        </Question>
      );

    case "q14": {
      const inferred = inferSideEffectsYesNo(answers);
      const value = answers.past_treatment_side_effects;
      const fromProducts = composeSideEffectLines({
        ...answers,
        extra_side_effects: [],
      });
      const extras = answers.extra_side_effects ?? [];
      const title =
        fromProducts.length > 0
          ? t.q14fromProducts
          : inferred === true
            ? t.q14marked
            : inferred === false
              ? t.q14none
              : t.q14ask;
      return (
        <Question kicker={t.q.q14.kicker} title={title} hint={t.q14optional}>
          <YesNo
            value={value}
            yes={t.yes}
            no={t.no}
            onChange={(nextValue) => {
              patchAnswers({
                past_treatment_side_effects: nextValue,
                extra_side_effects: nextValue ? (extras.length ? extras : [""]) : extras,
              });
            }}
          />
          {value ? (
            <div className="space-y-3">
              {fromProducts.length > 0 ? (
                <ul className="space-y-2">
                  {fromProducts.map((line) => (
                    <li
                      key={line}
                      className="rounded-2xl border border-sage/20 bg-sage-soft/50 px-4 py-3 text-[1.02rem] leading-snug"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              ) : null}
              {extras.map((note, index) => (
                <input
                  key={index}
                  value={note}
                  onChange={(event) => {
                    const nextExtras = [...extras];
                    nextExtras[index] = event.target.value;
                    patchAnswers({ extra_side_effects: nextExtras });
                  }}
                  placeholder={fromProducts.length ? t.anythingElse : t.q14example}
                  className="min-h-12 w-full rounded-2xl border border-line bg-white/80 px-4 text-base outline-none ring-sage/30 focus:ring-2"
                />
              ))}
              <button
                type="button"
                className="text-sm font-semibold text-sage-mid"
                onClick={() => patchAnswers({ extra_side_effects: [...extras, ""] })}
              >
                {t.addMore}
              </button>
            </div>
          ) : null}
          <div className="mt-auto pt-6">
            <PrimaryButton disabled={!complete} onClick={onNext}>
              {t.continue}
            </PrimaryButton>
          </div>
        </Question>
      );
    }

    case "q15":
      return (
        <Question kicker={t.q.q15.kicker} title={t.q.q15.title}>
          <div className="flex flex-col gap-2">
            {(SAMPLE_OPTIONS as readonly SampleType[]).map((option) => (
              <ChoiceButton
                key={option}
                large
                selected={answers.sample_type === option}
                subtitle={t.sampleHint[option]}
                onClick={() => onAuto(() => setAnswer("sample_type", option))}
              >
                {t.sampleOpt[option]}
              </ChoiceButton>
            ))}
          </div>
        </Question>
      );

    case "q16":
      return (
        <Question kicker={t.q.q16.kicker} title={t.q.q16.title} hint={t.q.q16.hint}>
          <YesNo
            value={answers.consent}
            yes={t.agree}
            no={t.disagree}
            onChange={(value) => onAuto(() => setAnswer("consent", value))}
          />
        </Question>
      );

    case "summary":
      return <Summary />;
  }
}

function WelcomeScreen({
  onStart,
  onSample,
}: {
  onStart: () => void;
  onSample: () => void;
}) {
  const lang = useIntakeStore((state) => state.lang);
  const t = copy(lang);
  const ready = lang !== null;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <header className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.16em] text-sage-mid uppercase">
          {t.welcomeKicker}
        </p>
        <h1
          className={`${displayClass(lang)} text-[1.85rem] leading-[1.15] tracking-tight text-ink sm:text-[2.05rem]`}
        >
          {t.welcomeTitle}
        </h1>
        <p className="text-[1.05rem] leading-relaxed text-muted">{t.welcomeWhy}</p>
      </header>

      <ul className="space-y-2.5">
        {t.welcomeBullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage text-xs text-paper">
              ✓
            </span>
            <span className="text-[1.02rem] leading-snug">{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        {!ready ? (
          <p className="text-center text-sm text-muted">{t.langNeed}</p>
        ) : null}
        <PrimaryButton disabled={!ready} onClick={onStart}>
          {t.start}
        </PrimaryButton>
        <GhostButton disabled={!ready} onClick={onSample}>
          {t.sample}
        </GhostButton>
      </div>
    </div>
  );
}

function applyExtract(patch: ExtractPatch) {
  const { answers, patchAnswers } = useIntakeStore.getState();
  patchAnswers({
    products: { ...answers.products, ...patch.products },
    procedures: { ...answers.procedures, ...patch.procedures },
    past_treatment_side_effects:
      patch.past_treatment_side_effects ?? answers.past_treatment_side_effects,
    describe: patch.describe ?? answers.describe,
  });
}

function NumberStepper({
  value,
  onChange,
  yearsOld,
}: {
  value: number | undefined;
  onChange: (value: number) => void;
  yearsOld: string;
}) {
  const lang = useIntakeStore((state) => state.lang);
  const age = value ?? 30;
  return (
    <div className="flex items-center justify-center gap-5 py-6">
      <button
        type="button"
        className="grid h-16 w-16 place-items-center rounded-full border border-line bg-white text-3xl"
        onClick={() => onChange(Math.max(5, age - 1))}
        aria-label="−"
      >
        −
      </button>
      <div className="min-w-24 text-center">
        <div className={`${displayClass(lang)} text-6xl tracking-tight`}>{age}</div>
        <div className="text-sm text-muted">{yearsOld}</div>
      </div>
      <button
        type="button"
        className="grid h-16 w-16 place-items-center rounded-full border border-line bg-white text-3xl"
        onClick={() => onChange(Math.min(90, age + 1))}
        aria-label="+"
      >
        +
      </button>
    </div>
  );
}
