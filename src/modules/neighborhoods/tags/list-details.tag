<neighborhoods-list-details>
  <div class="data-field-group" show={recentRodent}>
    <div class="data-field">
      <div class="data-label">Last reported</div>
      <div class="data-value">
        { moment(recentRodent.created_at).calendar() }
      </div>
      <div class="data-value">
        { recentRodent.street }
      </div>
      <div class="data-value">
        { recentRodent.status.title } &dash; { recentRodent.notes }
      </div>
      <rodents-edit-button id={ location.id }>Edit</rodents-edit-button>
    </div>
  </div>
  <div class="data-map">
    <neighborhoods-map neighborhood={ neighborhood.id } rodents={rodents} establishments={establishments}></neighborhoods-map>
  </div>
  <script type="babel">
    const rodentActions = this.mixin('rodents').rodents
    const establishmentActions = this.mixin('establishments').establishments
    const getState = (option) => {
      const state = option || this.initState()

      state.sort.set('created_at', 'desc')
      state.filter.limit = 100

      if (this.neighborhood.id) {
        state.filter.addWhere({ neighborhood: this.neighborhood.id })
      }

      return state
    }

    // load options
    this.neighborhood = opts.neighborhood || {}
    this.recentRodent = null

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

    this.on('update', () => {
      if (this.rodents.result) {
        this.recentRodent = this.rodents.result[0]
      }
    })
  </script>
  <style scoped>
    .data-field,
    .data-label,
    .data-value {
      display: block;
      margin: 0;
      text-align: left;
      width: 100%;
    }

    .data-field {
      margin-bottom: 7px;
    }

    .data-label {
      font-weight: 700;
    }

    .data-label:after {
      content: ':'
    }
  </style>
</neighborhoods-list-details>
