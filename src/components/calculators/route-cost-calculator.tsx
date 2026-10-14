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
  CalculatorMetric,
  CalculatorResultShell,
  CalculatorShell,
} from "@/components/calculators/calculator-ui";

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
          : "Nie udało się policzyć kosztu trasy.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="„To tylko parę kilometrów” brzmi niewinnie, dopóki nie doliczysz powrotu, autostrady i parkingu.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <CalculatorGroup
          title="Trasa i paliwo"
          badge="podstawa"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CalculatorField
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
              <span className="mb-2 block text-sm font-bold text-ink">
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
                    : "border-line bg-white hover:bg-canvas",
                ].join(
                  " ",
                )}
              >
                <span>
                  <span className="block text-sm font-black text-ink">
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
                  className="text-lg text-brand-700"
                >
                  ↔
                </span>
              </button>
            </div>

            <CalculatorField
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

            <CalculatorField
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
          </div>
        </CalculatorGroup>

        <div className="mt-4">
          <CalculatorGroup
            title="Dodatkowe koszty"
            badge="opcjonalne"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <CalculatorField
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

              <CalculatorField
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

              <CalculatorField
                id="route-other"
                label="Inne koszty"
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

              <CalculatorField
                id="route-travelers"
                label="Osoby dzielące koszt"
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
          </CalculatorGroup>
        </div>

        <CalculatorError
          message={
            error
          }
        />

        <CalculatorActions
          submitLabel="Policz koszt całej wyprawy"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <>
          <RouteCostResultView
            result={
              result
            }
          />

          <SaveCalculationPanel
            toolSlug="kalkulator-trasy"
            toolTitle="Kalkulator Trasy Janusza"
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

function RouteCostResultView({
  result,
}: {
  result:
    RouteCostResult;
}) {
  return (
    <CalculatorResultShell
      title={
        currencyFormatter.format(
          result.totalCostPln,
        ) +
        " za trasę"
      }
      lead={
        <>
          Przy podanej liczbie osób wychodzi{" "}
          <strong className="text-ink">
            {currencyFormatter.format(
              result.costPerTravelerPln,
            )}
          </strong>{" "}
          na osobę.
        </>
      }
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CalculatorMetric
          label="Łączny dystans"
          value={
            numberFormatter.format(
              result.totalDistanceKm,
            ) +
            " km"
          }
        />

        <CalculatorMetric
          label="Potrzebne paliwo"
          value={
            numberFormatter.format(
              result.fuelNeededLiters,
            ) +
            " l"
          }
        />

        <CalculatorMetric
          label="Koszt na osobę"
          value={
            currencyFormatter.format(
              result.costPerTravelerPln,
            )
          }
          accent
        />

        <CalculatorMetric
          label="Koszt na kilometr"
          value={
            currencyFormatter.format(
              result.costPerKmPln,
            )
          }
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

      <p className="mt-4 text-xs leading-5 text-muted">
        Nie doliczamy amortyzacji, serwisu, opon, ubezpieczenia ani wartości czasu. To koszt konkretnego przejazdu, nie pełny koszt posiadania auta.
      </p>
    </CalculatorResultShell>
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
      <p className="text-sm font-black text-ink">
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
    parsed <=
      0
  ) {
    throw new Error(
      "Liczba osób musi być dodatnią liczbą całkowitą.",
    );
  }

  return parsed;
}
