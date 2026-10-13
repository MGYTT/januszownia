import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateSubscriptionMeter,
  type BillingIntervalMonths,
} from "./subscription-meter";

describe("calculateSubscriptionMeter", () => {
  it("liczy miesięczny abonament przez 12 miesięcy", () => {
    const result =
      calculateSubscriptionMeter({
        billingPricePln:
          29.99,

        billingIntervalMonths:
          1,

        analysisMonths:
          12,

        setupFeePln:
          0,

        annualPriceIncreasePercent:
          0,

        usesPerMonth:
          24,

        peopleSharing:
          1,
      });

    expect(
      result.chargeCount,
    ).toBe(
      12,
    );

    expect(
      result.totalCostPln,
    ).toBeCloseTo(
      359.88,
      10,
    );

    expect(
      result.averageMonthlyCostPln,
    ).toBeCloseTo(
      29.99,
      10,
    );

    expect(
      result.costPerUsePln,
    ).toBeCloseTo(
      359.88 /
        288,
      10,
    );
  });

  it("liczy pełne opłaty roczne, których termin wpada w okres analizy", () => {
    const result =
      calculateSubscriptionMeter({
        billingPricePln:
          240,

        billingIntervalMonths:
          12,

        analysisMonths:
          13,

        setupFeePln:
          0,

        annualPriceIncreasePercent:
          0,

        usesPerMonth:
          0,

        peopleSharing:
          1,
      });

    expect(
      result.chargeCount,
    ).toBe(
      2,
    );

    expect(
      result.totalCostPln,
    ).toBeCloseTo(
      480,
      10,
    );

    expect(
      result.charges.map(
        (
          charge,
        ) =>
          charge.displayMonth,
      ),
    ).toEqual([
      1,
      13,
    ]);
  });

  it("obsługuje darmowe pierwsze płatności", () => {
    const result =
      calculateSubscriptionMeter({
        billingPricePln:
          20,

        billingIntervalMonths:
          1,

        analysisMonths:
          12,

        setupFeePln:
          0,

        introPricePln:
          0,

        introBillingPeriods:
          3,

        annualPriceIncreasePercent:
          0,

        usesPerMonth:
          10,

        peopleSharing:
          1,
      });

    expect(
      result.introChargeCount,
    ).toBe(
      3,
    );

    expect(
      result.regularChargeCount,
    ).toBe(
      9,
    );

    expect(
      result.recurringCostPln,
    ).toBeCloseTo(
      180,
      10,
    );

    expect(
      result.introDifferenceVsRegularPln,
    ).toBeCloseTo(
      60,
      10,
    );
  });

  it("nalicza coroczną podwyżkę po każdych 12 miesiącach", () => {
    const result =
      calculateSubscriptionMeter({
        billingPricePln:
          10,

        billingIntervalMonths:
          1,

        analysisMonths:
          24,

        setupFeePln:
          0,

        annualPriceIncreasePercent:
          10,

        usesPerMonth:
          1,

        peopleSharing:
          1,
      });

    expect(
      result.totalCostPln,
    ).toBeCloseTo(
      252,
      10,
    );

    expect(
      result.annualIncreaseExtraCostPln,
    ).toBeCloseTo(
      12,
      10,
    );

    expect(
      result.charges[12]?.pricePln,
    ).toBeCloseTo(
      11,
      10,
    );
  });

  it("uwzględnia opłatę startową i dzielenie kosztu", () => {
    const result =
      calculateSubscriptionMeter({
        billingPricePln:
          20,

        billingIntervalMonths:
          1,

        analysisMonths:
          12,

        setupFeePln:
          60,

        annualPriceIncreasePercent:
          0,

        usesPerMonth:
          8,

        peopleSharing:
          2,
      });

    expect(
      result.totalCostPln,
    ).toBeCloseTo(
      300,
      10,
    );

    expect(
      result.firstPaymentPln,
    ).toBeCloseTo(
      80,
      10,
    );

    expect(
      result.averageMonthlyCostPerPersonPln,
    ).toBeCloseTo(
      12.5,
      10,
    );
  });

  it("liczy użycia potrzebne do osiągnięcia własnego limitu kosztu", () => {
    const result =
      calculateSubscriptionMeter({
        billingPricePln:
          10,

        billingIntervalMonths:
          1,

        analysisMonths:
          12,

        setupFeePln:
          0,

        annualPriceIncreasePercent:
          0,

        usesPerMonth:
          2,

        peopleSharing:
          1,

        targetCostPerUsePln:
          2,
      });

    expect(
      result.requiredUsesPerMonthForTarget,
    ).toBeCloseTo(
      5,
      10,
    );

    expect(
      result.additionalUsesPerMonthForTarget,
    ).toBeCloseTo(
      3,
      10,
    );

    expect(
      result.targetReached,
    ).toBe(
      false,
    );
  });

  it("nie wylicza kosztu użycia, gdy usługa nie jest używana", () => {
    const result =
      calculateSubscriptionMeter({
        billingPricePln:
          15,

        billingIntervalMonths:
          1,

        analysisMonths:
          12,

        setupFeePln:
          0,

        annualPriceIncreasePercent:
          0,

        usesPerMonth:
          0,

        peopleSharing:
          1,
      });

    expect(
      result.costPerUsePln,
    ).toBeNull();

    expect(
      result.totalUses,
    ).toBe(
      0,
    );
  });

  it("odrzuca nieprawidłowy okres płatności", () => {
    expect(
      () =>
        calculateSubscriptionMeter({
          billingPricePln:
            20,

          billingIntervalMonths:
            2 as BillingIntervalMonths,

          analysisMonths:
            12,

          setupFeePln:
            0,

          annualPriceIncreasePercent:
            0,

          usesPerMonth:
            1,

          peopleSharing:
            1,
        }),
    ).toThrow();
  });
});
