"use client";

import {
  type FormEvent,
  useState,
} from "react";

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
        unknownError instanceof
          Error
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
    <div className="rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-7 lg:p-8">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <fieldset>
          <legend className="text-lg font-black">
            Ilu gości karmimy?
          </legend>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <NumberField
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

            <NumberField
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
            <span className="mb-2 block text-sm font-bold">
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
        </fieldset>

        <fieldset className="mt-8 border-t border-line pt-7">
          <legend className="text-lg font-black">
            Jakie masz ceny?
          </legend>

          <p className="mt-2 text-sm leading-6 text-muted">
            Podaj swoje realne średnie ceny. Jeżeli dany produkt masz już w domu, możesz wpisać 0 zł.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <NumberField
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

            <NumberField
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

            <NumberField
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

            <NumberField
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

            <NumberField
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

            <NumberField
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
        </fieldset>

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
            Zaplanuj grilla
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
          <GrillResultView
            result={
              result
            }
          />
        ) : null}
      </div>
    </div>
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
          : "border-line bg-canvas text-muted",
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
    </div>
  );
}

function GrillResultView({
  result,
}: {
  result:
    GrillResult;
}) {
  return (
    <section className="rounded-card border border-brand-200 bg-brand-50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        Plan grilla
      </p>

      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
        <p className="text-3xl font-black text-brand-900">
          {currencyFormatter.format(
            result.totalCostPln,
          )}
        </p>

        <p className="pb-1 text-sm font-bold text-brand-700">
          szacowany budżet
        </p>
      </div>

      <p className="mt-2 text-sm leading-6 text-brand-900">
        Przy wpisanych cenach daje to około{" "}
        <strong>
          {currencyFormatter.format(
            result.costPerGuestPln,
          )}
        </strong>{" "}
        na osobę.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
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

      <div className="mt-5 rounded-2xl border border-line bg-white p-4">
        <p className="text-sm font-black">
          Jak potraktowaliśmy grupę?
        </p>

        <p className="mt-2 text-xs leading-5 text-muted">
          {result.guests} osób odpowiada{" "}
          {quantityFormatter.format(
            result.guestEquivalents,
          )}{" "}
          „dorosłym porcjom” przed korektą apetytu. Dziecko liczymy jako 0,6 porcji dorosłej. Poziom apetytu zmienia ilość jedzenia, ale nie napojów ani paliwa do grilla.
        </p>
      </div>
    </section>
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
        "grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-3",
        last
          ? ""
          : "border-b border-line",
      ].join(
        " ",
      )}
    >
      <div>
        <p className="text-sm font-black">
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
