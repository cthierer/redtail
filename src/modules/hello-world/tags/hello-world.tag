<hello-world>
  <p class="upper">
    { message }
  </p>
  <script type="babel">
  this.helloWorld.getMessage().then((message) => {
    this.update({ message })
  })

  this.on('update', (ctx) => {
    this.message = (ctx || {}).message
  })
  </script>
  <style scoped>
  .upper {
    text-transform: uppercase;
  }
  </style>
</hello-world>
