export type QuantityUnit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "szt";

export type QuantityDimension =
  | "mass"
  | "volume"
  | "count";

export interface ProductPriceInput {
  pricePln: number;
  quantity: number;
  unit: QuantityUnit;
}

export interface ProductPriceMetrics {
  pricePln: number;
  quantity: number;
  unit: QuantityUnit;
  dimension: QuantityDimension;
  baseQuantity: number;
  baseUnit: "kg" | "l" | "szt";
  pricePerBaseUnit: number;
}

export type UnitPriceWinner =
  | "a"
  | "b"
  | "tie";

export interface UnitPriceComparison {
  a: ProductPriceMetrics;
  b: ProductPriceMetrics;
  winner: UnitPriceWinner;
  betterValuePercent: number;
}

export function calculateUnitPrice(
  input: ProductPriceInput,
): ProductPriceMetrics {
  assertNonNegativeFinite(
    input.pricePln,
    "Cena produktu",
  );

  assertPositiveFinite(
    input.quantity,
    "Ilość produktu",
  );

  const normalized =
    normalizeQuantity(
      input.quantity,
      input.unit,
    );

  return {
    pricePln: input.pricePln,
    quantity: input.quantity,
    unit: input.unit,
    dimension: normalized.dimension,
    baseQuantity:
      normalized.baseQuantity,
    baseUnit: normalized.baseUnit,
    pricePerBaseUnit:
      input.pricePln /
      normalized.baseQuantity,
  };
}

export function compareUnitPrices(
  inputA: ProductPriceInput,
  inputB: ProductPriceInput,
): UnitPriceComparison {
  const a = calculateUnitPrice(
    inputA,
  );

  const b = calculateUnitPrice(
    inputB,
  );

  if (
    a.dimension !== b.dimension
  ) {
    throw new RangeError(
      "Porównywane produkty muszą używać zgodnych jednostek, np. g z kg albo ml z l.",
    );
  }

  const difference =
    a.pricePerBaseUnit -
    b.pricePerBaseUnit;

  if (
    Math.abs(difference) < 1e-9
  ) {
    return {
      a,
      b,
      winner: "tie",
      betterValuePercent: 0,
    };
  }

  const lower =
    Math.min(
      a.pricePerBaseUnit,
      b.pricePerBaseUnit,
    );

  const higher =
    Math.max(
      a.pricePerBaseUnit,
      b.pricePerBaseUnit,
    );

  const betterValuePercent =
    higher === 0
      ? 0
      : ((higher - lower) /
          higher) *
        100;

  return {
    a,
    b,
    winner:
      a.pricePerBaseUnit <
      b.pricePerBaseUnit
        ? "a"
        : "b",
    betterValuePercent,
  };
}

function normalizeQuantity(
  quantity: number,
  unit: QuantityUnit,
): {
  dimension: QuantityDimension;
  baseQuantity: number;
  baseUnit: "kg" | "l" | "szt";
} {
  switch (unit) {
    case "g":
      return {
        dimension: "mass",
        baseQuantity:
          quantity / 1000,
        baseUnit: "kg",
      };

    case "kg":
      return {
        dimension: "mass",
        baseQuantity: quantity,
        baseUnit: "kg",
      };

    case "ml":
      return {
        dimension: "volume",
        baseQuantity:
          quantity / 1000,
        baseUnit: "l",
      };

    case "l":
      return {
        dimension: "volume",
        baseQuantity: quantity,
        baseUnit: "l",
      };

    case "szt":
      return {
        dimension: "count",
        baseQuantity: quantity,
        baseUnit: "szt",
      };
  }
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