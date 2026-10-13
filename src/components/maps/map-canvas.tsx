"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  MapBounds,
  MapExplorerPlace,
  MapFocus,
} from "@/lib/maps/explorer-types";

type LeafletModule =
  typeof import("leaflet");

type LeafletMap =
  import("leaflet").Map;

type LeafletLayerGroup =
  import("leaflet").LayerGroup;

type LeafletCircleMarker =
  import("leaflet").CircleMarker;

interface MapCanvasProps {
  places:
    MapExplorerPlace[];

  selectedPlaceId:
    string | null;

  focus:
    MapFocus | null;

  onSelectPlace:
    (
      placeId: string,
    ) => void;

  onViewportChange:
    (
      bounds:
        MapBounds,
    ) => void;
}

type MapStatus =
  | "initializing"
  | "ready"
  | "error";

const POLAND_CENTER:
  [number, number] = [
    52.0693,
    19.4803,
  ];

const DEFAULT_ZOOM =
  6;

const TILE_URL =
  process.env
    .NEXT_PUBLIC_MAP_TILE_URL ??
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function MapCanvas({
  places,
  selectedPlaceId,
  focus,
  onSelectPlace,
  onViewportChange,
}: MapCanvasProps) {
  const containerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const leafletRef =
    useRef<LeafletModule | null>(
      null,
    );

  const mapRef =
    useRef<LeafletMap | null>(
      null,
    );

  const placesLayerRef =
    useRef<LeafletLayerGroup | null>(
      null,
    );

  const locationMarkerRef =
    useRef<LeafletCircleMarker | null>(
      null,
    );

  const selectPlaceRef =
    useRef(
      onSelectPlace,
    );

  const viewportChangeRef =
    useRef(
      onViewportChange,
    );

  const [
    status,
    setStatus,
  ] =
    useState<MapStatus>(
      "initializing",
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState(
      "",
    );

  const [
    retryKey,
    setRetryKey,
  ] =
    useState(
      0,
    );

  useEffect(
    () => {
      selectPlaceRef.current =
        onSelectPlace;
    },
    [
      onSelectPlace,
    ],
  );

  useEffect(
    () => {
      viewportChangeRef.current =
        onViewportChange;
    },
    [
      onViewportChange,
    ],
  );

  useEffect(
    () => {
      const container =
        containerRef.current;

      if (!container) {
        return;
      }

      let cancelled =
        false;

      let initializedMap:
        LeafletMap | null =
        null;

      let resizeObserver:
        ResizeObserver | null =
        null;

      let firstTimer:
        number | null =
        null;

      let secondTimer:
        number | null =
        null;

      setStatus(
        "initializing",
      );

      setErrorMessage(
        "",
      );

      async function initializeMap() {
        try {
          /*
           * Leaflet jest importowany dopiero
           * w prawdziwej przeglądarce.
           *
           * Dzięki temu moduł komponentu
           * nie jest uzależniony od tego,
           * czy Leaflet może zostać
           * wykonany podczas renderowania
           * lub ładowania chunka Next.js.
           */
          const L =
            await import(
              "leaflet"
            );

          if (
            cancelled
          ) {
            return;
          }

          leafletRef.current =
            L;

          /*
           * W czasie Fast Refresh albo
           * ponownej inicjalizacji Leaflet
           * nie może dostać dwa razy tego
           * samego kontenera.
           */
          if (
            mapRef.current
          ) {
            mapRef.current.remove();

            mapRef.current =
              null;
          }

          const map =
            L.map(
              container,
              {
                zoomControl:
                  false,

                attributionControl:
                  true,

                preferCanvas:
                  true,

                /*
                 * Dobre zachowanie
                 * na ekranach dotykowych.
                 */
                touchZoom:
                  true,

                scrollWheelZoom:
                  true,

                doubleClickZoom:
                  true,

                dragging:
                  true,
              },
            );

          initializedMap =
            map;

          mapRef.current =
            map;

          map.setView(
            POLAND_CENTER,
            DEFAULT_ZOOM,
          );

          const tileLayer =
            L.tileLayer(
              TILE_URL,
              {
                minZoom:
                  3,

                maxZoom:
                  19,

                attribution:
                  "&copy; OpenStreetMap contributors",
              },
            );

          tileLayer.addTo(
            map,
          );

          L.control
            .zoom({
              position:
                "bottomright",
            })
            .addTo(
              map,
            );

          const placesLayer =
            L.layerGroup();

          placesLayer.addTo(
            map,
          );

          placesLayerRef.current =
            placesLayer;

          function emitViewport() {
            if (
              cancelled
            ) {
              return;
            }

            const bounds =
              map.getBounds();

            viewportChangeRef.current({
              minLat:
                bounds.getSouth(),

              minLong:
                bounds.getWest(),

              maxLat:
                bounds.getNorth(),

              maxLong:
                bounds.getEast(),
            });
          }

          function invalidate() {
            if (
              cancelled
            ) {
              return;
            }

            map.invalidateSize({
              pan:
                false,
            });
          }

          map.on(
            "moveend",
            emitViewport,
          );

          map.whenReady(
            () => {
              if (
                cancelled
              ) {
                return;
              }

              /*
               * Mobilne przeglądarki potrafią
               * dopiero chwilę po hydracji
               * ustalić końcową wysokość
               * viewportu.
               */
              invalidate();

              emitViewport();

              setStatus(
                "ready",
              );

              firstTimer =
                window.setTimeout(
                  invalidate,
                  100,
                );

              secondTimer =
                window.setTimeout(
                  () => {
                    invalidate();

                    emitViewport();
                  },
                  450,
                );
            },
          );

          if (
            typeof ResizeObserver !==
            "undefined"
          ) {
            resizeObserver =
              new ResizeObserver(
                () => {
                  invalidate();
                },
              );

            resizeObserver.observe(
              container,
            );
          } else {
            /*
             * Fallback dla starszych
             * przeglądarek mobilnych.
             */
            window.addEventListener(
              "resize",
              invalidate,
            );
          }

          /*
           * Cleanup eventu resize
           * zapisujemy bez dodatkowego
           * stanu React.
           */
          (
            map as LeafletMap & {
              __januszowniaInvalidate?:
                () => void;
            }
          ).__januszowniaInvalidate =
            invalidate;
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            "Nie udało się uruchomić Leaflet:",
            error,
          );

          setStatus(
            "error",
          );

          setErrorMessage(
            "Mapa nie mogła zostać uruchomiona. Sprawdź połączenie i spróbuj ponownie.",
          );
        }
      }

      void initializeMap();

      return () => {
        cancelled =
          true;

        if (
          firstTimer !==
          null
        ) {
          window.clearTimeout(
            firstTimer,
          );
        }

        if (
          secondTimer !==
          null
        ) {
          window.clearTimeout(
            secondTimer,
          );
        }

        resizeObserver?.disconnect();

        if (
          initializedMap
        ) {
          const invalidate =
            (
              initializedMap as LeafletMap & {
                __januszowniaInvalidate?:
                  () => void;
              }
            )
              .__januszowniaInvalidate;

          if (
            invalidate
          ) {
            window.removeEventListener(
              "resize",
              invalidate,
            );
          }

          initializedMap.off();

          initializedMap.remove();
        }

        if (
          mapRef.current ===
          initializedMap
        ) {
          mapRef.current =
            null;
        }

        placesLayerRef.current =
          null;

        locationMarkerRef.current =
          null;

        leafletRef.current =
          null;
      };
    },
    [
      retryKey,
    ],
  );

  /*
   * Renderowanie punktów.
   */
  useEffect(
    () => {
      if (
        status !==
        "ready"
      ) {
        return;
      }

      const L =
        leafletRef.current;

      const layer =
        placesLayerRef.current;

      if (
        !L ||
        !layer
      ) {
        return;
      }

      layer.clearLayers();

      for (
        const place
        of places
      ) {
        const selected =
          place.id ===
          selectedPlaceId;

        const marker =
          L.circleMarker(
            [
              place.latitude,
              place.longitude,
            ],
            {
              radius:
                selected
                  ? 10
                  : 7,

              weight:
                selected
                  ? 4
                  : 3,

              color:
                "#ffffff",

              fillColor:
                categoryColor(
                  place.categorySlug,
                ),

              fillOpacity:
                1,

              opacity:
                1,

              bubblingMouseEvents:
                false,
            },
          );

        marker.bindTooltip(
          escapeTooltip(
            place.name,
          ),
          {
            direction:
              "top",

            offset:
              [
                0,
                -8,
              ],

            opacity:
              0.96,

            className:
              "januszownia-map-tooltip",
          },
        );

        marker.on(
          "click",
          () => {
            selectPlaceRef.current(
              place.id,
            );
          },
        );

        marker.addTo(
          layer,
        );
      }
    },
    [
      places,
      selectedPlaceId,
      status,
    ],
  );

  /*
   * Centrowanie mapy:
   *
   * - konkretne miejsce,
   * - lokalizacja użytkownika,
   * - cała Polska.
   */
  useEffect(
    () => {
      if (
        status !==
          "ready" ||
        !focus
      ) {
        return;
      }

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

      map.flyTo(
        [
          focus.latitude,
          focus.longitude,
        ],
        focus.zoom,
        {
          animate:
            true,

          duration:
            0.65,
        },
      );

      if (
        !focus.showLocationMarker
      ) {
        return;
      }

      locationMarkerRef.current?.remove();

      const marker =
        L.circleMarker(
          [
            focus.latitude,
            focus.longitude,
          ],
          {
            radius:
              9,

            color:
              "#ffffff",

            weight:
              4,

            fillColor:
              "#166534",

            fillOpacity:
              1,

            opacity:
              1,
          },
        );

      marker.bindTooltip(
        "Twoja lokalizacja",
        {
          direction:
            "top",

          offset:
            [
              0,
              -8,
            ],
        },
      );

      marker.addTo(
        map,
      );

      locationMarkerRef.current =
        marker;
    },
    [
      focus,
      status,
    ],
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-canvas">
      {/*
       * Kontener istnieje od pierwszego
       * renderu i ma pełne wymiary.
       */}
      <div
        ref={
          containerRef
        }
        className="absolute inset-0 h-full w-full"
        aria-label="Mapa miejsc Januszowni"
      />

      {status ===
      "initializing" ? (
        <div className="pointer-events-none absolute inset-0 z-[900] flex items-center justify-center bg-canvas">
          <div className="rounded-2xl bg-white/95 px-6 py-5 text-center shadow-sm backdrop-blur">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />

            <p className="mt-3 text-sm font-black">
              Uruchamiam mapę…
            </p>

            <p className="mt-1 text-xs text-muted">
              To powinno potrwać
              tylko chwilę.
            </p>
          </div>
        </div>
      ) : null}

      {status ===
      "error" ? (
        <div className="absolute inset-0 z-[900] flex items-center justify-center bg-canvas p-5">
          <div
            role="alert"
            className="w-full max-w-sm rounded-[1.5rem] border border-line bg-white p-6 text-center shadow-lg"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-2xl">
              🗺️
            </div>

            <h3 className="mt-4 text-lg font-black">
              Mapa się nie uruchomiła
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              {
                errorMessage
              }
            </p>

            <button
              type="button"
              onClick={
                () =>
                  setRetryKey(
                    (
                      current,
                    ) =>
                      current +
                      1,
                  )
              }
              className="mt-5 min-h-11 w-full rounded-xl bg-brand-600 px-4 text-sm font-black text-white transition hover:bg-brand-700"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function categoryColor(
  slug: string,
): string {
  switch (slug) {
    case "parking":
      return "#2563eb";

    case "water":
      return "#0284c7";

    case "toilets":
      return "#7c3aed";

    case "food":
      return "#d97706";

    case "free":
      return "#16a34a";

    case "markets":
      return "#be123c";

    default:
      return "#166534";
  }
}

function escapeTooltip(
  value: string,
): string {
  return value
    .replaceAll(
      "&",
      "&amp;",
    )
    .replaceAll(
      "<",
      "&lt;",
    )
    .replaceAll(
      ">",
      "&gt;",
    )
    .replaceAll(
      '"',
      "&quot;",
    )
    .replaceAll(
      "'",
      "&#039;",
    );
}