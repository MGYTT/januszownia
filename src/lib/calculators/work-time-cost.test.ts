import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateWorkTimeCost,
} from "./work-time-cost";

describe("calculateWorkTimeCost", () => {
  it("przelicza cenę zakupu na godziny i dni pracy", () => {
    const result =
      calculateWorkTimeCost({
        itemPricePln:
          1000,

        monthlyNetIncomePln:
          8000,

        monthlyWorkHours:
          160,

        workdayHours:
          8,
      });

    expect(
      result.hourlyNetIncomePln,
    ).toBeCloseTo(
      50,
      10,
    );

    expect(
      result.workHoursRequired,
    ).toBeCloseTo(
      20,
      10,
    );

    expect(
      result.workdaysRequired,
    ).toBeCloseTo(
      2.5,
      10,
    );

    expect(
      result.monthlyIncomeSharePercent,
    ).toBeCloseTo(
      12.5,
      10,
    );
  });

  it("obsługuje zakup droższy niż miesięczny dochód", () => {
    const result =
      calculateWorkTimeCost({
        itemPricePln:
          12000,

        monthlyNetIncomePln:
          6000,

        monthlyWorkHours:
          160,

        workdayHours:
          8,
      });

    expect(
      result.monthlyIncomeSharePercent,
    ).toBeCloseTo(
      200,
      10,
    );

    expect(
      result.remainingMonthlyIncomePln,
    ).toBeCloseTo(
      -6000,
      10,
    );
  });

  it("pozwala policzyć darmowy zakup", () => {
    const result =
      calculateWorkTimeCost({
        itemPricePln:
          0,

        monthlyNetIncomePln:
          5000,

        monthlyWorkHours:
          160,

        workdayHours:
          8,
      });

    expect(
      result.workHoursRequired,
    ).toBe(
      0,
    );

    expect(
      result.workMinutesRequired,
    ).toBe(
      0,
    );
  });

  it("odrzuca zerowy dochód", () => {
    expect(
      () =>
        calculateWorkTimeCost({
          itemPricePln:
            100,

          monthlyNetIncomePln:
            0,

          monthlyWorkHours:
            160,

          workdayHours:
            8,
        }),
    ).toThrow();
  });
});
