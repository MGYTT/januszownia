type LeafletRuntime =
  typeof import("leaflet");

type LeafletModuleWithDefault = {
  default?:
    LeafletRuntime;
};

type LeafletWindow =
  Window & {
    L?:
      LeafletRuntime;
  };

let leafletPromise:
  | Promise<LeafletRuntime>
  | null =
  null;

let markerClusterPromise:
  | Promise<LeafletRuntime>
  | null =
  null;

export function loadLeaflet():
  Promise<LeafletRuntime> {
  if (
    typeof window ===
    "undefined"
  ) {
    return Promise.reject(
      new Error(
        "Leaflet może zostać uruchomiony wyłącznie w przeglądarce.",
      ),
    );
  }

  if (
    leafletPromise
  ) {
    return leafletPromise;
  }

  leafletPromise =
    import(
      "leaflet"
    )
      .then(
        (
          module,
        ) =>
          normalizeLeafletModule(
            module,
          ),
      )
      .catch(
        (
          error,
        ) => {
          leafletPromise =
            null;

          throw error;
        },
      );

  return leafletPromise;
}

export function loadLeafletWithMarkerCluster():
  Promise<LeafletRuntime> {
  if (
    typeof window ===
    "undefined"
  ) {
    return Promise.reject(
      new Error(
        "Leaflet może zostać uruchomiony wyłącznie w przeglądarce.",
      ),
    );
  }

  if (
    markerClusterPromise
  ) {
    return markerClusterPromise;
  }

  markerClusterPromise =
    initializeMarkerCluster()
      .catch(
        (
          error,
        ) => {
          markerClusterPromise =
            null;

          throw error;
        },
      );

  return markerClusterPromise;
}

async function initializeMarkerCluster():
  Promise<LeafletRuntime> {
  const leaflet =
    await loadLeaflet();

  const browserWindow =
    window as
      LeafletWindow;

  /*
   * markercluster jest starszym
   * pluginem rozszerzającym globalne L.
   */
  browserWindow.L =
    leaflet;

  await import(
    "leaflet.markercluster"
  );

  const runtimeLeaflet =
    browserWindow.L ??
    leaflet;

  if (
    typeof runtimeLeaflet
      .MarkerClusterGroup !==
      "function" &&
    typeof runtimeLeaflet
      .markerClusterGroup !==
      "function"
  ) {
    throw new Error(
      "Plugin leaflet.markercluster nie został poprawnie podłączony do Leaflet.",
    );
  }

  return runtimeLeaflet;
}

function normalizeLeafletModule(
  module:
    typeof import(
      "leaflet"
    ),
): LeafletRuntime {
  const moduleWithDefault =
    module as unknown as
      LeafletModuleWithDefault;

  return (
    moduleWithDefault.default ??
    module
  ) as LeafletRuntime;
}