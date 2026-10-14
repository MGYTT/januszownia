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
  CalculatorGroup,
  CalculatorResultShell,
  CalculatorShell,
} from "@/components/calculators/calculator-ui";

import {
  calculateGrillPlan,
  type GrillAppetite,
  type GrillResult,
} from "@/lib/calculators/grill";

interface FormState {
  adults: string;
  children: string;
  appetite: GrillAppetite;

  proteinPrice: string;
  sidesPrice: string;
  vegetablesPrice: string;
  breadPrice: string;
  drinksPrice: string;
  charcoalPrice: string;
}

const initialForm: FormState = {
  adults: "4",
  children: "0",
  appetite: "normal",

  proteinPrice: "",
  sidesPrice: "",
  vegetablesPrice: "",
  breadPrice: "",
  drinksPrice: "",
  charcoalPrice: "",
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

const quantityFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      maximumFractionDigits: 2,
    },
  );

export function GrillCalculator() {
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
    useState<GrillResult | null>(
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
        calculateGrillPlan({
          adults:
            parseInteger(
              form.adults,
            ),

          children:
            parseInteger(
              form.children,
            ),

          appetite:
            form.appetite,

          prices: {
            proteinPlnPerKg:
              parsePolishDecimal(
                form.proteinPrice,
              ),

            sidesPlnPerKg:
              parsePolishDecimal(
                form.sidesPrice,
              ),

            vegetablesPlnPerKg:
              parsePolishDecimal(
                form.vegetablesPrice,
              ),

            breadPlnPerKg:
              parsePolishDecimal(
                form.breadPrice,
              ),

            drinksPlnPerLiter:
              parsePolishDecimal(
                form.drinksPrice,
              ),

            charcoalPlnPerKg:
              parsePolishDecimal(
                form.charcoalPrice,
              ),
          },
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
          : "Nie udało się przygotować planu grilla.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="Grill bez planu kończy się zwykle nadmiarem pieczywa albo dramatycznym brakiem kiełbasy. Policzmy środek.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <CalculatorGroup
          title="Ekipa"
          badge="ile osób"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CalculatorField
              id="grill-adults"
              label="Dorośli"
              value={
                form.adults
              }
              placeholder="np. 6"
              suffix="os."
              inputMode="numeric"
              onChange={
                (
                  value,
                ) =>
                  updateField(
                    "adults",
                    value,
                  )
              }
            />

            <CalculatorField
              id="grill-children"
              label="Dzieci"
              value={
                form.children
              }
              placeholder="np. 2"
              suffix="os."
              inputMode="numeric"
              onChange={
                (
                  value,
                ) =>
                  updateField(
                    "children",
                    value,
                  )
              }
            />
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-sm font-bold text-ink">
              Apetyt grupy
            </span>

            <div className="grid grid-cols-3 gap-2">
              <AppetiteButton
                active={
                  form.appetite ===
                  "light"
                }
                title="Lekki"
                subtitle="80%"
                onClick={
                  () =>
                    updateField(
                      "appetite",
                      "light",
                    )
                }
              />

              <AppetiteButton
                active={
                  form.appetite ===
                  "normal"
                }
                title="Normalny"
                subtitle="100%"
                onClick={
                  () =>
                    updateField(
                      "appetite",
                      "normal",
                    )
                }
              />

              <AppetiteButton
                active={
                  form.appetite ===
                  "hungry"
                }
                title="Głodni"
                subtitle="125%"
                onClick={
                  () =>
                    updateField(
                      "appetite",
                      "hungry",
                    )
                }
              />
            </div>
          </div>
        </CalculatorGroup>

        <div className="mt-4">
          <CalculatorGroup
            title="Ceny"
            badge="Twoje stawki"
          >
            <p className="mb-4 text-xs leading-5 text-muted">
              Wpisz realne średnie ceny. Jeżeli coś już masz w domu, możesz wpisać 0 zł.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <CalculatorField
                id="grill-protein-price"
                label="Produkty główne"
                value={
                  form.proteinPrice
                }
                placeholder="np. 34,99"
                suffix="zł/kg"
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "proteinPrice",
                      value,
                    )
                }
              />

              <CalculatorField
                id="grill-sides-price"
                label="Dodatki"
                value={
                  form.sidesPrice
                }
                placeholder="np. 18,00"
                suffix="zł/kg"
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "sidesPrice",
                      value,
                    )
                }
              />

              <CalculatorField
                id="grill-vegetables-price"
                label="Warzywa"
                value={
                  form.vegetablesPrice
                }
                placeholder="np. 12,00"
                suffix="zł/kg"
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "vegetablesPrice",
                      value,
                    )
                }
              />

              <CalculatorField
                id="grill-bread-price"
                label="Pieczywo"
                value={
                  form.breadPrice
                }
                placeholder="np. 10,00"
                suffix="zł/kg"
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "breadPrice",
                      value,
                    )
                }
              />

              <CalculatorField
                id="grill-drinks-price"
                label="Napoje"
                value={
                  form.drinksPrice
                }
                placeholder="np. 5,00"
                suffix="zł/l"
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "drinksPrice",
                      value,
                    )
                }
              />

              <CalculatorField
                id="grill-charcoal-price"
                label="Węgiel lub brykiet"
                value={
                  form.charcoalPrice
                }
                placeholder="np. 8,00"
                suffix="zł/kg"
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "charcoalPrice",
                      value,
                    )
                }
              />
            </div>
          </CalculatorGroup>
        </div>

        <CalculatorError
          message={
            error
          }
        />

        <CalculatorActions
          submitLabel="Zaplanuj grilla bez dramatu"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <>
          <GrillResultView
            result={
              result
            }
          />

          <SaveCalculationPanel
            toolSlug="grillometr"
            toolTitle="Grillometr"
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

function AppetiteButton({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={
        active
      }
      onClick={
        onClick
      }
      className={[
        "min-h-16 rounded-xl border px-2 py-3 text-center transition",
        active
          ? "border-brand-300 bg-brand-50 text-brand-900"
          : "border-line bg-white text-muted hover:bg-canvas",
      ].join(
        " ",
      )}
    >
      <span className="block text-sm font-black">
        {title}
      </span>

      <span className="mt-0.5 block text-[11px] font-bold">
        {subtitle}
      </span>
    </button>
  );
}

function GrillResultView({
  result,
}: {
  result:
    GrillResult;
}) {
  return (
    <CalculatorResultShell
      title={
        currencyFormatter.format(
          result.totalCostPln,
        ) +
        " za całą ekipę"
      }
      lead={
        <>
          Przy wpisanych cenach wychodzi około{" "}
          <strong className="text-ink">
            {currencyFormatter.format(
              result.costPerGuestPln,
            )}
          </strong>{" "}
          na osobę.
        </>
      }
    >
      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
        <GrillRow
          label="Produkty główne"
          quantity={
            result.protein.quantity
          }
          unit={
            result.protein.unit
          }
          cost={
            result.protein.costPln
          }
        />

        <GrillRow
          label="Dodatki"
          quantity={
            result.sides.quantity
          }
          unit={
            result.sides.unit
          }
          cost={
            result.sides.costPln
          }
        />

        <GrillRow
          label="Warzywa"
          quantity={
            result.vegetables.quantity
          }
          unit={
            result.vegetables.unit
          }
          cost={
            result.vegetables.costPln
          }
        />

        <GrillRow
          label="Pieczywo"
          quantity={
            result.bread.quantity
          }
          unit={
            result.bread.unit
          }
          cost={
            result.bread.costPln
          }
        />

        <GrillRow
          label="Napoje"
          quantity={
            result.drinks.quantity
          }
          unit={
            result.drinks.unit
          }
          cost={
            result.drinks.costPln
          }
        />

        <GrillRow
          label="Węgiel / brykiet"
          quantity={
            result.charcoal.quantity
          }
          unit={
            result.charcoal.unit
          }
          cost={
            result.charcoal.costPln
          }
          last
        />
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-4">
        <p className="text-sm font-black text-ink">
          Jak policzyliśmy ekipę?
        </p>

        <p className="mt-2 text-xs leading-5 text-muted">
          {result.guests} osób odpowiada{" "}
          {quantityFormatter.format(
            result.guestEquivalents,
          )}{" "}
          „dorosłym porcjom” przed korektą apetytu. Dziecko liczymy jako 0,6 porcji dorosłej. Apetyt zmienia ilość jedzenia, ale nie napojów ani paliwa do grilla.
        </p>
      </div>
    </CalculatorResultShell>
  );
}

function GrillRow({
  label,
  quantity,
  unit,
  cost,
  last = false,
}: {
  label: string;
  quantity: number;
  unit: string;
  cost: number;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-3.5",
        last
          ? ""
          : "border-b border-line",
      ].join(
        " ",
      )}
    >
      <div>
        <p className="text-sm font-black text-ink">
          {label}
        </p>

        <p className="mt-0.5 text-xs text-muted">
          {quantityFormatter.format(
            quantity,
          )}{" "}
          {unit}
        </p>
      </div>

      <p className="self-center text-sm font-black text-brand-800">
        {currencyFormatter.format(
          cost,
        )}
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
      "Uzupełnij wszystkie pola z cenami.",
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
      "Liczba osób musi być liczbą całkowitą.",
    );
  }

  return parsed;
}
