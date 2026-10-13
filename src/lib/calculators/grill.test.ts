import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateGrillPlan,
} from "./grill";

const prices = {
  proteinPlnPerKg:
    40,

  sidesPlnPerKg:
    20,

  vegetablesPlnPerKg:
    15,

  breadPlnPerKg:
    10,

  drinksPlnPerLiter:
    5,

  charcoalPlnPerKg:
    8,
};

describe("calculateGrillPlan", () => {
  it("liczy plan dla dorosłych i dzieci", () => {
    const result =
      calculateGrillPlan({
        adults:
          4,

        children:
          2,

        appetite:
          "normal",

        prices,
      });

    expect(
      result.guests,
    ).toBe(
      6,
    );

    expect(
      result.guestEquivalents,
    ).toBeCloseTo(
      5.2,
      10,
    );

    expect(
      result.protein.quantity,
    ).toBeCloseTo(
      1.82,
      10,
    );

    expect(
      result.drinks.quantity,
    ).toBeCloseTo(
      6.24,
      10,
    );

    expect(
      result.charcoal.quantity,
    ).toBeCloseTo(
      2,
      10,
    );
  });

  it("zwiększa jedzenie dla dużego apetytu", () => {
    const normal =
      calculateGrillPlan({
        adults:
          5,

        children:
          0,

        appetite:
          "normal",

        prices,
      });

    const hungry =
      calculateGrillPlan({
        adults:
          5,

        children:
          0,

        appetite:
          "hungry",

        prices,
      });

    expect(
      hungry.protein.quantity,
    ).toBeGreaterThan(
      normal.protein.quantity,
    );

    expect(
      hungry.sides.quantity,
    ).toBeGreaterThan(
      normal.sides.quantity,
    );

    expect(
      hungry.drinks.quantity,
    ).toBeCloseTo(
      normal.drinks.quantity,
      10,
    );
  });

  it("nie pozwala zaplanować grilla dla zera osób", () => {
    expect(
      () =>
        calculateGrillPlan({
          adults:
            0,

          children:
            0,

          appetite:
            "normal",

          prices,
        }),
    ).toThrow();
  });

  it("liczy budżet z cen podanych przez użytkownika", () => {
    const result =
      calculateGrillPlan({
        adults:
          2,

        children:
          0,

        appetite:
          "normal",

        prices,
      });

    expect(
      result.totalCostPln,
    ).toBeGreaterThan(
      0,
    );

    expect(
      result.costPerGuestPln,
    ).toBeCloseTo(
      result.totalCostPln /
        2,
      10,
    );
  });
});
