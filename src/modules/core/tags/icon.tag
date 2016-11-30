<core-icon>
  <object>
    <core-raw html={ svg || alt } aria-text={ alt } aria-hidden="true"></core-raw>
  </object>
  <script type="babel">
    this.icon = this.icons[opts.name]
    this.svg = this.icon ? this.icon.toSVG() : null
    this.alt = opts.alt
  </script>
</core-icon>
