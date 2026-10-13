import type {
  ReputationLevel,
  ReputationLevelDefinition,
  ReputationLevelIcon,
  ReputationLevelTier,
} from "@/lib/reputation/types";

interface ReputationLevelSeed {
  code: string;

  name: string;

  description: string;

  minPoints: number;

  tier:
    ReputationLevelTier;

  iconKey:
    ReputationLevelIcon;
}

/*
 * Lokalny katalog awaryjny.
 *
 * Źródłem prawdy dla aplikacji pozostaje
 * public.reputation_levels w Supabase.
 *
 * Ten katalog istnieje po to, aby:
 *
 * 1. starsze komponenty wywołujące
 *    getReputationLevel(points)
 *    nadal działały,
 *
 * 2. pojedynczy komponent nie wywracał
 *    całego buildu tylko dlatego, że
 *    nie otrzymał katalogu z bazy,
 *
 * 3. logika poziomów miała bezpieczny
 *    fallback zgodny z aktualną
 *    25-poziomową progresją.
 */
const DEFAULT_LEVEL_SEEDS:
  readonly ReputationLevelSeed[] = [
    {
      code:
        "nowicjusz",

      name:
        "Nowicjusz Cebuli",

      description:
        "Pierwszy krok w Januszowni. Każdy mistrz kiedyś zaczynał.",

      minPoints:
        0,

      tier:
        "sprout",

      iconKey:
        "tag",
    },

    {
      code:
        "pierwsza_luska",

      name:
        "Pierwsza Łuska",

      description:
        "Pierwsze zweryfikowane działania zaczynają budować Twoją reputację.",

      minPoints:
        25,

      tier:
        "sprout",

      iconKey:
        "tag",
    },

    {
      code:
        "lowca_grosza",

      name:
        "Łowca Grosza",

      description:
        "Wiesz już, że małe oszczędności potrafią zrobić dużą różnicę.",

      minPoints:
        60,

      tier:
        "sprout",

      iconKey:
        "wallet",
    },

    {
      code:
        "praktykant",

      name:
        "Cebulowy Praktykant",

      description:
        "Regularnie dokładasz coś wartościowego do Januszowni.",

      minPoints:
        110,

      tier:
        "sprout",

      iconKey:
        "users",
    },

    {
      code:
        "osiedlowy",

      name:
        "Osiedlowy Cebularz",

      description:
        "Twój wkład przestaje być przypadkowy i zaczyna być zauważalny.",

      minPoints:
        180,

      tier:
        "bronze",

      iconKey:
        "map-pin",
    },

    {
      code:
        "sprytny_gospodarz",

      name:
        "Sprytny Gospodarz",

      description:
        "Rozsądne kombinowanie wchodzi Ci w nawyk.",

      minPoints:
        275,

      tier:
        "bronze",

      iconKey:
        "wallet",
    },

    {
      code:
        "lowca_okazji",

      name:
        "Łowca Okazji",

      description:
        "Coraz częściej zostawiasz po sobie coś użytecznego dla innych.",

      minPoints:
        400,

      tier:
        "bronze",

      iconKey:
        "tag",
    },

    {
      code:
        "lokalny_kombinator",

      name:
        "Lokalny Kombinator",

      description:
        "Lokalna społeczność może już realnie korzystać z Twojego wkładu.",

      minPoints:
        575,

      tier:
        "bronze",

      iconKey:
        "route",
    },

    {
      code:
        "mistrz_paragonu",

      name:
        "Mistrz Paragonu",

      description:
        "Oszczędzanie i użyteczne dane zaczynają wyglądać jak fach.",

      minPoints:
        800,

      tier:
        "silver",

      iconKey:
        "wallet",
    },

    {
      code:
        "zawodowy_kombinator",

      name:
        "Zawodowy Kombinator",

      description:
        "To już nie przypadek. Masz solidną historię wartościowych działań.",

      minPoints:
        1100,

      tier:
        "silver",

      iconKey:
        "trophy",
    },

    {
      code:
        "straznik_portfela",

      name:
        "Strażnik Portfela",

      description:
        "Twój dorobek pokazuje konsekwencję, nie jednorazowy zryw.",

      minPoints:
        1500,

      tier:
        "silver",

      iconKey:
        "shield-check",
    },

    {
      code:
        "kartograf",

      name:
        "Kartograf Oszczędności",

      description:
        "Potrafisz łączyć dane, miejsca i praktyczne oszczędzanie.",

      minPoints:
        2000,

      tier:
        "silver",

      iconKey:
        "map-pin",
    },

    {
      code:
        "starszy_cebularz",

      name:
        "Starszy Cebularz",

      description:
        "Masz reputację osoby, której wkład warto zauważyć.",

      minPoints:
        2600,

      tier:
        "gold",

      iconKey:
        "users",
    },

    {
      code:
        "strateg",

      name:
        "Cebulowy Strateg",

      description:
        "Nie tylko oszczędzasz — robisz to metodycznie.",

      minPoints:
        3350,

      tier:
        "gold",

      iconKey:
        "route",
    },

    {
      code:
        "mistrz_cebuli",

      name:
        "Mistrz Cebuli",

      description:
        "Wysoki poziom reputacji zdobyty konsekwentnym wkładem.",

      minPoints:
        4300,

      tier:
        "gold",

      iconKey:
        "trophy",
    },

    {
      code:
        "wielki_mistrz",

      name:
        "Wielki Mistrz Cebuli",

      description:
        "Do tego poziomu nie dochodzi się kilkoma kliknięciami.",

      minPoints:
        5500,

      tier:
        "gold",

      iconKey:
        "sparkles",
    },

    {
      code:
        "arcymistrz",

      name:
        "Arcymistrz Cebuli",

      description:
        "Twoja historia działań staje się naprawdę imponująca.",

      minPoints:
        7000,

      tier:
        "platinum",

      iconKey:
        "trophy",
    },

    {
      code:
        "baron",

      name:
        "Baron Oszczędności",

      description:
        "Należysz do grona najbardziej wytrwałych Cebularzy.",

      minPoints:
        8800,

      tier:
        "platinum",

      iconKey:
        "wallet",
    },

    {
      code:
        "ksiaze",

      name:
        "Książę Cebularzy",

      description:
        "Masz ogromny, długo budowany wkład w społeczność.",

      minPoints:
        11000,

      tier:
        "platinum",

      iconKey:
        "users",
    },

    {
      code:
        "magnat",

      name:
        "Cebulowy Magnat",

      description:
        "Skala Twojej reputacji wymaga już naprawdę dużej konsekwencji.",

      minPoints:
        13750,

      tier:
        "platinum",

      iconKey:
        "sparkles",
    },

    {
      code:
        "marszalek",

      name:
        "Marszałek Januszowni",

      description:
        "Jesteś w ścisłej czołówce najbardziej zasłużonych użytkowników.",

      minPoints:
        17000,

      tier:
        "legendary",

      iconKey:
        "trophy",
    },

    {
      code:
        "hetman",

      name:
        "Hetman Cebuli",

      description:
        "Ogromny dorobek i wyjątkowo długa droga progresji.",

      minPoints:
        21000,

      tier:
        "legendary",

      iconKey:
        "shield-check",
    },

    {
      code:
        "wielki_strateg",

      name:
        "Wielki Strateg Januszowni",

      description:
        "Poziom dla użytkowników, którzy przez długi czas realnie budują portal.",

      minPoints:
        26000,

      tier:
        "legendary",

      iconKey:
        "route",
    },

    {
      code:
        "legenda",

      name:
        "Legenda Januszowni",

      description:
        "Wyjątkowo rzadki poziom dla najbardziej wytrwałych.",

      minPoints:
        32000,

      tier:
        "mythic",

      iconKey:
        "sparkles",
    },

    {
      code:
        "mit",

      name:
        "Mit Januszowni",

      description:
        "Najwyższy poziom reputacji. Cel długoterminowy, nie szybki achievement.",

      minPoints:
        40000,

      tier:
        "mythic",

      iconKey:
        "sparkles",
    },
  ];

export const DEFAULT_REPUTATION_LEVELS:
  readonly ReputationLevelDefinition[] =
  DEFAULT_LEVEL_SEEDS.map(
    (
      seed,
      index,
    ) => ({
      /*
       * ID w fallbacku jest wyłącznie
       * identyfikatorem lokalnym.
       *
       * Kod aplikacji nie powinien
       * używać tego ID do operacji
       * bazodanowych.
       */
      id:
        index + 1,

      order:
        index + 1,

      code:
        seed.code,

      name:
        seed.name,

      description:
        seed.description,

      minPoints:
        seed.minPoints,

      tier:
        seed.tier,

      iconKey:
        seed.iconKey,
    }),
  );

/*
 * `definitions` jest opcjonalne celowo.
 *
 * Nowy kod:
 *
 * getReputationLevel(
 *   points,
 *   levelsFromDatabase,
 * )
 *
 * Starszy kod:
 *
 * getReputationLevel(
 *   points,
 * )
 *
 * Obie wersje są poprawne.
 */
export function getReputationLevel(
  rawPoints: number,

  definitions:
    readonly ReputationLevelDefinition[] =
    DEFAULT_REPUTATION_LEVELS,
): ReputationLevel {
  if (
    definitions.length ===
    0
  ) {
    throw new Error(
      "Brakuje definicji poziomów reputacji.",
    );
  }

  const points =
    normalizePoints(
      rawPoints,
    );

  const levels =
    [...definitions].sort(
      (
        left,
        right,
      ) =>
        left.order -
        right.order,
    );

  let currentIndex =
    0;

  for (
    let index = 0;
    index <
    levels.length;
    index += 1
  ) {
    const level =
      levels[index];

    if (
      points >=
      level.minPoints
    ) {
      currentIndex =
        index;

      continue;
    }

    break;
  }

  const current =
    levels[
      currentIndex
    ];

  const next =
    levels[
      currentIndex + 1
    ] ??
    null;

  if (!next) {
    return {
      ...current,

      nextLevelOrder:
        null,

      nextLevelName:
        null,

      nextLevelPoints:
        null,

      pointsToNext:
        0,

      progressPercent:
        100,
    };
  }

  const range =
    next.minPoints -
    current.minPoints;

  const gained =
    points -
    current.minPoints;

  const progress =
    range > 0
      ? Math.round(
          (
            gained /
            range
          ) *
            100,
        )
      : 100;

  return {
    ...current,

    nextLevelOrder:
      next.order,

    nextLevelName:
      next.name,

    nextLevelPoints:
      next.minPoints,

    pointsToNext:
      Math.max(
        0,
        next.minPoints -
          points,
      ),

    progressPercent:
      clampProgress(
        progress,
      ),
  };
}

function normalizePoints(
  value: number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(
      value,
    ),
  );
}

function clampProgress(
  value: number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      value,
    ),
  );
}