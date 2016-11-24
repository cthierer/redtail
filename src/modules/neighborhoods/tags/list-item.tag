<neighborhoods-list-item>
  <div class="neighborhood">
    <div class="data-field title">
      { neighborhood.name }
    </div>
    <div class="data-field area">
      { neighborhood.area }
    </div>
  </div>
  <script type="babel">
    this.neighborhood = opts.neighborhood || {}
  </script>
</neighborhoods-list-item>
