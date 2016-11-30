<rodents-map>
  <div id={ this.mapId } class="map"></div>
  <script type="babel">
    const actions = this.mixin('rodents')
    const leaflet = this.mixin('leaflet').leaflet

    // state can be passed in as an option, or initialized here
    this.state = opts.state || this.initState()

    // set defaults for filtering
    this.state.sort.set('created_at', 'desc')
    this.state.filter.limit = 100

    // neighborhood passed in as an option
    this.neighborhood = opts.neighborhood || null

    // filter on neighborhood, if specified
    if (this.neighborhood) {
      this.state.filter.addWhere({ neighborhood: this.neighborhood })
    }

    // reference to the leaflet map on this tag
    this.map = null
    this.mapId = `rodent-map-${this.neighborhood}`

    this.state.on('core.state.queryUpdated', () => {
      // re-load data when the query is updated
      actions.loadAll(this.state)
    })

    this.state.on('core.state.updated', (updated) => {
      // trigger this tag to re-render when the state has been updated
      this.update({ state: updated })
    })

    this.on('before-mount', () => {
      // pre-load data before the tag is mounted for the first time
      actions.loadAll(this.state)
    })

    this.on('mount', () => {
      // initialize the map
      this.map = leaflet.map(this.mapId)
        .setView([39.299236, -76.609383], 13) // center on Baltimore
      leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        accessToken: 'pk.eyJ1IjoiY3RoaWVyZXIiLCJhIjoiY2l3NGdoaTZkMDBrbzJ0cGd2eGU2aGs5MiJ9.aHADhfD8LYo7TvpGbWfirA'
      }).addTo(this.map)
    })

    this.on('updated', () => {
      // when the data is updated, also update the map
      if (this.map) {
        // map must be initailized (only done after mounting)
        // resize based on visibility
        this.map.invalidateSize()

        if (this.state.result) {
          // only map locations that have a latitude/longitude
          const locations = this.state.result.filter(result => result.latitude && result.longitude)
          // generate markers for each location to show
          const markers = locations.map((rodent, idx) => {
            const id = `${this.mapId}-popup-${idx}`
            const marker = leaflet.marker([rodent.longitude, rodent.latitude], {
              icon: leaflet.icon({
                iconUrl: `data:image/svg+xml,${this.icons.bug.toSVG({
                  xmlns: 'http://www.w3.org/2000/svg'
                })}`
              })
            })

            // stub out a popup for this marker
            marker.bindPopup(`<div id="${id}"></div>`)

            marker.on('popupopen', (e) => {
              // mount the popup, center the map on it
              riot.mount(`#${id}`, 'rodents-map-details', { location: rodent })
              this.map.panTo(e.popup.getLatLng())
            })

            // load the marker
            marker.addTo(this.map)

            return marker
          })
          // initialize a group of all of the markers
          const group = new leaflet.featureGroup(markers)

          // fit map to the markers that were loaded
          this.map.fitBounds(group.getBounds())
        }
      }
    })
  </script>
  <style scoped>
    .map {
      height: 325px;
    }

    .leaflet-popup {
      width: 250px;
    }
  </style>
</rodents-map>
