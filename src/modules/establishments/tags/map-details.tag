<establishments-map-details>
  <h6>{ location.name }</h6>
  <div class="data-field">
    <span class="data-label">Address</span>
    <span class="data-value address">
      { location.street }<br>
      { location.city }, { location.state } { location.zip }
    </span>
  </div>
  <script type="babel">
    this.location = opts.location || {}
  </script>
  <style scoped>
    .data-field,
    .data-label,
    .data-value {
      display: block;
      margin: 0;
      text-align: left;
      width: 100%;
    }

    .data-field {
      margin-bottom: 7px;
    }

    .data-label {
      font-weight: 700;
    }

    .data-label:after {
      content: ':'
    }
  </style>
</establishments-map-details>
