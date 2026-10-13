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

  memeLine: string;
  description: string;
  whatYouGet: string;

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

      memeLine:
        "Bo 50 cm brzmi kozacko, dopóki nie policzysz ile płacisz za placek.",

      description:
        "Porównuje pizze według powierzchni i ceny za 100 cm², więc rozmiar przestaje robić wrażenie bez pokrycia.",

      whatYouGet:
        "Wiesz, która pizza daje najwięcej jedzenia za złotówkę.",

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
        "placek",
        "duża pizza",
        "mała pizza",
      ],
    },

    {
      slug:
        "oplaca-sie-tankowac",

      title:
        "OpłacaSięTankować?",

      shortTitle:
        "Tankowanie",

      memeLine:
        "Tańsze paliwo 8 km dalej? Spokojnie, najpierw odpalamy kalkulator, nie silnik.",

      description:
        "Sprawdza, czy dojazd do tańszej stacji faktycznie daje oszczędność po uwzględnieniu paliwa zużytego po drodze.",

      whatYouGet:
        "Wiesz, czy jedziesz po oszczędność, czy tylko po dodatkowe kilometry.",

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
        "tańsze paliwo",
        "oszczędność",
      ],
    },

    {
      slug:
        "cena-jednostkowa",

      title:
        "Cena Jednostkowa",

      shortTitle:
        "Cena jednostkowa",

      memeLine:
        "Większe opakowanie nie zawsze znaczy większy cebulowy sukces.",

      description:
        "Porównuje produkty według ceny za kilogram, litr albo sztukę, niezależnie od wielkości opakowania.",

      whatYouGet:
        "Wiesz, który produkt naprawdę jest tańszy w przeliczeniu na tę samą jednostkę.",

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
        "cena za kg",
        "cena za litr",
      ],
    },

    {
      slug:
        "promocjometr",

      title:
        "Promocjometr",

      shortTitle:
        "Promocjometr",

      memeLine:
        "Czerwona naklejka to jeszcze nie oszczędność. Czasem to tylko czerwony kartonik.",

      description:
        "Liczy rzeczywistą obniżkę, oszczędność dla wielu sztuk i pozwala porównać cenę z podaną najniższą ceną z 30 dni.",

      whatYouGet:
        "Wiesz, ile naprawdę oszczędzasz i czy procent na etykiecie robi robotę.",

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
        "procent",
        "okazja",
      ],
    },

    {
      slug:
        "pradozerca",

      title:
        "Prądożerca",

      shortTitle:
        "Prądożerca",

      memeLine:
        "Wyłączone, ale świeci dioda? Portfel już wie, że jednak nie całkiem wyłączone.",

      description:
        "Oblicza zużycie energii i koszt pracy urządzenia na dzień, miesiąc i rok, również z poborem w trybie czuwania.",

      whatYouGet:
        "Wiesz, ile urządzenie zjada kWh i złotówek, także wtedy, gdy tylko sobie czuwa.",

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
        "koszt prądu",
      ],
    },

    {
      slug:
        "prysznicometr",

      title:
        "Prysznicometr",

      shortTitle:
        "Prysznicometr",

      memeLine:
        "Jeszcze tylko minutka pod ciepłą wodą — powiedział człowiek osiem minut temu.",

      description:
        "Liczy zużycie wody, energię potrzebną do jej podgrzania oraz koszt jednego prysznica, miesiąca i roku.",

      whatYouGet:
        "Wiesz, ile kosztuje Twoje „jeszcze chwilkę” pod prysznicem.",

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
        "rachunek za wodę",
      ],
    },

    {
      slug:
        "grillometr",

      title:
        "Grillometr",

      shortTitle:
        "Grillometr",

      memeLine:
        "Lepiej wrócić z grilla z kiełbasą niż wracać do sklepu po kiełbasę w trakcie grilla.",

      description:
        "Szacuje ilość jedzenia, napojów, paliwa do grilla i budżet na podstawie liczby gości oraz cen wpisanych przez użytkownika.",

      whatYouGet:
        "Dostajesz praktyczną listę ilości i orientacyjny budżet na całą ekipę.",

      category:
        "Jedzenie",

      status:
        "available",

      href:
        "/narzedzia/grillometr",

      icon:
        "calculator",

      keywords: [
        "grill",
        "jedzenie",
        "impreza",
        "kiełbasa",
        "budżet",
        "goście",
        "napoje",
        "węgiel",
        "brykiet",
      ],
    },

    {
      slug:
        "ile-na-to-robisz",

      title:
        "IleNaToRobisz?",

      shortTitle:
        "Godziny pracy",

      memeLine:
        "Cena 2999 zł boli inaczej, gdy zobaczysz ją jako trzydzieści kilka godzin życia.",

      description:
        "Przelicza cenę zakupu na minuty, godziny i dni pracy na podstawie własnego dochodu netto.",

      whatYouGet:
        "Widzisz cenę nie tylko w złotówkach, ale też w czasie własnej pracy.",

      category:
        "Pieniądze",

      status:
        "available",

      href:
        "/narzedzia/ile-na-to-robisz",

      icon:
        "wallet",

      keywords: [
        "praca",
        "pensja",
        "zarobki",
        "godziny",
        "zakup",
        "czas pracy",
        "dochód",
        "netto",
        "ile pracuję",
      ],
    },

    {
      slug:
        "kalkulator-trasy",

      title:
        "Kalkulator Trasy Janusza",

      shortTitle:
        "Koszt trasy",

      memeLine:
        "„To tylko 200 km” brzmi taniej, zanim doliczysz powrót, autostradę i parking.",

      description:
        "Liczy paliwo, opłaty, parking, pełny koszt przejazdu oraz koszt przypadający na osobę.",

      whatYouGet:
        "Wiesz, ile naprawdę kosztuje wyjazd i jak uczciwie podzielić koszt między pasażerów.",

      category:
        "Podróże",

      status:
        "available",

      href:
        "/narzedzia/kalkulator-trasy",

      icon:
        "map-pin",

      keywords: [
        "trasa",
        "podróż",
        "samochód",
        "paliwo",
        "koszt",
        "parking",
        "autostrada",
        "pasażer",
        "wyjazd",
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
