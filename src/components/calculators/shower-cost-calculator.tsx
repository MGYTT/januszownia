"use client";

import {
  type FormEvent,
  useState,
} from "react";

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

          <NumberField
            id="flow"
            label="Przepływ słuchawki"
            value={
              form.flowLitersPerMinute
            }
            placeholder="np. 8"
            suffix="l/min"
            help="Jeżeli nie znasz przepływu, zmierz ile litrów słuchawka nalewa przez dokładnie minutę."
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

          <NumberField
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

          <NumberField
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

          <NumberField
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

          <NumberField
            id="shower-temperature"
            label="Temperatura wody pod prysznicem"
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

          <NumberField
            id="efficiency"
            label="Sprawność podgrzewania"
            value={
              form.heatingEfficiencyPercent
            }
            placeholder="90"
            suffix="%"
            help="100% oznacza model idealny. Dla rzeczywistego źródła ciepła wpisz sprawność odpowiadającą Twojej instalacji."
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

          <NumberField
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
            Policz koszt prysznica
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
          <ShowerResult
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

function ShowerResult({
  result,
}: {
  result:
    ShowerCostResult;
}) {
  return (
    <section className="rounded-card border border-brand-200 bg-brand-50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        Wynik Prysznicometru
      </p>

      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
        <p className="text-3xl font-black text-brand-900">
          {currencyFormatter.format(
            result.totalCostPerShowerPln,
          )}
        </p>

        <p className="pb-1 text-sm font-bold text-brand-700">
          za jeden prysznic
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultTile
          label="Woda / prysznic"
          value={
            numberFormatter.format(
              result.waterLitersPerShower,
            ) +
            " l"
          }
        />

        <ResultTile
          label="Energia / prysznic"
          value={
            numberFormatter.format(
              result.purchasedEnergyPerShowerKwh,
            ) +
            " kWh"
          }
        />

        <ResultTile
          label="Koszt / miesiąc"
          value={
            currencyFormatter.format(
              result.totalCostPerMonthPln,
            )
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
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

      <p className="mt-5 text-xs leading-5 text-muted">
        Model przyjmuje około 1 kg masy na 1 litr wody i ciepło właściwe wody 4,186 kJ/(kg·K). Wynik zależy od wpisanej ceny energii i sprawności instalacji.
      </p>
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
      <p className="text-sm font-black">
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
