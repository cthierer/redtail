<rodents-edit-button>
  <button class={ btn: true, btn-sm: opts.sm } onclick={ gotoEdit }>
    <core-icon name="zap"></core-icon>
    <yield/>
  </button>
  <script type="babel">
    this.gotoEdit = () => {
      riot.route(`rodents/edit/${opts.id}`)
    }
  </script>
</rodents-edit-button>
