<redtail-landing>
  <h2>Rodent tracker</h2>
  <p class="lead">
    Track rodents around the Baltimore neighborhoods, and their proximity to
    food establishments.
  </p>
  <div class="row">
    <div class="col-md-8">
      <p>
        Browse Baltimore neighborhoods using the listing below. Use the
        search box to <strong>find neighborhoods by name</strong>. Sort
        results by: neighborhood <strong>name</strong>, total
        <strong>area</strong> of the neighborhood, number of
        <strong>rodents</strong> reported in the neighborhood, and number of
        food <strong>establishments</strong> in each neighborhood.
      </p>
      <p>
        Clicking the <strong>details</strong> button for each neighborhood
        shows a <strong>map</strong> of all rodents and food establishments in
        that area, as well as a summary of the <strong>last reported rodent
        sighting</strong> in the neighborhood.
      </p>
      <p>
        Rodent sightings can be <strong>edited</strong> or
        <strong>deleted</strong> by clicking on locations on the map.
      </p>
    </div>
    <div class="col-md-4">
      <div class="card card-inverse card-primary">
        <div class="card-block">
          <h3 class="card-title">Spot a critter?</h3>
          <p class="card-text">
            Use the button below to report a new rodent sighting in your
            neighborhood.
          </p>
          <rodents-add-button>Report rodent</rodents-add-button>
        </div>
      </div>
    </div>
  </div>
  <hr/>
  <neighborhoods-list state={ opts.state }></neighborhoods-list>
  <style scoped>
    .card-primary {
      background-color: #373a3c;
      border-color: #373a3c;
    }
  </style>
</redtail-landing>
