import zoomViewer from './zoomViewer.js'
import mapGen from './mapGen.js'
import paraFetchJSON from './paraFetchJson.js'
import addImageOverlayToMap from './addImageOverlayToMap.js'
// import selectMap from './selectMap.js'

const scale = 5200;
const shiftN = 1000;
const shiftE = 1000;
const bounds = [[-scale + shiftN, -scale + shiftE], [scale + shiftN, scale + shiftE]];

const mapID = 0xf02;
const mapIDHex = mapID.toString(16);

const map = mapGen('map', bounds);

zoomViewer(map);

addImageOverlayToMap(mapIDHex, bounds, map);

let lootData;
let mapIDMap;
(async ()=>{
  [lootData, mapIDMap] = await paraFetchJSON(
    './lootData.json', './mapIDMap.json'
  );
  const loots = [];
  for (const loot of lootData) {
    if (loot.mapID === mapID) {
      const coords = loot.coords;
      const latlong = [-coords[2], coords[0]];
      loots.push(
        L.marker(latlong, {image: loot.image}).bindPopup(`${loot.contents} @${loot.coords}`)
      );
    }
  }
  map.lootLayer = L.featureGroup(loots).addTo(map);

  function updatePreview(e) {
    map.setPreviewImage(e.sourceTarget.options.image);
  }
  map.lootLayer.on('popupopen', updatePreview);
})();
