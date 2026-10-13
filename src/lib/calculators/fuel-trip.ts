export interface FuelTripInput {
  nearPricePlnPerLiter: number;
  farPricePlnPerLiter: number;
  litersToBuy: number;
  extraDistanceKm: number;
  consumptionLitersPer100Km: number;
}

export interface FuelTripResult {
  grossSavingPln: number;
  extraFuelUsedLiters: number;
  travelCostPln: number;
  netSavingPln: number;
  breakEvenDifferencePlnPerLiter: number;
  effectiveSavingPlnPerLiter: number;
  worthIt: boolean;
}

export function calculateFuelTrip(
  input: FuelTripInput,
): FuelTripResult {
  assertNonNegativeFinite(
    input.nearPricePlnPerLiter,
    "Cena na bliższej stacji",
  );

  assertNonNegativeFinite(
    input.farPricePlnPerLiter,
    "Cena na dalszej stacji",
  );

  assertPositiveFinite(
    input.litersToBuy,
    "Liczba tankowanych litrów",
  );

  assertNonNegativeFinite(
    input.extraDistanceKm,
    "Dodatkowy dystans",
  );

  assertNonNegativeFinite(
    input.consumptionLitersPer100Km,
    "Spalanie",
  );

  const grossSavingPln =
    (input.nearPricePlnPerLiter -
      input.farPricePlnPerLiter) *
    input.litersToBuy;

  const extraFuelUsedLiters =
    (input.extraDistanceKm *
      input.consumptionLitersPer100Km) /
    100;

  /*
   * Dodatkowo spalone paliwo wyceniamy
   * po cenie bliższej stacji.
   *
   * Jest to jawne założenie modelu.
   * Nie próbujemy zgadywać historycznej
   * ceny paliwa znajdującego się już
   * w baku.
   */
  const travelCostPln =
    extraFuelUsedLiters *
    input.nearPricePlnPerLiter;

  const netSavingPln =
    grossSavingPln -
    travelCostPln;

  const breakEvenDifferencePlnPerLiter =
    travelCostPln /
    input.litersToBuy;

  const effectiveSavingPlnPerLiter =
    netSavingPln /
    input.litersToBuy;

  return {
    grossSavingPln,
    extraFuelUsedLiters,
    travelCostPln,
    netSavingPln,
    breakEvenDifferencePlnPerLiter,
    effectiveSavingPlnPerLiter,
    worthIt: netSavingPln > 1e-9,
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