export interface ShowerCostInput {
  durationMinutes: number;
  flowLitersPerMinute: number;

  waterAndSewerPricePerM3Pln: number;

  coldWaterTemperatureC: number;
  showerTemperatureC: number;

  energyPricePerKwhPln: number;
  heatingEfficiencyPercent: number;

  showersPerMonth: number;
}

export interface ShowerCostResult {
  waterLitersPerShower: number;
  waterM3PerShower: number;

  temperatureRiseC: number;

  usefulHeatPerShowerKwh: number;
  purchasedEnergyPerShowerKwh: number;

  waterCostPerShowerPln: number;
  heatingCostPerShowerPln: number;
  totalCostPerShowerPln: number;

  waterLitersPerMonth: number;
  purchasedEnergyPerMonthKwh: number;

  waterCostPerMonthPln: number;
  heatingCostPerMonthPln: number;

  totalCostPerMonthPln: number;
  totalCostPerYearPln: number;
}

const WATER_SPECIFIC_HEAT_KJ_PER_KG_K =
  4.186;

const KJ_PER_KWH =
  3600;

export function calculateShowerCost(
  input: ShowerCostInput,
): ShowerCostResult {
  assertPositiveFinite(
    input.durationMinutes,
    "Czas prysznica",
  );

  assertPositiveFinite(
    input.flowLitersPerMinute,
    "Przepływ słuchawki",
  );

  assertNonNegativeFinite(
    input.waterAndSewerPricePerM3Pln,
    "Cena wody i ścieków",
  );

  assertFiniteRange(
    input.coldWaterTemperatureC,
    "Temperatura zimnej wody",
    -10,
    50,
  );

  assertFiniteRange(
    input.showerTemperatureC,
    "Temperatura prysznica",
    -10,
    70,
  );

  if (
    input.showerTemperatureC <=
    input.coldWaterTemperatureC
  ) {
    throw new RangeError(
      "Temperatura prysznica musi być wyższa od temperatury zimnej wody.",
    );
  }

  assertNonNegativeFinite(
    input.energyPricePerKwhPln,
    "Cena energii",
  );

  assertFiniteRange(
    input.heatingEfficiencyPercent,
    "Sprawność podgrzewania",
    0.01,
    100,
  );

  assertPositiveInteger(
    input.showersPerMonth,
    "Liczba pryszniców w miesiącu",
  );

  const waterLitersPerShower =
    input.durationMinutes *
    input.flowLitersPerMinute;

  const waterM3PerShower =
    waterLitersPerShower /
    1000;

  const temperatureRiseC =
    input.showerTemperatureC -
    input.coldWaterTemperatureC;

  const usefulHeatPerShowerKwh =
    (
      waterLitersPerShower *
      WATER_SPECIFIC_HEAT_KJ_PER_KG_K *
      temperatureRiseC
    ) /
    KJ_PER_KWH;

  const heatingEfficiency =
    input.heatingEfficiencyPercent /
    100;

  const purchasedEnergyPerShowerKwh =
    usefulHeatPerShowerKwh /
    heatingEfficiency;

  const waterCostPerShowerPln =
    waterM3PerShower *
    input.waterAndSewerPricePerM3Pln;

  const heatingCostPerShowerPln =
    purchasedEnergyPerShowerKwh *
    input.energyPricePerKwhPln;

  const totalCostPerShowerPln =
    waterCostPerShowerPln +
    heatingCostPerShowerPln;

  const waterLitersPerMonth =
    waterLitersPerShower *
    input.showersPerMonth;

  const purchasedEnergyPerMonthKwh =
    purchasedEnergyPerShowerKwh *
    input.showersPerMonth;

  const waterCostPerMonthPln =
    waterCostPerShowerPln *
    input.showersPerMonth;

  const heatingCostPerMonthPln =
    heatingCostPerShowerPln *
    input.showersPerMonth;

  const totalCostPerMonthPln =
    totalCostPerShowerPln *
    input.showersPerMonth;

  return {
    waterLitersPerShower,

    waterM3PerShower,

    temperatureRiseC,

    usefulHeatPerShowerKwh,

    purchasedEnergyPerShowerKwh,

    waterCostPerShowerPln,

    heatingCostPerShowerPln,

    totalCostPerShowerPln,

    waterLitersPerMonth,

    purchasedEnergyPerMonthKwh,

    waterCostPerMonthPln,

    heatingCostPerMonthPln,

    totalCostPerMonthPln,

    totalCostPerYearPln:
      totalCostPerMonthPln *
      12,
  };
}

function assertPositiveFinite(
  value: number,
  label: string,
): void {
  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new RangeError(
      `${label} musi być większa od zera.`,
    );
  }
}

function assertNonNegativeFinite(
  value: number,
  label: string,
): void {
  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new RangeError(
      `${label} nie może być ujemna.`,
    );
  }
}

function assertFiniteRange(
  value: number,
  label: string,
  min: number,
  max: number,
): void {
  if (
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    throw new RangeError(
      `${label} musi mieścić się w zakresie od ${min} do ${max}.`,
    );
  }
}

function assertPositiveInteger(
  value: number,
  label: string,
): void {
  if (
    !Number.isInteger(value) ||
    value <= 0 ||
    value > 1000
  ) {
    throw new RangeError(
      `${label} musi być liczbą całkowitą od 1 do 1000.`,
    );
  }
}