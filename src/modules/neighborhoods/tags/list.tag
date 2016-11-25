<neighborhoods-list>
  <div class="neighborhood-listing">
    <form class="filter" onsubmit={ filter }>
      <filter-match label="Search" name="search" filter={ state.filter }></filter-match>
      <button type="submit">Filter</button>
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
    this.state = opts.state || {}

    this.filter = () => false
  </script>
</neighborhoods-list>
