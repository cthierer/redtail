<neighborhoods-list-details>
  <div class="row">
    <div class="col-md-9">
      <div class="data-map">
        <neighborhoods-map neighborhood={ neighborhood.id } rodents={ opts.rodents } establishments={ opts.establishments } state={ opts.state }></neighborhoods-map>
      </div>
    </div>
    <div class="col-md-3">
      <div class="data-field-group" show={ recentRodent }>
        <h6 class="font-weight-bold">Last reported sighting</h6>
        <div class="data-field">
          <div class="data-label">Date</div>
          <div class="data-value">
            { moment(recentRodent.created_at).calendar() }
          </div>
        </div>
        <div class="data-field">
          <div class="data-label">Street</div>
          <div class="data-value">
            { recentRodent.street }
          </div>
        </div>
        <div class="data-field">
          <div class="data-label">Status</div>
          <div class="data-value">
            { recentRodent.status.title }
          </div>
        </div>
        <div class="data-field" if={ recentRodent.notes }>
          <div class="data-label">Notes</div>
          <div class="data-value">
            { recentRodent.notes }
          </div>
        </div>
        <rodents-edit-button id={ recentRodent.id } state={ opts.state }>Edit</rodents-edit-button>
        <rodents-remove-button id={ recentRodent.id } state={ opts.state }>Delete</rodents-remove-button>
      </div>
    </div>
  </div>
  <script type="babel">
    const rodentActions = this.mixin('rodents').rodents
    const establishmentActions = this.mixin('establishments').establishments

    // load options
    this.neighborhood = opts.neighborhood || {}
    this.recentRodent = null

    this.on('update', () => {
      if (opts.rodents && opts.rodents.result) {
        this.recentRodent = opts.rodents.result[0]
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
