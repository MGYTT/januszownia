"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  loadLeaflet,
} from "@/lib/maps/leaflet-runtime";

import type {
  MapBounds,
  MapExplorerPlace,
  MapFocus,
} from "@/lib/maps/explorer-types";

type LeafletRuntime =
  typeof import("leaflet");

type LeafletMap =
  import("leaflet").Map;

type LeafletLayerGroup =
  import("leaflet").LayerGroup;

type LeafletCircleMarker =
  import("leaflet").CircleMarker;

interface MapCanvasProps {
  active:
    boolean;

  places:
    MapExplorerPlace[];

  selectedPlaceId:
    string | null;

  focus:
    MapFocus | null;

  fallbackHref:
    string;

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
  | "idle"
  | "loading"
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
  10_000;

const TILE_URL =
  process.env
    .NEXT_PUBLIC_MAP_TILE_URL
    ?.trim() ||
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function MapCanvas({
  active,
  places,
  selectedPlaceId,
  focus,
  fallbackHref,
  onSelectPlace,
  onViewportChange,
}: MapCanvasProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const leafletRef =
    useRef<LeafletRuntime | null>(
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
      "idle",
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

  useEffect(
    () => {
      if (!active) {
        setStatus(
          "idle",
        );

        return;
      }

      const element =
        containerRef.current;

      if (!element) {
        setStatus(
          "error",
        );

        setErrorMessage(
          "Nie udało się przygotować kontenera mapy.",
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

      let orientationListener:
        (() => void) | null =
        null;

      let visibilityListener:
        (() => void) | null =
        null;

      let firstFrame =
        0;

      let secondFrame =
        0;

      let delayedTimer:
        number | null =
        null;

      let tileErrorCount =
        0;

      setStatus(
        "loading",
      );

      setErrorMessage(
        "",
      );

      setTileWarning(
        false,
      );

      const initializationTimer =
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
              "Mapa nie uruchomiła się w wymaganym czasie. Możesz nadal korzystać z listy miejsc.",
            );
          },
          INITIALIZATION_TIMEOUT_MS,
        );

      async function initializeMap(
        container:
          HTMLDivElement,
      ) {
        try {
          const L =
            await loadLeaflet();

          if (
            disposed ||
            timedOut
          ) {
            return;
          }

          leafletRef.current =
            L;

          const map =
            L.map(
              container,
              {
                center:
                  POLAND_CENTER,

                zoom:
                  DEFAULT_ZOOM,

                minZoom:
                  4,

                maxZoom:
                  19,

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

                zoomAnimation:
                  !prefersReducedMotion(),
              },
            );

          initializedMap =
            map;

          mapRef.current =
            map;

          const tileLayer =
            L.tileLayer(
              TILE_URL,
              {
                minZoom:
                  4,

                maxZoom:
                  19,

                updateWhenIdle:
                  true,

                keepBuffer:
                  2,

                attribution:
                  "&copy; OpenStreetMap contributors",
              },
            );

          tileLayer.on(
            "tileerror",
            () => {
              tileErrorCount +=
                1;

              if (
                tileErrorCount >=
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

          window.clearTimeout(
            initializationTimer,
          );

          setStatus(
            "ready",
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
              450,
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
              container,
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

          orientationListener =
            () => {
              window.setTimeout(
                invalidateMap,
                120,
              );
            };

          window.addEventListener(
            "orientationchange",
            orientationListener,
          );

          visibilityListener =
            () => {
              if (
                document.visibilityState ===
                "visible"
              ) {
                window.setTimeout(
                  invalidateMap,
                  80,
                );
              }
            };

          document.addEventListener(
            "visibilitychange",
            visibilityListener,
          );
        } catch (
          error
        ) {
          window.clearTimeout(
            initializationTimer,
          );

          if (
            disposed
          ) {
            return;
          }

          console.error(
            "Nie udało się uruchomić mapy Leaflet:",
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
              ? `Nie udało się uruchomić mapy: ${message}`
              : "Nie udało się uruchomić mapy. Skorzystaj z listy miejsc albo spróbuj ponownie.",
          );
        }
      }

      void initializeMap(
        element,
      );

      return () => {
        disposed =
          true;

        window.clearTimeout(
          initializationTimer,
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
          resizeListener
        ) {
          window.removeEventListener(
            "resize",
            resizeListener,
          );
        }

        if (
          orientationListener
        ) {
          window.removeEventListener(
            "orientationchange",
            orientationListener,
          );
        }

        if (
          visibilityListener
        ) {
          document.removeEventListener(
            "visibilitychange",
            visibilityListener,
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
          initializedMap
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
      active,
      retryKey,
    ],
  );

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

            offset: [
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
            !prefersReducedMotion(),

          duration:
            0.6,
        },
      );

      locationMarkerRef.current?.remove();

      locationMarkerRef.current =
        null;

      if (
        !focus.showLocationMarker
      ) {
        return;
      }

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

          offset: [
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
      className="relative h-full w-full overflow-hidden bg-[#eef2ec]"
      style={{
        minHeight:
          "420px",
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
        "idle" ||
      status ===
        "loading" ? (
        <MapFallback
          loading={
            status ===
            "loading"
          }
          fallbackHref={
            fallbackHref
          }
        />
      ) : null}

      {status ===
      "error" ? (
        <div
          className="absolute inset-0 z-[900] flex items-center justify-center bg-[#eef2ec] p-5"
          role="alert"
        >
          <div className="w-full max-w-sm rounded-[1.5rem] border border-line bg-white p-6 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-2xl">
              🗺️
            </div>

            <h3 className="mt-4 text-lg font-black">
              Mapa jest chwilowo niedostępna
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

            <a
              href={
                fallbackHref
              }
              className="mt-2 flex min-h-10 w-full items-center justify-center rounded-xl border border-line bg-white px-4 text-xs font-black text-muted transition hover:bg-canvas hover:text-ink"
            >
              Przejdź do listy miejsc
            </a>
          </div>
        </div>
      ) : null}

      {status ===
        "ready" &&
      tileWarning ? (
        <div
          role="status"
          className="absolute left-3 right-3 top-3 z-[800] rounded-xl border border-accent-200 bg-accent-50/95 px-4 py-3 text-xs font-semibold leading-5 text-accent-800 shadow-sm backdrop-blur sm:left-1/2 sm:right-auto sm:max-w-md sm:-translate-x-1/2"
        >
          Mapa działa, ale nie wszystkie
          kafelki zostały pobrane. Sprawdź
          połączenie z internetem.
        </div>
      ) : null}
    </div>
  );
}

function MapFallback({
  loading,
  fallbackHref,
}: {
  loading:
    boolean;

  fallbackHref:
    string;
}) {
  return (
    <div
      className="absolute inset-0 z-[900] flex items-center justify-center bg-[#eef2ec] p-5"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm rounded-[1.5rem] border border-line bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <span
            aria-hidden="true"
            className="text-xl"
          >
            🗺️
          </span>
        </div>

        <h3 className="mt-4 text-lg font-black">
          {loading
            ? "Przygotowuję mapę"
            : "Mapa interaktywna"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted">
          {loading
            ? "Mapa uruchamia się niezależnie od listy miejsc. Jeśli urządzenie jej nie obsłuży, lista nadal działa."
            : "Widok mapy zostanie uruchomiony po stronie Twojego urządzenia. Lista miejsc działa niezależnie."}
        </p>

        <a
          href={
            fallbackHref
          }
          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-line bg-white px-4 text-xs font-black text-brand-700 transition hover:bg-brand-50"
        >
          Zamiast tego pokaż listę
        </a>
      </div>
    </div>
  );
}

function prefersReducedMotion():
  boolean {
  return (
    typeof window !==
      "undefined" &&
    typeof window.matchMedia ===
      "function" &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
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