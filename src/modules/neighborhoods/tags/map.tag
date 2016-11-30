<neighborhoods-map>
  <core-map markers={ markers }></core-map>
  <script type="babel">
    const leaflet = this.mixin('leaflet').leaflet

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
          // mount the popup
          riot.mount(`#${popupId}`, detailsTag, { location })
        })

        return marker
      })
    }

    // options
    this.neighborhood = opts.neighborhood || null
    this.rodents = opts.rodents || this.initState()
    this.establishments = opts.establishments || this.initState()
    this.markers = []

    this.on('update', () => {
      if (this.rodents.result || this.establishments.result) {
        const rodents = getMarkers(this.rodents.result, 'rodents-map-details', 'bug')
        const establishments = getMarkers(this.establishments.result, 'establishments-map-details', 'radio-tower')
        this.markers = [].concat(rodents, establishments)
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
