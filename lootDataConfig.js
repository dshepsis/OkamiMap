export default {
  rowIdGenerator: loot =>
    `Map_${loot.mapID}_at_${loot.coords?.join('_') || 'UNKNOWN'}`,
  header: [
    { text: 'Map', style: { width: '20%' } },
    { text: 'Type', style: { width: '10%' } },
    { text: 'Terrain', style: { width: '10%' } },
    { text: 'Contents', style: { width: '15%' } },
    { text: 'Image', style: { width: '12%' } },
    { text: 'Notes' },
  ],
  renderOrder: ['mapStr', 'type', 'terrain', 'contents', 'image', 'notes'],
  mapStr: [
    'default',
    (loot, mapIDMap) => {
      const { contents, mapID, type } = loot
      if (mapID === undefined) {
        console.error(`Loot ${contents} in ${type} found with no Map ID.`)
        return 'Unknown map'
      } else if (mapIDMap[mapID] === undefined) {
        console.error(
          `Loot ${contents} in ${type} found with invalid Map ID ${mapID}.`,
        )
        return `Unknown map (r${mapID.toString(16)})`
      } else {
        return `${mapIDMap[mapID]} (r${mapID.toString(16)})`
      }
    },
  ],
  type: 'default',
  terrain: 'default',
  contents: 'default',
  image: 'image',
  notes: 'default',
}
