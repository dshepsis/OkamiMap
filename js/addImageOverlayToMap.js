export default function (mapIDHex, bounds, map) {
  L.imageOverlay(`./DumpedMaps/map_r${mapIDHex}_0out.png`, bounds).addTo(map)
}
