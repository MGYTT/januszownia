"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  CalculatorActions,
  CalculatorError,
  CalculatorGroup,
  CalculatorMetric,
  CalculatorResultShell,
  CalculatorShell,
  CalculatorField,
} from "@/components/calculators/calculator-ui";

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

export function PizzaCalculator() {
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
    useState<PizzaComparison | null>(
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
      const comparison =
        comparePizzas(
          {
            diameterCm:
              parsePolishDecimal(
                form.diameterA,
              ),

            pricePln:
              parsePolishDecimal(
                form.priceA,
              ),
          },
          {
            diameterCm:
              parsePolishDecimal(
                form.diameterB,
              ),

            pricePln:
              parsePolishDecimal(
                form.priceB,
              ),
          },
        );

      setResult(comparison);
      setError(null);
    } catch (
      unknownError
    ) {
      setResult(null);

      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Nie udało się porównać pizz.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="Tu centymetry nie oszukują. Dwie pizze wchodzą, jedna wychodzi z lepszą ceną za kawałek powierzchni.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <PizzaFields
            title="Pizza A"
            badge="pierwsza"
            diameterId="pizza-a-diameter"
            priceId="pizza-a-price"
            diameter={
              form.diameterA
            }
            price={
              form.priceA
            }
            onDiameterChange={
              (
                value,
              ) =>
                updateField(
                  "diameterA",
                  value,
                )
            }
            onPriceChange={
              (
                value,
              ) =>
                updateField(
                  "priceA",
                  value,
                )
            }
          />

          <PizzaFields
            title="Pizza B"
            badge="druga"
            diameterId="pizza-b-diameter"
            priceId="pizza-b-price"
            diameter={
              form.diameterB
            }
            price={
              form.priceB
            }
            onDiameterChange={
              (
                value,
              ) =>
                updateField(
                  "diameterB",
                  value,
                )
            }
            onPriceChange={
              (
                value,
              ) =>
                updateField(
                  "priceB",
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
          submitLabel="Sprawdź, który placek wygrywa"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <PizzaResult
          result={
            result
          }
        />
      ) : null}
    </CalculatorShell>
  );
}

function PizzaFields({
  title,
  badge,
  diameterId,
  priceId,
  diameter,
  price,
  onDiameterChange,
  onPriceChange,
}: {
  title: string;
  badge: string;
  diameterId: string;
  priceId: string;
  diameter: string;
  price: string;

  onDiameterChange:
    (
      value: string,
    ) => void;

  onPriceChange:
    (
      value: string,
    ) => void;
}) {
  return (
    <CalculatorGroup
      title={
        title
      }
      badge={
        badge
      }
    >
      <div className="space-y-4">
        <CalculatorField
          id={
            diameterId
          }
          label="Średnica"
          value={
            diameter
          }
          suffix="cm"
          placeholder="np. 32"
          onChange={
            onDiameterChange
          }
        />

        <CalculatorField
          id={
            priceId
          }
          label="Cena"
          value={
            price
          }
          suffix="zł"
          placeholder="np. 29,90"
          onChange={
            onPriceChange
          }
        />
      </div>
    </CalculatorGroup>
  );
}

function PizzaResult({
  result,
}: {
  result:
    PizzaComparison;
}) {
  const isTie =
    result.winner ===
    "tie";

  const winnerName =
    result.winner ===
    "a"
      ? "Pizza A"
      : "Pizza B";

  return (
    <CalculatorResultShell
      tone={
        isTie
          ? "neutral"
          : "good"
      }
      title={
        isTie
          ? "Remis. Cebula nie ma faworyta."
          : winnerName +
            " daje więcej pizzy za złotówkę."
      }
      lead={
        isTie
          ? "Obie pizze kosztują praktycznie tyle samo w przeliczeniu na powierzchnię."
          : (
              <>
                Koszt 100 cm² zwycięskiej pizzy jest niższy o{" "}
                <strong className="text-ink">
                  {numberFormatter.format(
                    result.betterValuePercent,
                  )}
                  %
                </strong>
                .
              </>
            )
      }
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <PizzaMetric
          title="Pizza A"
          area={
            result.a.areaCm2
          }
          pricePer100={
            result.a.pricePer100Cm2
          }
          winner={
            result.winner ===
            "a"
          }
        />

        <PizzaMetric
          title="Pizza B"
          area={
            result.b.areaCm2
          }
          pricePer100={
            result.b.pricePer100Cm2
          }
          winner={
            result.winner ===
            "b"
          }
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        Liczymy wyłącznie powierzchnię i cenę. Dodatki, grubość ciasta i poziom „ale sera dali” zostają poza matematyką.
      </p>
    </CalculatorResultShell>
  );
}

function PizzaMetric({
  title,
  area,
  pricePer100,
  winner,
}: {
  title: string;
  area: number;
  pricePer100: number;
  winner: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white p-4",
        winner
          ? "border-brand-300"
          : "border-line",
      ].join(
        " ",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-black">
          {title}
        </p>

        {winner ? (
          <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-brand-800">
            cebula approved
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <CalculatorMetric
          label="Powierzchnia"
          value={
            numberFormatter.format(
              area,
            ) +
            " cm²"
          }
        />

        <CalculatorMetric
          label="Cena / 100 cm²"
          value={
            currencyFormatter.format(
              pricePer100,
            )
          }
          accent={
            winner
          }
        />
      </div>
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