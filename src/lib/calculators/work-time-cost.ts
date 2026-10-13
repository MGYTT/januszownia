export interface WorkTimeCostInput {
  itemPricePln: number;
  monthlyNetIncomePln: number;
  monthlyWorkHours: number;
  workdayHours: number;
}

export interface WorkTimeCostResult {
  hourlyNetIncomePln: number;
  minuteNetIncomePln: number;

  workHoursRequired: number;
  workMinutesRequired: number;
  workdaysRequired: number;

  monthlyIncomeSharePercent: number;
  remainingMonthlyIncomePln: number;
}

export function calculateWorkTimeCost(
  input: WorkTimeCostInput,
): WorkTimeCostResult {
  assertNonNegativeFinite(
    input.itemPricePln,
    "Cena zakupu",
  );

  assertPositiveFinite(
    input.monthlyNetIncomePln,
    "Miesięczny dochód netto",
  );

  assertPositiveFinite(
    input.monthlyWorkHours,
    "Liczba godzin pracy w miesiącu",
  );

  if (
    input.monthlyWorkHours >
    744
  ) {
    throw new RangeError(
      "Liczba godzin pracy w miesiącu nie może przekraczać 744.",
    );
  }

  assertPositiveFinite(
    input.workdayHours,
    "Długość dnia pracy",
  );

  if (
    input.workdayHours >
    24
  ) {
    throw new RangeError(
      "Długość dnia pracy nie może przekraczać 24 godzin.",
    );
  }

  const hourlyNetIncomePln =
    input.monthlyNetIncomePln /
    input.monthlyWorkHours;

  const minuteNetIncomePln =
    hourlyNetIncomePln /
    60;

  const workHoursRequired =
    input.itemPricePln /
    hourlyNetIncomePln;

  const workMinutesRequired =
    workHoursRequired *
    60;

  const workdaysRequired =
    workHoursRequired /
    input.workdayHours;

  const monthlyIncomeSharePercent =
    (input.itemPricePln /
      input.monthlyNetIncomePln) *
    100;

  return {
    hourlyNetIncomePln,

    minuteNetIncomePln,

    workHoursRequired,

    workMinutesRequired,

    workdaysRequired,

    monthlyIncomeSharePercent,

    remainingMonthlyIncomePln:
      input.monthlyNetIncomePln -
      input.itemPricePln,
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
      \`\${label} musi być większa od zera.\`,
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
      \`\${label} nie może być ujemna.\`,
    );
  }
}
