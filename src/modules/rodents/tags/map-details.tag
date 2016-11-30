<rodents-map-details>
  <h6>Rodent reported</h6>
  <div class="data-field">
    <span class="data-label">Address</span>
    <span class="data-value address">
      { location.street }<br>
      { location.city }, { location.state } { location.zip }
    </span>
  </div>
  <div class="data-field">
    <span class="data-label">Status</span>
    <span class="data-value status">
      { location.status.title }
    </span>
  </div>
  <div class="data-field">
    <span class="data-label">Reported</span>
    <span class="data-value created_at">
      { moment(location.created_at).calendar() }
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
</rodents-map-details>
