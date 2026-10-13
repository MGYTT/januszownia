"use client";

import type * as Leaflet from "leaflet";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { loadLeaflet } from "@/lib/maps/leaflet-runtime";

interface PlaceLocationMapProps {
  latitude: number;

  longitude: number;

  name: string;
}

const DEFAULT_TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function PlaceLocationMap({
  latitude,
  longitude,
  name,
}: PlaceLocationMapProps) {
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
                false,

              attributionControl:
                true,
            },
          );

        mapRef.current =
          map;

        L.control
          .zoom({
            position:
              "topright",
          })
          .addTo(map);

        L.tileLayer(
          tileUrl,
          {
            minZoom: 4,

            maxZoom: 19,

            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',

            updateWhenIdle:
              true,

            keepBuffer: 2,
          },
        ).addTo(map);

        const icon =
          L.divIcon({
            className:
              "janusz-place-icon",

            html:
              '<span class="janusz-place-marker"></span>',

            iconSize: [
              32,
              32,
            ],

            iconAnchor: [
              10,
              29,
            ],
          });

        L.marker(
          [
            latitude,
            longitude,
          ],
          {
            icon,
            title: name,
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
            : "Nie udało się uruchomić mapy.",
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
    name,
    tileUrl,
  ]);

  if (error) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-[2rem] border border-danger-600/20 bg-danger-50 p-6 text-center text-sm font-semibold text-danger-600">
        {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-line bg-[#eef2ec] shadow-sm">
      <div
        ref={containerRef}
        className="absolute inset-0"
      />
    </div>
  );
}