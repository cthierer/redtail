<filter-match>
  <div class="match form-group">
    <label>
      <yield/>
      <input type="text" name={ opts.name } value={ value() } onchange={ submit }/>
    </label>
  </div>
  <script type="babel">
    this.filter = opts.filter || {}

    this.submit = (e) => {
      if (this.filter && this.filter.addWhere) {
        this.filter.addWhere({ [opts.name]: e.target.value })

        this.filter.active = this.filter.active || {}
        this.filter.active[opts.name] = e.target.value
      }

      return false
    }

    this.value = () => {
      if (this.filter && this.filter.active) {
        return this.filter.active[opts.name]
      }
    }

    this.on('update', () => {
      this.filter = opts.filter || {}
    })
  </script>
</filter-match>
