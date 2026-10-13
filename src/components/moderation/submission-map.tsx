"use client";

import type * as Leaflet from "leaflet";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { loadLeaflet } from "@/lib/maps/leaflet-runtime";

interface SubmissionMapProps {
  latitude: number;
  longitude: number;
}

const DEFAULT_TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function SubmissionMap({
  latitude,
  longitude,
}: SubmissionMapProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mapRef =
    useRef<Leaflet.Map | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const tileUrl =
    process.env
      .NEXT_PUBLIC_MAP_TILE_URL
      ?.trim() ||
    DEFAULT_TILE_URL;

  useEffect(() => {
    if (
      !containerRef.current
    ) {
      return;
    }

    let disposed =
      false;

    async function initializeMap() {
      try {
        const L =
          await loadLeaflet();

        if (
          disposed ||
          !containerRef.current
        ) {
          return;
        }

        const map =
          L.map(
            containerRef.current,
            {
              center: [
                latitude,
                longitude,
              ],

              zoom: 16,

              minZoom: 4,

              maxZoom: 19,

              zoomControl:
                true,

              attributionControl:
                true,

              scrollWheelZoom:
                false,
            },
          );

        mapRef.current =
          map;

        L.tileLayer(
          tileUrl,
          {
            minZoom: 4,

            maxZoom: 19,

            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',

            updateWhenIdle:
              true,

            keepBuffer: 1,
          },
        ).addTo(map);

        L.circleMarker(
          [
            latitude,
            longitude,
          ],
          {
            radius: 9,

            color:
              "#ffffff",

            weight: 3,

            fillColor:
              "#2f703e",

            fillOpacity: 1,

            interactive:
              false,
          },
        ).addTo(map);
      } catch (
        unknownError
      ) {
        if (disposed) {
          return;
        }

        setError(
          unknownError instanceof
            Error
            ? unknownError.message
            : "Nie udało się uruchomić podglądu mapy.",
        );
      }
    }

    void initializeMap();

    return () => {
      disposed =
        true;

      mapRef.current?.remove();

      mapRef.current =
        null;
    };
  }, [
    latitude,
    longitude,
    tileUrl,
  ]);

  if (error) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-danger-600/20 bg-danger-50 p-5 text-center text-sm font-semibold text-danger-600">
        {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-64 overflow-hidden rounded-2xl border border-line bg-[#eef2ec]">
      <div
        ref={containerRef}
        className="absolute inset-0"
      />
    </div>
  );
}