<neighborhoods-list-item>
  <div class="neighborhood card card-block">
    <h4 class="card-title data-field title">{ neighborhood.name }</h4>
    <div class="card-text">
      <span class="data-field area">
        { neighborhood.area }
      </span>
    </div>
  </div>
  <script type="babel">
    this.neighborhood = opts.neighborhood || {}
  </script>
</neighborhoods-list-item>
