"use client";

import type * as Leaflet from "leaflet";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  loadLeaflet,
} from "@/lib/maps/leaflet-runtime";

export interface SelectedCoordinates {
  latitude: number;
  longitude: number;
}

interface PlacePickerProps {
  value:
    SelectedCoordinates | null;

  onSelect: (
    coordinates:
      SelectedCoordinates,
  ) => void;
}

const DEFAULT_CENTER: [
  number,
  number,
] = [
  51.9194,
  19.1451,
];

const DEFAULT_TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function PlacePicker({
  value,
  onSelect,
}: PlacePickerProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const leafletRef =
    useRef<
      typeof import("leaflet") | null
    >(null);

  const mapRef =
    useRef<Leaflet.Map | null>(
      null,
    );

  const markerRef =
    useRef<Leaflet.Marker | null>(
      null,
    );

  const onSelectRef =
    useRef(
      onSelect,
    );

  const [mapReady, setMapReady] =
    useState(false);

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
    onSelectRef.current =
      onSelect;
  }, [
    onSelect,
  ]);

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

        leafletRef.current =
          L;

        const map =
          L.map(
            containerRef.current,
            {
              center:
                DEFAULT_CENTER,

              zoom: 6,

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
            maxZoom: 19,

            minZoom: 4,

            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',

            updateWhenIdle:
              true,

            keepBuffer: 2,
          },
        ).addTo(map);

        map.on(
          "click",
          (
            event:
              Leaflet.LeafletMouseEvent,
          ) => {
            onSelectRef.current(
              {
                latitude:
                  event
                    .latlng
                    .lat,

                longitude:
                  event
                    .latlng
                    .lng,
              },
            );
          },
        );

        function handleLocationError() {
          setError(
            "Nie udało się ustalić Twojej lokalizacji. Możesz nadal wybrać punkt ręcznie.",
          );
        }

        map.on(
          "locationerror",
          handleLocationError,
        );

        map.once(
          "unload",
          () => {
            map.off(
              "locationerror",
              handleLocationError,
            );
          },
        );

        setMapReady(
          true,
        );
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

      markerRef.current?.remove();

      markerRef.current =
        null;

      mapRef.current?.remove();

      mapRef.current =
        null;

      leafletRef.current =
        null;
    };
  }, [
    tileUrl,
  ]);

  useEffect(() => {
    const L =
      leafletRef.current;

    const map =
      mapRef.current;

    if (
      !L ||
      !map
    ) {
      return;
    }

    if (!value) {
      markerRef.current?.remove();

      markerRef.current =
        null;

      return;
    }

    const latLng:
      Leaflet.LatLngExpression = [
        value.latitude,
        value.longitude,
      ];

    if (
      markerRef.current
    ) {
      markerRef.current.setLatLng(
        latLng,
      );

      return;
    }

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

    markerRef.current =
      L.marker(
        latLng,
        {
          icon,
        },
      ).addTo(map);
  }, [
    value,
  ]);

  function locateUser() {
    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    setError(null);

    map.locate({
      setView: true,

      maxZoom: 16,

      enableHighAccuracy:
        false,

      timeout: 10000,
    });
  }

  return (
    <div>
      <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] border border-line bg-[#eef2ec]">
        <div
          ref={
            containerRef
          }
          className="absolute inset-0"
        />

        {!mapReady &&
        !error ? (
          <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center bg-canvas">
            <div className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold shadow-sm">
              Uruchamiam mapę…
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={
            locateUser
          }
          disabled={
            !mapReady
          }
          className="absolute left-4 top-4 z-[500] min-h-11 rounded-xl border border-line bg-white px-4 text-sm font-black shadow-card transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          📍 Moja
          lokalizacja
        </button>

        <div className="pointer-events-none absolute bottom-8 left-4 right-4 z-[500] rounded-2xl border border-line bg-white/95 p-3 text-sm font-semibold shadow-sm backdrop-blur sm:right-auto sm:max-w-xs">
          Kliknij mapę
          dokładnie w miejscu,
          które chcesz zgłosić.
        </div>
      </div>

      {value ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Coordinate
            label="Latitude"
            value={
              value.latitude
            }
          />

          <Coordinate
            label="Longitude"
            value={
              value.longitude
            }
          />
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Nie wybrano jeszcze
          punktu.
        </p>
      )}

      {error ? (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-danger-600/20 bg-danger-50 p-3 text-sm font-semibold text-danger-600"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}

function Coordinate({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-canvas px-4 py-3">
      <p className="text-xs font-bold text-muted">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm font-black">
        {value.toFixed(
          6,
        )}
      </p>
    </div>
  );
}