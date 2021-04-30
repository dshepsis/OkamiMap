let zoomViewer

export default map => {
  if (zoomViewer != null) return zoomViewer

  zoomViewer = new (L.Control.extend({
    onAdd: function () {
      var gauge = L.DomUtil.create('div')
      gauge.style.width = '200px'
      gauge.style.background = 'rgba(255,255,255,0.5)'
      gauge.style.textAlign = 'left'
      const update = function (ev) {
        gauge.innerHTML = 'Zoom level: ' + map.getZoom()
      }
      update()
      map.on('zoomstart zoom zoomend', update)
      return gauge
    },
  }))

  zoomViewer.addTo(map)

  return zoomViewer
}
