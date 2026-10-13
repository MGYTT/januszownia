export type ToolStatus =
  | "available"
  | "planned";

export type ToolCategory =
  | "Jedzenie"
  | "Samochód"
  | "Zakupy"
  | "Dom"
  | "Pieniądze"
  | "Podróże";

export type ToolIconName =
  | "calculator"
  | "wallet"
  | "map-pin";

export interface ToolDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  href?: string;
  icon: ToolIconName;
  keywords: string[];
}

export const toolCatalog:
  ToolDefinition[] = [
    {
      slug:
        "pizza-na-cebule",

      title:
        "Pizza na Cebulę",

      shortTitle:
        "Pizza",

      description:
        "Porównuje pizze według powierzchni i ceny za 100 cm².",

      category:
        "Jedzenie",

      status:
        "available",

      href:
        "/narzedzia/pizza-na-cebule",

      icon:
        "calculator",

      keywords: [
        "pizza",
        "jedzenie",
        "średnica",
        "powierzchnia",
        "cena",
        "porównanie",
      ],
    },

    {
      slug:
        "oplaca-sie-tankowac",

      title:
        "OpłacaSięTankować?",

      shortTitle:
        "Tankowanie",

      description:
        "Sprawdza, czy dojazd do tańszej stacji naprawdę przyniesie oszczędność.",

      category:
        "Samochód",

      status:
        "available",

      href:
        "/narzedzia/oplaca-sie-tankowac",

      icon:
        "wallet",

      keywords: [
        "paliwo",
        "benzyna",
        "diesel",
        "tankowanie",
        "stacja",
        "samochód",
        "spalanie",
        "dojazd",
      ],
    },

    {
      slug:
        "cena-jednostkowa",

      title:
        "Cena Jednostkowa",

      shortTitle:
        "Cena jednostkowa",

      description:
        "Porównuje produkty według ceny za kilogram, litr albo sztukę.",

      category:
        "Zakupy",

      status:
        "available",

      href:
        "/narzedzia/cena-jednostkowa",

      icon:
        "calculator",

      keywords: [
        "zakupy",
        "cena",
        "kilogram",
        "litr",
        "gram",
        "produkt",
        "porównanie",
        "opakowanie",
      ],
    },

    {
      slug:
        "promocjometr",

      title:
        "Promocjometr",

      shortTitle:
        "Promocjometr",

      description:
        "Liczy rzeczywistą obniżkę, oszczędność dla wielu sztuk i porównuje cenę z podaną najniższą ceną z 30 dni.",

      category:
        "Zakupy",

      status:
        "available",

      href:
        "/narzedzia/promocjometr",

      icon:
        "wallet",

      keywords: [
        "promocja",
        "rabat",
        "obniżka",
        "zniżka",
        "zakupy",
        "cena",
        "30 dni",
        "najniższa cena",
        "oszczędność",
      ],
    },

    {
      slug:
        "pradozerca",

      title:
        "Prądożerca",

      shortTitle:
        "Prądożerca",

      description:
        "Oblicza zużycie energii i koszt pracy urządzenia na dzień, miesiąc i rok, również z trybem czuwania.",

      category:
        "Dom",

      status:
        "available",

      href:
        "/narzedzia/pradozerca",

      icon:
        "calculator",

      keywords: [
        "prąd",
        "energia",
        "wat",
        "waty",
        "kilowat",
        "kwh",
        "rachunek",
        "urządzenie",
        "czuwanie",
        "standby",
      ],
    },

    {
      slug:
        "prysznicometr",

      title:
        "Prysznicometr",

      shortTitle:
        "Prysznicometr",

      description:
        "Liczy zużycie wody, energię potrzebną do jej podgrzania oraz koszt prysznica, miesiąca i roku.",

      category:
        "Dom",

      status:
        "available",

      href:
        "/narzedzia/prysznicometr",

      icon:
        "calculator",

      keywords: [
        "woda",
        "prysznic",
        "kąpiel",
        "ogrzewanie",
        "podgrzewanie",
        "energia",
        "ciepła woda",
        "przepływ",
      ],
    },

    {
      slug:
        "grillometr",

      title:
        "Grillometr",

      shortTitle:
        "Grillometr",

      description:
        "Pomoże obliczyć ilość jedzenia i budżet grilla dla podanej liczby osób.",

      category:
        "Jedzenie",

      status:
        "planned",

      icon:
        "calculator",

      keywords: [
        "grill",
        "jedzenie",
        "impreza",
        "kiełbasa",
        "budżet",
      ],
    },

    {
      slug:
        "ile-na-to-robisz",

      title:
        "IleNaToRobisz?",

      shortTitle:
        "Godziny pracy",

      description:
        "Przeliczy cenę zakupu na liczbę godzin pracy potrzebnych do jego sfinansowania.",

      category:
        "Pieniądze",

      status:
        "planned",

      icon:
        "wallet",

      keywords: [
        "praca",
        "pensja",
        "zarobki",
        "godziny",
        "zakup",
      ],
    },

    {
      slug:
        "kalkulator-trasy",

      title:
        "Kalkulator Trasy Janusza",

      shortTitle:
        "Koszt trasy",

      description:
        "Policzy koszt paliwa, przejazdu oraz koszt podróży przypadający na pasażera.",

      category:
        "Podróże",

      status:
        "planned",

      icon:
        "map-pin",

      keywords: [
        "trasa",
        "podróż",
        "samochód",
        "paliwo",
        "koszt",
      ],
    },
  ];

export function getAvailableTools():
  ToolDefinition[] {
  return toolCatalog.filter(
    (
      tool,
    ) =>
      tool.status ===
      "available",
  );
}
