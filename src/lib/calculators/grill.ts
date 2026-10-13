export type GrillAppetite =
  | "light"
  | "normal"
  | "hungry";

export interface GrillPriceInput {
  proteinPlnPerKg: number;
  sidesPlnPerKg: number;
  vegetablesPlnPerKg: number;
  breadPlnPerKg: number;
  drinksPlnPerLiter: number;
  charcoalPlnPerKg: number;
}

export interface GrillInput {
  adults: number;
  children: number;
  appetite: GrillAppetite;
  prices: GrillPriceInput;
}

export interface GrillCategoryResult {
  quantity: number;
  unit:
    | "kg"
    | "l";
  unitPricePln: number;
  costPln: number;
}

export interface GrillResult {
  guests: number;
  guestEquivalents: number;
  appetiteMultiplier: number;

  protein: GrillCategoryResult;
  sides: GrillCategoryResult;
  vegetables: GrillCategoryResult;
  bread: GrillCategoryResult;
  drinks: GrillCategoryResult;
  charcoal: GrillCategoryResult;

  totalCostPln: number;
  costPerGuestPln: number;
}

const CHILD_EQUIVALENT =
  0.6;

const BASE_PROTEIN_KG =
  0.35;

const BASE_SIDES_KG =
  0.25;

const BASE_VEGETABLES_KG =
  0.2;

const BASE_BREAD_KG =
  0.15;

const BASE_DRINKS_LITERS =
  1.2;

const CHARCOAL_KG_PER_EQUIVALENT =
  0.35;

const MIN_CHARCOAL_KG =
  2;

export function calculateGrillPlan(
  input: GrillInput,
): GrillResult {
  assertGuestCount(
    input.adults,
    "Liczba dorosłych",
  );

  assertGuestCount(
    input.children,
    "Liczba dzieci",
  );

  const guests =
    input.adults +
    input.children;

  if (
    guests <=
    0
  ) {
    throw new RangeError(
      "Dodaj co najmniej jedną osobę.",
    );
  }

  assertPrices(
    input.prices,
  );

  const appetiteMultiplier =
    getAppetiteMultiplier(
      input.appetite,
    );

  const guestEquivalents =
    input.adults +
    input.children *
      CHILD_EQUIVALENT;

  const foodEquivalents =
    guestEquivalents *
    appetiteMultiplier;

  const proteinKg =
    foodEquivalents *
    BASE_PROTEIN_KG;

  const sidesKg =
    foodEquivalents *
    BASE_SIDES_KG;

  const vegetablesKg =
    foodEquivalents *
    BASE_VEGETABLES_KG;

  const breadKg =
    foodEquivalents *
    BASE_BREAD_KG;

  const drinksLiters =
    guestEquivalents *
    BASE_DRINKS_LITERS;

  const charcoalKg =
    Math.max(
      MIN_CHARCOAL_KG,
      guestEquivalents *
        CHARCOAL_KG_PER_EQUIVALENT,
    );

  const protein =
    createCategory(
      proteinKg,
      "kg",
      input.prices
        .proteinPlnPerKg,
    );

  const sides =
    createCategory(
      sidesKg,
      "kg",
      input.prices
        .sidesPlnPerKg,
    );

  const vegetables =
    createCategory(
      vegetablesKg,
      "kg",
      input.prices
        .vegetablesPlnPerKg,
    );

  const bread =
    createCategory(
      breadKg,
      "kg",
      input.prices
        .breadPlnPerKg,
    );

  const drinks =
    createCategory(
      drinksLiters,
      "l",
      input.prices
        .drinksPlnPerLiter,
    );

  const charcoal =
    createCategory(
      charcoalKg,
      "kg",
      input.prices
        .charcoalPlnPerKg,
    );

  const totalCostPln =
    protein.costPln +
    sides.costPln +
    vegetables.costPln +
    bread.costPln +
    drinks.costPln +
    charcoal.costPln;

  return {
    guests,

    guestEquivalents,

    appetiteMultiplier,

    protein,

    sides,

    vegetables,

    bread,

    drinks,

    charcoal,

    totalCostPln,

    costPerGuestPln:
      totalCostPln /
      guests,
  };
}

function createCategory(
  quantity: number,
  unit:
    | "kg"
    | "l",
  unitPricePln: number,
): GrillCategoryResult {
  return {
    quantity,
    unit,
    unitPricePln,

    costPln:
      quantity *
      unitPricePln,
  };
}

function getAppetiteMultiplier(
  appetite:
    GrillAppetite,
): number {
  switch (
    appetite
  ) {
    case "light":
      return 0.8;

    case "normal":
      return 1;

    case "hungry":
      return 1.25;
  }
}

function assertPrices(
  prices:
    GrillPriceInput,
): void {
  const entries:
    Array<
      [
        number,
        string,
      ]
    > = [
      [
        prices.proteinPlnPerKg,
        "Cena produktów głównych",
      ],
      [
        prices.sidesPlnPerKg,
        "Cena dodatków",
      ],
      [
        prices.vegetablesPlnPerKg,
        "Cena warzyw",
      ],
      [
        prices.breadPlnPerKg,
        "Cena pieczywa",
      ],
      [
        prices.drinksPlnPerLiter,
        "Cena napojów",
      ],
      [
        prices.charcoalPlnPerKg,
        "Cena węgla lub brykietu",
      ],
    ];

  for (
    const [
      value,
      label,
    ] of entries
  ) {
    if (
      !Number.isFinite(
        value,
      ) ||
      value <
        0
    ) {
      throw new RangeError(
        label + " nie może być ujemna.",
      );
    }
  }
}

function assertGuestCount(
  value: number,
  label: string,
): void {
  if (
    !Number.isInteger(
      value,
    ) ||
    value <
      0 ||
    value >
      200
  ) {
    throw new RangeError(
      label + " musi być liczbą całkowitą od 0 do 200.",
    );
  }
}
