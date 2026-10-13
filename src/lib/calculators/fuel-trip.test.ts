import {
  describe,
  expect,
  it,
} from "vitest";

import { calculateFuelTrip } from "./fuel-trip";

describe("calculateFuelTrip", () => {
  it("poprawnie uwzględnia koszt dodatkowego dojazdu", () => {
    const result =
      calculateFuelTrip({
        nearPricePlnPerLiter: 6.3,
        farPricePlnPerLiter: 6,
        litersToBuy: 50,
        extraDistanceKm: 20,
        consumptionLitersPer100Km: 7,
      });

    expect(
      result.grossSavingPln,
    ).toBeCloseTo(15, 10);

    expect(
      result.extraFuelUsedLiters,
    ).toBeCloseTo(1.4, 10);

    expect(
      result.travelCostPln,
    ).toBeCloseTo(8.82, 10);

    expect(
      result.netSavingPln,
    ).toBeCloseTo(6.18, 10);

    expect(
      result.breakEvenDifferencePlnPerLiter,
    ).toBeCloseTo(
      0.1764,
      10,
    );

    expect(result.worthIt).toBe(true);
  });

  it("wykrywa nieopłacalny dojazd", () => {
    const result =
      calculateFuelTrip({
        nearPricePlnPerLiter: 6.3,
        farPricePlnPerLiter: 6.2,
        litersToBuy: 30,
        extraDistanceKm: 30,
        consumptionLitersPer100Km: 8,
      });

    expect(
      result.netSavingPln,
    ).toBeLessThan(0);

    expect(result.worthIt).toBe(false);
  });

  it("obsługuje zerowy dodatkowy dystans", () => {
    const result =
      calculateFuelTrip({
        nearPricePlnPerLiter: 6.3,
        farPricePlnPerLiter: 6,
        litersToBuy: 40,
        extraDistanceKm: 0,
        consumptionLitersPer100Km: 7,
      });

    expect(
      result.travelCostPln,
    ).toBe(0);

    expect(
      result.netSavingPln,
    ).toBeCloseTo(12, 10);
  });

  it("odrzuca zerową ilość tankowanego paliwa", () => {
    expect(() =>
      calculateFuelTrip({
        nearPricePlnPerLiter: 6.3,
        farPricePlnPerLiter: 6,
        litersToBuy: 0,
        extraDistanceKm: 10,
        consumptionLitersPer100Km: 7,
      }),
    ).toThrow();
  });
});