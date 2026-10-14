import type {
  Metadata,
} from "next";

import Link from "next/link";

import type {
  ReactNode,
} from "react";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  DEFAULT_REPUTATION_LEVELS,
} from "@/lib/reputation/levels";

export const metadata: Metadata = {
  title:
    "Społeczność",

  description:
    "Społeczność Januszowni: dodawanie miejsc, potwierdzanie aktualności, zgłaszanie problemów, moderacja, Cebuliony, osiągnięcia i ranking.",
};

const communityActions: {
  icon: IconName;
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  href: string;
  cta: string;
}[] = [
  {
    icon:
      "map-pin",

    eyebrow:
      "Nowe miejsce",

    title:
      "Dodaj coś, czego brakuje na mapie",

    description:
      "Zalogowany użytkownik może wybrać kategorię, opisać miejsce, wskazać dokładny punkt na mapie i opcjonalnie podać źródło.",

    detail:
      "Nowy punkt nie pojawia się publicznie od razu. Najpierw trafia do kolejki moderacyjnej.",

    href:
      "/mapy/dodaj",

    cta:
      "Dodaj miejsce",
  },

  {
    icon:
      "check",

    eyebrow:
      "Aktualność",

    title:
      "Potwierdź, że miejsce nadal działa",

    description:
      "Na stronie opublikowanego miejsca możesz oznaczyć je jako aktualne albo wysłać sygnał, że informacje mogą być już nieaktualne.",

    detail:
      "Wymaga zalogowania. Jedno konto ma jeden aktualny głos dla danego miejsca i może później zmienić swoją odpowiedź.",

    href:
      "/mapy",

    cta:
      "Przejdź do mapy",
  },

  {
    icon:
      "shield-check",

    eyebrow:
      "Problem",

    title:
      "Zgłoś błąd do moderatorów",

    description:
      "Jeśli punkt jest zamknięty, ma błędną lokalizację, złe informacje, jest duplikatem albo wymaga innej poprawki, możesz wysłać formalne zgłoszenie.",

    detail:
      "Wymaga zalogowania. Raport trafia do osobnej kolejki moderacyjnej i samo zgłoszenie nie usuwa miejsca z mapy.",

    href:
      "/mapy",

    cta:
      "Znajdź miejsce",
  },

  {
    icon:
      "trophy",

    eyebrow:
      "Reputacja",

    title:
      "Buduj reputację użytecznym wkładem",

    description:
      "Cebuliony są powiązane ze zweryfikowanymi działaniami, a nie z liczbą kliknięć czy samym czasem spędzonym w portalu.",

    detail:
      "System reputacji rozpoznaje obecnie m.in. zatwierdzone miejsca i trafne zgłoszenia problemów.",

    href:
      "/ranking",

    cta:
      "Zobacz ranking",
  },
];

const processSteps = [
  {
    number:
      "01",

    title:
      "Zgłaszasz",

    description:
      "Podajesz konkretne dane. Przy nowym miejscu wskazujesz także dokładną lokalizację na mapie.",
  },

  {
    number:
      "02",

    title:
      "System waliduje",

    description:
      "Formularz i backend sprawdzają wymagane pola, format danych, aktywną kategorię oraz poprawność lokalizacji i źródła.",
  },

  {
    number:
      "03",

    title:
      "Moderator sprawdza",

    description:
      "Nowe miejsce albo formalny raport trafiają do prywatnej kolejki moderacyjnej zamiast automatycznie zmieniać dane publiczne.",
  },

  {
    number:
      "04",

    title:
      "Publikujemy albo poprawiamy",

    description:
      "Zatwierdzone nowe miejsce trafia na mapę. Trafny raport może zakończyć się poprawieniem i ponowną weryfikacją istniejącego punktu.",
  },

  {
    number:
      "05",

    title:
      "Dane żyją dalej",

    description:
      "Po publikacji zalogowani użytkownicy mogą nadal potwierdzać aktualność miejsca albo zgłaszać kolejne problemy.",
  },
];

const achievementAreas = [
  "Mapa",
  "Czujność",
  "Reputacja",
  "Wkład",
  "Wszechstronność",
];

export default function CommunityPage() {
  const reputationLevelCount =
    DEFAULT_REPUTATION_LEVELS.length;

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-black text-brand-700">
              <Icon
                name="users"
                className="h-4 w-4"
              />

              Społeczność Januszowni
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Mniej gadania.
              Więcej poprawiania
              danych.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
              Społeczność Januszowni
              nie jest zbudowana wokół
              nieskończonego feedu.
              Ma pomagać dodawać dobre
              miejsca, wychwytywać
              nieaktualne informacje
              i utrzymywać mapę w
              porządku.
            </p>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted sm:text-base">
              A jeśli ktoś robi to
              dobrze i regularnie,
              system reputacji potrafi
              to zauważyć. Cebula
              cebulą, ale wkład musi
              być prawdziwy.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/mapy/dodaj"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700"
              >
                <Icon
                  name="map-pin"
                  className="h-4 w-4"
                />

                Dodaj miejsce
              </Link>

              <Link
                href="/ranking"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-3 font-black text-ink transition hover:bg-canvas"
              >
                <Icon
                  name="trophy"
                  className="h-4 w-4 text-brand-700"
                />

                Ranking Cebularzy
              </Link>
            </div>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            <CommunityStat
              value="3"
              label="sposoby dbania o mapę"
              description="Dodawanie miejsc, potwierdzanie aktualności i formalne raporty."
            />

            <CommunityStat
              value={
                String(
                  reputationLevelCount,
                )
              }
              label="poziomów reputacji"
              description="Progresja od pierwszych działań aż do najwyższych rang."
            />

            <CommunityStat
              value="0"
              label="automatycznych publikacji"
              description="Nowe miejsca przechodzą przez moderację przed pojawieniem się na publicznej mapie."
            />
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Co możesz zrobić"
            title="Każda akcja ma konkretny cel."
            description="Nie trzeba być moderatorem, żeby poprawiać jakość Januszowni. Zwykłe konto ma kilka prostych sposobów na realny wkład."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {communityActions.map(
              (
                action,
              ) => (
                <CommunityActionCard
                  key={
                    action.title
                  }
                  {...action}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Od zgłoszenia do mapy"
            title="Nic ważnego nie powinno pojawiać się jednym kliknięciem."
            description="Nowe dane przechodzą przez przewidywalny proces. Dzięki temu społeczność pomaga rozwijać bazę, ale nie może bez kontroli nadpisywać informacji publicznych."
          />

          <div className="mt-9 grid gap-4 lg:grid-cols-5">
            {processSteps.map(
              (
                step,
              ) => (
                <ProcessStep
                  key={
                    step.number
                  }
                  number={
                    step.number
                  }
                  title={
                    step.title
                  }
                >
                  {
                    step.description
                  }
                </ProcessStep>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Dwa różne sygnały"
            title="„Może być nieaktualne” to nie to samo co raport."
            description="Rozdzielamy szybkie głosy społeczności od formalnych zgłoszeń, żeby zwykła obserwacja nie uruchamiała od razu ciężkiej moderacji."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <SignalCard
              icon="check"
              label="Szybki sygnał"
              title="Potwierdzenie aktualności"
              items={[
                "Dotyczy opublikowanego miejsca.",
                "Jedno konto ma jeden aktualny głos.",
                "Głos można później zmienić.",
                "Możesz wybrać „aktualne” albo „może być nieaktualne”.",
                "Sam sygnał nie usuwa miejsca z mapy.",
              ]}
            />

            <SignalCard
              icon="shield-check"
              label="Formalna ścieżka"
              title="Zgłoszenie problemu"
              items={[
                "Trafia do kolejki moderatorów.",
                "Ma konkretny powód: nieaktualne dane, zamknięcie, lokalizacja, błędne informacje, duplikat albo inny problem.",
                "Można dodać szczegółowy opis.",
                "To samo konto nie może mieć kilku jednocześnie otwartych raportów dla tego samego miejsca.",
                "Moderator może poprawić dane i zamknąć raport albo odrzucić zgłoszenie z uzasadnieniem.",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
                Cebuliony i reputacja
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Punkty za efekt,
                nie za klikanie.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-muted">
                Reputacja jest
                budowana przez
                zweryfikowane działania.
                W aktualnym systemie
                zdarzeniami reputacyjnymi
                są zatwierdzone miejsca
                oraz trafne raporty
                dotyczące istniejących
                punktów.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                Samo potwierdzenie
                aktualności jest ważne
                dla jakości danych, ale
                nie traktujemy każdego
                kliknięcia jak nagrody
                punktowej.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/ranking"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
                >
                  Ranking

                  <Icon
                    name="arrow-right"
                    className="h-4 w-4"
                  />
                </Link>

                <Link
                  href="/konto/osiagniecia"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-canvas"
                >
                  Osiągnięcia

                  <Icon
                    name="trophy"
                    className="h-4 w-4 text-brand-700"
                  />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-line bg-canvas p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
                <Icon
                  name="sparkles"
                  className="h-5 w-5"
                />
              </div>

              <h3 className="mt-5 text-xl font-black">
                Osiągnięcia nie są tylko ozdobą
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                System śledzi postęp w
                kilku obszarach wkładu.
                Zdobyte odznaki można
                później wyróżniać na
                publicznym profilu.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {achievementAreas.map(
                  (
                    area,
                  ) => (
                    <span
                      key={
                        area
                      }
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-black text-muted"
                    >
                      {area}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
                Prywatność
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Reputacja może być
                Twoja bez robienia z
                niej wystawy.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-muted">
                Publiczny profil i
                udział w publicznym
                rankingu są
                niezależnymi
                ustawieniami. Nie
                wymagamy publikowania
                profilu tylko dlatego,
                że ktoś pomaga
                społeczności.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <PrivacyCard
                icon="users"
                title="Co może być publiczne"
              >
                Nazwa wyświetlana,
                nick, Cebuliony,
                poziom oraz publiczne
                statystyki wkładu, jeśli
                użytkownik włączy
                odpowiednią widoczność.
              </PrivacyCard>

              <PrivacyCard
                icon="shield-check"
                title="Czego nie pokazujemy"
              >
                E-maila, danych
                logowania, pełnego
                ledgera reputacji ani
                prywatnych zgłoszeń
                użytkownika.
              </PrivacyCard>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/konto/publiczny-profil"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-brand-50"
            >
              Ustawienia publicznego profilu

              <Icon
                name="arrow-right"
                className="h-4 w-4 text-brand-700"
              />
            </Link>

            <Link
              href="/ranking"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-brand-50"
            >
              Ustawienia rankingu

              <Icon
                name="arrow-right"
                className="h-4 w-4 text-brand-700"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Świadomie tego nie robimy"
            title="Społeczność nie potrzebuje wszystkiego, co ma portal społecznościowy."
            description="Najpierw budujemy mechanizmy, które faktycznie poprawiają Januszownię."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <NotHereCard
              title="Brak feedu dla samego feedu"
            >
              Nie dokładamy strumienia
              postów tylko po to, żeby
              użytkownik przewijał
              ekran.
            </NotHereCard>

            <NotHereCard
              title="Brak automatycznej publikacji"
            >
              Nowy punkt nie trafia na
              mapę wyłącznie dlatego,
              że ktoś nacisnął
              „Wyślij”.
            </NotHereCard>

            <NotHereCard
              title="Brak punktów za spam"
            >
              Reputacja ma wynikać z
              zaakceptowanego,
              wartościowego wkładu, a
              nie z liczby wykonanych
              akcji.
            </NotHereCard>
          </div>
        </div>
      </section>

      <section className="bg-brand-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-200">
                Do roboty
              </p>

              <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Znalazłeś miejsce,
                którego jeszcze nie ma?
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-brand-100">
                Dodaj je z dokładną
                lokalizacją i możliwie
                konkretnym opisem.
                Resztę przeprowadzi
                proces weryfikacji.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/mapy/dodaj"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-white px-5 py-3 font-black text-brand-900 transition hover:bg-brand-50"
              >
                Dodaj miejsce

                <Icon
                  name="map-pin"
                  className="h-4 w-4"
                />
              </Link>

              <Link
                href="/mapy"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-brand-700 px-5 py-3 font-black text-white transition hover:bg-brand-800"
              >
                Sprawdź mapę

                <Icon
                  name="arrow-right"
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

function CommunityStat({
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

function CommunityActionCard({
  icon,
  eyebrow,
  title,
  description,
  detail,
  href,
  cta,
}: {
  icon:
    IconName;

  eyebrow:
    string;

  title:
    string;

  description:
    string;

  detail:
    string;

  href:
    string;

  cta:
    string;
}) {
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon
            name={
              icon
            }
            className="h-6 w-6"
          />
        </div>

        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-brand-800">
          działa
        </span>
      </div>

      <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-brand-700">
        {eyebrow}
      </p>

      <h3 className="mt-1 text-xl font-black tracking-[-0.02em]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-muted">
        {description}
      </p>

      <div className="mt-4 rounded-2xl bg-canvas p-4">
        <p className="text-xs font-semibold leading-5 text-muted">
          {detail}
        </p>
      </div>

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

function ProcessStep({
  number,
  title,
  children,
}: {
  number:
    string;

  title:
    string;

  children:
    ReactNode;
}) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-canvas p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-xs font-black text-white">
        {number}
      </div>

      <h3 className="mt-4 font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {children}
      </p>
    </article>
  );
}

function SignalCard({
  icon,
  label,
  title,
  items,
}: {
  icon:
    IconName;

  label:
    string;

  title:
    string;

  items:
    string[];
}) {
  return (
    <article className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={
            icon
          }
          className="h-5 w-5"
        />
      </div>

      <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-brand-700">
        {label}
      </p>

      <h3 className="mt-1 text-xl font-black">
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        {items.map(
          (
            item,
          ) => (
            <div
              key={
                item
              }
              className="flex gap-3"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Icon
                  name="check"
                  className="h-3.5 w-3.5"
                />
              </span>

              <p className="text-sm leading-6 text-muted">
                {item}
              </p>
            </div>
          ),
        )}
      </div>
    </article>
  );
}

function PrivacyCard({
  icon,
  title,
  children,
}: {
  icon:
    IconName;

  title:
    string;

  children:
    ReactNode;
}) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={
            icon
          }
          className="h-5 w-5"
        />
      </div>

      <h3 className="mt-4 font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {children}
      </p>
    </article>
  );
}

function NotHereCard({
  title,
  children,
}: {
  title:
    string;

  children:
    ReactNode;
}) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-canvas p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
        <Icon
          name="shield-check"
          className="h-4 w-4"
        />
      </div>

      <h3 className="mt-4 font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {children}
      </p>
    </article>
  );
}