export default datum => ({
  availability: datum.availability || null,
  bestiary: datum.bestiary || 'None',
  coords: datum.coords || [],
  image: datum.image || null,
  mapID: datum.mapID || null,
  notes: datum.notes || '',
  praise: datum.praise || 0,
  types: datum.types || null,
})
