<filter-sorter>
  <a class="sorter" href="#" onclick={ submit }>
    <span class="field">{ opts.label }</span>
    <span class="direction asc" show={ get() == 'asc' }>
      <core-icon name="triangle-up" alt="[asc]"></core-icon>
    </span>
    <span class="direction desc" show={ get() == 'desc'}>
      <core-icon name="triangle-down" alt="[desc]"></core-icon>
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
