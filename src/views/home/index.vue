<template>
  <div class="canvas-parent" />
</template>

<script>
import TrackCanvas from './track-canvas.js'

export default {
  components: {},
  data() {
    return {
      cart: {
        name: 'DF4D147',
        typeName: 'track_1',
        coordinate: [400, 500]
      },
      TrackCanvas: null,
      time: null
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {
    const parent = document.querySelector('.canvas-parent')
    this.TrackCanvas = new TrackCanvas(parent)
    this.TrackCanvas.draw()

    if (this.cart.coordinate[0] >= 1000) {
      clearInterval(this.time)
      this.time = null
    } else {
      this.setCartPositon(() => {
        console.log(this.cart)
        this.TrackCanvas.clearCanvas(this.cart)
        this.TrackCanvas.draw(this.cart)
        this.TrackCanvas.drawCart(this.cart)
      })
    }
  },
  methods: {
    setCartPositon(callBack) {
      let x = 400
      const y = 500
      this.time = setInterval(() => {
        this.cart.coordinate = [x += 10, y]
        callBack()
      }, 1000)
    }
  }
}
</script>

<style lang='scss' scoped>
.canvas-parent {
    margin: 20px;
}
</style>
