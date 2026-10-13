type LeafletRuntime =
  typeof import("leaflet");

type LeafletModuleWithDefault = {
  default?: LeafletRuntime;
};

type LeafletWindow = Window & {
  L?: LeafletRuntime;
};

let leafletRuntimePromise:
  | Promise<LeafletRuntime>
  | null = null;

export function loadLeafletWithMarkerCluster():
  Promise<LeafletRuntime> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error(
        "Leaflet może zostać uruchomiony wyłącznie w przeglądarce.",
      ),
    );
  }

  if (leafletRuntimePromise) {
    return leafletRuntimePromise;
  }

  leafletRuntimePromise =
    initializeLeafletRuntime();

  return leafletRuntimePromise;
}

async function initializeLeafletRuntime():
  Promise<LeafletRuntime> {
  const leafletModule =
    await import("leaflet");

  const moduleWithDefault =
    leafletModule as unknown as
      LeafletModuleWithDefault;

  const leaflet =
    (moduleWithDefault.default ??
      leafletModule) as
      LeafletRuntime;

  const browserWindow =
    window as LeafletWindow;

  /*
   * leaflet.markercluster jest starszym
   * pluginem rozszerzającym obiekt L.
   *
   * Ustawiamy globalne L na dokładnie tę
   * samą instancję Leaflet, której używa
   * nasza aplikacja.
   */
  browserWindow.L =
    leaflet;

  /*
   * Plugin musi zostać załadowany
   * dopiero po Leaflet.
   */
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
    leafletRuntimePromise =
      null;

    throw new Error(
      "Plugin leaflet.markercluster nie został poprawnie podłączony do instancji Leaflet.",
    );
  }

  return runtimeLeaflet;
}

export async function loadLeaflet():
  Promise<LeafletRuntime> {
  if (typeof window === "undefined") {
    throw new Error(
      "Leaflet może zostać uruchomiony wyłącznie w przeglądarce.",
    );
  }

  const leafletModule =
    await import("leaflet");

  const moduleWithDefault =
    leafletModule as unknown as
      LeafletModuleWithDefault;

  return (
    moduleWithDefault.default ??
    leafletModule
  ) as LeafletRuntime;
}