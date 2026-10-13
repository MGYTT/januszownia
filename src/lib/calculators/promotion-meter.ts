export interface PromotionMeterInput {
  regularPricePln: number;
  promotionalPricePln: number;
  quantity: number;
  lowest30DaysPln?: number | null;
}

export type PromotionRating =
  | "worse"
  | "none"
  | "small"
  | "good"
  | "strong";

export type Lowest30DaysRelation =
  | "lower"
  | "same"
  | "higher";

export interface PromotionMeterResult {
  regularPricePln: number;
  promotionalPricePln: number;
  quantity: number;

  regularTotalPln: number;
  promotionalTotalPln: number;

  savingPerItemPln: number;
  totalSavingPln: number;

  discountPercent: number;
  rating: PromotionRating;

  lowest30DaysPln: number | null;
  relationToLowest30Days:
    Lowest30DaysRelation | null;
  differenceVsLowest30DaysPln:
    number | null;
  discountVsLowest30DaysPercent:
    number | null;
}

const EPSILON =
  1e-9;

export function calculatePromotionMeter(
  input: PromotionMeterInput,
): PromotionMeterResult {
  assertPositiveFinite(
    input.regularPricePln,
    "Cena regularna",
  );

  assertNonNegativeFinite(
    input.promotionalPricePln,
    "Cena promocyjna",
  );

  assertPositiveInteger(
    input.quantity,
    "Liczba sztuk",
  );

  const lowest30DaysPln =
    normalizeOptionalReferencePrice(
      input.lowest30DaysPln,
    );

  const savingPerItemPln =
    input.regularPricePln -
    input.promotionalPricePln;

  const totalSavingPln =
    savingPerItemPln *
    input.quantity;

  const discountPercent =
    (savingPerItemPln /
      input.regularPricePln) *
    100;

  const {
    relationToLowest30Days,
    differenceVsLowest30DaysPln,
    discountVsLowest30DaysPercent,
  } =
    compareWithLowest30Days(
      input.promotionalPricePln,
      lowest30DaysPln,
    );

  return {
    regularPricePln:
      input.regularPricePln,

    promotionalPricePln:
      input.promotionalPricePln,

    quantity:
      input.quantity,

    regularTotalPln:
      input.regularPricePln *
      input.quantity,

    promotionalTotalPln:
      input.promotionalPricePln *
      input.quantity,

    savingPerItemPln,

    totalSavingPln,

    discountPercent,

    rating:
      classifyPromotion(
        discountPercent,
      ),

    lowest30DaysPln,

    relationToLowest30Days,

    differenceVsLowest30DaysPln,

    discountVsLowest30DaysPercent,
  };
}

function compareWithLowest30Days(
  promotionalPricePln: number,
  lowest30DaysPln: number | null,
): {
  relationToLowest30Days:
    Lowest30DaysRelation | null;

  differenceVsLowest30DaysPln:
    number | null;

  discountVsLowest30DaysPercent:
    number | null;
} {
  if (
    lowest30DaysPln ===
    null
  ) {
    return {
      relationToLowest30Days:
        null,

      differenceVsLowest30DaysPln:
        null,

      discountVsLowest30DaysPercent:
        null,
    };
  }

  const difference =
    lowest30DaysPln -
    promotionalPricePln;

  const relation:
    Lowest30DaysRelation =
    Math.abs(
      difference,
    ) <
    EPSILON
      ? "same"
      : difference >
          0
        ? "lower"
        : "higher";

  return {
    relationToLowest30Days:
      relation,

    differenceVsLowest30DaysPln:
      difference,

    discountVsLowest30DaysPercent:
      (difference /
        lowest30DaysPln) *
      100,
  };
}

function classifyPromotion(
  discountPercent: number,
): PromotionRating {
  if (
    discountPercent <
    -EPSILON
  ) {
    return "worse";
  }

  if (
    Math.abs(
      discountPercent,
    ) <
    EPSILON
  ) {
    return "none";
  }

  if (
    discountPercent >=
    30
  ) {
    return "strong";
  }

  if (
    discountPercent >=
    15
  ) {
    return "good";
  }

  return "small";
}

function normalizeOptionalReferencePrice(
  value:
    number | null | undefined,
): number | null {
  if (
    value ===
      undefined ||
    value ===
      null
  ) {
    return null;
  }

  assertPositiveFinite(
    value,
    "Najniższa cena z 30 dni",
  );

  return value;
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
      0 ||
    value >
      10000
  ) {
    throw new RangeError(
      `${label} musi być liczbą całkowitą od 1 do 10000.`,
    );
  }
}
