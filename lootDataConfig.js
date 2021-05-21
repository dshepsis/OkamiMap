export default datum => ({
  coords: datum.coords || [],
  contents: datum.contents || null,
  image: datum.image || null,
  mapID: datum.mapID || null,
  nice: datum.nice || false,
  notes: datum.notes || '',
  terrain: datum.terrain || null,
  type: datum.type || null,
})
