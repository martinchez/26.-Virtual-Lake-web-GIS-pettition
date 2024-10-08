var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
})

var osmHOT = L.tileLayer(
  'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution:
      '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France',
  }
)

var esriImagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}',
  {
    maxZoom: 19,
    attribution: 'Tiles © Esri',
  }
)

var mapboxImagery = L.tileLayer(
  'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibGFjaGF1eCIsImEiOiJjbHduczJxbmYyOGF0MmtteXliMHBpYndhIn0.2e27G0skx41btpihGCoH4w',
  {
    maxZoom: 19,
    attribution: '© Mapbox © OpenStreetMap © DigitalGlobe',
  }
)

var map = L.map('map', {
  center: [46.0792, 7.2766],
  zoom: 16.0,
  layers: [mapboxImagery],
})

var baseMaps = {
  Imagery: mapboxImagery,
  OpenStreetMap: osm,
  'OpenStreetMap.HOT': osmHOT,
}

var overlayMaps = {}

var layerControl = L.control
  .layers(baseMaps, overlayMaps, { collapsed: false })
  .addTo(map)

// Fetch GeoJSON data from an external file and add to the map
fetch('artificiallake.geojson')
  .then((response) => response.json())
  .then((data) => {
    var geojsonLayer = L.geoJSON(data, {
      style: function (feature) {
        return {
          fillColor: 'transparent',
          color: 'black',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.0,
          dashArray: '5, 5',
        }
      },
    })
    geojsonLayer.addTo(map)
    geojsonLayer.bringToFront()
    overlayMaps['Artificial Lake'] = geojsonLayer
    layerControl.addOverlay(geojsonLayer, 'Artificial Lake')
  })
  .catch((error) =>
    console.error('Error Loading Artificial Lake GeoJSON:', error)
  )

fetch('archeoprotection.geojson')
  .then((response) => response.json())
  .then((data) => {
    var geojsonLayer = L.geoJSON(data, {
      style: function (feature) {
        return {
          fillColor: 'Green',
          color: 'green',
          weight: 2,
          opacity: 1,
          fillOpacity: 1,
        }
      },
    })
    geojsonLayer.addTo(map)
    overlayMaps['Archeological Sites'] = geojsonLayer
    layerControl.addOverlay(geojsonLayer, 'Archeological Sites')
  })
  .catch((error) => console.error('Error loading GeoJSON:', error))

fetch('natureprotection.geojson')
  .then((response) => response.json())
  .then((data) => {
    var geojsonLayer = L.geoJSON(data, {
      style: function (feature) {
        return {
          fillColor: 'blue',
          color: 'blue',
          weight: 2,
          opacity: 1,
          fillOpacity: 1,
        }
      },
    })
    geojsonLayer.addTo(map)
    overlayMaps['Nature Protection'] = geojsonLayer
    layerControl.addOverlay(geojsonLayer, 'Nature Protection')
  })
  .catch((error) => console.error('Error'))
L.control.scale({ position: 'bottomright' }).addTo(map)

// Add legend to the map
var legend = L.control({ position: 'bottomleft' })

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend')
  div.innerHTML +=
    '<div class="legend-item"><span class="legend-color" style="border: 2px dashed black;"></span> Artificial Lake</div>'
  div.innerHTML +=
    '<div class="legend-item"><span class="legend-color" style="background-color: green;"></span> Archeological Sites</div>'
  div.innerHTML +=
    '<div class="legend-item"><span class="legend-color" style="background-color: blue;"></span> Nature Protection</div>'
  return div
}

legend.addTo(map)
