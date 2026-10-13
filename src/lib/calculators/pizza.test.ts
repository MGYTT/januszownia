import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculatePizza,
  comparePizzas,
  pizzaAreaCm2,
} from "./pizza";

describe("pizzaAreaCm2", () => {
  it("poprawnie oblicza pole pizzy 32 cm", () => {
    expect(
      pizzaAreaCm2(32),
    ).toBeCloseTo(
      804.247719318987,
      10,
    );
  });

  it("odrzuca średnicę równą zero", () => {
    expect(() =>
      pizzaAreaCm2(0),
    ).toThrow();
  });

  it("odrzuca średnicę ujemną", () => {
    expect(() =>
      pizzaAreaCm2(-30),
    ).toThrow();
  });
});

describe("calculatePizza", () => {
  it("oblicza cenę za 100 cm²", () => {
    const result = calculatePizza({
      diameterCm: 32,
      pricePln: 30,
    });

    expect(
      result.pricePer100Cm2,
    ).toBeCloseTo(
      3.7301939787,
      8,
    );
  });

  it("obsługuje pizzę darmową", () => {
    const result = calculatePizza({
      diameterCm: 30,
      pricePln: 0,
    });

    expect(
      result.pricePer100Cm2,
    ).toBe(0);
  });

  it("odrzuca cenę ujemną", () => {
    expect(() =>
      calculatePizza({
        diameterCm: 30,
        pricePln: -1,
      }),
    ).toThrow();
  });
});

describe("comparePizzas", () => {
  it("wybiera pizzę B jako korzystniejszą dla 32 cm / 30 zł i 40 cm / 45 zł", () => {
    const result = comparePizzas(
      {
        diameterCm: 32,
        pricePln: 30,
      },
      {
        diameterCm: 40,
        pricePln: 45,
      },
    );

    expect(result.winner).toBe("b");

    expect(
      result.betterValuePercent,
    ).toBeCloseTo(4, 8);
  });

  it("rozpoznaje identyczną opłacalność", () => {
    const result = comparePizzas(
      {
        diameterCm: 30,
        pricePln: 30,
      },
      {
        diameterCm: 30,
        pricePln: 30,
      },
    );

    expect(result.winner).toBe("tie");
    expect(
      result.betterValuePercent,
    ).toBe(0);
  });

  it("większa pizza przy proporcjonalnie dwukrotnie większej średnicy jest bardziej opłacalna przy dwukrotnej cenie", () => {
    const result = comparePizzas(
      {
        diameterCm: 30,
        pricePln: 30,
      },
      {
        diameterCm: 60,
        pricePln: 60,
      },
    );

    expect(result.winner).toBe("b");
  });
});