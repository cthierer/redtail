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

    // listen for notify events, and load data into the tag to show
    this.state.on('core.state.notify', (type, notification) => {
      this.reset()
      this.type = type
      this.message = notification.message
      this.details = Array.isArray(notification.details)
        ? notification.details
        : (notification.details ? [notification.details] : null)
      this.update()

      // auto-hide info and success messages after 20 seconds
      if (this.isInfo() || this.isSuccess()) {
        setTimeout(() => this.dismiss(), 20000)
      }
    })

    // check if the notification should be visible
    this.isVisible = () => this.type && this.message

    // check if the notification is an error notification
    this.isError = () => this.type === 'error'

    // check if the notification is an info notification
    this.isInfo = () => this.type === 'info'

    // check if the notification is  a success notification
    this.isSuccess = () => this.type === 'success'

    // reset the notification to its initial (empty) state
    this.reset = () => {
      this.type = null
      this.message = null
      this.details = []
    }

    // dismiss the notification
    this.dismiss = () => {
      this.reset()
      this.update()
    }

    this.on('before-mount', () => {
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
