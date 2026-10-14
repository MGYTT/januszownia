export type BillingIntervalMonths =
  | 1
  | 3
  | 6
  | 12;

export type SubscriptionChargeKind =
  | "intro"
  | "regular";

export interface SubscriptionMeterInput {
  billingPricePln: number;
  billingIntervalMonths: BillingIntervalMonths;
  analysisMonths: number;

  setupFeePln: number;

  introPricePln?: number | null;
  introBillingPeriods?: number;

  annualPriceIncreasePercent: number;

  usesPerMonth: number;
  peopleSharing: number;

  targetCostPerUsePln?: number | null;
}

export interface SubscriptionCharge {
  chargeNumber: number;
  startMonth: number;
  displayMonth: number;

  kind: SubscriptionChargeKind;

  basePricePln: number;
  annualMultiplier: number;
  pricePln: number;

  coveredMonths: number;
  recognizedCostPln: number;
}

export interface SubscriptionMeterResult {
  analysisMonths: number;
  billingIntervalMonths: BillingIntervalMonths;

  chargeCount: number;
  introChargeCount: number;
  regularChargeCount: number;

  setupFeePln: number;

  cashRecurringCostPln: number;
  cashOutflowPln: number;

  recurringCostPln: number;
  totalCostPln: number;

  firstPaymentPln: number;

  averageMonthlyCostPln: number;
  annualizedCostPln: number;

  costPerPersonForPeriodPln: number;
  averageMonthlyCostPerPersonPln: number;
  peopleSharing: number;

  usesPerMonth: number;
  totalUses: number;
  costPerUsePln: number | null;

  targetCostPerUsePln: number | null;
  requiredUsesPerMonthForTarget: number | null;
  additionalUsesPerMonthForTarget: number | null;
  targetReached: boolean | null;

  introDifferenceVsRegularPln: number;
  annualIncreaseExtraCostPln: number;

  charges: SubscriptionCharge[];
}

const ALLOWED_INTERVALS:
  BillingIntervalMonths[] = [
    1,
    3,
    6,
    12,
  ];

export function calculateSubscriptionMeter(
  input: SubscriptionMeterInput,
): SubscriptionMeterResult {
  assertPositiveFinite(
    input.billingPricePln,
    "Cena abonamentu",
  );

  assertBillingInterval(
    input.billingIntervalMonths,
  );

  assertIntegerInRange(
    input.analysisMonths,
    "Okres analizy",
    1,
    60,
  );

  assertNonNegativeFinite(
    input.setupFeePln,
    "Opłata startowa",
  );

  assertNonNegativeFinite(
    input.annualPriceIncreasePercent,
    "Coroczna podwyżka ceny",
  );

  if (
    input.annualPriceIncreasePercent >
    1000
  ) {
    throw new RangeError(
      "Coroczna podwyżka ceny nie może przekraczać 1000%.",
    );
  }

  assertNonNegativeFinite(
    input.usesPerMonth,
    "Liczba użyć miesięcznie",
  );

  assertIntegerInRange(
    input.peopleSharing,
    "Liczba osób dzielących abonament",
    1,
    100,
  );

  const introPricePln =
    normalizeOptionalNonNegative(
      input.introPricePln,
      "Cena startowa",
    );

  const introBillingPeriods =
    introPricePln ===
    null
      ? 0
      : normalizeIntroPeriods(
          input.introBillingPeriods,
        );

  const targetCostPerUsePln =
    normalizeOptionalPositive(
      input.targetCostPerUsePln,
      "Docelowy koszt jednego użycia",
    );

  const charges =
    buildChargeSchedule({
      billingPricePln:
        input.billingPricePln,

      billingIntervalMonths:
        input.billingIntervalMonths,

      analysisMonths:
        input.analysisMonths,

      introPricePln,

      introBillingPeriods,

      annualPriceIncreasePercent:
        input.annualPriceIncreasePercent,
    });

  const cashRecurringCostPln =
    charges.reduce(
      (
        sum,
        charge,
      ) =>
        sum +
        charge.pricePln,
      0,
    );

  const recurringCostPln =
    charges.reduce(
      (
        sum,
        charge,
      ) =>
        sum +
        charge.recognizedCostPln,
      0,
    );

  const cashOutflowPln =
    input.setupFeePln +
    cashRecurringCostPln;

  const totalCostPln =
    input.setupFeePln +
    recurringCostPln;

  const firstPaymentPln =
    input.setupFeePln +
    (
      charges[0]?.pricePln ??
      0
    );

  const averageMonthlyCostPln =
    totalCostPln /
    input.analysisMonths;

  const annualizedCostPln =
    averageMonthlyCostPln *
    12;

  const costPerPersonForPeriodPln =
    totalCostPln /
    input.peopleSharing;

  const averageMonthlyCostPerPersonPln =
    averageMonthlyCostPln /
    input.peopleSharing;

  const totalUses =
    input.usesPerMonth *
    input.analysisMonths;

  const costPerUsePln =
    totalUses >
    0
      ? totalCostPln /
        totalUses
      : null;

  const requiredUsesPerMonthForTarget =
    targetCostPerUsePln ===
    null
      ? null
      : totalCostPln /
        targetCostPerUsePln /
        input.analysisMonths;

  const additionalUsesPerMonthForTarget =
    requiredUsesPerMonthForTarget ===
    null
      ? null
      : Math.max(
          0,
          requiredUsesPerMonthForTarget -
            input.usesPerMonth,
        );

  const targetReached =
    targetCostPerUsePln ===
    null
      ? null
      : costPerUsePln !==
          null &&
        costPerUsePln <=
          targetCostPerUsePln;

  const regularBaselineCostPln =
    charges.reduce(
      (
        sum,
        charge,
      ) => {
        const regularMultiplier =
          Math.pow(
            1 +
              input.annualPriceIncreasePercent /
                100,
            Math.floor(
              charge.startMonth /
                12,
            ),
          );

        const regularPricePln =
          input.billingPricePln *
          regularMultiplier;

        return (
          sum +
          prorateCharge(
            regularPricePln,
            charge.coveredMonths,
            input.billingIntervalMonths,
          )
        );
      },
      0,
    );

  const introDifferenceVsRegularPln =
    regularBaselineCostPln -
    recurringCostPln;

  const recurringCostWithoutIncreasePln =
    charges.reduce(
      (
        sum,
        charge,
      ) =>
        sum +
        prorateCharge(
          charge.basePricePln,
          charge.coveredMonths,
          input.billingIntervalMonths,
        ),
      0,
    );

  const annualIncreaseExtraCostPln =
    recurringCostPln -
    recurringCostWithoutIncreasePln;

  const introChargeCount =
    charges.filter(
      (
        charge,
      ) =>
        charge.kind ===
        "intro",
    ).length;

  return {
    analysisMonths:
      input.analysisMonths,

    billingIntervalMonths:
      input.billingIntervalMonths,

    chargeCount:
      charges.length,

    introChargeCount,

    regularChargeCount:
      charges.length -
      introChargeCount,

    setupFeePln:
      input.setupFeePln,

    cashRecurringCostPln,

    cashOutflowPln,

    recurringCostPln,

    totalCostPln,

    firstPaymentPln,

    averageMonthlyCostPln,

    annualizedCostPln,

    costPerPersonForPeriodPln,

    averageMonthlyCostPerPersonPln,

    peopleSharing:
      input.peopleSharing,

    usesPerMonth:
      input.usesPerMonth,

    totalUses,

    costPerUsePln,

    targetCostPerUsePln,

    requiredUsesPerMonthForTarget,

    additionalUsesPerMonthForTarget,

    targetReached,

    introDifferenceVsRegularPln,

    annualIncreaseExtraCostPln,

    charges,
  };
}

function buildChargeSchedule({
  billingPricePln,
  billingIntervalMonths,
  analysisMonths,
  introPricePln,
  introBillingPeriods,
  annualPriceIncreasePercent,
}: {
  billingPricePln: number;
  billingIntervalMonths:
    BillingIntervalMonths;
  analysisMonths: number;
  introPricePln: number | null;
  introBillingPeriods: number;
  annualPriceIncreasePercent: number;
}): SubscriptionCharge[] {
  const charges:
    SubscriptionCharge[] = [];

  let chargeNumber =
    1;

  for (
    let startMonth = 0;
    startMonth <
    analysisMonths;
    startMonth +=
      billingIntervalMonths
  ) {
    const isIntro =
      introPricePln !==
        null &&
      chargeNumber <=
        introBillingPeriods;

    const basePricePln =
      isIntro
        ? introPricePln
        : billingPricePln;

    const completedYears =
      Math.floor(
        startMonth /
        12,
      );

    const annualMultiplier =
      isIntro
        ? 1
        : Math.pow(
            1 +
              annualPriceIncreasePercent /
                100,
            completedYears,
          );

    const pricePln =
      basePricePln *
      annualMultiplier;

    const coveredMonths =
      Math.min(
        billingIntervalMonths,
        analysisMonths -
          startMonth,
      );

    charges.push({
      chargeNumber,

      startMonth,

      displayMonth:
        startMonth +
        1,

      kind:
        isIntro
          ? "intro"
          : "regular",

      basePricePln,

      annualMultiplier,

      pricePln,

      coveredMonths,

      recognizedCostPln:
        prorateCharge(
          pricePln,
          coveredMonths,
          billingIntervalMonths,
        ),
    });

    chargeNumber +=
      1;
  }

  return charges;
}

function prorateCharge(
  pricePln: number,
  coveredMonths: number,
  billingIntervalMonths:
    BillingIntervalMonths,
): number {
  return (
    pricePln *
    coveredMonths /
    billingIntervalMonths
  );
}

function assertBillingInterval(
  value: number,
): asserts value is BillingIntervalMonths {
  if (
    !ALLOWED_INTERVALS.includes(
      value as BillingIntervalMonths,
    )
  ) {
    throw new RangeError(
      "Okres płatności musi wynosić 1, 3, 6 albo 12 miesięcy.",
    );
  }
}

function normalizeIntroPeriods(
  value:
    number | undefined,
): number {
  if (
    value ===
    undefined
  ) {
    return 1;
  }

  assertIntegerInRange(
    value,
    "Liczba płatności w cenie startowej",
    1,
    120,
  );

  return value;
}

function normalizeOptionalNonNegative(
  value:
    number | null | undefined,
  label: string,
): number | null {
  if (
    value ===
      undefined ||
    value ===
      null
  ) {
    return null;
  }

  assertNonNegativeFinite(
    value,
    label,
  );

  return value;
}

function normalizeOptionalPositive(
  value:
    number | null | undefined,
  label: string,
): number | null {
  if (
    value ===
      undefined ||
    value ===
      null
  ) {
    return null;
  }

  assertPositiveFinite(
    value,
    label,
  );

  return value;
}

function assertPositiveFinite(
  value: number,
  label: string,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <=
      0
  ) {
    throw new RangeError(
      label +
      " musi być większa od zera.",
    );
  }
}

function assertNonNegativeFinite(
  value: number,
  label: string,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <
      0
  ) {
    throw new RangeError(
      label +
      " nie może być ujemna.",
    );
  }
}

function assertIntegerInRange(
  value: number,
  label: string,
  min: number,
  max: number,
): void {
  if (
    !Number.isInteger(
      value,
    ) ||
    value <
      min ||
    value >
      max
  ) {
    throw new RangeError(
      label +
      " musi być liczbą całkowitą od " +
      min +
      " do " +
      max +
      ".",
    );
  }
}