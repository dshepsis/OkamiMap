export default {
  rowIdGenerator: loot =>
    `Map_${loot.mapID}_at_${loot.coords?.join('_') || 'UNKNOWN'}`,
  headers: [
    { text: 'Map', key: 'mapStr', style: { width: '20%' }, icon: './assets/map-32x32.png' },
    { text: 'Type', key: 'type', style: { width: '10%' } },
    { text: 'Terrain', key: 'terrain', style: { width: '10%' } },
    { text: 'Contents', key: 'contents', style: { width: '15%' } },
    { text: 'Image', key: 'image', style: { width: '12%' } },
    { text: 'Notes', key: 'notes' },
  ],
  mapStr: [
    'default',
    (loot, mapInfo) => {
      const { contents, mapID, type } = loot
      if (mapID === undefined) {
        console.error(`Loot ${contents} in ${type} found with no Map ID.`)
        return 'Unknown map'
      } else if (mapInfo[mapID].name === undefined) {
        console.error(
          `Loot ${contents} in ${type} found with invalid Map ID ${mapID}.`,
        )
        return `Unknown map (r${mapID.toString(16)})`
      } else {
        return `${mapInfo[mapID].name} (r${mapID.toString(16)})`
      }
    },
  ],
  type: 'default',
  terrain: 'default',
  contents: 'default',
  image: 'image',
  notes: 'default',
}
