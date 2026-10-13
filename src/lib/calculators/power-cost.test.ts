import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculatePowerCost,
} from "./power-cost";

describe("calculatePowerCost", () => {
  it("liczy koszt aktywnego użycia i czuwania", () => {
    const result =
      calculatePowerCost({
        activePowerWatts:
          1000,

        activeHoursPerDay:
          2,

        standbyPowerWatts:
          5,

        daysPerMonth:
          30,

        electricityPricePerKwhPln:
          1,
      });

    expect(
      result.activeEnergyPerMonthKwh,
    ).toBeCloseTo(
      60,
      10,
    );

    expect(
      result.standbyEnergyPerMonthKwh,
    ).toBeCloseTo(
      3.3,
      10,
    );

    expect(
      result.totalCostPerMonthPln,
    ).toBeCloseTo(
      63.3,
      10,
    );

    expect(
      result.totalCostPerYearPln,
    ).toBeCloseTo(
      759.6,
      10,
    );
  });

  it("liczy urządzenie bez poboru w czuwaniu", () => {
    const result =
      calculatePowerCost({
        activePowerWatts:
          60,

        activeHoursPerDay:
          5,

        standbyPowerWatts:
          0,

        daysPerMonth:
          30,

        electricityPricePerKwhPln:
          1.2,
      });

    expect(
      result.totalEnergyPerMonthKwh,
    ).toBeCloseTo(
      9,
      10,
    );

    expect(
      result.standbySharePercent,
    ).toBe(
      0,
    );

    expect(
      result.totalCostPerMonthPln,
    ).toBeCloseTo(
      10.8,
      10,
    );
  });

  it("odrzuca czas pracy przekraczający dobę", () => {
    expect(
      () =>
        calculatePowerCost({
          activePowerWatts:
            100,

          activeHoursPerDay:
            25,

          standbyPowerWatts:
            0,

          daysPerMonth:
            30,

          electricityPricePerKwhPln:
            1,
        }),
    ).toThrow();
  });
});
