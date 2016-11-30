<core-map>
  <div id={ this.mapId } class="map"></div>
  <script type="babel">
    const leaflet = this.mixin('leaflet').leaflet
    const mapConfig = this.mixin('mapConfig').mapConfig

    // reference to the leaflet map on this tag
    this.map = null
    this.mapId = `map-${Math.trunc(101 * Math.random())}`

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

        if (opts.markers && opts.markers.length) {
          const group = new leaflet.featureGroup(opts.markers)

          opts.markers.forEach((marker) => {
            marker.addTo(this.map)

            marker.on('popupopen', (e) => {
              this.map.panTo(e.popup.getLatLng())
            })
          })
          this.map.fitBounds(group.getBounds())
        }
      }
    })
  </script>
  <style scoped>
    .map {
      height: 150px;
    }
  </style>
</core-map>
