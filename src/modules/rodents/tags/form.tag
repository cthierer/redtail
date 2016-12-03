<rodents-form>
  <h2>
    { rodent.id ? 'Update report' : 'Report rodent' }
  </h2>
  <form onsubmit={ save }>
    <input type="hidden" name="id" value={ rodent.id }>

    <fieldset>
      <legend>Neighborhood</legend>
      <div class="row">
        <div class="col-md-8">
          <div class="form-group">
            <label class="sr-only" for="rodentNeighborhood">Neighborhood</label>
            <select name="neighborhood_id"
                class="form-control"
                id="rodentNeighborhood"
                required>
              <option each={ neighborhoods.result }
                  value={ id }
                  selected={ parent.rodent.neighborhood_id == id }>
                { name }
              </option>
            </select>
            <small class="form-text text-muted">
              Select the neighborhood where the rodent was spotted.
            </small>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>Address</legend>
      <div class="row">
        <div class="col-md-8">
          <div class="form-group">
            <label for="rodentStreet">Street</label>
            <input type="text"
              name="street"
              class="form-control"
              id="rodentStreet"
              placeholder="100 Holliday St"
              onchange={ geocode }
              required
              value={ rodent.street }>
            <small class="form-text text-muted">
              Enter the street address where the rodent was spotted.
            </small>
          </div>
          <div class="form-group">
            <label for="rodentCity">City</label>
            <input type="text"
              name="city"
              class="form-control"
              id="rodentCity"
              onchange={ geocode }
              readonly
              required
              value={ rodent.city || "Baltimore" }>
          </div>
          <div class="form-group">
            <label for="rodentState">State</label>
            <input type="text"
              name="state"
              class="form-control"
              id="rodentState"
              onchange={ geocode }
              readonly
              required
              value={ rodent.state || "MD" }>
          </div>
          <div class="form-group">
            <label for="rodentZip">Zip</label>
            <input type="text"
              name="zip"
              class="form-control"
              id="rodentZip"
              placeholder="21202"
              onchange={ geocode }
              required
              pattern="[0-9]\{5\}(-[0-9]\{4\})?"
              value={ rodent.zip }>
            <small class="form-text text-muted">
              Supports Zip or Zip+4.
            </small>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label>Location</label>
            <input type="hidden" name="latitude" value={ getLat() }>
            <input type="hidden" name="longitude" value={ getLng() }>
            <core-map markers={ marker ? [marker] : [] }></core-map>
            <small class="form-text text-muted">
              Location is automatically calculated based on the entered
              street and Zip code.
            </small>
          </div>
        </div>
      </div>
    </fieldset>

    <div class="row">
      <div class="col-md-4">
        <fieldset class="form-group">
          <legend>Source</legend>
          <p class="form-text text-muted">
            Where did this report originate?
          </p>
          <div class="row">
            <div class="col-md-12">
              <div each={ sources.result } class="form-check">
                <label class="form-check-label">
                  <input type="radio"
                    name="source_id"
                    class="form-check-input"
                    value={ id }
                    checked={ parent.rodent.source_id == id }
                    required>
                  { title }
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="col-md-4">
        <fieldset>
          <legend>Assign to</legend>
          <p class="form-text text-muted">
            Which city department should handle this report?
          </p>
          <div class="row">
            <div class="col-md-12">
              <div each={ agencies.result } class="form-check">
                <label class="form-check-label">
                  <input type="radio"
                    name="agency_id"
                    class="form-check-input"
                    value={ id }
                    checked={ parent.rodent.agency_id == id}
                    required>
                  { name }
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="col-md-4">
        <fieldset>
          <legend>Status</legend>
          <p class="form-text text-muted">
            Is this still an active problem?
          </p>
          <div class="row">
            <div class="col-md-12">
              <div each={ statuses.result } class="form-check">
                <label class="form-check-label">
                  <input type="radio"
                    name="status_id"
                    class="form-check-input"
                    value={ id }
                    checked={ parent.rodent.status_id == id }
                    required>
                  { title }
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>

    <fieldset>
      <legend>Notes</legend>
      <div class="row">
        <div class="col-md-8">
          <div class="form-group">
            <label class="sr-only" for="rodentNotes">Notes</label>
            <textarea name="notes"
              class="form-control"
              id="rodentNotes"
              value={ rodent.notes }></textarea>
          </div>
        </div>
      </div>
    </fieldset>

    <div class="toolbar form-group">
      <button type="submit" class="btn btn-primary btn-lg">
        { rodent.id ? 'Update' : 'Create' }
      </button>
      <button class="btn btn-secondary btn-lg" onclick={ cancel }>
        Cancel
      </button>
    </div>
  </form>
  <script type="babel">
    const leaflet = this.mixin('leaflet').leaflet
    const helpers = this.mixin('rodents').rodents

    this.rodent = opts.rodent || {}       // rodent being edited
    this.marker = null                    // map marker for this rodent

    if (this.rodent && this.rodent.latitude && this.rodent.longitude) {
      // rodent has a location, initialize the marker
      this.marker = leaflet.marker([this.rodent.longitude, this.rodent.latitude])
    }

    this.neighborhoods = this.initState() // lookup all neighborhoods
    this.agencies = this.initState()      // lookup all agencies
    this.sources = this.initState()       // lookup all sources
    this.statuses = this.initState()      // lookup all statuses

    this.neighborhoods.on('core.state.updated', (updated) => {
      this.update({ neighborhoods: updated })
    })

    this.agencies.on('core.state.updated', (updated) => {
      this.update({ agencies: updated })
    })

    this.sources.on('core.state.updated', (updated) => {
      this.update({ sources: updated })
    })

    this.statuses.on('core.state.updated', (updated) => {
      this.update({ statuses: updated })
    })

    this.on('before-mount', () => {
      helpers.loadNeighborhoods(this.neighborhoods)
      helpers.loadAgencies(this.agencies)
      helpers.loadSources(this.sources)
      helpers.loadStatuses(this.statuses)
    })

    this.getLat = () => {
      if (this.marker) {
        return this.marker.getLatLng().lng
      }
      return null
    }

    this.getLng = () => {
      if (this.marker) {
        return this.marker.getLatLng().lat
      }
      return null
    }

    this.geocode = () => {
      const address = {
        street: this.rodentStreet.value,
        state: this.rodentState.value,
        city: this.rodentCity.value,
        zip: this.rodentZip.value
      }

      if (address.street && address.state && address.city && address.zip) {
        helpers.geocode(address)
          .then((coordinates) => {
            this.marker = leaflet.marker([coordinates.longitude, coordinates.latitude])
            this.update()
          })
      }
    }

    this.save = (e) => {
      const data = helpers.serialize(e.target, { hash: true, disabled: true })
      const saveState = this.initState(opts.state)

      saveState.data = data
      saveState.on('core.state.updated', (updated) => {
        if (updated && updated.result) {
          riot.route('/')
        }
      })
      saveState.on('core.state.notify.error', () => {
        window.scrollTo(0, 0)
      })

      helpers.save(saveState)
      return false
    }

    this.cancel = () => {
      riot.route('/')
    }
  </script>
  <style scoped>
    .map {
      height: 300px;
    }
  </style>
</rodents-form>
