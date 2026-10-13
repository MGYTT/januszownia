export interface PowerCostInput {
  activePowerWatts: number;
  activeHoursPerDay: number;
  standbyPowerWatts: number;
  daysPerMonth: number;
  electricityPricePerKwhPln: number;
}

export interface PowerCostResult {
  activeEnergyPerDayKwh: number;
  standbyEnergyPerDayKwh: number;
  totalEnergyPerDayKwh: number;

  activeEnergyPerMonthKwh: number;
  standbyEnergyPerMonthKwh: number;
  totalEnergyPerMonthKwh: number;

  totalEnergyPerYearKwh: number;

  activeCostPerMonthPln: number;
  standbyCostPerMonthPln: number;
  totalCostPerMonthPln: number;
  totalCostPerYearPln: number;

  standbySharePercent: number;
}

export function calculatePowerCost(
  input: PowerCostInput,
): PowerCostResult {
  assertPositiveFinite(
    input.activePowerWatts,
    "Moc urządzenia",
  );

  assertRange(
    input.activeHoursPerDay,
    "Czas pracy dziennie",
    0,
    24,
  );

  assertNonNegativeFinite(
    input.standbyPowerWatts,
    "Moc w trybie czuwania",
  );

  assertIntegerRange(
    input.daysPerMonth,
    "Liczba dni w miesiącu",
    1,
    31,
  );

  assertNonNegativeFinite(
    input.electricityPricePerKwhPln,
    "Cena energii",
  );

  const standbyHoursPerDay =
    24 -
    input.activeHoursPerDay;

  const activeEnergyPerDayKwh =
    (input.activePowerWatts /
      1000) *
    input.activeHoursPerDay;

  const standbyEnergyPerDayKwh =
    (input.standbyPowerWatts /
      1000) *
    standbyHoursPerDay;

  const totalEnergyPerDayKwh =
    activeEnergyPerDayKwh +
    standbyEnergyPerDayKwh;

  const activeEnergyPerMonthKwh =
    activeEnergyPerDayKwh *
    input.daysPerMonth;

  const standbyEnergyPerMonthKwh =
    standbyEnergyPerDayKwh *
    input.daysPerMonth;

  const totalEnergyPerMonthKwh =
    activeEnergyPerMonthKwh +
    standbyEnergyPerMonthKwh;

  const totalEnergyPerYearKwh =
    totalEnergyPerMonthKwh *
    12;

  const activeCostPerMonthPln =
    activeEnergyPerMonthKwh *
    input.electricityPricePerKwhPln;

  const standbyCostPerMonthPln =
    standbyEnergyPerMonthKwh *
    input.electricityPricePerKwhPln;

  const totalCostPerMonthPln =
    totalEnergyPerMonthKwh *
    input.electricityPricePerKwhPln;

  const totalCostPerYearPln =
    totalEnergyPerYearKwh *
    input.electricityPricePerKwhPln;

  const standbySharePercent =
    totalEnergyPerMonthKwh >
    0
      ? (standbyEnergyPerMonthKwh /
          totalEnergyPerMonthKwh) *
        100
      : 0;

  return {
    activeEnergyPerDayKwh,

    standbyEnergyPerDayKwh,

    totalEnergyPerDayKwh,

    activeEnergyPerMonthKwh,

    standbyEnergyPerMonthKwh,

    totalEnergyPerMonthKwh,

    totalEnergyPerYearKwh,

    activeCostPerMonthPln,

    standbyCostPerMonthPln,

    totalCostPerMonthPln,

    totalCostPerYearPln,

    standbySharePercent,
  };
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
      `${label} musi być większa od zera.`,
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
      `${label} nie może być ujemna.`,
    );
  }
}

function assertRange(
  value: number,
  label: string,
  min: number,
  max: number,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <
      min ||
    value >
      max
  ) {
    throw new RangeError(
      `${label} musi mieścić się w zakresie od ${min} do ${max}.`,
    );
  }
}

function assertIntegerRange(
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
      `${label} musi być liczbą całkowitą od ${min} do ${max}.`,
    );
  }
}
