"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  comparePizzas,
  type PizzaComparison,
} from "@/lib/calculators/pizza";

interface FormState {
  diameterA: string;
  priceA: string;
  diameterB: string;
  priceB: string;
}

const initialForm: FormState = {
  diameterA: "",
  priceA: "",
  diameterB: "",
  priceB: "",
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

export function PizzaCalculator() {
  const [form, setForm] =
    useState<FormState>(initialForm);

  const [result, setResult] =
    useState<PizzaComparison | null>(null);

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
      const comparison = comparePizzas(
        {
          diameterCm: parsePolishDecimal(
            form.diameterA,
          ),
          pricePln: parsePolishDecimal(
            form.priceA,
          ),
        },
        {
          diameterCm: parsePolishDecimal(
            form.diameterB,
          ),
          pricePln: parsePolishDecimal(
            form.priceB,
          ),
        },
      );

      setResult(comparison);
      setError(null);
    } catch (unknownError) {
      setResult(null);

      if (
        unknownError instanceof Error
      ) {
        setError(unknownError.message);
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
        <div className="grid gap-6 md:grid-cols-2">
          <PizzaFields
            title="Pizza A"
            diameterId="pizza-a-diameter"
            priceId="pizza-a-price"
            diameter={form.diameterA}
            price={form.priceA}
            onDiameterChange={(value) =>
              updateField(
                "diameterA",
                value,
              )
            }
            onPriceChange={(value) =>
              updateField(
                "priceA",
                value,
              )
            }
          />

          <PizzaFields
            title="Pizza B"
            diameterId="pizza-b-diameter"
            priceId="pizza-b-price"
            diameter={form.diameterB}
            price={form.priceB}
            onDiameterChange={(value) =>
              updateField(
                "diameterB",
                value,
              )
            }
            onPriceChange={(value) =>
              updateField(
                "priceB",
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
            Porównaj pizze
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
          <PizzaResult
            result={result}
          />
        ) : null}
      </div>
    </div>
  );
}

interface PizzaFieldsProps {
  title: string;
  diameterId: string;
  priceId: string;
  diameter: string;
  price: string;
  onDiameterChange: (
    value: string,
  ) => void;
  onPriceChange: (
    value: string,
  ) => void;
}

function PizzaFields({
  title,
  diameterId,
  priceId,
  diameter,
  price,
  onDiameterChange,
  onPriceChange,
}: PizzaFieldsProps) {
  return (
    <fieldset className="rounded-card border border-line bg-canvas p-5">
      <legend className="px-2 text-lg font-black">
        {title}
      </legend>

      <div className="mt-2 space-y-5">
        <InputField
          id={diameterId}
          label="Średnica"
          value={diameter}
          suffix="cm"
          placeholder="np. 32"
          onChange={onDiameterChange}
        />

        <InputField
          id={priceId}
          label="Cena"
          value={price}
          suffix="zł"
          placeholder="np. 29,90"
          onChange={onPriceChange}
        />
      </div>
    </fieldset>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  suffix: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function InputField({
  id,
  label,
  value,
  suffix,
  placeholder,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-ink"
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
            onChange(event.target.value)
          }
          className="h-12 w-full rounded-xl border border-line bg-white px-4 pr-12 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
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

function PizzaResult({
  result,
}: {
  result: PizzaComparison;
}) {
  const winnerText =
    result.winner === "tie"
      ? "Obie pizze kosztują tyle samo w przeliczeniu na powierzchnię."
      : result.winner === "a"
        ? "Pizza A jest korzystniejsza cenowo."
        : "Pizza B jest korzystniejsza cenowo.";

  return (
    <section className="rounded-card border border-brand-200 bg-brand-50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        Wynik
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-900">
        {winnerText}
      </h2>

      {result.winner !== "tie" ? (
        <p className="mt-2 text-sm leading-6 text-brand-800">
          Koszt 100 cm² jest niższy o{" "}
          <strong>
            {numberFormatter.format(
              result.betterValuePercent,
            )}
            %
          </strong>
          .
        </p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ResultCard
          title="Pizza A"
          area={result.a.areaCm2}
          pricePer100={
            result.a.pricePer100Cm2
          }
          winner={
            result.winner === "a"
          }
        />

        <ResultCard
          title="Pizza B"
          area={result.b.areaCm2}
          pricePer100={
            result.b.pricePer100Cm2
          }
          winner={
            result.winner === "b"
          }
        />
      </div>

      <p className="mt-5 text-xs leading-5 text-muted">
        Porównanie uwzględnia wyłącznie
        powierzchnię i cenę. Nie ocenia ilości
        dodatków, grubości ciasta ani jakości
        składników.
      </p>
    </section>
  );
}

interface ResultCardProps {
  title: string;
  area: number;
  pricePer100: number;
  winner: boolean;
}

function ResultCard({
  title,
  area,
  pricePer100,
  winner,
}: ResultCardProps) {
  return (
    <div
      className={
        winner
          ? "rounded-2xl border border-brand-300 bg-white p-4"
          : "rounded-2xl border border-line bg-white/75 p-4"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black">
          {title}
        </h3>

        {winner ? (
          <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-black text-brand-800">
            lepsza cena
          </span>
        ) : null}
      </div>

      <dl className="mt-4 space-y-3">
        <div>
          <dt className="text-xs text-muted">
            Powierzchnia
          </dt>

          <dd className="mt-0.5 font-bold">
            {numberFormatter.format(area)} cm²
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted">
            Cena za 100 cm²
          </dt>

          <dd className="mt-0.5 text-lg font-black text-brand-700">
            {currencyFormatter.format(
              pricePer100,
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}