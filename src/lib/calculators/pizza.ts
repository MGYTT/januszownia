export interface PizzaInput {
  diameterCm: number;
  pricePln: number;
}

export interface PizzaMetrics {
  diameterCm: number;
  pricePln: number;
  areaCm2: number;
  pricePer100Cm2: number;
}

export type PizzaWinner =
  | "a"
  | "b"
  | "tie";

export interface PizzaComparison {
  a: PizzaMetrics;
  b: PizzaMetrics;
  winner: PizzaWinner;

  /**
   * O ile procent niższy jest koszt 100 cm²
   * zwycięskiej pizzy względem droższej.
   */
  betterValuePercent: number;
}

export function pizzaAreaCm2(
  diameterCm: number,
): number {
  assertPositiveFinite(
    diameterCm,
    "Średnica pizzy",
  );

  const radiusCm = diameterCm / 2;

  return Math.PI * radiusCm ** 2;
}

export function calculatePizza(
  input: PizzaInput,
): PizzaMetrics {
  assertPositiveFinite(
    input.diameterCm,
    "Średnica pizzy",
  );

  assertNonNegativeFinite(
    input.pricePln,
    "Cena pizzy",
  );

  const areaCm2 = pizzaAreaCm2(
    input.diameterCm,
  );

  const pricePer100Cm2 =
    (input.pricePln / areaCm2) * 100;

  return {
    diameterCm: input.diameterCm,
    pricePln: input.pricePln,
    areaCm2,
    pricePer100Cm2,
  };
}

export function comparePizzas(
  inputA: PizzaInput,
  inputB: PizzaInput,
): PizzaComparison {
  const a = calculatePizza(inputA);
  const b = calculatePizza(inputB);

  const difference =
    a.pricePer100Cm2 -
    b.pricePer100Cm2;

  const epsilon = 1e-9;

  if (Math.abs(difference) < epsilon) {
    return {
      a,
      b,
      winner: "tie",
      betterValuePercent: 0,
    };
  }

  const lowerPrice =
    Math.min(
      a.pricePer100Cm2,
      b.pricePer100Cm2,
    );

  const higherPrice =
    Math.max(
      a.pricePer100Cm2,
      b.pricePer100Cm2,
    );

  const betterValuePercent =
    higherPrice === 0
      ? 0
      : ((higherPrice - lowerPrice) /
          higherPrice) *
        100;

  return {
    a,
    b,
    winner:
      a.pricePer100Cm2 <
      b.pricePer100Cm2
        ? "a"
        : "b",
    betterValuePercent,
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