"use client";

import type { Habits } from "@/lib/schema";
import { copy } from "@/lib/i18n";
import {
  HAIR_WASH_OPTIONS,
  SMOKING_SEVERITY_OPTIONS,
  type HairWashFrequency,
  type SmokingSeverity,
} from "@/lib/options";
import { useIntakeStore } from "@/store/intake";
import { Chip, ChipWrap, YesNoSwitch } from "./ui";

type DraftHabits = Partial<Habits>;

export function HabitsList({
  value,
  onChange,
}: {
  value: DraftHabits;
  onChange: (next: DraftHabits) => void;
}) {
  const set = (patch: DraftHabits) => onChange({ ...value, ...patch });
  const t = copy(useIntakeStore((state) => state.lang));
  const yn = { yesLabel: t.yes, noLabel: t.no };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-2.5 md:max-w-2xl">
      <HabitCard
        id="habit-smoke"
        title={t.habits.smoke[0]}
        hint={t.habits.smoke[1]}
        value={value.smoking}
        yn={yn}
        onChange={(smoking) =>
          set({
            smoking,
            smoking_severity: smoking ? value.smoking_severity : undefined,
          })
        }
      >
        {value.smoking ? (
          <FollowUp label={t.habits.smokeHow}>
            <ChipWrap>
              {SMOKING_SEVERITY_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  selected={value.smoking_severity === option}
                  onClick={() => set({ smoking_severity: option as SmokingSeverity })}
                >
                  {t.smoking[option]}
                </Chip>
              ))}
            </ChipWrap>
          </FollowUp>
        ) : null}
      </HabitCard>

      <HabitCard
        id="habit-alcohol"
        title={t.habits.alcohol[0]}
        hint={t.habits.alcohol[1]}
        value={value.alcohol}
        yn={yn}
        onChange={(alcohol) => set({ alcohol })}
      />

      <HabitCard
        id="habit-water"
        title={t.habits.water[0]}
        hint={t.habits.water[1]}
        value={value.hard_water}
        yn={yn}
        onChange={(hard_water) => set({ hard_water })}
      />

      <div className="rounded-2xl border border-line bg-white px-3.5 py-3">
        <p className="text-[0.98rem] font-semibold">{t.habits.wash[0]}</p>
        <p className="mb-2.5 text-[0.8rem] leading-snug text-muted">{t.habits.wash[1]}</p>
        <ChipWrap>
          {HAIR_WASH_OPTIONS.map((option) => (
            <Chip
              key={option}
              selected={value.hair_wash_frequency === option}
              onClick={() => set({ hair_wash_frequency: option as HairWashFrequency })}
            >
              {t.wash[option]}
            </Chip>
          ))}
        </ChipWrap>
      </div>

      <HabitCard
        id="habit-heat"
        title={t.habits.heat[0]}
        hint={t.habits.heat[1]}
        value={value.heating_tools_styling_chemicals}
        yn={yn}
        onChange={(heating_tools_styling_chemicals) =>
          set({ heating_tools_styling_chemicals })
        }
      />

      <HabitCard
        id="habit-salon"
        title={t.habits.salon[0]}
        hint={t.habits.salon[1]}
        value={value.salon_treatments}
        yn={yn}
        onChange={(salon_treatments) =>
          set({
            salon_treatments,
            salon_treatment_detail: salon_treatments
              ? value.salon_treatment_detail
              : undefined,
          })
        }
      >
        {value.salon_treatments ? (
          <FollowUp label={t.habits.salonWhich}>
            <input
              value={value.salon_treatment_detail ?? ""}
              onChange={(event) => set({ salon_treatment_detail: event.target.value })}
              placeholder="e.g. keratin"
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-base outline-none ring-sage/30 focus:ring-2"
            />
          </FollowUp>
        ) : null}
      </HabitCard>
    </div>
  );
}

function HabitCard({
  id,
  title,
  hint,
  value,
  onChange,
  children,
  yn,
}: {
  id: string;
  title: string;
  hint: string;
  value: boolean | undefined;
  onChange: (next: boolean) => void;
  children?: React.ReactNode;
  yn: { yesLabel: string; noLabel: string };
}) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white px-3.5 py-3 transition-colors",
        value === true ? "border-sage/35" : "border-line",
      ].join(" ")}
    >
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="min-w-0">
          <p id={id} className="text-[0.98rem] font-semibold leading-tight">
            {title}
          </p>
          <p className="mt-0.5 text-[0.8rem] leading-snug text-muted">{hint}</p>
        </div>
        <YesNoSwitch labelledBy={id} value={value} onChange={onChange} full {...yn} />
      </div>
      {children}
    </div>
  );
}

function FollowUp({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 border-t border-dashed border-line pt-3">
      <p className="mb-2 text-[0.8rem] font-medium text-sage-mid">{label}</p>
      {children}
    </div>
  );
}
