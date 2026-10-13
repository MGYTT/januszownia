"use client";

import {
  useState,
} from "react";

import {
  submitPlace,
} from "@/app/mapy/actions";

import {
  PlacePicker,
  type SelectedCoordinates,
} from "@/components/maps/place-picker";

import type {
  MapCategory,
} from "@/lib/maps/types";

interface AddPlaceFormProps {
  categories:
    MapCategory[];
}

export function AddPlaceForm({
  categories,
}: AddPlaceFormProps) {
  const [
    coordinates,
    setCoordinates,
  ] =
    useState<SelectedCoordinates | null>(
      null,
    );

  return (
    <form
      action={submitPlace}
      className="space-y-7"
    >
      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Podstawowe informacje
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="categoryId"
              className="mb-2 block text-sm font-bold"
            >
              Kategoria
            </label>

            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue=""
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            >
              <option
                value=""
                disabled
              >
                Wybierz kategorię
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold"
            >
              Nazwa miejsca
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={120}
              placeholder="np. Darmowy parking przy dworcu"
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-bold"
            >
              Miasto
            </label>

            <input
              id="city"
              name="city"
              type="text"
              maxLength={100}
              placeholder="np. Kraków"
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="mb-2 block text-sm font-bold"
            >
              Kod pocztowy
            </label>

            <input
              id="postalCode"
              name="postalCode"
              type="text"
              maxLength={20}
              autoComplete="postal-code"
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-bold"
            >
              Adres
            </label>

            <input
              id="address"
              name="address"
              type="text"
              maxLength={200}
              autoComplete="street-address"
              placeholder="Ulica, numer lub opis lokalizacji"
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              htmlFor="countryCode"
              className="mb-2 block text-sm font-bold"
            >
              Kod kraju
            </label>

            <input
              id="countryCode"
              name="countryCode"
              type="text"
              required
              minLength={2}
              maxLength={2}
              defaultValue="PL"
              autoCapitalize="characters"
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 uppercase outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />

            <p className="mt-2 text-xs text-muted">
              Dwuliterowy kod kraju,
              np. PL.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-bold"
            >
              Opis
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              maxLength={2000}
              placeholder="Co warto wiedzieć o tym miejscu? Podaj konkretne, możliwe do zweryfikowania informacje."
              className="w-full resize-y rounded-xl border border-line bg-canvas px-4 py-3 outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Dokładna lokalizacja
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Wskaż punkt na mapie
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Nie zgadujemy
          współrzędnych. Kliknij
          dokładne miejsce na
          mapie.
        </p>

        <input
          type="hidden"
          name="latitude"
          value={
            coordinates?.latitude ??
            ""
          }
        />

        <input
          type="hidden"
          name="longitude"
          value={
            coordinates?.longitude ??
            ""
          }
        />

        <div className="mt-5">
          <PlacePicker
            value={
              coordinates
            }
            onSelect={
              setCoordinates
            }
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Źródło
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Skąd o tym wiesz?
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Źródło nie zawsze jest
          wymagane, ale bardzo
          pomaga moderatorowi
          potwierdzić zgłoszenie.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="sourceLabel"
              className="mb-2 block text-sm font-bold"
            >
              Nazwa źródła
            </label>

            <input
              id="sourceLabel"
              name="sourceLabel"
              type="text"
              maxLength={120}
              placeholder="np. strona urzędu miasta"
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              htmlFor="sourceUrl"
              className="mb-2 block text-sm font-bold"
            >
              Adres źródła
            </label>

            <input
              id="sourceUrl"
              name="sourceUrl"
              type="url"
              maxLength={1000}
              placeholder="https://..."
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </div>
      </section>

      <div className="rounded-[2rem] border border-brand-200 bg-brand-50 p-5 sm:p-6">
        <p className="font-black text-brand-900">
          Zgłoszenie nie pojawi
          się od razu na mapie.
        </p>

        <p className="mt-2 text-sm leading-6 text-brand-800">
          Najpierw sprawdzi je
          moderator. Dzięki temu
          publiczna mapa nie
          zamienia się w zbiór
          przypadkowych lub
          fałszywych punktów.
        </p>

        <button
          type="submit"
          disabled={
            coordinates === null
          }
          className="mt-5 min-h-12 rounded-button bg-brand-600 px-6 py-3 font-black text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {coordinates
            ? "Wyślij do weryfikacji"
            : "Najpierw wybierz punkt"}
        </button>
      </div>
    </form>
  );
}