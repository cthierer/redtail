<filter-match>
  <div class="match form-group">
    <label>
      <yield/>
      <input type="text" name={ opts.name } value={ filter[opts.name] } onchange={ submit }/>
    </label>
  </div>
  <script type="babel">
    this.filter = opts.filter || {}

    this.submit = (e) => {
      if (this.filter && this.filter.addWhere) {
        this.filter.addWhere({ [opts.name]: e.target.value })
      }

      return false
    }

    this.on('update', () => {
      this.filter = opts.filter || {}
    })
  </script>
</filter-match>
