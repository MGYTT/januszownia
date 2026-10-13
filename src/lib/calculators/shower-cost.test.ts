import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateShowerCost,
} from "./shower-cost";

describe("calculateShowerCost", () => {
  it("liczy koszt wody i energii jednego prysznica", () => {
    const result =
      calculateShowerCost({
        durationMinutes:
          10,

        flowLitersPerMinute:
          8,

        waterAndSewerPricePerM3Pln:
          15,

        coldWaterTemperatureC:
          10,

        showerTemperatureC:
          40,

        energyPricePerKwhPln:
          1,

        heatingEfficiencyPercent:
          100,

        showersPerMonth:
          30,
      });

    expect(
      result.waterLitersPerShower,
    ).toBeCloseTo(
      80,
      10,
    );

    expect(
      result.waterCostPerShowerPln,
    ).toBeCloseTo(
      1.2,
      10,
    );

    expect(
      result.usefulHeatPerShowerKwh,
    ).toBeCloseTo(
      2.7906666667,
      8,
    );

    expect(
      result.totalCostPerShowerPln,
    ).toBeCloseTo(
      3.9906666667,
      8,
    );
  });

  it("uwzględnia sprawność podgrzewania", () => {
    const ideal =
      calculateShowerCost({
        durationMinutes:
          10,

        flowLitersPerMinute:
          8,

        waterAndSewerPricePerM3Pln:
          0,

        coldWaterTemperatureC:
          10,

        showerTemperatureC:
          40,

        energyPricePerKwhPln:
          1,

        heatingEfficiencyPercent:
          100,

        showersPerMonth:
          1,
      });

    const lessEfficient =
      calculateShowerCost({
        durationMinutes:
          10,

        flowLitersPerMinute:
          8,

        waterAndSewerPricePerM3Pln:
          0,

        coldWaterTemperatureC:
          10,

        showerTemperatureC:
          40,

        energyPricePerKwhPln:
          1,

        heatingEfficiencyPercent:
          80,

        showersPerMonth:
          1,
      });

    expect(
      lessEfficient
        .purchasedEnergyPerShowerKwh,
    ).toBeGreaterThan(
      ideal
        .purchasedEnergyPerShowerKwh,
    );
  });

  it("odrzuca temperaturę prysznica niższą od temperatury zimnej wody", () => {
    expect(
      () =>
        calculateShowerCost({
          durationMinutes:
            5,

          flowLitersPerMinute:
            8,

          waterAndSewerPricePerM3Pln:
            10,

          coldWaterTemperatureC:
            20,

          showerTemperatureC:
            20,

          energyPricePerKwhPln:
            1,

          heatingEfficiencyPercent:
            90,

          showersPerMonth:
            30,
        }),
    ).toThrow();
  });
});
