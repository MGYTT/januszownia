export interface JanuszometerAnswer {
  label: string;
  points: number;
}

export interface JanuszometerQuestion {
  id: string;
  question: string;
  answers: JanuszometerAnswer[];
}

export interface JanuszometerResult {
  score: number;
  maxScore: number;
  percentage: number;
  title: string;
  description: string;
}

export const januszometerQuestions: JanuszometerQuestion[] =
  [
    {
      id: "promotion",
      question:
        "Widzisz produkt 2+1 gratis. Co robisz?",
      answers: [
        {
          label:
            "Biorę bez zastanowienia.",
          points: 1,
        },
        {
          label:
            "Sprawdzam cenę jednostkową.",
          points: 3,
        },
        {
          label:
            "Nie potrzebuję, więc nie kupuję.",
          points: 2,
        },
        {
          label:
            "Kupuję trzy, bo gratis to gratis.",
          points: 0,
        },
      ],
    },
    {
      id: "fuel",
      question:
        "Tańsza stacja jest 10 km dalej.",
      answers: [
        {
          label:
            "Jadę natychmiast.",
          points: 1,
        },
        {
          label:
            "Najpierw liczę koszt dojazdu.",
          points: 3,
        },
        {
          label:
            "Tankuję tam, gdzie jestem.",
          points: 0,
        },
        {
          label:
            "Pytam szwagra.",
          points: 2,
        },
      ],
    },
    {
      id: "pizza",
      question:
        "Dwie pizze mają różne średnice i ceny.",
      answers: [
        {
          label:
            "Biorę większą średnicę.",
          points: 1,
        },
        {
          label:
            "Porównuję powierzchnię i cenę.",
          points: 3,
        },
        {
          label:
            "Biorę tańszą bez liczenia.",
          points: 0,
        },
        {
          label:
            "Zamawiam obie.",
          points: 2,
        },
      ],
    },
    {
      id: "receipt",
      question:
        "Po zakupach dostajesz paragon.",
      answers: [
        {
          label:
            "Wyrzucam od razu.",
          points: 0,
        },
        {
          label:
            "Sprawdzam, czy ceny się zgadzają.",
          points: 3,
        },
        {
          label:
            "Trzymam przez jakiś czas.",
          points: 2,
        },
        {
          label:
            "Patrzę tylko na sumę.",
          points: 1,
        },
      ],
    },
    {
      id: "free",
      question:
        "Możesz dostać coś za darmo, czego nie potrzebujesz.",
      answers: [
        {
          label:
            "Biorę. Za darmo to uczciwa cena.",
          points: 1,
        },
        {
          label:
            "Nie biorę, jeśli będzie tylko zawadzać.",
          points: 3,
        },
        {
          label:
            "Biorę dwa.",
          points: 0,
        },
        {
          label:
            "Pytam, czy można trzy.",
          points: 2,
        },
      ],
    },
    {
      id: "parking",
      question:
        "Parking kosztuje 8 zł, a 600 metrów dalej jest darmowy.",
      answers: [
        {
          label:
            "Płacę, wygoda kosztuje.",
          points: 0,
        },
        {
          label:
            "Idę 600 metrów.",
          points: 3,
        },
        {
          label:
            "Porównuję czas, pogodę i sytuację.",
          points: 2,
        },
        {
          label:
            "Krążę 40 minut szukając jeszcze lepszej opcji.",
          points: 1,
        },
      ],
    },
    {
      id: "repair",
      question:
        "Urządzenie przestaje działać.",
      answers: [
        {
          label:
            "Kupuję nowe.",
          points: 0,
        },
        {
          label:
            "Najpierw sprawdzam koszt naprawy.",
          points: 3,
        },
        {
          label:
            "Szwagier na pewno ogarnie.",
          points: 2,
        },
        {
          label:
            "Taśma izolacyjna i jedziemy.",
          points: 1,
        },
      ],
    },
    {
      id: "shopping",
      question:
        "W sklepie są dwa opakowania tego samego produktu.",
      answers: [
        {
          label:
            "Biorę większe, bo pewnie bardziej się opłaca.",
          points: 1,
        },
        {
          label:
            "Patrzę na cenę za kilogram lub litr.",
          points: 3,
        },
        {
          label:
            "Biorę tańsze opakowanie.",
          points: 0,
        },
        {
          label:
            "Liczyłem to kiedyś w głowie.",
          points: 2,
        },
      ],
    },
  ];

export function calculateJanuszometer(
  answers: number[],
): JanuszometerResult {
  const maxScore =
    januszometerQuestions.length * 3;

  if (
    answers.length !==
    januszometerQuestions.length
  ) {
    throw new RangeError(
      "Odpowiedz na wszystkie pytania.",
    );
  }

  for (const score of answers) {
    if (
      !Number.isInteger(score) ||
      score < 0 ||
      score > 3
    ) {
      throw new RangeError(
        "Nieprawidłowa odpowiedź.",
      );
    }
  }

  const score = answers.reduce(
    (sum, value) =>
      sum + value,
    0,
  );

  const percentage = Math.round(
    (score / maxScore) * 100,
  );

  if (score <= 5) {
    return {
      score,
      maxScore,
      percentage,
      title:
        "Turysta w Krainie Cebuli",
      description:
        "Masz jeszcze sporo do odkrycia. Promocja potrafi Cię zaskoczyć.",
    };
  }

  if (score <= 11) {
    return {
      score,
      maxScore,
      percentage,
      title:
        "Początkujący Cebularz",
      description:
        "Czasem liczysz, czasem działasz na wyczucie. Jest potencjał.",
    };
  }

  if (score <= 17) {
    return {
      score,
      maxScore,
      percentage,
      title:
        "Rozsądny Janusz",
      description:
        "Wiesz, że oszczędzanie zaczyna się od liczenia, a nie od kupowania wszystkiego na promocji.",
    };
  }

  if (score <= 21) {
    return {
      score,
      maxScore,
      percentage,
      title:
        "Zawodowy Kombinator",
      description:
        "Cena jednostkowa, koszt dojazdu i darmowy parking nie mają przed Tobą tajemnic.",
    };
  }

  return {
    score,
    maxScore,
    percentage,
    title:
      "Arcymistrz Cebuli",
    description:
      "Nie przepłacasz przez przypadek. Najpierw liczysz, potem podejmujesz decyzję.",
  };
}