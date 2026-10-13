"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  CalculatorActions,
  CalculatorError,
  CalculatorField,
  CalculatorMetric,
  CalculatorResultShell,
  CalculatorShell,
} from "@/components/calculators/calculator-ui";

import {
  calculateShowerCost,
  type ShowerCostResult,
} from "@/lib/calculators/shower-cost";

interface FormState {
  durationMinutes: string;
  flowLitersPerMinute: string;
  waterAndSewerPricePerM3Pln: string;
  coldWaterTemperatureC: string;
  showerTemperatureC: string;
  energyPricePerKwhPln: string;
  heatingEfficiencyPercent: string;
  showersPerMonth: string;
}

const initialForm: FormState = {
  durationMinutes: "8",
  flowLitersPerMinute: "8",
  waterAndSewerPricePerM3Pln: "",
  coldWaterTemperatureC: "10",
  showerTemperatureC: "40",
  energyPricePerKwhPln: "",
  heatingEfficiencyPercent: "90",
  showersPerMonth: "30",
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
      maximumFractionDigits: 2,
    },
  );

export function ShowerCostCalculator() {
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
    useState<ShowerCostResult | null>(
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
        calculateShowerCost({
          durationMinutes:
            parsePolishDecimal(
              form.durationMinutes,
            ),

          flowLitersPerMinute:
            parsePolishDecimal(
              form.flowLitersPerMinute,
            ),

          waterAndSewerPricePerM3Pln:
            parsePolishDecimal(
              form.waterAndSewerPricePerM3Pln,
            ),

          coldWaterTemperatureC:
            parsePolishDecimal(
              form.coldWaterTemperatureC,
            ),

          showerTemperatureC:
            parsePolishDecimal(
              form.showerTemperatureC,
            ),

          energyPricePerKwhPln:
            parsePolishDecimal(
              form.energyPricePerKwhPln,
            ),

          heatingEfficiencyPercent:
            parsePolishDecimal(
              form.heatingEfficiencyPercent,
            ),

          showersPerMonth:
            parseInteger(
              form.showersPerMonth,
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
          : "Nie udało się policzyć kosztu prysznica.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="„Jeszcze minutka” pod ciepłą wodą lubi się rozmnażać. Policzmy wodę i podgrzewanie bez moralizowania.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CalculatorField
            id="duration"
            label="Długość jednego prysznica"
            value={
              form.durationMinutes
            }
            placeholder="np. 8"
            suffix="min"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "durationMinutes",
                  value,
                )
            }
          />

          <CalculatorField
            id="flow"
            label="Przepływ słuchawki"
            value={
              form.flowLitersPerMinute
            }
            placeholder="np. 8"
            suffix="l/min"
            help="Jeżeli nie znasz przepływu, zmierz ile litrów nalewa słuchawka przez dokładnie minutę."
            onChange={
              (
                value,
              ) =>
                updateField(
                  "flowLitersPerMinute",
                  value,
                )
            }
          />

          <CalculatorField
            id="water-price"
            label="Cena wody i ścieków"
            value={
              form.waterAndSewerPricePerM3Pln
            }
            placeholder="np. 15,50"
            suffix="zł/m³"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "waterAndSewerPricePerM3Pln",
                  value,
                )
            }
          />

          <CalculatorField
            id="energy-price"
            label="Cena energii do podgrzewania"
            value={
              form.energyPricePerKwhPln
            }
            placeholder="np. 1,15"
            suffix="zł/kWh"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "energyPricePerKwhPln",
                  value,
                )
            }
          />

          <CalculatorField
            id="cold-temperature"
            label="Temperatura zimnej wody"
            value={
              form.coldWaterTemperatureC
            }
            placeholder="10"
            suffix="°C"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "coldWaterTemperatureC",
                  value,
                )
            }
          />

          <CalculatorField
            id="shower-temperature"
            label="Temperatura pod prysznicem"
            value={
              form.showerTemperatureC
            }
            placeholder="40"
            suffix="°C"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "showerTemperatureC",
                  value,
                )
            }
          />

          <CalculatorField
            id="efficiency"
            label="Sprawność podgrzewania"
            value={
              form.heatingEfficiencyPercent
            }
            placeholder="90"
            suffix="%"
            help="100% oznacza model idealny. Wpisz sprawność odpowiadającą Twojej instalacji, jeśli ją znasz."
            onChange={
              (
                value,
              ) =>
                updateField(
                  "heatingEfficiencyPercent",
                  value,
                )
            }
          />

          <CalculatorField
            id="showers-month"
            label="Prysznice w miesiącu"
            value={
              form.showersPerMonth
            }
            placeholder="30"
            suffix="razy"
            inputMode="numeric"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "showersPerMonth",
                  value,
                )
            }
          />
        </div>

        <CalculatorError
          message={
            error
          }
        />

        <CalculatorActions
          submitLabel="Policz koszt chlapania"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <ShowerResult
          result={
            result
          }
        />
      ) : null}
    </CalculatorShell>
  );
}

function ShowerResult({
  result,
}: {
  result:
    ShowerCostResult;
}) {
  return (
    <CalculatorResultShell
      title={
        currencyFormatter.format(
          result.totalCostPerShowerPln,
        ) +
        " za prysznic"
      }
      lead={
        <>
          Przy wpisanej częstotliwości daje to około{" "}
          <strong className="text-ink">
            {currencyFormatter.format(
              result.totalCostPerMonthPln,
            )}
          </strong>{" "}
          miesięcznie.
        </>
      }
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CalculatorMetric
          label="Woda / prysznic"
          value={
            numberFormatter.format(
              result.waterLitersPerShower,
            ) +
            " l"
          }
          accent
        />

        <CalculatorMetric
          label="Energia / prysznic"
          value={
            numberFormatter.format(
              result.purchasedEnergyPerShowerKwh,
            ) +
            " kWh"
          }
        />

        <CalculatorMetric
          label="Koszt / miesiąc"
          value={
            currencyFormatter.format(
              result.totalCostPerMonthPln,
            )
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <BreakdownTile
          label="Woda i ścieki / miesiąc"
          cost={
            result.waterCostPerMonthPln
          }
          detail={
            numberFormatter.format(
              result.waterLitersPerMonth,
            ) +
            " l wody"
          }
        />

        <BreakdownTile
          label="Podgrzewanie / miesiąc"
          cost={
            result.heatingCostPerMonthPln
          }
          detail={
            numberFormatter.format(
              result.purchasedEnergyPerMonthKwh,
            ) +
            " kWh energii"
          }
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        Model przyjmuje około 1 kg masy na 1 litr wody i ciepło właściwe 4,186 kJ/(kg·K). Wynik zależy od wpisanych stawek i sprawności instalacji.
      </p>
    </CalculatorResultShell>
  );
}

function BreakdownTile({
  label,
  cost,
  detail,
}: {
  label: string;
  cost: number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-sm font-black text-ink">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-brand-800">
        {currencyFormatter.format(
          cost,
        )}
      </p>

      <p className="mt-1 text-xs text-muted">
        {detail}
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
      "Liczba pryszniców musi być liczbą całkowitą.",
    );
  }

  return parsed;
}