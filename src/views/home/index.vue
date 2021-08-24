<template>
  <div class="canvas-parent" />
</template>

<script>
import TrackCanvas from './track-canvas.js'

import trackList from './track-list.js'

export default {
  components: {},
  data() {
    return {
      trackList: [],
      canvasSize: {},
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
    this.getTackList()
  },
  mounted() {
    const parent = document.querySelector('.canvas-parent')

    this.TrackCanvas = new TrackCanvas(parent, this.trackList, {
      width: this.canvasSize.w,
      height: this.canvasSize.h
    })

    if (this.cart.coordinate[0] >= 1000) {
      clearInterval(this.time)
      this.time = null
    } else {
      this.setCartPositon(() => {
        this.TrackCanvas.reset()
        this.TrackCanvas.drawCart(this.cart)
      })
    }
  },
  methods: {
    // 模拟数据请求
    getTackList() {
      this.trackList = trackList.data
      this.canvasSize = trackList.canvasSize
    },
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
    width: 100%;
    height: 100vh;
    background: #000;
}
</style>
