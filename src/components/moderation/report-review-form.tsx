"use client";

import {
  useState,
} from "react";

import {
  dismissPlaceReport,
  resolvePlaceReport,
} from "@/app/moderacja/zgloszenia/actions";

import {
  PlacePicker,
  type SelectedCoordinates,
} from "@/components/maps/place-picker";

import type {
  MapCategory,
} from "@/lib/maps/types";

import type {
  ModerationReportDetail,
} from "@/lib/moderation/types";

interface ReportReviewFormProps {
  report:
    ModerationReportDetail;

  categories:
    MapCategory[];
}

export function ReportReviewForm({
  report,
  categories,
}: ReportReviewFormProps) {
  const [
    coordinates,
    setCoordinates,
  ] =
    useState<SelectedCoordinates>({
      latitude:
        report.latitude,

      longitude:
        report.longitude,
    });

  return (
    <form className="space-y-7">
      <input
        type="hidden"
        name="reportId"
        value={
          report.report_id
        }
      />

      <input
        type="hidden"
        name="latitude"
        value={
          coordinates.latitude
        }
      />

      <input
        type="hidden"
        name="longitude"
        value={
          coordinates.longitude
        }
      />

      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Popraw dane
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Aktualna wersja miejsca
        </h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
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
              defaultValue={
                report.category_id
              }
              required
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            >
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

          <Field
            id="name"
            label="Nazwa"
            required
            maxLength={120}
            defaultValue={
              report.name
            }
          />

          <Field
            id="city"
            label="Miasto"
            maxLength={100}
            defaultValue={
              report.city ??
              ""
            }
          />

          <Field
            id="address"
            label="Adres"
            maxLength={200}
            defaultValue={
              report.address ??
              ""
            }
          />

          <Field
            id="postalCode"
            label="Kod pocztowy"
            maxLength={20}
            defaultValue={
              report.postal_code ??
              ""
            }
          />

          <Field
            id="countryCode"
            label="Kod kraju"
            required
            maxLength={2}
            defaultValue={
              report.country_code
            }
          />

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
              defaultValue={
                report.description ??
                ""
              }
              className="w-full resize-y rounded-xl border border-line bg-canvas px-4 py-3 outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Lokalizacja
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Popraw punkt na mapie
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Jeśli lokalizacja jest
          prawidłowa, niczego nie
          zmieniaj. Jeśli nie —
          kliknij właściwy punkt.
        </p>

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
        <label
          htmlFor="note"
          className="block text-sm font-black"
        >
          Notatka moderatora
        </label>

        <p className="mt-1 text-sm leading-6 text-muted">
          Opcjonalna przy
          poprawieniu miejsca.
          Przy odrzuceniu raportu
          podaj przynajmniej krótkie
          uzasadnienie.
        </p>

        <textarea
          id="note"
          name="note"
          rows={4}
          maxLength={1000}
          className="mt-4 w-full resize-y rounded-xl border border-line bg-canvas px-4 py-3 outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="submit"
            formAction={
              resolvePlaceReport
            }
            className="min-h-12 rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700"
          >
            Zapisz poprawkę i zamknij
          </button>

          <button
            type="submit"
            formAction={
              dismissPlaceReport
            }
            className="min-h-12 rounded-button border border-danger-600/30 bg-white px-5 py-3 font-black text-danger-600 transition hover:bg-danger-50"
          >
            Odrzuć zgłoszenie
          </button>
        </div>
      </section>
    </form>
  );
}

interface FieldProps {
  id: string;

  label: string;

  required?: boolean;

  maxLength?: number;

  defaultValue: string;
}

function Field({
  id,
  label,
  required = false,
  maxLength,
  defaultValue,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type="text"
        required={required}
        maxLength={maxLength}
        defaultValue={
          defaultValue
        }
        className="h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
      />
    </div>
  );
}