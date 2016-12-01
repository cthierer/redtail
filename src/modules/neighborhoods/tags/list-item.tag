<neighborhoods-list-item>
  <div class="neighborhood card">
    <h4 class="card-header">{ neighborhood.name }</h4>
    <div class="card-block">
      <div class="card-text field-list-center">
        <h5 class="sr-only">Overview</h5>
        <div class="data-field area">
          <span class="data-label">
            <core-icon name="globe"></core-icon>
            Area
          </span>
          <span class="data-value">{ number(neighborhood.area).format('0,0.00') } ft<sup>2</sup></span>
        </div>
        <div class="data-field num-rodents">
          <span class="data-label">
            <core-icon name="bug"></core-icon>
            Rodents
          </span>
          <span class="data-value">{ neighborhood.num_rodents }</span>
        </div>
        <div class="data-field num_establishments">
          <span class="data-label">
            <core-icon name="radio-tower"></core-icon>
            Establishments
          </span>
          <span class="data-value">{ neighborhood.num_establishments }</span>
        </div>
      </div>
    </div>
    <div class="card-block" show={ showDetails }>
      <h5>Details</h5>
      <p hide={ hasDetails() }>
        No rodents or establishments in this neighborhood.
      </p>
      <neighborhoods-list-details show={ hasDetails() } neighborhood={ neighborhood }
        establishments={ establishments }
        rodents={ rodents }>
      </neighborhoods-list-details>
    </div>
    <div class="card-footer">
      <button class="btn" onclick={ toggleDetails }>
        Details
        <core-icon name="triangle-up" show={ showDetails }></core-icon>
        <core-icon name="triangle-down" hide={ showDetails }></core-icon>
      </button>
    </div>
  </div>
  <script type="babel">
    const rodentActions = this.mixin('rodents').rodents
    const establishmentActions = this.mixin('establishments').establishments
    const initSearchState = (option) => {
      const state = option || this.initState()

      state.sort.set('created_at', 'desc')
      state.filter.limit = 100

      if (this.neighborhood.id) {
        state.filter.addWhere({ neighborhood: this.neighborhood.id })
      }

      return state
    }

    this.state = opts.state || {}
    this.neighborhood = opts.neighborhood || {}
    this.rodents = initSearchState()
    this.establishments = initSearchState()
    this.detailsMountId = `neighborhood-details-${this.neighborhood.id}`

    this.state.showDetails = this.state.showDetails || {}
    this.showDetails = this.state.showDetails[this.detailsMountId] || null

    this.rodents.on('core.state.updated', (updated) => {
      // trigger this tag to re-render when the state has been updated
      this.update({ rodents: updated })
    })

    this.establishments.on('core.state.updated', (updated) => {
      // trigger this tag to re-render when the state has been updated
      this.update({ establishments: updated })
    })

    this.on('before-mount', () => {
      if (this.showDetails !== null) {
        rodentActions.loadAll(this.rodents)
        establishmentActions.loadAll(this.establishments)
      }
    })

    this.hasDetails = () => {
      return this.rodents.count > 0 || this.establishments.count > 0
    }

    this.toggleDetails = () => {
      if (this.showDetails === null) {
        rodentActions.loadAll(this.rodents)
        establishmentActions.loadAll(this.establishments)

        this.showDetails = true
      } else {
        this.showDetails = !this.showDetails
      }

      this.state.showDetails[this.detailsMountId] = this.showDetails
    }
  </script>
  <style scoped>
    .field-list-center .data-field {
      display: inline-block;
      margin-left: 1%;
      margin-right: 1%;
      width: 30%;
    }

    .field-list-center .data-label,
    .field-list-center .data-value {
      display: block;
      text-align: center;
    }

    .field-list-center .data-label {
      font-weight: 700;
    }
  </style>
</neighborhoods-list-item>
