function selectMap(e) {
  const selectedMapID = parseInt(e.target.value)
  const selectedMapIDHex = selectedMapID.toString(16)
  mapHex.value = '0x' + selectedMapIDHex
  mapDec.value = selectedMapID
  image.setUrl(`./DumpedMaps/map_r${selectedMapIDHex}_0out.png`)
}

export default function (mapHex, mapDec) {
  mapHex.addEventListener('change', selectMap)
  mapDec.addEventListener('change', selectMap)
}
