<neighborhoods-list>
  <div class="neighborhood-listing">
    <neighborhoods-list-item each={ neighborhoods } neighborhood={ this }>
    </neighborhoods-list-item>
  </div>
  <script type="babel">
    this.neighborhoods = opts.state.neighborhoods || []
  </script>
</neighborhoods-list>
