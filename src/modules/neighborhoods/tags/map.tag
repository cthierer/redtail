<neighborhoods-map>
  <div id={ this.mapId } class="map"></div>
  <script type="babel">
    const leaflet = this.mixin('leaflet').leaflet
    const mapConfig = this.mixin('mapConfig').mapConfig

    const getMarkers = (result, detailsTag, icon) => {
      if (!result) {
        return []
      }

      const locations = result.filter(result => result.latitude && result.longitude)

      // generate markers for each location to show
      return locations.map((location, idx) => {
        const popupId = `${this.mapId}-popup-${idx}-${detailsTag}`
        const marker = leaflet.marker([location.longitude, location.latitude], {
          icon: leaflet.icon({
            iconUrl: `data:image/svg+xml,${this.icons[icon].toSVG({
              xmlns: 'http://www.w3.org/2000/svg'
            })}`
          })
        })

        // stub out a popup for this marker
        marker.bindPopup(`<div id="${popupId}"></div>`)

        marker.on('popupopen', (e) => {
          // mount the popup, center the map on it
          riot.mount(`#${popupId}`, detailsTag, { location })
          this.map.panTo(e.popup.getLatLng())
        })

        // load the marker
        marker.addTo(this.map)

        return marker
      })
    }

    // options
    this.neighborhood = opts.neighborhood || null
    this.rodents = opts.rodents || this.initState()
    this.establishments = opts.establishments || this.initState()

    // reference to the leaflet map on this tag
    this.map = null
    this.mapId = `rodent-map-${this.neighborhood}`

    this.on('mount', () => {
      // initialize the map
      this.map = leaflet.map(this.mapId).setView(mapConfig.initial_view, mapConfig.initial_zoom)
      leaflet.tileLayer(mapConfig.tile_url, mapConfig.options).addTo(this.map)
    })

    this.on('updated', () => {
      // when the data is updated, also update the map
      if (this.map) {
        // map must be initailized (only done after mounting)
        // resize based on visibility
        this.map.invalidateSize()

        if (this.rodents.result || this.establishments.result) {
          const rodents = getMarkers(this.rodents.result, 'rodents-map-details', 'bug')
          const establishments = getMarkers(this.establishments.result, 'establishments-map-details', 'radio-tower')
          const group = new leaflet.featureGroup([].concat(rodents, establishments))
          this.map.fitBounds(group.getBounds())
        }
      }
    })
  </script>
  <style scoped>
    .map {
      height: 400px;
    }

    .leaflet-popup {
      width: 250px;
    }
  </style>
</neighborhoods-map>
