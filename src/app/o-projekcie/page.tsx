import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  getAvailableTools,
} from "@/lib/tools/catalog";

import {
  DEFAULT_REPUTATION_LEVELS,
} from "@/lib/reputation/levels";

export const metadata: Metadata = {
  title:
    "O projekcie",

  description:
    "Czym jest Januszownia, jak działają jej narzędzia, mapy i system społecznościowy oraz według jakich zasad rozwijamy portal.",
};

const projectPrinciples: {
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    icon:
      "calculator",

    title:
      "Najpierw użyteczność",

    description:
      "Każde narzędzie ma rozwiązywać konkretny problem: porównać koszt, policzyć opłacalność albo pomóc podjąć codzienną decyzję.",
  },

  {
    icon:
      "shield-check",

    title:
      "Jasne założenia",

    description:
      "Wynik ma dać się zrozumieć. Pokazujemy, co liczymy, czego nie liczymy i gdzie kończy się matematyka, a zaczyna interpretacja.",
  },

  {
    icon:
      "smile",

    title:
      "Humor bez przesady",

    description:
      "Januszowy charakter ma zapadać w pamięć, ale nie może zasłaniać formularza, wyniku ani ważnej informacji.",
  },

  {
    icon:
      "users",

    title:
      "Społeczność ma pomagać",

    description:
      "Nie budujemy chaotycznego feedu. Działania użytkowników mają przede wszystkim poprawiać dane, miejsca i wiarygodność portalu.",
  },
];

const currentModules: {
  icon: IconName;
  title: string;
  description: string;
  href: string;
  cta: string;
}[] = [
  {
    icon:
      "map-pin",

    title:
      "Mapa Cebularza",

    description:
      "Praktyczne miejsca są wyszukiwane z prawdziwej bazy. Publikacja przechodzi moderację, a aktualność może być później potwierdzana przez społeczność.",

    href:
      "/mapy",

    cta:
      "Otwórz mapy",
  },

  {
    icon:
      "calculator",

    title:
      "Kalkulatory i narzędzia",

    description:
      "Od ceny jednostkowej i kosztu trasy po Promocjometr, Prądożercę i Abonamentometr. Każde narzędzie ma własną logikę i jawne założenia.",

    href:
      "/narzedzia",

    cta:
      "Zobacz narzędzia",
  },

  {
    icon:
      "trophy",

    title:
      "Reputacja i osiągnięcia",

    description:
      "Cebuliony są powiązane ze zweryfikowanymi działaniami. Poziomy, osiągnięcia i ranking mają nagradzać realny wkład, a nie samo klikanie.",

    href:
      "/ranking",

    cta:
      "Zobacz ranking",
  },
];

const buildRules = [
  "Nie dokładamy funkcji tylko po to, żeby zwiększyć licznik opcji.",
  "Nie opieramy kalkulatorów na ukrytych, wymyślonych cenach — użytkownik podaje własne dane albo korzystamy z rzeczywistego źródła.",
  "Nie publikujemy społecznościowych danych bez procesu kontroli i jasnych zasad.",
  "Nie mieszamy humoru z bezpieczeństwem, prywatnością ani wynikiem obliczeń.",
];

export default function AboutPage() {
  const availableTools =
    getAvailableTools();

  const reputationLevelCount =
    DEFAULT_REPUTATION_LEVELS.length;

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-black text-brand-700">
              <Icon
                name="sparkles"
                className="h-4 w-4"
              />

              O projekcie
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Po co przepłacać,
              skoro można
              pojanuszować?
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
              Januszownia to portal do
              codziennego kombinowania
              w dobrym znaczeniu:
              porównywania kosztów,
              znajdowania przydatnych
              miejsc i podejmowania
              lepszych decyzji bez
              nadęcia.
            </p>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted sm:text-base">
              Humor nadaje charakter.
              Matematyka, dane i
              użyteczność mają zawsze
              pierwszeństwo.
            </p>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            <ProjectStat
              value={
                String(
                  availableTools.length,
                )
              }
              label="działających narzędzi"
              description="Liczba pochodzi bezpośrednio z aktualnego katalogu portalu."
            />

            <ProjectStat
              value={
                String(
                  reputationLevelCount,
                )
              }
              label="poziomów reputacji"
              description="Od Nowicjusza Cebuli do Mitu Januszowni."
            />

            <ProjectStat
              value="1"
              label="wspólny portal"
              description="Mapy, narzędzia i społeczność rozwijamy jako jeden spójny produkt."
            />
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Zasady"
            title="Januszowo nie znaczy byle jak."
            description="Portal może żartować z cebuli, paragonów i kombinowania, ale sposób liczenia i obchodzenia się z danymi ma być profesjonalny."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {projectPrinciples.map(
              (
                principle,
              ) => (
                <PrincipleCard
                  key={
                    principle.title
                  }
                  icon={
                    principle.icon
                  }
                  title={
                    principle.title
                  }
                >
                  {
                    principle.description
                  }
                </PrincipleCard>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Co już działa"
            title="To nie jest już tylko plan na przyszłość."
            description="Najważniejsze moduły mają już działające fundamenty. Rozwijamy je dalej zamiast zastępować makietami i fikcyjnymi rekordami."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {currentModules.map(
              (
                module,
              ) => (
                <ModuleCard
                  key={
                    module.title
                  }
                  icon={
                    module.icon
                  }
                  title={
                    module.title
                  }
                  description={
                    module.description
                  }
                  href={
                    module.href
                  }
                  cta={
                    module.cta
                  }
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
                Jak rozwijamy portal
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Najpierw fundament,
                potem kolejne cebule.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-muted">
                Duża liczba funkcji ma
                sens tylko wtedy, gdy
                użytkownik nie czuje,
                że trafił do katalogu
                przypadkowych
                miniaplikacji.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                Dlatego wspólne są:
                nawigacja, wygląd,
                konta, dane, zasady
                moderacji i sposób
                prezentowania wyniku.
              </p>
            </div>

            <div className="space-y-3">
              <RoadmapStep
                number="01"
                title="Problem"
              >
                Najpierw ustalamy,
                jaką realną decyzję
                użytkownik chce
                podjąć.
              </RoadmapStep>

              <RoadmapStep
                number="02"
                title="Model i dane"
              >
                Definiujemy wzór,
                dane wejściowe,
                walidację i granice
                odpowiedzialności
                narzędzia.
              </RoadmapStep>

              <RoadmapStep
                number="03"
                title="Interfejs"
              >
                Formularz ma działać
                dobrze przede wszystkim
                na telefonie i nie
                wymagać instrukcji
                obsługi.
              </RoadmapStep>

              <RoadmapStep
                number="04"
                title="Weryfikacja"
              >
                Dopiero potem
                dokładamy testy,
                moderację, źródła,
                aktualność i kolejne
                integracje.
              </RoadmapStep>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
                Cebuliony
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Reputacja ma wynikać
                z wkładu, nie z
                klikania.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-muted">
                Punkty reputacji są
                związane ze
                zweryfikowanymi
                działaniami. Ranking
                nie ma być
                wyścigiem aktywności
                dla samej aktywności.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                Publiczny ranking i
                publiczny profil są
                ustawieniami
                dobrowolnymi.
                Użytkownik nie musi
                wystawiać swojej
                aktywności na widok
                publiczny.
              </p>
            </div>

            <div className="rounded-[2rem] border border-line bg-canvas p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
                  <Icon
                    name="trophy"
                    className="h-5 w-5"
                  />
                </div>

                <div>
                  <h3 className="font-black">
                    Co może budować
                    reputację?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    Przede wszystkim
                    działania, które
                    zostały sprawdzone
                    i rzeczywiście
                    pomagają innym:
                    zaakceptowane
                    miejsca, poprawne
                    zgłoszenia i
                    kolejne
                    wartościowe
                    wkłady rozwijane
                    wraz z portalem.
                  </p>
                </div>
              </div>

              <Link
                href="/ranking"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-button bg-white px-4 py-2.5 text-sm font-black text-brand-700 shadow-sm transition hover:bg-brand-50"
              >
                Ranking Cebularzy

                <Icon
                  name="arrow-right"
                  className="h-4 w-4"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Czego pilnujemy"
            title="Kilka rzeczy, których nie chcemy zepsuć."
            description="Rozwój ma zwiększać wartość portalu, a nie tylko jego rozmiar."
          />

          <div className="mt-8 overflow-hidden rounded-[2rem] border border-line bg-white">
            {buildRules.map(
              (
                rule,
                index,
              ) => (
                <div
                  key={
                    rule
                  }
                  className={[
                    "flex gap-4 px-5 py-5 sm:px-6",
                    index <
                    buildRules.length -
                      1
                      ? "border-b border-line"
                      : "",
                  ].join(
                    " ",
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <Icon
                      name="check"
                      className="h-4 w-4"
                    />
                  </div>

                  <p className="pt-1 text-sm font-semibold leading-6 text-ink sm:text-base">
                    {rule}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-brand-900">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-200">
                Januszownia
              </p>

              <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Najlepiej sprawdzić
                projekt w praktyce.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-brand-100">
                Wejdź w narzędzia,
                policz własny przypadek
                albo zobacz, jakie
                miejsca są już na mapie.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/narzedzia"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-white px-5 py-3 font-black text-brand-900 transition hover:bg-brand-50"
              >
                Narzędzia

                <Icon
                  name="calculator"
                  className="h-4 w-4"
                />
              </Link>

              <Link
                href="/mapy"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-brand-700 px-5 py-3 font-black text-white transition hover:bg-brand-800"
              >
                Mapa Cebularza

                <Icon
                  name="map-pin"
                  className="h-4 w-4"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectStat({
  value,
  label,
  description,
}: {
  value:
    string;

  label:
    string;

  description:
    string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-canvas p-5">
      <p className="text-3xl font-black tracking-[-0.03em] text-brand-800">
        {value}
      </p>

      <p className="mt-1 font-black text-ink">
        {label}
      </p>

      <p className="mt-2 text-xs leading-5 text-muted">
        {description}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function PrincipleCard({
  icon,
  title,
  children,
}: {
  icon:
    IconName;

  title:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <article className="rounded-[1.75rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={
            icon
          }
          className="h-5 w-5"
        />
      </div>

      <h3 className="mt-5 text-lg font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {children}
      </p>
    </article>
  );
}

function ModuleCard({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon:
    IconName;

  title:
    string;

  description:
    string;

  href:
    string;

  cta:
    string;
}) {
  return (
    <article className="flex min-h-[290px] flex-col rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon
          name={
            icon
          }
          className="h-6 w-6"
        />
      </div>

      <h3 className="mt-5 text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-muted">
        {description}
      </p>

      <Link
        href={
          href
        }
        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-black text-brand-700 hover:underline"
      >
        {cta}

        <Icon
          name="arrow-right"
          className="h-4 w-4"
        />
      </Link>
    </article>
  );
}

function RoadmapStep({
  number,
  title,
  children,
}: {
  number:
    string;

  title:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 rounded-[1.5rem] border border-line bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xs font-black text-brand-700">
        {number}
      </div>

      <div>
        <h3 className="font-black">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-muted">
          {children}
        </p>
      </div>
    </div>
  );
}