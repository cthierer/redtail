<neighborhoods-map>
  <div id={ this.mapId } class="map"></div>
  <script type="babel">
    const rodentActions = this.mixin('rodents').rodents
    const establishmentActions = this.mixin('establishments').establishments
    const leaflet = this.mixin('leaflet').leaflet
    const mapConfig = this.mixin('mapConfig').mapConfig

    const getState = (option) => {
      const state = option || this.initState()

      state.sort.set('created_at', 'desc')
      state.filter.limit = 100

      if (this.neighborhood) {
        state.filter.addWhere({ neighborhood: this.neighborhood })
      }

      return state
    }

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

    // neighborhood passed in as an option
    this.neighborhood = opts.neighborhood || null

    // reference to the leaflet map on this tag
    this.map = null
    this.mapId = `rodent-map-${this.neighborhood}`

    // setup rodents
    this.rodents = getState(opts.rodents)

    this.rodents.on('core.state.queryUpdated', () => {
      // re-load data when the query is updated
      rodentActions.loadAll(this.rodents)
    })

    this.rodents.on('core.state.updated', (updated) => {
      // trigger this tag to re-render when the state has been updated
      this.update({ rodents: updated })
    })

    // setup establishments
    this.establishments = getState(opts.establishments)

    this.establishments.on('core.state.queryUpdated', () => {
      // re-load data when the query is updated
      establishmentActions.loadAll(this.rodents)
    })

    this.establishments.on('core.state.updated', (updated) => {
      // trigger this tag to re-render when the state has been updated
      this.update({ establishments: updated })
    })

    // tag lifecycle hooks

    this.on('before-mount', () => {
      // pre-load data before the tag is mounted for the first time
      rodentActions.loadAll(this.rodents)
      establishmentActions.loadAll(this.establishments)
    })

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
