<filter-pagination>
  <nav aria-label="page navigation" if={ links.next || links.previous }>
    <ul class="pagination">
      <li class="page-item { disabled: !links.previous }">
        <a class="page-link" href="#" aria-label="previous" onclick={ previousPage }>
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">previous</span>
        </a>
      </li>
      <li class="page-item { disabled: !links.next }">
        <a class="page-link" href="#" aria-label="next" onclick={ nextPage }>
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">next</span>
        </a>
      </li>
    </ul>
  </nav>
  <script type="babel">
    this.links = opts.links || {}

    this.navigate = (to) => {
      if (this.links.navigate) {
        this.links.navigate(to)
      }
    }

    this.nextPage = () => {
      if (this.links.next) {
        this.navigate('next')
      }

      return false
    }

    this.previousPage = () => {
      if (this.links.previous) {
        this.navigate('previous')
      }

      return false
    }

    this.on('update', (ctx) => {
      this.links = opts.links || {}
    })
  </script>
</filter-pagination>
