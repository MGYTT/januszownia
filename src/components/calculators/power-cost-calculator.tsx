"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  calculatePowerCost,
  type PowerCostResult,
} from "@/lib/calculators/power-cost";

interface FormState {
  activePowerWatts: string;
  activeHoursPerDay: string;
  standbyPowerWatts: string;
  daysPerMonth: string;
  electricityPricePerKwhPln: string;
}

const initialForm: FormState = {
  activePowerWatts: "",
  activeHoursPerDay: "",
  standbyPowerWatts: "0",
  daysPerMonth: "30",
  electricityPricePerKwhPln: "",
};

const currencyFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );

const numberFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      maximumFractionDigits: 3,
    },
  );

const percentFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      maximumFractionDigits: 1,
    },
  );

export function PowerCostCalculator() {
  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      initialForm,
    );

  const [
    result,
    setResult,
  ] =
    useState<PowerCostResult | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  function updateField(
    field: keyof FormState,
    value: string,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,
        [field]: value,
      }),
    );

    setResult(null);
    setError(null);
  }

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      const nextResult =
        calculatePowerCost({
          activePowerWatts:
            parsePolishDecimal(
              form.activePowerWatts,
            ),

          activeHoursPerDay:
            parsePolishDecimal(
              form.activeHoursPerDay,
            ),

          standbyPowerWatts:
            parsePolishDecimal(
              form.standbyPowerWatts,
            ),

          daysPerMonth:
            parseInteger(
              form.daysPerMonth,
            ),

          electricityPricePerKwhPln:
            parsePolishDecimal(
              form.electricityPricePerKwhPln,
            ),
        });

      setResult(
        nextResult,
      );

      setError(null);
    } catch (
      unknownError
    ) {
      setResult(null);

      setError(
        unknownError instanceof
          Error
          ? unknownError.message
          : "Nie udało się wykonać obliczenia.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <div className="rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-7 lg:p-8">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            id="power-watts"
            label="Moc urządzenia"
            value={
              form.activePowerWatts
            }
            placeholder="np. 1500"
            suffix="W"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "activePowerWatts",
                  value,
                )
            }
          />

          <NumberField
            id="hours-day"
            label="Czas pracy dziennie"
            value={
              form.activeHoursPerDay
            }
            placeholder="np. 2,5"
            suffix="h"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "activeHoursPerDay",
                  value,
                )
            }
          />

          <NumberField
            id="standby-watts"
            label="Moc w trybie czuwania"
            value={
              form.standbyPowerWatts
            }
            placeholder="np. 3"
            suffix="W"
            help="Jeżeli urządzenie po wyłączeniu nie pobiera energii, zostaw 0."
            onChange={
              (
                value,
              ) =>
                updateField(
                  "standbyPowerWatts",
                  value,
                )
            }
          />

          <NumberField
            id="days-month"
            label="Dni używania w miesiącu"
            value={
              form.daysPerMonth
            }
            placeholder="30"
            suffix="dni"
            inputMode="numeric"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "daysPerMonth",
                  value,
                )
            }
          />

          <div className="md:col-span-2">
            <NumberField
              id="energy-price"
              label="Łączna cena 1 kWh z Twojej taryfy"
              value={
                form.electricityPricePerKwhPln
              }
              placeholder="np. 1,15"
              suffix="zł/kWh"
              help="Najdokładniej wpisz własny koszt zmienny 1 kWh wynikający z rachunku lub taryfy."
              onChange={
                (
                  value,
                ) =>
                  updateField(
                    "electricityPricePerKwhPln",
                    value,
                  )
              }
            />
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-danger-600/20 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-600"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="min-h-12 flex-1 rounded-button bg-brand-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-brand-700 active:translate-y-px"
          >
            Policz koszt prądu
          </button>

          <button
            type="button"
            onClick={
              reset
            }
            className="min-h-12 rounded-button border border-line bg-white px-5 py-3 font-semibold text-muted transition hover:bg-canvas hover:text-ink"
          >
            Wyczyść
          </button>
        </div>
      </form>

      <div
        aria-live="polite"
        className="mt-7"
      >
        {result ? (
          <PowerResult
            result={
              result
            }
          />
        ) : null}
      </div>
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  placeholder,
  suffix,
  help,
  inputMode = "decimal",
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  suffix: string;
  help?: string;
  inputMode?:
    | "decimal"
    | "numeric";
  onChange:
    (
      value: string,
    ) => void;
}) {
  return (
    <div>
      <label
        htmlFor={
          id
        }
        className="mb-2 block text-sm font-bold"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={
            id
          }
          type="text"
          inputMode={
            inputMode
          }
          value={
            value
          }
          placeholder={
            placeholder
          }
          onChange={
            (
              event,
            ) =>
              onChange(
                event.target
                  .value,
              )
          }
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 pr-20 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">
          {suffix}
        </span>
      </div>

      {help ? (
        <p className="mt-2 text-xs leading-5 text-muted">
          {help}
        </p>
      ) : null}
    </div>
  );
}

function PowerResult({
  result,
}: {
  result:
    PowerCostResult;
}) {
  return (
    <section className="rounded-card border border-brand-200 bg-brand-50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        Wynik Prądożercy
      </p>

      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
        <p className="text-3xl font-black text-brand-900">
          {currencyFormatter.format(
            result.totalCostPerMonthPln,
          )}
        </p>

        <p className="pb-1 text-sm font-bold text-brand-700">
          na modelowy miesiąc
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultTile
          label="Zużycie / dzień"
          value={
            numberFormatter.format(
              result.totalEnergyPerDayKwh,
            ) +
            " kWh"
          }
        />

        <ResultTile
          label="Zużycie / miesiąc"
          value={
            numberFormatter.format(
              result.totalEnergyPerMonthKwh,
            ) +
            " kWh"
          }
        />

        <ResultTile
          label="Zużycie / rok"
          value={
            numberFormatter.format(
              result.totalEnergyPerYearKwh,
            ) +
            " kWh"
          }
        />

        <ResultTile
          label="Koszt / rok"
          value={
            currencyFormatter.format(
              result.totalCostPerYearPln,
            )
          }
        />
      </div>

      {result.standbyEnergyPerMonthKwh >
      0 ? (
        <div className="mt-5 rounded-2xl border border-line bg-white p-4">
          <p className="font-black">
            Tryb czuwania
          </p>

          <p className="mt-2 text-sm leading-6 text-muted">
            Czuwanie zużywa około{" "}
            <strong className="text-ink">
              {numberFormatter.format(
                result.standbyEnergyPerMonthKwh,
              )}{" "}
              kWh
            </strong>{" "}
            miesięcznie, czyli{" "}
            <strong className="text-ink">
              {currencyFormatter.format(
                result.standbyCostPerMonthPln,
              )}
            </strong>
            . To{" "}
            <strong className="text-ink">
              {percentFormatter.format(
                result.standbySharePercent,
              )}
              %
            </strong>{" "}
            modelowanego zużycia urządzenia.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function ResultTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs leading-5 text-muted">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-brand-800">
        {value}
      </p>
    </div>
  );
}

function parsePolishDecimal(
  value: string,
): number {
  const normalized =
    value
      .trim()
      .replace(
        /\s/g,
        "",
      )
      .replace(
        ",",
        ".",
      );

  if (
    normalized ===
    ""
  ) {
    throw new Error(
      "Uzupełnij wszystkie pola.",
    );
  }

  const parsed =
    Number(
      normalized,
    );

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    throw new Error(
      "Wpisz poprawną liczbę.",
    );
  }

  return parsed;
}

function parseInteger(
  value: string,
): number {
  const parsed =
    parsePolishDecimal(
      value,
    );

  if (
    !Number.isInteger(
      parsed,
    )
  ) {
    throw new Error(
      "Liczba dni musi być liczbą całkowitą.",
    );
  }

  return parsed;
}
