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
  CalculatorNotice,
  CalculatorResultShell,
  CalculatorShell,
} from "@/components/calculators/calculator-ui";

import {
  calculateFuelTrip,
  type FuelTripResult,
} from "@/lib/calculators/fuel-trip";

interface FormState {
  nearPrice: string;
  farPrice: string;
  liters: string;
  extraDistance: string;
  consumption: string;
}

const initialForm: FormState = {
  nearPrice: "",
  farPrice: "",
  liters: "",
  extraDistance: "",
  consumption: "",
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

export function FuelTripCalculator() {
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
    useState<FuelTripResult | null>(
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
      const calculation =
        calculateFuelTrip({
          nearPricePlnPerLiter:
            parsePolishDecimal(
              form.nearPrice,
            ),

          farPricePlnPerLiter:
            parsePolishDecimal(
              form.farPrice,
            ),

          litersToBuy:
            parsePolishDecimal(
              form.liters,
            ),

          extraDistanceKm:
            parsePolishDecimal(
              form.extraDistance,
            ),

          consumptionLitersPer100Km:
            parsePolishDecimal(
              form.consumption,
            ),
        });

      setResult(
        calculation,
      );

      setError(null);
    } catch (
      unknownError
    ) {
      setResult(null);

      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Nie udało się policzyć opłacalności.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="Tańsza stacja może wyjść drożej, jeśli pół oszczędności zostawisz w baku po drodze.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CalculatorField
            id="near-price"
            label="Cena na bliższej stacji"
            suffix="zł/l"
            placeholder="np. 6,30"
            value={
              form.nearPrice
            }
            onChange={
              (
                value,
              ) =>
                updateField(
                  "nearPrice",
                  value,
                )
            }
          />

          <CalculatorField
            id="far-price"
            label="Cena na dalszej stacji"
            suffix="zł/l"
            placeholder="np. 6,00"
            value={
              form.farPrice
            }
            onChange={
              (
                value,
              ) =>
                updateField(
                  "farPrice",
                  value,
                )
            }
          />

          <CalculatorField
            id="liters"
            label="Ile zatankujesz?"
            suffix="l"
            placeholder="np. 50"
            value={
              form.liters
            }
            onChange={
              (
                value,
              ) =>
                updateField(
                  "liters",
                  value,
                )
            }
          />

          <CalculatorField
            id="extra-distance"
            label="Dodatkowy dystans łącznie"
            suffix="km"
            placeholder="np. 20"
            value={
              form.extraDistance
            }
            onChange={
              (
                value,
              ) =>
                updateField(
                  "extraDistance",
                  value,
                )
            }
          />

          <div className="sm:col-span-2">
            <CalculatorField
              id="consumption"
              label="Średnie spalanie samochodu"
              suffix="l/100 km"
              placeholder="np. 7"
              value={
                form.consumption
              }
              onChange={
                (
                  value,
                ) =>
                  updateField(
                    "consumption",
                    value,
                  )
              }
            />
          </div>
        </div>

        <CalculatorNotice>
          Wpisz tylko kilometry, których nie przejechałbyś bez wyjazdu po tańsze paliwo. Nie cały dystans Twojej normalnej trasy.
        </CalculatorNotice>

        <CalculatorError
          message={
            error
          }
        />

        <CalculatorActions
          submitLabel="Policz, czy warto odpalać auto"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <FuelResult
          result={
            result
          }
        />
      ) : null}
    </CalculatorShell>
  );
}

function FuelResult({
  result,
}: {
  result:
    FuelTripResult;
}) {
  const tone =
    result.worthIt
      ? "good"
      : "warning";

  return (
    <CalculatorResultShell
      tone={
        tone
      }
      title={
        result.worthIt
          ? "Jedź. Oszczędność przeżyła dojazd."
          : "Zostań. Wachę zjada sam dojazd."
      }
      lead={
        <>
          Bilans po uwzględnieniu dodatkowego przejazdu:{" "}
          <strong className="text-ink">
            {currencyFormatter.format(
              result.netSavingPln,
            )}
          </strong>
          .
        </>
      }
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <CalculatorMetric
          label="Oszczędność na cenie paliwa"
          value={
            currencyFormatter.format(
              result.grossSavingPln,
            )
          }
        />

        <CalculatorMetric
          label="Koszt dodatkowego dojazdu"
          value={
            currencyFormatter.format(
              result.travelCostPln,
            )
          }
        />

        <CalculatorMetric
          label="Dodatkowo spalone paliwo"
          value={
            numberFormatter.format(
              result.extraFuelUsedLiters,
            ) +
            " l"
          }
        />

        <CalculatorMetric
          label="Różnica ceny potrzebna do zera"
          value={
            numberFormatter.format(
              result.breakEvenDifferencePlnPerLiter,
            ) +
            " zł/l"
          }
          accent
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        Koszt dodatkowego przejazdu wyceniamy po cenie bliższej stacji. Nie doliczamy czasu, amortyzacji ani nerwów za traktorem na krajówce.
      </p>
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
