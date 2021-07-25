const bScale = 8000;
const zoomGranularity = 0.5;
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -6,
  maxZoom: -1,
  zoomSnap: zoomGranularity,
  zoomDelta: zoomGranularity,
  // maxBounds: [[-bScale, -bScale], [bScale, bScale]],
  maxBoundsViscosity: 1,
  layerPreview: true
});
map.setView([0, 0], 0);
window.OkamiMap = map;

/* Initialize to Shinshu: */
let currentGameMap = 0xf02;

const IMAGE_TO_GAME_COORD_SCALE_CONST = 2608.765265;
let mapImage = null;
function setGameMap(mapID, scale, center, layer=0, imageID = mapID) {
  currentGameMap = mapID;
  const lScale = scale*IMAGE_TO_GAME_COORD_SCALE_CONST;
  const bounds = [[-lScale - center[1], -lScale + center[0]], [lScale - center[1], lScale + center[0]]];
  let mapIDHex = imageID.toString(16);

  const mapURL = `./DumpedMaps/map_r${mapIDHex}_${layer}out.png`
  if (mapImage === null) {
    mapImage = L.imageOverlay(mapURL, bounds).addTo(map);
  } else {
    mapImage.setUrl(mapURL);
    mapImage.setBounds(bounds);
  }
  map.fitBounds(bounds, {animate: false});
}
/* Initialize to Shinshu: */
// setGameMap(0xf02, 5200, 1000, 1000);

/* Fetch multiple JSON files in parallel */
async function paraFetchJSON(...URLs) {
  const requests = URLs.map(u=>
    fetch(u).then(r=>r.json())
  );
  return Promise.all(requests);
}

let lootData;
let mapInfo
(async ()=>{
  let response;
  [lootData, mapInfo] = await paraFetchJSON(
    './Loot/data.json', './mapInfo.json'
  );

  const curMapInfo = mapInfo[currentGameMap];
  setGameMap(currentGameMap, curMapInfo.scale, curMapInfo.center);

  map.lootLayer = L.featureGroup().addTo(map);
  function addLootMarkers() {
    map.lootLayer.clearLayers();
    for (const loot of lootData) {
      if (loot.mapID === currentGameMap) {
        const coords = loot.coords;
        const latlong = [-coords[2], coords[0]];
        map.lootLayer.addLayer(
          L.marker(latlong, {image: loot.image}).bindPopup(`${loot.contents} @${loot.coords}`)
        );
      }
    }
  }
  addLootMarkers();

  function updatePreview(e) {
    map.setPreviewImage(e.sourceTarget.options.image);
  }
  map.lootLayer.on('popupopen', updatePreview);

  const MapSelector = L.Control.extend({
    onAdd: function(){
      const container = L.DomUtil.create('div');
      // container.style.width = '300px';
      // container.style.background = 'rgba(255,255,255,0.5)';
      // container.style.textAlign = 'left';
      const selBox = L.DomUtil.create('select', undefined, container);
      for (const id in mapInfo) {
        if (mapInfo[id].category !== "Normal") continue;
        const selOpt = L.DomUtil.create('option', undefined, selBox);
        selOpt.value = id;
        selOpt.innerText = mapInfo[id].name;

        if (+id === currentGameMap) selOpt.setAttribute('selected', '');
      }

      // const layerCont = L.DomUtil.create('div');
      // layerCont.style.width = '300px';
      // layerCont.style.background = 'rgba(255,255,255,0.5)';
      // layerCont.style.textAlign = 'left';
      const layerBox = L.DomUtil.create('select', undefined, container);

      function setLayerOptions(mapID) {
        const curMapInfo = mapInfo[mapID]
        L.DomUtil.empty(layerBox);
        layerBox.style.display = 'block';
        layerBox.disabled = false;
        if ('layers' in curMapInfo) {
          const mapLayers = curMapInfo.layers;
          for (let layerNum = 0; layerNum < mapLayers.length; ++layerNum) {
            const layerOpt = L.DomUtil.create('option', undefined, layerBox);
            layerOpt.value = layerNum;
            layerOpt.innerText = mapLayers[layerNum];
    
            // if (layerNum) selOpt.setAttribute('selected', '');
          }  
        } else if ('layerGroups' in curMapInfo) {
          const allLayers = [];
          const groups = curMapInfo.layerGroups;
          for (const groupName in groups) {
            const optGroup = L.DomUtil.create('optgroup', undefined, layerBox);
            optGroup.label = groupName;
            const groupLayers = groups[groupName].layers;
            for (let layerNum = 0; layerNum < groupLayers.length; ++layerNum) {
              const layerOpt = L.DomUtil.create('option', undefined, optGroup);
              layerOpt.value = layerNum;
              layerOpt.innerText = groupLayers[layerNum];
            }  
          }
        } else {
          layerBox.style.display = 'none';
          layerBox.disabled = true;
        }
      }
      setLayerOptions(currentGameMap);
      
      // const setMap = function(){
      //   gauge.innerHTML = 'Zoom level: ' + map.getZoom();
      // };
      // update();
      // map.on('zoomstart zoom zoomend', update)
      L.DomEvent.on(selBox, 'input', e=>{
        const selID = +selBox.value;
        setLayerOptions(selID);
        let selInfo = mapInfo[selID];
        let layer;
        if (!layerBox.disabled) {
          const selEle = layerBox.selectedOptions[0];//should be only 1
          const optGroup = selEle.parentElement;
          if (optGroup.nodeName === 'OPTGROUP') {
            selInfo = selInfo.layerGroups[optGroup.label];
          }
          layer = +layerBox.value
        }
        setGameMap(selID, selInfo.scale, selInfo.center, layer, selInfo.imageID);
        addLootMarkers();
      });

      L.DomEvent.on(layerBox, 'input', e=>{
        const selID = +selBox.value;
        const selEle = layerBox.selectedOptions[0];//should be only 1
        let selInfo = mapInfo[selID];
        const optGroup = selEle.parentElement;
        if (optGroup.nodeName === 'OPTGROUP') {
          selInfo = selInfo.layerGroups[optGroup.label];
        }
        const layer = +layerBox.value;
        setGameMap(selID, selInfo.scale, selInfo.center, layer, selInfo.imageID);
      });
      return container;
    }
  });
  (new MapSelector).addTo(map);
})();
