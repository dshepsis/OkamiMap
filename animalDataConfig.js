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
    'map',
    'bestiary',
    'availability',
    'praise',
    'types',
    'image',
    'notes',
  ],
  bestiary: 'default',
  availability: 'default',
  praise: 'default',
  types: 'default',
  notes: 'default',
  mapID: 'default',
  coords: 'default',
}
