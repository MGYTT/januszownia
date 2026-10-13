import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateRouteCost,
} from "./route-cost";

describe("calculateRouteCost", () => {
  it("liczy przejazd w obie strony i koszt na osobę", () => {
    const result =
      calculateRouteCost({
        oneWayDistanceKm:
          100,

        roundTrip:
          true,

        consumptionLitersPer100Km:
          7,

        fuelPricePlnPerLiter:
          6.5,

        tollsPln:
          20,

        parkingPln:
          10,

        otherCostsPln:
          0,

        travelers:
          2,
      });

    expect(
      result.totalDistanceKm,
    ).toBeCloseTo(
      200,
      10,
    );

    expect(
      result.fuelNeededLiters,
    ).toBeCloseTo(
      14,
      10,
    );

    expect(
      result.fuelCostPln,
    ).toBeCloseTo(
      91,
      10,
    );

    expect(
      result.totalCostPln,
    ).toBeCloseTo(
      121,
      10,
    );

    expect(
      result.costPerTravelerPln,
    ).toBeCloseTo(
      60.5,
      10,
    );
  });

  it("liczy przejazd tylko w jedną stronę", () => {
    const result =
      calculateRouteCost({
        oneWayDistanceKm:
          50,

        roundTrip:
          false,

        consumptionLitersPer100Km:
          6,

        fuelPricePlnPerLiter:
          6,

        tollsPln:
          0,

        parkingPln:
          0,

        otherCostsPln:
          0,

        travelers:
          1,
      });

    expect(
      result.totalDistanceKm,
    ).toBe(
      50,
    );

    expect(
      result.fuelNeededLiters,
    ).toBeCloseTo(
      3,
      10,
    );

    expect(
      result.totalCostPln,
    ).toBeCloseTo(
      18,
      10,
    );
  });

  it("odrzuca zerową liczbę podróżnych", () => {
    expect(
      () =>
        calculateRouteCost({
          oneWayDistanceKm:
            100,

          roundTrip:
            true,

          consumptionLitersPer100Km:
            7,

          fuelPricePlnPerLiter:
            6,

          tollsPln:
            0,

          parkingPln:
            0,

          otherCostsPln:
            0,

          travelers:
            0,
        }),
    ).toThrow();
  });
});