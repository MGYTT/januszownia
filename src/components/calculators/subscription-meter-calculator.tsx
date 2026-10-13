"use client";

import {
  type FormEvent,
  useState,
} from "react";

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
  calculateSubscriptionMeter,
  type BillingIntervalMonths,
  type SubscriptionMeterResult,
} from "@/lib/calculators/subscription-meter";

interface FormState {
  subscriptionName: string;

  billingPrice: string;
  billingIntervalMonths: string;
  analysisMonths: string;

  usesPerMonth: string;
  peopleSharing: string;

  setupFee: string;
  introPrice: string;
  introBillingPeriods: string;
  annualPriceIncreasePercent: string;
  targetCostPerUse: string;
}

const initialForm: FormState = {
  subscriptionName: "",

  billingPrice: "",
  billingIntervalMonths: "1",
  analysisMonths: "12",

  usesPerMonth: "8",
  peopleSharing: "1",

  setupFee: "0",
  introPrice: "",
  introBillingPeriods: "1",
  annualPriceIncreasePercent: "0",
  targetCostPerUse: "",
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

export function SubscriptionMeterCalculator() {
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
    useState<SubscriptionMeterResult | null>(
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
        calculateSubscriptionMeter({
          billingPricePln:
            parsePolishDecimal(
              form.billingPrice,
            ),

          billingIntervalMonths:
            parseBillingInterval(
              form.billingIntervalMonths,
            ),

          analysisMonths:
            parsePositiveInteger(
              form.analysisMonths,
              "Okres analizy",
            ),

          setupFeePln:
            parseOptionalDecimal(
              form.setupFee,
            ) ??
            0,

          introPricePln:
            parseOptionalDecimal(
              form.introPrice,
            ),

          introBillingPeriods:
            form.introPrice.trim() ===
            ""
              ? undefined
              : parsePositiveInteger(
                  form.introBillingPeriods,
                  "Liczba płatności w cenie startowej",
                ),

          annualPriceIncreasePercent:
            parseOptionalDecimal(
              form.annualPriceIncreasePercent,
            ) ??
            0,

          usesPerMonth:
            parsePolishDecimal(
              form.usesPerMonth,
            ),

          peopleSharing:
            parsePositiveInteger(
              form.peopleSharing,
              "Liczba osób pokrywających koszt",
            ),

          targetCostPerUsePln:
            parseOptionalDecimal(
              form.targetCostPerUse,
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
          : "Nie udało się policzyć abonamentu.",
      );
    }
  }

  function reset() {
    setForm(
      initialForm,
    );

    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="„To tylko 29,99 miesięcznie” to ulubione zaklęcie abonamentów. My sprawdzimy, ile naprawdę znika z konta i ile kosztuje jedno użycie.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <CalculatorGroup
          title="Abonament"
          badge="podstawa"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="subscription-name"
                className="mb-2 block text-sm font-bold text-ink"
              >
                Nazwa abonamentu
              </label>

              <input
                id="subscription-name"
                type="text"
                value={
                  form.subscriptionName
                }
                placeholder="np. streaming, siłownia, chmura"
                onChange={
                  (
                    event,
                  ) =>
                    updateField(
                      "subscriptionName",
                      event.target.value,
                    )
                }
                className="h-12 w-full rounded-xl border border-line bg-white px-4 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
              />

              <p className="mt-2 text-xs leading-5 text-muted">
                Opcjonalne. Nazwa pomaga tylko rozpoznać analizę — nie wpływa na obliczenia.
              </p>
            </div>

            <CalculatorField
              id="billing-price"
              label="Cena jednej płatności"
              value={
                form.billingPrice
              }
              placeholder="np. 39,99"
              suffix="zł"
              onChange={
                (
                  value,
                ) =>
                  updateField(
                    "billingPrice",
                    value,
                  )
              }
            />

            <div>
              <label
                htmlFor="billing-interval"
                className="mb-2 block text-sm font-bold text-ink"
              >
                Jak często pobierana jest opłata?
              </label>

              <select
                id="billing-interval"
                value={
                  form.billingIntervalMonths
                }
                onChange={
                  (
                    event,
                  ) =>
                    updateField(
                      "billingIntervalMonths",
                      event.target.value,
                    )
                }
                className="h-12 w-full rounded-xl border border-line bg-white px-4 text-base font-semibold outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
              >
                <option value="1">
                  Co miesiąc
                </option>

                <option value="3">
                  Co 3 miesiące
                </option>

                <option value="6">
                  Co 6 miesięcy
                </option>

                <option value="12">
                  Raz w roku
                </option>
              </select>
            </div>

            <CalculatorField
              id="analysis-months"
              label="Jak długi okres analizujemy?"
              value={
                form.analysisMonths
              }
              placeholder="12"
              suffix="mies."
              inputMode="numeric"
              help="Od 1 do 60 miesięcy. Dla zwykłego audytu abonamentu 12 miesięcy jest czytelnym punktem odniesienia."
              onChange={
                (
                  value,
                ) =>
                  updateField(
                    "analysisMonths",
                    value,
                  )
              }
            />
          </div>
        </CalculatorGroup>

        <div className="mt-4">
          <CalculatorGroup
            title="Czy faktycznie z tego korzystasz?"
            badge="najważniejsze"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <CalculatorField
                id="uses-per-month"
                label="Łączna liczba użyć miesięcznie"
                value={
                  form.usesPerMonth
                }
                placeholder="np. 8"
                suffix="użyć"
                help="Sam definiujesz jedno użycie: trening, seans, zamówienie, sesja w aplikacji itd. Wpisz łączną liczbę dla całego abonamentu."
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "usesPerMonth",
                      value,
                    )
                }
              />

              <CalculatorField
                id="people-sharing"
                label="Ile osób pokrywa koszt?"
                value={
                  form.peopleSharing
                }
                placeholder="1"
                suffix="os."
                inputMode="numeric"
                help="Służy tylko do podziału kosztu. Nie zakładamy, że regulamin danej usługi pozwala współdzielić konto."
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "peopleSharing",
                      value,
                    )
                }
              />
            </div>
          </CalculatorGroup>
        </div>

        <details className="mt-4 rounded-2xl border border-line bg-canvas/70">
          <summary className="cursor-pointer px-4 py-4 text-sm font-black text-ink sm:px-5">
            Tryb księgowego — promocje, podwyżki i dodatkowe opłaty
          </summary>

          <div className="border-t border-line px-4 py-5 sm:px-5">
            <p className="mb-5 text-xs leading-5 text-muted">
              Te pola są opcjonalne. Zostaw je w spokoju, jeśli Twój abonament ma po prostu stałą cenę.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <CalculatorField
                id="setup-fee"
                label="Jednorazowa opłata startowa"
                value={
                  form.setupFee
                }
                placeholder="0"
                suffix="zł"
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "setupFee",
                      value,
                    )
                }
              />

              <CalculatorField
                id="annual-increase"
                label="Zakładana coroczna podwyżka"
                value={
                  form.annualPriceIncreasePercent
                }
                placeholder="0"
                suffix="%"
                help="Jeżeli chcesz zasymulować wzrost ceny, wpisz procent. Podwyżka zaczyna działać po każdych pełnych 12 miesiącach."
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "annualPriceIncreasePercent",
                      value,
                    )
                }
              />

              <CalculatorField
                id="intro-price"
                label="Cena startowa jednej płatności"
                value={
                  form.introPrice
                }
                placeholder="np. 0 albo 9,99"
                suffix="zł"
                help="Opcjonalne. Możesz wpisać 0 zł dla darmowych pierwszych płatności."
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "introPrice",
                      value,
                    )
                }
              />

              <CalculatorField
                id="intro-periods"
                label="Ile pierwszych płatności ma tę cenę?"
                value={
                  form.introBillingPeriods
                }
                placeholder="1"
                suffix="płatn."
                inputMode="numeric"
                help="Liczymy liczbę pobrań opłaty, nie liczbę miesięcy."
                onChange={
                  (
                    value,
                  ) =>
                    updateField(
                      "introBillingPeriods",
                      value,
                    )
                }
              />

              <div className="md:col-span-2">
                <CalculatorField
                  id="target-cost-per-use"
                  label="Ile maksymalnie chcesz płacić za jedno użycie?"
                  value={
                    form.targetCostPerUse
                  }
                  placeholder="opcjonalnie, np. 5"
                  suffix="zł/użycie"
                  help="Jeśli wpiszesz limit, policzymy ile użyć miesięcznie potrzeba, żeby się w nim zmieścić. To Twój własny próg, nie nasza arbitralna ocena."
                  onChange={
                    (
                      value,
                    ) =>
                      updateField(
                        "targetCostPerUse",
                        value,
                      )
                  }
                />
              </div>
            </div>
          </div>
        </details>

        <CalculatorError
          message={
            error
          }
        />

        <CalculatorActions
          submitLabel="Prześwietl abonament"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <SubscriptionResult
          result={
            result
          }
          subscriptionName={
            form.subscriptionName
          }
        />
      ) : null}
    </CalculatorShell>
  );
}

function SubscriptionResult({
  result,
  subscriptionName,
}: {
  result:
    SubscriptionMeterResult;

  subscriptionName:
    string;
}) {
  const verdict =
    getVerdict(
      result,
    );

  const cleanName =
    subscriptionName.trim();

  return (
    <CalculatorResultShell
      tone={
        verdict.tone
      }
      title={
        verdict.title
      }
      lead={
        <>
          {cleanName ? (
            <>
              <strong className="text-ink">
                {cleanName}
              </strong>
              :{" "}
            </>
          ) : null}

          przez{" "}
          <strong className="text-ink">
            {result.analysisMonths}
          </strong>{" "}
          mies. pobierze łącznie{" "}
          <strong className="text-ink">
            {currencyFormatter.format(
              result.totalCostPln,
            )}
          </strong>
          .
        </>
      }
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CalculatorMetric
          label="Średnio / miesiąc"
          value={
            currencyFormatter.format(
              result.averageMonthlyCostPln,
            )
          }
          accent
        />

        <CalculatorMetric
          label="Pierwsza płatność z opłatą startową"
          value={
            currencyFormatter.format(
              result.firstPaymentPln,
            )
          }
        />

        <CalculatorMetric
          label="Na osobę / miesiąc"
          value={
            currencyFormatter.format(
              result.averageMonthlyCostPerPersonPln,
            )
          }
        />

        <CalculatorMetric
          label="Koszt jednego użycia"
          value={
            result.costPerUsePln ===
            null
              ? "brak użyć"
              : currencyFormatter.format(
                  result.costPerUsePln,
                )
          }
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <DetailTile
          label="Pobrane opłaty cykliczne"
          value={
            String(
              result.chargeCount,
            )
          }
          detail={
            currencyFormatter.format(
              result.recurringCostPln,
            ) +
            " łącznie"
          }
        />

        <DetailTile
          label="Roczny odpowiednik średniej"
          value={
            currencyFormatter.format(
              result.annualizedCostPln,
            )
          }
          detail="Średni koszt miesięczny × 12"
        />

        <DetailTile
          label="Koszt na osobę za cały okres"
          value={
            currencyFormatter.format(
              result.costPerPersonForPeriodPln,
            )
          }
          detail={
            "Po podziale na " +
            result.peopleSharing +
            (
              result.peopleSharing ===
              1
                ? " osobę"
                : " osoby/osób"
            )
          }
        />
      </div>

      {Math.abs(
        result.introDifferenceVsRegularPln,
      ) >
      0.005 ? (
        <EffectCard
          title="Cena startowa"
          value={
            formatSignedBenefit(
              result.introDifferenceVsRegularPln,
            )
          }
          description={
            result.introDifferenceVsRegularPln >=
            0
              ? "Tyle mniej kosztują płatności w okresie analizy względem regularnego cennika przy tych samych założeniach."
              : "Cena startowa podnosi koszt względem regularnego cennika."
          }
        />
      ) : null}

      {result.annualIncreaseExtraCostPln >
      0.005 ? (
        <EffectCard
          title="Efekt założonych podwyżek"
          value={
            "+" +
            currencyFormatter.format(
              result.annualIncreaseExtraCostPln,
            )
          }
          description="Tyle dokładamy w analizowanym okresie wyłącznie przez wpisany coroczny wzrost ceny."
        />
      ) : null}

      {result.targetCostPerUsePln !==
      null ? (
        <TargetCard
          result={
            result
          }
        />
      ) : null}

      <details className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
        <summary className="cursor-pointer px-4 py-4 text-sm font-black text-ink">
          Pokaż harmonogram wszystkich płatności
        </summary>

        <div className="border-t border-line">
          {result.charges.map(
            (
              charge,
            ) => (
              <div
                key={
                  charge.chargeNumber
                }
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-line px-4 py-3 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-black text-ink">
                    Płatność{" "}
                    {charge.chargeNumber}
                  </p>

                  <p className="mt-0.5 text-xs text-muted">
                    miesiąc{" "}
                    {charge.displayMonth}
                    {" · "}
                    {charge.kind ===
                    "intro"
                      ? "cena startowa"
                      : "cena regularna"}
                  </p>
                </div>

                <p className="self-center text-sm font-black text-brand-800">
                  {currencyFormatter.format(
                    charge.pricePln,
                  )}
                </p>
              </div>
            ),
          )}
        </div>
      </details>

      <p className="mt-4 text-xs leading-5 text-muted">
        Liczymy płatności, których termin przypada w analizowanym okresie. Jeśli kolejna roczna opłata zaczyna się np. w 13. miesiącu, cała ta płatność wchodzi do kosztu — bo właśnie tyle realnie pobierze usługodawca.
      </p>
    </CalculatorResultShell>
  );
}

function TargetCard({
  result,
}: {
  result:
    SubscriptionMeterResult;
}) {
  const required =
    result.requiredUsesPerMonthForTarget ??
    0;

  const additional =
    result.additionalUsesPerMonthForTarget ??
    0;

  return (
    <div className="mt-4 rounded-2xl border border-line bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">
        Twój limit kosztu użycia
      </p>

      {result.targetReached ? (
        <>
          <p className="mt-2 text-lg font-black text-brand-800">
            Mieścisz się w limicie.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted">
            Do osiągnięcia wpisanego limitu wystarcza około{" "}
            <strong className="text-ink">
              {numberFormatter.format(
                required,
              )}
            </strong>{" "}
            użyć miesięcznie. Według deklaracji korzystasz{" "}
            <strong className="text-ink">
              {numberFormatter.format(
                result.usesPerMonth,
              )}
            </strong>{" "}
            razy.
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 text-lg font-black text-accent-700">
            Trzeba używać częściej albo płacić mniej.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted">
            Żeby zejść do własnego limitu{" "}
            <strong className="text-ink">
              {currencyFormatter.format(
                result.targetCostPerUsePln ??
                0,
              )}
            </strong>{" "}
            za użycie, potrzeba około{" "}
            <strong className="text-ink">
              {numberFormatter.format(
                required,
              )}
            </strong>{" "}
            użyć miesięcznie, czyli o około{" "}
            <strong className="text-ink">
              {numberFormatter.format(
                additional,
              )}
            </strong>{" "}
            więcej niż deklarujesz.
          </p>
        </>
      )}
    </div>
  );
}

function DetailTile({
  label,
  value,
  detail,
}: {
  label:
    string;

  value:
    string;

  detail:
    string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs leading-5 text-muted">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-ink">
        {value}
      </p>

      {detail ? (
        <p className="mt-1 text-xs leading-5 text-muted">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

function EffectCard({
  title,
  value,
  description,
}: {
  title:
    string;

  value:
    string;

  description:
    string;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-ink">
            {title}
          </p>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">
            {description}
          </p>
        </div>

        <p className="text-lg font-black text-brand-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function getVerdict(
  result:
    SubscriptionMeterResult,
): {
  tone:
    | "good"
    | "neutral"
    | "warning";

  title:
    string;
} {
  if (
    result.totalUses ===
    0
  ) {
    return {
      tone:
        "warning",

      title:
        "Płacisz, ale nie używasz. Abonament-duch.",
    };
  }

  if (
    result.targetCostPerUsePln !==
    null
  ) {
    if (
      result.targetReached
    ) {
      return {
        tone:
          "good",

        title:
          "Mieści się w Twoim limicie. Cebula zatwierdza matematykę.",
      };
    }

    return {
      tone:
        "warning",

      title:
        "Jedno użycie kosztuje więcej, niż chcesz.",
    };
  }

  return {
    tone:
      "neutral",

    title:
      "Teraz „tylko abonament” ma pełną cenę.",
  };
}

function formatSignedBenefit(
  value:
    number,
): string {
  if (
    Math.abs(
      value,
    ) <
    0.005
  ) {
    return currencyFormatter.format(
      0,
    );
  }

  return (
    (
      value >
      0
        ? "−"
        : "+"
    ) +
    currencyFormatter.format(
      Math.abs(
        value,
      ),
    )
  );
}

function parseBillingInterval(
  value:
    string,
): BillingIntervalMonths {
  const parsed =
    Number(
      value,
    );

  if (
    parsed ===
      1 ||
    parsed ===
      3 ||
    parsed ===
      6 ||
    parsed ===
      12
  ) {
    return parsed;
  }

  throw new Error(
    "Wybierz poprawny okres płatności.",
  );
}

function parseOptionalDecimal(
  value:
    string,
): number | null {
  if (
    value.trim() ===
    ""
  ) {
    return null;
  }

  return parsePolishDecimal(
    value,
  );
}

function parsePolishDecimal(
  value:
    string,
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
      "Uzupełnij wymagane pola.",
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
  value:
    string,

  label:
    string,
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
      label +
      " musi być dodatnią liczbą całkowitą.",
    );
  }

  return parsed;
}
