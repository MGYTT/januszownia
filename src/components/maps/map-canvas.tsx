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

const INITIALIZATION_TIMEOUT_MS =
  8000;

const TILE_URL =
  process.env
    .NEXT_PUBLIC_MAP_TILE_URL
    ?.trim() ||
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
    tileWarning,
    setTileWarning,
  ] =
    useState(
      false,
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

  /*
   * =======================================================
   * INICJALIZACJA MAPY
   * =======================================================
   */
  useEffect(
    () => {
      const containerElement =
        containerRef.current;

      if (
        containerElement ===
        null
      ) {
        setStatus(
          "error",
        );

        setErrorMessage(
          "Nie znaleziono kontenera mapy.",
        );

        return;
      }

      let disposed =
        false;

      let timedOut =
        false;

      let initializedMap:
        LeafletMap | null =
        null;

      let resizeObserver:
        ResizeObserver | null =
        null;

      let resizeListener:
        (() => void) | null =
        null;

      let firstFrame =
        0;

      let secondFrame =
        0;

      let delayedTimer:
        number | null =
        null;

      let tileErrors =
        0;

      setStatus(
        "initializing",
      );

      setErrorMessage(
        "",
      );

      setTileWarning(
        false,
      );

      /*
       * Jeżeli import albo inicjalizacja
       * faktycznie się zawiesi, po 8 s
       * użytkownik dostanie błąd.
       */
      const timeout =
        window.setTimeout(
          () => {
            if (
              disposed ||
              mapRef.current !==
                null
            ) {
              return;
            }

            timedOut =
              true;

            setStatus(
              "error",
            );

            setErrorMessage(
              "Uruchomienie mapy trwało zbyt długo. Spróbuj ponownie.",
            );

            console.error(
              "MapCanvas: timeout inicjalizacji Leafleta.",
            );
          },
          INITIALIZATION_TIMEOUT_MS,
        );

      async function initializeMap(
        element:
          HTMLDivElement,
      ) {
        try {
          console.info(
            "MapCanvas: rozpoczynam inicjalizację.",
          );

          const L =
            await import(
              "leaflet"
            );

          if (
            disposed ||
            timedOut
          ) {
            return;
          }

          leafletRef.current =
            L;

          if (
            mapRef.current !==
            null
          ) {
            mapRef.current.remove();

            mapRef.current =
              null;
          }

          /*
           * Leaflet wymaga kontenera
           * posiadającego realne wymiary.
           */
          const map =
            L.map(
              element,
              {
                zoomControl:
                  false,

                attributionControl:
                  true,

                preferCanvas:
                  true,

                dragging:
                  true,

                touchZoom:
                  true,

                doubleClickZoom:
                  true,

                scrollWheelZoom:
                  true,

                boxZoom:
                  true,

                keyboard:
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
            {
              animate:
                false,
            },
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

          tileLayer.on(
            "tileerror",
            () => {
              tileErrors +=
                1;

              if (
                tileErrors >=
                  6 &&
                !disposed
              ) {
                setTileWarning(
                  true,
                );
              }
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
              disposed
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

          function invalidateMap() {
            if (
              disposed
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

          /*
           * Najważniejsze:
           *
           * NIE używamy whenReady().
           *
           * Instancja mapy już istnieje,
           * setView został wykonany,
           * warstwa kafelków jest podpięta.
           */
          window.clearTimeout(
            timeout,
          );

          setStatus(
            "ready",
          );

          console.info(
            "MapCanvas: Leaflet uruchomiony.",
          );

          firstFrame =
            window.requestAnimationFrame(
              () => {
                if (
                  disposed
                ) {
                  return;
                }

                invalidateMap();

                emitViewport();

                secondFrame =
                  window.requestAnimationFrame(
                    () => {
                      if (
                        disposed
                      ) {
                        return;
                      }

                      invalidateMap();
                    },
                  );
              },
            );

          delayedTimer =
            window.setTimeout(
              () => {
                if (
                  disposed
                ) {
                  return;
                }

                invalidateMap();

                emitViewport();
              },
              400,
            );

          if (
            typeof ResizeObserver !==
            "undefined"
          ) {
            resizeObserver =
              new ResizeObserver(
                () => {
                  invalidateMap();
                },
              );

            resizeObserver.observe(
              element,
            );
          } else {
            resizeListener =
              () => {
                invalidateMap();
              };

            window.addEventListener(
              "resize",
              resizeListener,
            );
          }
        } catch (
          error
        ) {
          window.clearTimeout(
            timeout,
          );

          if (
            disposed
          ) {
            return;
          }

          console.error(
            "MapCanvas: błąd uruchamiania Leafleta:",
            error,
          );

          const message =
            error instanceof Error
              ? error.message
              : "Nieznany błąd.";

          setStatus(
            "error",
          );

          setErrorMessage(
            process.env.NODE_ENV ===
              "development"
              ? `Mapa nie mogła zostać uruchomiona: ${message}`
              : "Mapa nie mogła zostać uruchomiona. Spróbuj ponownie.",
          );
        }
      }

      void initializeMap(
        containerElement,
      );

      return () => {
        disposed =
          true;

        window.clearTimeout(
          timeout,
        );

        if (
          delayedTimer !==
          null
        ) {
          window.clearTimeout(
            delayedTimer,
          );
        }

        if (
          firstFrame !==
          0
        ) {
          window.cancelAnimationFrame(
            firstFrame,
          );
        }

        if (
          secondFrame !==
          0
        ) {
          window.cancelAnimationFrame(
            secondFrame,
          );
        }

        resizeObserver?.disconnect();

        if (
          resizeListener !==
          null
        ) {
          window.removeEventListener(
            "resize",
            resizeListener,
          );
        }

        locationMarkerRef.current?.remove();

        locationMarkerRef.current =
          null;

        placesLayerRef.current =
          null;

        leafletRef.current =
          null;

        if (
          initializedMap !==
          null
        ) {
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
      };
    },
    [
      retryKey,
    ],
  );

  /*
   * =======================================================
   * MARKERY MIEJSC
   * =======================================================
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
        L === null ||
        layer === null
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
   * =======================================================
   * FOCUS / LOKALIZACJA
   * =======================================================
   */
  useEffect(
    () => {
      if (
        status !==
          "ready" ||
        focus ===
          null
      ) {
        return;
      }

      const L =
        leafletRef.current;

      const map =
        mapRef.current;

      if (
        L === null ||
        map === null
      ) {
        return;
      }

      map.invalidateSize({
        pan:
          false,
      });

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
    <div
      className="relative h-full w-full overflow-hidden bg-canvas"
      style={{
        position:
          "relative",

        width:
          "100%",

        height:
          "100%",

        minHeight:
          "420px",

        overflow:
          "hidden",

        background:
          "#eef2ec",
      }}
    >
      <div
        ref={
          containerRef
        }
        aria-label="Mapa miejsc Januszowni"
        style={{
          position:
            "absolute",

          inset:
            0,

          width:
            "100%",

          height:
            "100%",

          minHeight:
            "420px",
        }}
      />

      {status ===
      "initializing" ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position:
              "absolute",

            inset:
              0,

            zIndex:
              900,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            padding:
              "20px",

            background:
              "#eef2ec",
          }}
        >
          <div className="rounded-[1.5rem] border border-line bg-white px-6 py-5 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />

            <p className="mt-3 text-sm font-black">
              Uruchamiam mapę…
            </p>

            <p className="mt-1 text-xs text-muted">
              Maksymalnie kilka
              sekund.
            </p>
          </div>
        </div>
      ) : null}

      {status ===
      "error" ? (
        <div
          style={{
            position:
              "absolute",

            inset:
              0,

            zIndex:
              900,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            padding:
              "20px",

            background:
              "#eef2ec",
          }}
        >
          <div
            role="alert"
            className="w-full max-w-sm rounded-[1.5rem] border border-line bg-white p-6 text-center shadow-xl"
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
                () => {
                  setRetryKey(
                    (
                      current,
                    ) =>
                      current +
                      1,
                  );
                }
              }
              className="mt-5 min-h-11 w-full rounded-xl bg-brand-600 px-4 text-sm font-black text-white transition hover:bg-brand-700"
            >
              Spróbuj ponownie
            </button>

            <button
              type="button"
              onClick={
                () => {
                  window.location.reload();
                }
              }
              className="mt-2 min-h-10 w-full rounded-xl border border-line bg-white px-4 text-xs font-black text-muted transition hover:bg-canvas hover:text-ink"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      ) : null}

      {status ===
        "ready" &&
      tileWarning ? (
        <div
          role="status"
          className="absolute left-3 right-3 top-3 z-[800] rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-xs font-semibold leading-5 text-accent-800 shadow-sm sm:left-1/2 sm:right-auto sm:max-w-md sm:-translate-x-1/2"
        >
          Mapa działa, ale część
          kafelków nie została
          pobrana. Sprawdź
          połączenie z internetem.
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
    .replace(
      /&/g,
      "&amp;",
    )
    .replace(
      /</g,
      "&lt;",
    )
    .replace(
      />/g,
      "&gt;",
    )
    .replace(
      /"/g,
      "&quot;",
    )
    .replace(
      /'/g,
      "&#039;",
    );
}