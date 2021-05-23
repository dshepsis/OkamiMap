export default {
  rowIdGenerator: animal =>
    `Map_${animal.mapID}_at_${animal.coords?.join('_') || 'UNKNOWN'}`,
  header: [
    { text: 'Map', style: { width: '23%' } },
    { text: 'Bestiary', style: { width: '10%' } },
    { text: 'Availability', style: { width: '10%' } },
    { text: 'Praise', style: { width: '8%' } },
    { text: 'Types', style: { width: '15%' } },
    { text: 'Image', style: { width: '12%' } },
    { text: 'Notes' },
  ],
  renderOrder: [
    'mapID',
    'bestiary',
    'availability',
    'praise',
    'types',
    'image',
    'notes',
  ],
  mapID: [
    'default',
    (animal, mapIDMap) => {
      const { bestiary, mapID, types } = animal
      if (mapID === undefined) {
        console.error(
          `Animal ${bestiary} with types ${types} found with no Map ID.`,
        )
        return 'Unknown map'
      } else if (mapIDMap[mapID] === undefined) {
        console.error(
          `Animal ${bestiary} with types ${types} found with invalid Map ID ${mapID}.`,
        )
        return `Unknown map (r${mapID.toString(16)})`
      } else {
        return `${mapIDMap[mapID]} (r${mapID.toString(16)})`
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
