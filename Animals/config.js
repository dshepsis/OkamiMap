export default {
  rowIdGenerator: animal =>
    `Map_${animal.mapID}_at_${animal.coords?.join('_') || 'UNKNOWN'}`,
  headers: [
    { text: 'Map', key: 'mapStr', style: { width: '23%' } },
    { text: 'Bestiary', key: 'bestiary', style: { width: '10%' } },
    { text: 'Availability', key: 'availability', style: { width: '10%' } },
    { text: 'Praise', key: 'praise', style: { width: '8%' } },
    { text: 'Types', key: 'types', style: { width: '15%' } },
    { text: 'Image', key: 'image', style: { width: '12%' } },
    { text: 'Notes', key: 'notes' },
  ],
  mapStr: [
    'default',
    (animal, mapInfo) => {
      const { bestiary, mapID, types } = animal
      if (mapID === undefined) {
        console.error(
          `Animal ${bestiary} with types ${types} found with no Map ID.`,
        )
        return 'Unknown map'
      } else if (mapInfo[mapID].name === undefined) {
        console.error(
          `Animal ${bestiary} with types ${types} found with invalid Map ID ${mapID}.`,
        )
        return `Unknown map (r${mapID.toString(16)})`
      } else {
        return `${mapInfo[mapID].name} (r${mapID.toString(16)})`
      }
    },
  ],
  bestiary: 'default',
  availability: 'default',
  praise: 'default',
  types: 'default',
  image: 'image',
  notes: 'default',
}
