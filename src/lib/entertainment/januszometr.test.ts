import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateJanuszometer,
  januszometerQuestions,
} from "./januszometr";

describe("calculateJanuszometer", () => {
  it("zwraca 100% dla maksymalnego wyniku", () => {
    const answers =
      januszometerQuestions.map(
        () => 3,
      );

    const result =
      calculateJanuszometer(
        answers,
      );

    expect(result.score).toBe(
      24,
    );

    expect(
      result.percentage,
    ).toBe(100);

    expect(result.title).toBe(
      "Arcymistrz Cebuli",
    );
  });

  it("zwraca 0% dla wyniku zerowego", () => {
    const answers =
      januszometerQuestions.map(
        () => 0,
      );

    const result =
      calculateJanuszometer(
        answers,
      );

    expect(result.score).toBe(
      0,
    );

    expect(
      result.percentage,
    ).toBe(0);
  });

  it("wymaga odpowiedzi na każde pytanie", () => {
    expect(() =>
      calculateJanuszometer([
        1,
        2,
      ]),
    ).toThrow();
  });

  it("odrzuca wynik spoza zakresu", () => {
    const answers =
      januszometerQuestions.map(
        () => 3,
      );

    answers[0] = 4;

    expect(() =>
      calculateJanuszometer(
        answers,
      ),
    ).toThrow();
  });
});