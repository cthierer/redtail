<neighborhoods-list>
  <div class="neighborhood-listing">
    <div class="row">
      <div class="col-md-7 sort">
        <h3>Sort by</h3>
        <ul class="list-inline">
          <li class="list-inline-item" data-is="filter-sorter" label="Name" name="name" sort={ state.sort }></li>
          <li class="list-inline-item" data-is="filter-sorter" label="Area" name="area" sort={ state.sort }></li>
          <li class="list-inline-item" data-is="filter-sorter" label="Rodents" name="num_rodents" sort={ state.sort }></li>
          <li class="list-inline-item" data-is="filter-sorter" label="Establishments" name="num_establishments" sort={ state.sort }></li>
        </ul>
      </div>
      <div class="col-md-5 text-md-right filter">
        <h3 class="sr-only">Filter</h3>
        <form onsubmit={ filter }>
          <filter-match name="search" filter={ state.filter }>
            <core-icon name="search" alt="Search"></core-icon>
            <span class="hidden-md-down">Name</span>
          </filter-match>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 results">
        <h3 class="sr-only">Results</h3>
        <div each={ state.result }>
          <neighborhoods-list-item neighborhood={ this } state={ parent.state }></neighborhoods-list-item>
        </div>
      </div>
      <filter-pagination links={ state.links }></filter-pagination>
    </div>
  </div>
  <script type="babel">
    const actions = this.mixin('neighborhoods')

    // state can be passed in as an option, or initialized here
    this.state = opts.state || this.initState()

    this.state.on('core.state.refresh', () => {
      actions.loadAll(this.state)
    })

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

    // execute the filter - doesn't do anything because the individual filter
    // tags handle updating the state and updating
    // used to prevent the default form action when the user presses "enter"
    this.filter = () => false
  </script>
  <style scoped>
    .sort .list-inline {
      display: inline;
    }

    .sort .list-inline-item {
      margin-right: 15px;
    }

    .sort h3 {
      display: inline;
      font-size: 1rem;
      font-weight: 700;
      margin-right: 7px;
    }

    .filter label {
      font-weight: 700
    }
  </style>
</neighborhoods-list>
