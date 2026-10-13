"use client";

import {
  type FormEvent,
  useState,
} from "react";

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
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const numberFormatter =
  new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 2,
  });

function parsePolishDecimal(
  value: string,
): number {
  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace(",", ".");

  if (normalized === "") {
    throw new Error(
      "Uzupełnij wszystkie pola.",
    );
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error(
      "Wpisz poprawną liczbę.",
    );
  }

  return parsed;
}

export function FuelTripCalculator() {
  const [form, setForm] =
    useState<FormState>(initialForm);

  const [result, setResult] =
    useState<FuelTripResult | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(null);

  function updateField(
    field: keyof FormState,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setResult(null);
    setError(null);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
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

      setResult(calculation);
      setError(null);
    } catch (unknownError) {
      setResult(null);

      if (
        unknownError instanceof Error
      ) {
        setError(
          unknownError.message,
        );
      } else {
        setError(
          "Nie udało się wykonać obliczenia.",
        );
      }
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <div className="rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-7 lg:p-8">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField
            id="near-price"
            label="Cena na bliższej stacji"
            suffix="zł/l"
            placeholder="np. 6,30"
            value={form.nearPrice}
            onChange={(value) =>
              updateField(
                "nearPrice",
                value,
              )
            }
          />

          <InputField
            id="far-price"
            label="Cena na dalszej stacji"
            suffix="zł/l"
            placeholder="np. 6,00"
            value={form.farPrice}
            onChange={(value) =>
              updateField(
                "farPrice",
                value,
              )
            }
          />

          <InputField
            id="liters"
            label="Ile litrów zatankujesz?"
            suffix="l"
            placeholder="np. 50"
            value={form.liters}
            onChange={(value) =>
              updateField(
                "liters",
                value,
              )
            }
          />

          <InputField
            id="extra-distance"
            label="Dodatkowy dystans łącznie"
            suffix="km"
            placeholder="np. 20"
            value={form.extraDistance}
            onChange={(value) =>
              updateField(
                "extraDistance",
                value,
              )
            }
          />

          <div className="sm:col-span-2">
            <InputField
              id="consumption"
              label="Średnie spalanie samochodu"
              suffix="l/100 km"
              placeholder="np. 7"
              value={form.consumption}
              onChange={(value) =>
                updateField(
                  "consumption",
                  value,
                )
              }
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-canvas px-4 py-3 text-sm leading-6 text-muted">
          Dodatkowy dystans oznacza
          faktyczną liczbę kilometrów,
          których nie przejechałbyś bez
          wyjazdu po tańsze paliwo.
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-danger-600/20 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-600"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="min-h-12 flex-1 rounded-button bg-brand-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-brand-700 active:translate-y-px"
          >
            Sprawdź opłacalność
          </button>

          <button
            type="button"
            onClick={reset}
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
          <FuelResult
            result={result}
          />
        ) : null}
      </div>
    </div>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  suffix: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function InputField({
  id,
  label,
  suffix,
  placeholder,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 pr-24 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted"
        >
          {suffix}
        </span>
      </div>
    </div>
  );
}

function FuelResult({
  result,
}: {
  result: FuelTripResult;
}) {
  return (
    <section
      className={
        result.worthIt
          ? "rounded-card border border-brand-200 bg-brand-50 p-5 sm:p-6"
          : "rounded-card border border-line bg-canvas p-5 sm:p-6"
      }
    >
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        Wynik
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight">
        {result.worthIt
          ? "Tak — finansowo się opłaca."
          : "Nie — sam dojazd zjada oszczędność."}
      </h2>

      <p className="mt-3 text-lg font-black text-brand-700">
        Bilans:{" "}
        {currencyFormatter.format(
          result.netSavingPln,
        )}
      </p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <ResultItem
          label="Oszczędność na samym paliwie"
          value={currencyFormatter.format(
            result.grossSavingPln,
          )}
        />

        <ResultItem
          label="Koszt dodatkowego dojazdu"
          value={currencyFormatter.format(
            result.travelCostPln,
          )}
        />

        <ResultItem
          label="Dodatkowo spalone paliwo"
          value={`${numberFormatter.format(
            result.extraFuelUsedLiters,
          )} l`}
        />

        <ResultItem
          label="Minimalna różnica ceny do wyjścia na zero"
          value={`${numberFormatter.format(
            result.breakEvenDifferencePlnPerLiter,
          )} zł/l`}
        />
      </dl>

      <p className="mt-5 text-xs leading-5 text-muted">
        Koszt paliwa zużytego na
        dodatkowy dojazd jest w tym
        kalkulatorze wyceniany po cenie
        bliższej stacji. Kalkulator nie
        uwzględnia czasu, zużycia
        samochodu, opłat parkingowych ani
        innych kosztów eksploatacyjnych.
      </p>
    </section>
  );
}

function ResultItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <dt className="text-xs leading-5 text-muted">
        {label}
      </dt>

      <dd className="mt-1 font-black">
        {value}
      </dd>
    </div>
  );
}