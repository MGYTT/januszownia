import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculatePromotionMeter,
} from "./promotion-meter";

describe("calculatePromotionMeter", () => {
  it("liczy rabat i oszczędność dla wielu sztuk", () => {
    const result =
      calculatePromotionMeter({
        regularPricePln:
          100,

        promotionalPricePln:
          75,

        quantity:
          3,
      });

    expect(
      result.discountPercent,
    ).toBeCloseTo(
      25,
      10,
    );

    expect(
      result.savingPerItemPln,
    ).toBeCloseTo(
      25,
      10,
    );

    expect(
      result.totalSavingPln,
    ).toBeCloseTo(
      75,
      10,
    );

    expect(
      result.rating,
    ).toBe(
      "good",
    );
  });

  it("porównuje promocję z najniższą ceną z 30 dni", () => {
    const result =
      calculatePromotionMeter({
        regularPricePln:
          100,

        promotionalPricePln:
          80,

        quantity:
          1,

        lowest30DaysPln:
          90,
      });

    expect(
      result.relationToLowest30Days,
    ).toBe(
      "lower",
    );

    expect(
      result.differenceVsLowest30DaysPln,
    ).toBeCloseTo(
      10,
      10,
    );

    expect(
      result.discountVsLowest30DaysPercent,
    ).toBeCloseTo(
      11.11111111,
      8,
    );
  });

  it("wykrywa cenę promocyjną wyższą od regularnej", () => {
    const result =
      calculatePromotionMeter({
        regularPricePln:
          10,

        promotionalPricePln:
          12,

        quantity:
          1,
      });

    expect(
      result.rating,
    ).toBe(
      "worse",
    );

    expect(
      result.discountPercent,
    ).toBeCloseTo(
      -20,
      10,
    );
  });

  it("odrzuca nieprawidłową liczbę sztuk", () => {
    expect(
      () =>
        calculatePromotionMeter({
          regularPricePln:
            10,

          promotionalPricePln:
            8,

          quantity:
            0,
        }),
    ).toThrow();
  });
});
