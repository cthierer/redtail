<neighborhoods-list>
  <div class="neighborhood-listing">
    <form class="filter" onsubmit={ filter }>
      <filter-match label="Search" name="search" filter={ state.filter }></filter-match>
    </form>
    <ul class="sort">
      <li class="field">
        <filter-sorter label="Name" name="name" sort={ state.sort }></filter-sorter>
      </li>
      <li class="field">
        <filter-sorter label="Area" name="area" sort={ state.sort }></filter-sorter>
      </li>
    </ul>
    <neighborhoods-list-item each={ state.result } neighborhood={ this }></neighborhoods-list-item>
    <filter-pagination links={ state.links }></filter-pagination>
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

    // execute the filter - doesn't do anything because the individual filter
    // tags handle updating the state and updating
    // used to prevent the default form action when the user presses "enter"
    this.filter = () => false
  </script>
</neighborhoods-list>
