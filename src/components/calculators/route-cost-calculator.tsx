"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  calculateRouteCost,
  type RouteCostResult,
} from "@/lib/calculators/route-cost";

interface FormState {
  oneWayDistanceKm: string;
  roundTrip: boolean;
  consumptionLitersPer100Km: string;
  fuelPricePlnPerLiter: string;
  tollsPln: string;
  parkingPln: string;
  otherCostsPln: string;
  travelers: string;
}

const initialForm: FormState = {
  oneWayDistanceKm: "",
  roundTrip: true,
  consumptionLitersPer100Km: "",
  fuelPricePlnPerLiter: "",
  tollsPln: "0",
  parkingPln: "0",
  otherCostsPln: "0",
  travelers: "1",
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

const percentFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      maximumFractionDigits: 1,
    },
  );

export default function RouteCostCalculator() {
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
    useState<RouteCostResult | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  function updateField<
    Key extends keyof FormState,
  >(
    field: Key,
    value: FormState[Key],
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
        calculateRouteCost({
          oneWayDistanceKm:
            parsePolishDecimal(
              form.oneWayDistanceKm,
            ),

          roundTrip:
            form.roundTrip,

          consumptionLitersPer100Km:
            parsePolishDecimal(
              form.consumptionLitersPer100Km,
            ),

          fuelPricePlnPerLiter:
            parsePolishDecimal(
              form.fuelPricePlnPerLiter,
            ),

          tollsPln:
            parsePolishDecimal(
              form.tollsPln,
            ),

          parkingPln:
            parsePolishDecimal(
              form.parkingPln,
            ),

          otherCostsPln:
            parsePolishDecimal(
              form.otherCostsPln,
            ),

          travelers:
            parsePositiveInteger(
              form.travelers,
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
            id="route-distance"
            label="Dystans w jedną stronę"
            value={
              form.oneWayDistanceKm
            }
            placeholder="np. 145"
            suffix="km"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "oneWayDistanceKm",
                  value,
                )
            }
          />

          <div>
            <span className="mb-2 block text-sm font-bold">
              Rodzaj przejazdu
            </span>

            <button
              type="button"
              aria-pressed={
                form.roundTrip
              }
              onClick={
                () =>
                  updateField(
                    "roundTrip",
                    !form.roundTrip,
                  )
              }
              className={[
                "flex min-h-12 w-full items-center justify-between rounded-xl border px-4 text-left transition",
                form.roundTrip
                  ? "border-brand-300 bg-brand-50"
                  : "border-line bg-canvas",
              ].join(
                " ",
              )}
            >
              <span>
                <span className="block text-sm font-black">
                  {form.roundTrip
                    ? "Tam i z powrotem"
                    : "Tylko w jedną stronę"}
                </span>

                <span className="mt-0.5 block text-xs text-muted">
                  Kliknij, aby zmienić
                </span>
              </span>

              <span
                aria-hidden="true"
                className="text-lg"
              >
                ↔
              </span>
            </button>
          </div>

          <NumberField
            id="route-consumption"
            label="Średnie spalanie"
            value={
              form.consumptionLitersPer100Km
            }
            placeholder="np. 6,8"
            suffix="l/100 km"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "consumptionLitersPer100Km",
                  value,
                )
            }
          />

          <NumberField
            id="route-fuel-price"
            label="Cena paliwa"
            value={
              form.fuelPricePlnPerLiter
            }
            placeholder="np. 6,35"
            suffix="zł/l"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "fuelPricePlnPerLiter",
                  value,
                )
            }
          />

          <NumberField
            id="route-tolls"
            label="Opłaty drogowe"
            value={
              form.tollsPln
            }
            placeholder="0"
            suffix="zł"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "tollsPln",
                  value,
                )
            }
          />

          <NumberField
            id="route-parking"
            label="Parking"
            value={
              form.parkingPln
            }
            placeholder="0"
            suffix="zł"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "parkingPln",
                  value,
                )
            }
          />

          <NumberField
            id="route-other"
            label="Inne koszty przejazdu"
            value={
              form.otherCostsPln
            }
            placeholder="0"
            suffix="zł"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "otherCostsPln",
                  value,
                )
            }
          />

          <NumberField
            id="route-travelers"
            label="Liczba osób dzielących koszt"
            value={
              form.travelers
            }
            placeholder="1"
            suffix="os."
            inputMode="numeric"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "travelers",
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
            Policz koszt trasy
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
          <RouteCostResultView
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
  inputMode = "decimal",
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  suffix: string;

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
                event.target.value,
              )
          }
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 pr-24 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function RouteCostResultView({
  result,
}: {
  result:
    RouteCostResult;
}) {
  return (
    <section className="rounded-card border border-brand-200 bg-brand-50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        Koszt trasy
      </p>

      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
        <p className="text-3xl font-black text-brand-900">
          {currencyFormatter.format(
            result.totalCostPln,
          )}
        </p>

        <p className="pb-1 text-sm font-bold text-brand-700">
          łącznie
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultTile
          label="Łączny dystans"
          value={
            numberFormatter.format(
              result.totalDistanceKm,
            ) +
            " km"
          }
        />

        <ResultTile
          label="Potrzebne paliwo"
          value={
            numberFormatter.format(
              result.fuelNeededLiters,
            ) +
            " l"
          }
        />

        <ResultTile
          label="Koszt na osobę"
          value={
            currencyFormatter.format(
              result.costPerTravelerPln,
            )
          }
        />

        <ResultTile
          label="Koszt na kilometr"
          value={
            currencyFormatter.format(
              result.costPerKmPln,
            )
          }
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <BreakdownTile
          label="Paliwo"
          value={
            currencyFormatter.format(
              result.fuelCostPln,
            )
          }
          detail={
            percentFormatter.format(
              result.fuelSharePercent,
            ) +
            "% całego kosztu"
          }
        />

        <BreakdownTile
          label="Pozostałe koszty"
          value={
            currencyFormatter.format(
              result.additionalCostsPln,
            )
          }
          detail="opłaty drogowe, parking i inne wpisane koszty"
        />
      </div>

      <p className="mt-5 text-xs leading-5 text-muted">
        Kalkulator liczy koszty wpisane
        przez użytkownika. Nie uwzględnia
        amortyzacji, opon, serwisu,
        ubezpieczenia ani wartości czasu
        podróży.
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
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-sm font-black">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-brand-800">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-muted">
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

function parsePositiveInteger(
  value: string,
): number {
  const parsed =
    parsePolishDecimal(
      value,
    );

  if (
    !Number.isInteger(
      parsed,
    ) ||
    parsed <= 0
  ) {
    throw new Error(
      "Liczba osób musi być dodatnią liczbą całkowitą.",
    );
  }

  return parsed;
}
