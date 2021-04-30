const zoomGranularity = 0.5;

export default (mapDivId, bounds) => {
  const map = L.map(mapDivId, {
    crs: L.CRS.Simple,
    minZoom: -6,
    maxZoom: -1,
    zoomSnap: zoomGranularity,
    zoomDelta: zoomGranularity,
    maxBoundsViscosity: 1,
    layerPreview: true
  });

  map.setView([0, 0], 0);
  map.fitBounds(bounds, {animate: false});

  return map;
}
