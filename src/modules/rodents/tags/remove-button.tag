<rodents-remove-button>
  <button class={ btn: true, btn-sm: opts.sm, btn-danger: true } onclick={ doDelete }>
    <core-icon name="x"></core-icon>
    <yield/>
  </button>
  <script type="babel">
    const helpers = this.mixin('rodents').rodents

    this.state = this.initState()

    this.state.on('core.state.updated', () => {
      riot.route('/')
      this.refresh()
    })

    this.state.on('core.state.notify', (type, notification) => {
      opts.state.notify(type, notification.message, notification.details)
    })

    this.on('update', () => {
      this.state.id = opts.id
    })

    this.doDelete = () => {
      if (window.confirm('Do you really want to delete?')) {
        helpers.remove(this.state)
      }

      return false
    }
  </script>
</rodents-remove-button>
