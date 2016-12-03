<rodents-add-button>
  <button class="btn btn-primary" onclick={ reportRodent }>
    <core-icon name="location"></core-icon>
    <yield/>
  </button>
  <script type="babel">
    this.reportRodent = () => {
      riot.route('rodents/create')
      return false
    }
  </script>
</rodents-add-button>
