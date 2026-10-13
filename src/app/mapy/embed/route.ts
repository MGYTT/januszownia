import type {
  NextRequest,
} from "next/server";

const DEFAULT_TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const CATEGORY_PATTERN =
  /^[a-z0-9-]{1,60}$/;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  request:
    NextRequest,
) {
  const {
    searchParams,
  } =
    request.nextUrl;

  const query =
    normalizeQuery(
      searchParams.get(
        "q",
      ),
    );

  const categories =
    parseCategories(
      searchParams.get(
        "category",
      ),
    );

  const selectedPlaceId =
    normalizeUuid(
      searchParams.get(
        "place",
      ),
    );

  const latitude =
    readCoordinate(
      searchParams.get(
        "lat",
      ),
      -90,
      90,
    );

  const longitude =
    readCoordinate(
      searchParams.get(
        "lng",
      ),
      -180,
      180,
    );

  const zoom =
    readZoom(
      searchParams.get(
        "zoom",
      ),
    );

  const tileUrl =
    process.env
      .NEXT_PUBLIC_MAP_TILE_URL
      ?.trim() ||
    DEFAULT_TILE_URL;

  const center:
    [number, number] =
    latitude !==
        null &&
      longitude !==
        null
      ? [
          latitude,
          longitude,
        ]
      : [
          52.0693,
          19.4803,
        ];

  const initialZoom =
    latitude !==
        null &&
      longitude !==
        null
      ? zoom ??
        16
      : zoom ??
        6;

  const nonce =
    createNonce();

  const config =
    serializeForScript({
      query,

      categories:
        categories.join(
          ",",
        ),

      selectedPlaceId,

      center,

      zoom:
        initialZoom,

      tileUrl,
    });

  const html =
    buildHtml({
      nonce,
      config,
    });

  return new Response(
    html,
    {
      headers: {
        "Content-Type":
          "text/html; charset=utf-8",

        "Cache-Control":
          "private, no-store, max-age=0",

        "Content-Security-Policy":
          [
            "default-src 'none'",
            `script-src 'nonce-${nonce}' https://unpkg.com`,
            "style-src 'unsafe-inline' https://unpkg.com",
            "img-src https: data: blob:",
            "connect-src 'self'",
            "frame-ancestors 'self'",
            "base-uri 'none'",
            "form-action 'none'",
          ].join(
            "; ",
          ),

        "Referrer-Policy":
          "strict-origin-when-cross-origin",

        "X-Content-Type-Options":
          "nosniff",
      },
    },
  );
}

function buildHtml({
  nonce,
  config,
}: {
  nonce: string;

  config: string;
}): string {
  return `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, viewport-fit=cover"
  >
  <title>Mapa Januszowni</title>

  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  >

  <style>
    :root {
      color-scheme: light;
      font-family:
        Inter,
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body,
    #map {
      width: 100%;
      height: 100%;
      min-height: 100%;
      margin: 0;
    }

    html,
    body {
      overflow: hidden;
      background: #eef2ec;
      color: #172019;
    }

    button,
    a {
      -webkit-tap-highlight-color: transparent;
    }

    #map {
      position: absolute;
      inset: 0;
      background: #eef2ec;
    }

    .map-status {
      position: absolute;
      z-index: 1000;
      top:
        max(
          12px,
          env(safe-area-inset-top)
        );
      left:
        max(
          12px,
          env(safe-area-inset-left)
        );
      max-width:
        calc(
          100% -
          24px -
          env(safe-area-inset-left) -
          env(safe-area-inset-right)
        );
      padding: 9px 12px;
      border:
        1px solid
        #e5e9e4;
      border-radius: 999px;
      background:
        rgba(
          255,
          255,
          255,
          0.96
        );
      box-shadow:
        0 3px 14px
        rgba(
          23,
          32,
          25,
          0.12
        );
      font-size: 12px;
      line-height: 16px;
      font-weight: 800;
      pointer-events: none;
    }

    .map-status[data-state="error"] {
      border-color: #efc9c5;
      color: #a82e28;
      background: #fff3f2;
    }

    .map-controls {
      position: absolute;
      z-index: 1000;
      top:
        max(
          12px,
          env(safe-area-inset-top)
        );
      right:
        max(
          12px,
          env(safe-area-inset-right)
        );
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .map-button {
      min-height: 42px;
      padding: 0 13px;
      border:
        1px solid
        #e5e9e4;
      border-radius: 12px;
      background:
        rgba(
          255,
          255,
          255,
          0.97
        );
      color: #285a35;
      box-shadow:
        0 3px 14px
        rgba(
          23,
          32,
          25,
          0.12
        );
      font: inherit;
      font-size: 12px;
      font-weight: 900;
      cursor: pointer;
    }

    .map-button:active {
      transform:
        translateY(
          1px
        );
    }

    .fatal {
      position: absolute;
      z-index: 2000;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      padding:
        max(
          20px,
          env(safe-area-inset-top)
        )
        max(
          20px,
          env(safe-area-inset-right)
        )
        max(
          20px,
          env(safe-area-inset-bottom)
        )
        max(
          20px,
          env(safe-area-inset-left)
        );
      background: #eef2ec;
    }

    .fatal.is-visible {
      display: flex;
    }

    .fatal-card {
      width: 100%;
      max-width: 360px;
      padding: 24px;
      border:
        1px solid
        #e5e9e4;
      border-radius: 24px;
      background: #ffffff;
      box-shadow:
        0 12px 35px
        rgba(
          23,
          32,
          25,
          0.08
        );
      text-align: center;
    }

    .fatal-card h1 {
      margin: 0;
      font-size: 19px;
      line-height: 24px;
    }

    .fatal-card p {
      margin: 10px 0 0;
      color: #667069;
      font-size: 13px;
      line-height: 20px;
    }

    .popup {
      min-width: 190px;
      max-width: 250px;
    }

    .popup-category {
      color: #285a35;
      font-size: 10px;
      line-height: 14px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .popup-title {
      margin-top: 3px;
      color: #172019;
      font-size: 14px;
      line-height: 18px;
      font-weight: 900;
    }

    .popup-address {
      margin-top: 5px;
      color: #667069;
      font-size: 11px;
      line-height: 16px;
    }

    .popup-actions {
      display: flex;
      gap: 6px;
      margin-top: 10px;
    }

    .popup-link {
      display: inline-flex;
      min-height: 34px;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      border-radius: 9px;
      background: #2f703e;
      color: white !important;
      text-decoration: none;
      font-size: 11px;
      font-weight: 900;
    }

    .popup-link.secondary {
      border: 1px solid #e5e9e4;
      background: white;
      color: #285a35 !important;
    }

    .leaflet-container {
      font-family: inherit;
    }

    .leaflet-control-zoom {
      margin-right:
        max(
          12px,
          env(safe-area-inset-right)
        ) !important;
      margin-bottom:
        max(
          12px,
          env(safe-area-inset-bottom)
        ) !important;
      overflow: hidden;
      border:
        1px solid
        #e5e9e4 !important;
      border-radius:
        12px !important;
      box-shadow:
        0 3px 14px
        rgba(
          23,
          32,
          25,
          0.12
        ) !important;
    }

    .leaflet-control-zoom a {
      width: 42px !important;
      height: 42px !important;
      line-height: 42px !important;
      border: 0 !important;
      background:
        #ffffff !important;
      color:
        #172019 !important;
    }

    .leaflet-control-attribution {
      padding:
        2px 5px !important;
      background:
        rgba(
          255,
          255,
          255,
          0.9
        ) !important;
      font-size:
        9px !important;
    }

    @media (
      max-width:
        520px
    ) {
      .map-controls {
        top: auto;
        right:
          max(
            12px,
            env(safe-area-inset-right)
          );
        bottom:
          max(
            68px,
            calc(
              56px +
              env(safe-area-inset-bottom)
            )
          );
      }

      .map-button {
        width: 44px;
        min-height: 44px;
        padding: 0;
        overflow: hidden;
        font-size: 0;
      }

      .map-button::first-letter {
        font-size: 17px;
      }
    }
  </style>
</head>
<body>
  <div
    id="map"
    aria-label="Interaktywna mapa miejsc Januszowni"
  ></div>

  <div
    id="status"
    class="map-status"
    role="status"
    aria-live="polite"
  >
    Przygotowuję mapę…
  </div>

  <div class="map-controls">
    <button
      id="locate"
      class="map-button"
      type="button"
      title="Moja lokalizacja"
    >
      📍 Moja lokalizacja
    </button>

    <button
      id="poland"
      class="map-button"
      type="button"
      title="Pokaż całą Polskę"
    >
      🇵🇱 Cała Polska
    </button>
  </div>

  <div
    id="fatal"
    class="fatal"
    role="alert"
  >
    <div class="fatal-card">
      <h1>Mapa jest niedostępna</h1>

      <p id="fatal-message">
        Nie udało się uruchomić silnika mapy.
        Lista miejsc na Januszowni nadal działa.
      </p>
    </div>
  </div>

  <noscript>
    <div class="fatal is-visible">
      <div class="fatal-card">
        <h1>JavaScript jest wyłączony</h1>

        <p>
          Interaktywna mapa wymaga JavaScript.
          Wróć do listy miejsc, która działa
          bez tego widoku.
        </p>
      </div>
    </div>
  </noscript>

  <script
    nonce="${nonce}"
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""
  ></script>

  <script nonce="${nonce}">
    (function () {
      "use strict";

      var CONFIG =
        ${config};

      var statusElement =
        document.getElementById(
          "status"
        );

      var fatalElement =
        document.getElementById(
          "fatal"
        );

      var fatalMessageElement =
        document.getElementById(
          "fatal-message"
        );

      var locateButton =
        document.getElementById(
          "locate"
        );

      var polandButton =
        document.getElementById(
          "poland"
        );

      var requestTimer =
        null;

      var activeRequest =
        null;

      var userMarker =
        null;

      var selectedOpened =
        false;

      function setStatus(
        message,
        isError
      ) {
        statusElement.textContent =
          message;

        statusElement.setAttribute(
          "data-state",
          isError
            ? "error"
            : "ok"
        );
      }

      function showFatal(
        message
      ) {
        fatalMessageElement.textContent =
          message;

        fatalElement.className =
          "fatal is-visible";
      }

      if (
        typeof window.L ===
          "undefined"
      ) {
        showFatal(
          "Nie udało się pobrać biblioteki mapy. Sprawdź połączenie z internetem i wróć do listy miejsc."
        );

        return;
      }

      var L =
        window.L;

      var map =
        L.map(
          "map",
          {
            center:
              CONFIG.center,

            zoom:
              CONFIG.zoom,

            minZoom:
              4,

            maxZoom:
              19,

            zoomControl:
              false,

            attributionControl:
              true,

            preferCanvas:
              true
          }
        );

      L.control
        .zoom({
          position:
            "bottomright"
        })
        .addTo(
          map
        );

      var tileLayer =
        L.tileLayer(
          CONFIG.tileUrl,
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
              "&copy; OpenStreetMap contributors"
          }
        );

      var tileErrors =
        0;

      tileLayer.on(
        "tileerror",
        function () {
          tileErrors +=
            1;

          if (
            tileErrors ===
            6
          ) {
            setStatus(
              "Mapa działa, ale część kafelków nie została pobrana.",
              true
            );
          }
        }
      );

      tileLayer.addTo(
        map
      );

      var placesLayer =
        L.layerGroup()
          .addTo(
            map
          );

      function categoryColor(
        slug
      ) {
        switch (
          slug
        ) {
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

      function createPopup(
        place
      ) {
        var container =
          document.createElement(
            "div"
          );

        container.className =
          "popup";

        var category =
          document.createElement(
            "div"
          );

        category.className =
          "popup-category";

        category.textContent =
          place.categoryName;

        container.appendChild(
          category
        );

        var title =
          document.createElement(
            "div"
          );

        title.className =
          "popup-title";

        title.textContent =
          place.name;

        container.appendChild(
          title
        );

        var addressParts =
          [];

        if (
          place.address
        ) {
          addressParts.push(
            place.address
          );
        }

        if (
          place.city
        ) {
          addressParts.push(
            place.city
          );
        }

        if (
          addressParts.length >
          0
        ) {
          var address =
            document.createElement(
              "div"
            );

          address.className =
            "popup-address";

          address.textContent =
            addressParts.join(
              " · "
            );

          container.appendChild(
            address
          );
        }

        var actions =
          document.createElement(
            "div"
          );

        actions.className =
          "popup-actions";

        var details =
          document.createElement(
            "a"
          );

        details.className =
          "popup-link";

        details.href =
          "/mapy/miejsce/" +
          encodeURIComponent(
            place.id
          );

        details.target =
          "_top";

        details.textContent =
          "Szczegóły";

        actions.appendChild(
          details
        );

        var osm =
          document.createElement(
            "a"
          );

        osm.className =
          "popup-link secondary";

        osm.href =
          "https://www.openstreetmap.org/?mlat=" +
          encodeURIComponent(
            place.latitude
          ) +
          "&mlon=" +
          encodeURIComponent(
            place.longitude
          ) +
          "#map=17/" +
          encodeURIComponent(
            place.latitude
          ) +
          "/" +
          encodeURIComponent(
            place.longitude
          );

        osm.target =
          "_blank";

        osm.rel =
          "noreferrer";

        osm.textContent =
          "OSM ↗";

        actions.appendChild(
          osm
        );

        container.appendChild(
          actions
        );

        return container;
      }

      function renderPlaces(
        payload
      ) {
        placesLayer.clearLayers();

        var places =
          payload &&
          Array.isArray(
            payload.places
          )
            ? payload.places
            : [];

        var index;

        for (
          index = 0;
          index <
          places.length;
          index += 1
        ) {
          var place =
            places[
              index
            ];

          var marker =
            L.circleMarker(
              [
                place.latitude,
                place.longitude
              ],
              {
                radius:
                  place.id ===
                  CONFIG.selectedPlaceId
                    ? 10
                    : 7,

                weight:
                  place.id ===
                  CONFIG.selectedPlaceId
                    ? 4
                    : 3,

                color:
                  "#ffffff",

                fillColor:
                  categoryColor(
                    place.categorySlug
                  ),

                fillOpacity:
                  1,

                opacity:
                  1
              }
            );

          marker.bindPopup(
            createPopup(
              place
            ),
            {
              maxWidth:
                270
            }
          );

          marker.addTo(
            placesLayer
          );

          if (
            !selectedOpened &&
            CONFIG.selectedPlaceId &&
            place.id ===
              CONFIG.selectedPlaceId
          ) {
            marker.openPopup();

            selectedOpened =
              true;
          }
        }

        if (
          payload &&
          payload.truncated
        ) {
          setStatus(
            "300+ miejsc — przybliż mapę",
            false
          );

          return;
        }

        if (
          places.length ===
          0
        ) {
          setStatus(
            "Brak miejsc w tym obszarze",
            false
          );

          return;
        }

        setStatus(
          String(
            places.length
          ) +
          " " +
          placeWord(
            places.length
          ),
          false
        );
      }

      function placeWord(
        count
      ) {
        if (
          count ===
          1
        ) {
          return "miejsce";
        }

        var last =
          count %
          10;

        var lastTwo =
          count %
          100;

        if (
          last >= 2 &&
          last <= 4 &&
          !(
            lastTwo >= 12 &&
            lastTwo <= 14
          )
        ) {
          return "miejsca";
        }

        return "miejsc";
      }

      function buildApiUrl() {
        var bounds =
          map.getBounds();

        var url =
          "/api/mapy/miejsca" +
          "?minLat=" +
          encodeURIComponent(
            bounds.getSouth()
          ) +
          "&minLong=" +
          encodeURIComponent(
            bounds.getWest()
          ) +
          "&maxLat=" +
          encodeURIComponent(
            bounds.getNorth()
          ) +
          "&maxLong=" +
          encodeURIComponent(
            bounds.getEast()
          );

        if (
          CONFIG.query
        ) {
          url +=
            "&q=" +
            encodeURIComponent(
              CONFIG.query
            );
        }

        if (
          CONFIG.categories
        ) {
          url +=
            "&categories=" +
            encodeURIComponent(
              CONFIG.categories
            );
        }

        return url;
      }

      function loadPlaces() {
        if (
          activeRequest
        ) {
          activeRequest.abort();

          activeRequest =
            null;
        }

        setStatus(
          "Aktualizuję miejsca…",
          false
        );

        var xhr =
          new XMLHttpRequest();

        activeRequest =
          xhr;

        xhr.open(
          "GET",
          buildApiUrl(),
          true
        );

        xhr.setRequestHeader(
          "Accept",
          "application/json"
        );

        xhr.onreadystatechange =
          function () {
            if (
              xhr.readyState !==
              4
            ) {
              return;
            }

            if (
              activeRequest ===
              xhr
            ) {
              activeRequest =
                null;
            }

            if (
              xhr.status >=
                200 &&
              xhr.status <
                300
            ) {
              try {
                renderPlaces(
                  JSON.parse(
                    xhr.responseText
                  )
                );
              } catch (
                error
              ) {
                setStatus(
                  "Nie udało się odczytać danych mapy.",
                  true
                );
              }

              return;
            }

            if (
              xhr.status ===
              0
            ) {
              return;
            }

            setStatus(
              "Nie udało się pobrać miejsc.",
              true
            );
          };

        xhr.send();
      }

      function scheduleLoad() {
        if (
          requestTimer
        ) {
          window.clearTimeout(
            requestTimer
          );
        }

        requestTimer =
          window.setTimeout(
            loadPlaces,
            180
          );
      }

      map.on(
        "moveend",
        scheduleLoad
      );

      polandButton.onclick =
        function () {
          map.setView(
            [
              52.0693,
              19.4803
            ],
            6
          );
        };

      locateButton.onclick =
        function () {
          var secureEnough =
            window.isSecureContext ===
              true ||
            window.location.protocol ===
              "https:" ||
            window.location.hostname ===
              "localhost" ||
            window.location.hostname ===
              "127.0.0.1";

          if (
            !secureEnough
          ) {
            setStatus(
              "Lokalizacja wymaga HTTPS. Sama mapa działa bez niej.",
              true
            );

            return;
          }

          if (
            !navigator.geolocation
          ) {
            setStatus(
              "Ta przeglądarka nie obsługuje lokalizacji.",
              true
            );

            return;
          }

          setStatus(
            "Ustalam Twoją lokalizację…",
            false
          );

          navigator.geolocation
            .getCurrentPosition(
              function (
                position
              ) {
                var latitude =
                  position.coords
                    .latitude;

                var longitude =
                  position.coords
                    .longitude;

                if (
                  userMarker
                ) {
                  userMarker.remove();
                }

                userMarker =
                  L.circleMarker(
                    [
                      latitude,
                      longitude
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
                        1
                    }
                  )
                    .bindTooltip(
                      "Twoja lokalizacja"
                    )
                    .addTo(
                      map
                    );

                map.setView(
                  [
                    latitude,
                    longitude
                  ],
                  15
                );
              },

              function () {
                setStatus(
                  "Nie udało się pobrać lokalizacji.",
                  true
                );
              },

              {
                enableHighAccuracy:
                  false,

                timeout:
                  10000,

                maximumAge:
                  60000
              }
            );
        };

      window.setTimeout(
        function () {
          map.invalidateSize(
            false
          );

          loadPlaces();
        },
        40
      );

      window.setTimeout(
        function () {
          map.invalidateSize(
            false
          );
        },
        450
      );

      window.addEventListener(
        "resize",
        function () {
          map.invalidateSize(
            false
          );
        }
      );
    }());
  </script>
</body>
</html>`;
}

function normalizeQuery(
  value:
    string | null,
): string {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .replace(
      /\s+/g,
      " ",
    )
    .slice(
      0,
      80,
    );
}

function parseCategories(
  value:
    string | null,
): string[] {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value
        .split(",")
        .map(
          (
            slug,
          ) =>
            slug.trim(),
        )
        .filter(
          (
            slug,
          ) =>
            CATEGORY_PATTERN.test(
              slug,
            ),
        ),
    ),
  ].slice(
    0,
    20,
  );
}

function normalizeUuid(
  value:
    string | null,
): string | null {
  if (
    value &&
    UUID_PATTERN.test(
      value,
    )
  ) {
    return value;
  }

  return null;
}

function readCoordinate(
  value:
    string | null,

  min:
    number,

  max:
    number,
): number | null {
  if (!value) {
    return null;
  }

  const parsed =
    Number(
      value,
    );

  if (
    !Number.isFinite(
      parsed,
    ) ||
    parsed <
      min ||
    parsed >
      max
  ) {
    return null;
  }

  return parsed;
}

function readZoom(
  value:
    string | null,
): number | null {
  if (!value) {
    return null;
  }

  const parsed =
    Number(
      value,
    );

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return null;
  }

  return Math.max(
    4,
    Math.min(
      19,
      Math.round(
        parsed,
      ),
    ),
  );
}

function createNonce():
  string {
  const bytes =
    new Uint8Array(
      16,
    );

  crypto.getRandomValues(
    bytes,
  );

  let binary =
    "";

  for (
    const byte
    of bytes
  ) {
    binary +=
      String.fromCharCode(
        byte,
      );
  }

  return btoa(
    binary,
  );
}

function serializeForScript(
  value:
    unknown,
): string {
  return JSON.stringify(
    value,
  )
    .replace(
      /</g,
      "\\u003c",
    )
    .replace(
      />/g,
      "\\u003e",
    )
    .replace(
      /&/g,
      "\\u0026",
    )
    .replace(
      /\u2028/g,
      "\\u2028",
    )
    .replace(
      /\u2029/g,
      "\\u2029",
    );
}
