<neighborhoods-list>
  <h2>Neighborhoods</h2>
  <div class="neighborhood-listing row">
    <div class="col-sm-4 push-sm-8">
      <div class="filter">
        <h3>Filter</h3>
        <form onsubmit={ filter }>
          <filter-match name="search" filter={ state.filter }>
            <core-icon name="search" alt="Search"></core-icon>
          </filter-match>
        </form>
      </div>
      <div class="sort">
        <h3>Sort</h3>
        <ul class="list-inline">
          <li class="list-inline-item" data-is="filter-sorter" label="Name" name="name" sort={ state.sort }></li>
          <li class="list-inline-item" data-is="filter-sorter" label="Area" name="area" sort={ state.sort }></li>
          <li class="list-inline-item" data-is="filter-sorter" label="Rodents" name="num_rodents" sort={ state.sort }></li>
          <li class="list-inline-item" data-is="filter-sorter" label="Establishments" name="num_establishments" sort={ state.sort }></li>
        </ul>
      </div>
    </div>
    <div class="col-sm-8 pull-sm-4">
      <div class="results">
        <h3 class="sr-only">Results</h3>
        <neighborhoods-list-item each={ state.result } neighborhood={ this }></neighborhoods-list-item>
      </div>
      <filter-pagination links={ state.links }></filter-pagination>
    </div>
  </div>
  <script type="babel">
    const actions = this.mixin('neighborhoods')

    // state can be passed in as an option, or initialized here
    this.state = opts.state || this.initState()

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

    this.on('updated', () => {
      window.scrollTo(0,0)
    })

    // execute the filter - doesn't do anything because the individual filter
    // tags handle updating the state and updating
    // used to prevent the default form action when the user presses "enter"
    this.filter = () => false
  </script>
</neighborhoods-list>
