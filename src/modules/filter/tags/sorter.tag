<filter-sorter>
  <a class="sorter" href="#" onclick={ submit }>
    <span class="field">{ opts.label }</span>
    <span class="direction desc" show={ get() == 'asc' }>
      [asc]
    </span>
    <span class="direction asc" show={ get() == 'desc'}>
      [desc]
    </span>
  </a>
  <script type="babel">
    this.sort = opts.sort || {}

    this.get = () => {
      if (this.sort && this.sort.getDirection) {
        return this.sort.getDirection(opts.name)
      }

      return null
    }

    this.submit = () => {
      if (this.sort && this.sort.toggle) {
        this.sort.toggle(opts.name)
      }
    }

    this.on('update', () => {
      this.sort = opts.sort || {}
    })
  </script>
</filter-sorter>
