export interface RouteCostInput {
  oneWayDistanceKm: number;
  roundTrip: boolean;

  consumptionLitersPer100Km: number;
  fuelPricePlnPerLiter: number;

  tollsPln: number;
  parkingPln: number;
  otherCostsPln: number;

  travelers: number;
}

export interface RouteCostResult {
  totalDistanceKm: number;

  fuelNeededLiters: number;
  fuelCostPln: number;

  additionalCostsPln: number;
  totalCostPln: number;

  costPerTravelerPln: number;
  costPerKmPln: number;

  fuelSharePercent: number;
}

export function calculateRouteCost(
  input: RouteCostInput,
): RouteCostResult {
  assertPositiveFinite(
    input.oneWayDistanceKm,
    "Dystans w jedną stronę",
  );

  assertPositiveFinite(
    input.consumptionLitersPer100Km,
    "Średnie spalanie",
  );

  assertNonNegativeFinite(
    input.fuelPricePlnPerLiter,
    "Cena paliwa",
  );

  assertNonNegativeFinite(
    input.tollsPln,
    "Opłaty drogowe",
  );

  assertNonNegativeFinite(
    input.parkingPln,
    "Parking",
  );

  assertNonNegativeFinite(
    input.otherCostsPln,
    "Inne koszty",
  );

  assertPositiveInteger(
    input.travelers,
    "Liczba osób",
  );

  if (
    input.travelers >
    100
  ) {
    throw new RangeError(
      "Liczba osób nie może przekraczać 100.",
    );
  }

  const totalDistanceKm =
    input.oneWayDistanceKm *
    (
      input.roundTrip
        ? 2
        : 1
    );

  const fuelNeededLiters =
    (
      totalDistanceKm *
      input.consumptionLitersPer100Km
    ) /
    100;

  const fuelCostPln =
    fuelNeededLiters *
    input.fuelPricePlnPerLiter;

  const additionalCostsPln =
    input.tollsPln +
    input.parkingPln +
    input.otherCostsPln;

  const totalCostPln =
    fuelCostPln +
    additionalCostsPln;

  return {
    totalDistanceKm,

    fuelNeededLiters,

    fuelCostPln,

    additionalCostsPln,

    totalCostPln,

    costPerTravelerPln:
      totalCostPln /
      input.travelers,

    costPerKmPln:
      totalCostPln /
      totalDistanceKm,

    fuelSharePercent:
      totalCostPln >
      0
        ? (
            fuelCostPln /
            totalCostPln
          ) *
          100
        : 0,
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

function assertPositiveInteger(
  value: number,
  label: string,
): void {
  if (
    !Number.isInteger(
      value,
    ) ||
    value <=
      0
  ) {
    throw new RangeError(
      `${label} musi być dodatnią liczbą całkowitą.`,
    );
  }
}