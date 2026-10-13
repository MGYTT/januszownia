import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateUnitPrice,
  compareUnitPrices,
} from "./unit-price";

describe("calculateUnitPrice", () => {
  it("przelicza gramy na kilogramy", () => {
    const result =
      calculateUnitPrice({
        pricePln: 8.99,
        quantity: 500,
        unit: "g",
      });

    expect(
      result.baseQuantity,
    ).toBeCloseTo(0.5, 10);

    expect(
      result.pricePerBaseUnit,
    ).toBeCloseTo(17.98, 10);

    expect(result.baseUnit).toBe(
      "kg",
    );
  });

  it("przelicza mililitry na litry", () => {
    const result =
      calculateUnitPrice({
        pricePln: 4.99,
        quantity: 500,
        unit: "ml",
      });

    expect(
      result.baseQuantity,
    ).toBeCloseTo(0.5, 10);

    expect(
      result.pricePerBaseUnit,
    ).toBeCloseTo(9.98, 10);

    expect(result.baseUnit).toBe(
      "l",
    );
  });
});

describe("compareUnitPrices", () => {
  it("wybiera tańszy wariant po przeliczeniu ceny za kilogram", () => {
    const result =
      compareUnitPrices(
        {
          pricePln: 8.99,
          quantity: 500,
          unit: "g",
        },
        {
          pricePln: 12.49,
          quantity: 750,
          unit: "g",
        },
      );

    expect(result.winner).toBe(
      "b",
    );

    expect(
      result.a.pricePerBaseUnit,
    ).toBeCloseTo(17.98, 10);

    expect(
      result.b.pricePerBaseUnit,
    ).toBeCloseTo(
      16.6533333333,
      8,
    );

    expect(
      result.betterValuePercent,
    ).toBeCloseTo(
      7.37856878,
      7,
    );
  });

  it("pozwala porównać gramy z kilogramami", () => {
    const result =
      compareUnitPrices(
        {
          pricePln: 10,
          quantity: 500,
          unit: "g",
        },
        {
          pricePln: 20,
          quantity: 1,
          unit: "kg",
        },
      );

    expect(result.winner).toBe(
      "tie",
    );
  });

  it("odrzuca porównanie masy z objętością", () => {
    expect(() =>
      compareUnitPrices(
        {
          pricePln: 10,
          quantity: 500,
          unit: "g",
        },
        {
          pricePln: 10,
          quantity: 500,
          unit: "ml",
        },
      ),
    ).toThrow();
  });
});