<neighborhoods-list-item>
  <div class="neighborhood card">
    <h4 class="card-header">{ neighborhood.name }</h4>
    <div class="card-block">
      <div class="card-text">
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
      <div id={ mapMountId }></div>
    </div>
    <div class="card-footer">
      <button class="btn" onclick={ showMap }>
        Details
        <core-icon name="triangle-up" show={ showDetails }></core-icon>
        <core-icon name="triangle-down" hide={ showDetails }></core-icon>
      </button>
    </div>
  </div>
  <script type="babel">
    this.neighborhood = opts.neighborhood || {}
    this.mapMountId = `map-${this.neighborhood.id}`
    this.showDetails = null

    this.showMap = () => {
      if (this.showDetails === null) {
        riot.mount(`#${this.mapMountId}`, 'rodents-map', {
          neighborhood: this.neighborhood.id
        })

        this.showDetails = true
      } else {
        this.showDetails = !this.showDetails
      }
    }
  </script>
  <style scoped>
    .data-field {
      display: inline-block;
      margin-left: 1%;
      margin-right: 1%;
      width: 30%;
    }

    .data-label,
    .data-value {
      display: block;
      text-align: center;
    }

    .data-label {
      font-weight: 700;
    }
  </style>
</neighborhoods-list-item>
