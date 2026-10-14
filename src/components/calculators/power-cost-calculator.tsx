"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  SaveCalculationPanel,
} from "@/components/calculators/save-calculation-panel";

import {
  CalculatorActions,
  CalculatorError,
  CalculatorField,
  CalculatorMetric,
  CalculatorResultShell,
  CalculatorShell,
} from "@/components/calculators/calculator-ui";

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
        unknownError instanceof Error
          ? unknownError.message
          : "Nie udało się policzyć kosztu urządzenia.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="Jeśli świeci dioda, to często licznik też ma coś do powiedzenia. Policzmy pracę i czuwanie osobno.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CalculatorField
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

          <CalculatorField
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

          <CalculatorField
            id="standby-watts"
            label="Moc w trybie czuwania"
            value={
              form.standbyPowerWatts
            }
            placeholder="np. 3"
            suffix="W"
            help="Jeżeli po wyłączeniu urządzenie faktycznie nie pobiera energii, zostaw 0."
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

          <CalculatorField
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
            <CalculatorField
              id="energy-price"
              label="Cena 1 kWh z Twojej taryfy"
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

        <CalculatorError
          message={
            error
          }
        />

        <CalculatorActions
          submitLabel="Sprawdź, ile zjada prądu"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <>
          <PowerResult
            result={
              result
            }
          />

          <SaveCalculationPanel
            toolSlug="pradozerca"
            toolTitle="Prądożerca"
            inputData={
              form
            }
            resultData={
              result
            }
          />
        </>
      ) : null}
    </CalculatorShell>
  );
}

function PowerResult({
  result,
}: {
  result:
    PowerCostResult;
}) {
  return (
    <CalculatorResultShell
      title={
        currencyFormatter.format(
          result.totalCostPerMonthPln,
        ) +
        " na miesiąc"
      }
      lead="Tyle kosztuje modelowane używanie urządzenia przy wpisanej mocy, czasie pracy i Twojej cenie energii."
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CalculatorMetric
          label="Zużycie / dzień"
          value={
            numberFormatter.format(
              result.totalEnergyPerDayKwh,
            ) +
            " kWh"
          }
        />

        <CalculatorMetric
          label="Zużycie / miesiąc"
          value={
            numberFormatter.format(
              result.totalEnergyPerMonthKwh,
            ) +
            " kWh"
          }
          accent
        />

        <CalculatorMetric
          label="Zużycie / rok"
          value={
            numberFormatter.format(
              result.totalEnergyPerYearKwh,
            ) +
            " kWh"
          }
        />

        <CalculatorMetric
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
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-black text-ink">
              Cichy pożeracz: tryb czuwania
            </p>

            <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-black text-muted">
              {percentFormatter.format(
                result.standbySharePercent,
              )}
              % zużycia
            </span>
          </div>

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
            .
          </p>
        </div>
      ) : null}
    </CalculatorResultShell>
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
