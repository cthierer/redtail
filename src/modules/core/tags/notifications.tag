<core-notifications>
  <div show={ isVisible() }
      class={ alert: true, alert-success: isSuccess(), alert-info: isInfo(), alert-danger: isError(), fade: true, in: true }
      role="alert">
    <button type="button" class="close" aria-label="Close" onclick={ dismiss }>
      <span aria-hidden="true">&times;</span>
    </button>
    <p>{ message }</p>
    <ul if={ details } class="list-unstyled">
      <li each={ details }>{ message }</li>
    </ul>
  </div>
  <script type="babel">
    this.state = opts.state
    this.type = null
    this.message = null
    this.details = []

    this.state.on('core.state.notify', (type, notification) => {
      this.reset()
      this.type = type
      this.message = notification.message
      this.details = Array.isArray(notification.details)
        ? notification.details
        : (notification.details ? [notification.details] : null)
      this.update()
    })

    this.state.on('core.state.updated', (state) => {
      this.update({ state })
    })

    this.isVisible = () => this.type && this.message
    this.isError = () => this.type === 'error'
    this.isInfo = () => this.type === 'info'
    this.isSuccess = () => this.type === 'success'

    this.reset = () => {
      this.type = null
      this.message = null
      this.details = []
    }

    this.dismiss = () => {
      this.reset()
    }

    this.on('mount', () => {
      this.reset()
    })
  </script>
  <style scoped>
    .alert > p {
      margin-bottom: 0;
    }

    .alert > *:last-child {
      margin-bottom: 0;
    }
  </style>
</core-notifications>
