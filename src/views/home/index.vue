<template>
  <div class="canvas-parent" />
</template>

<script>
import TrackCanvas from './track-canvas.js'

export default {
  components: {},
  data() {
    return {
      TrackCanvas: null,
      maxX: 0,
      minX: 0,
      minY: 0,
      maxY: 0,
      canvasSize: {
        w: 2000,
        h: 2000
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.createdCanvas()
    this.draw()
  },
  methods: {
    // 绘制各种数据
    async draw() {
      const data = await this.getTackList()

      const { maxLeft, minLeft, minTop, maxTop } = this.setScale(data.mapLine)
      this.maxX = maxLeft
      this.minX = minLeft
      this.minY = minTop
      this.maxY = maxTop

      this.setCanvasSize()

      const mapLine = this.setTrackLine(data.mapLine)
      console.log('🚀 ~ file: index.vue ~ line 34 ~ draw ~ mapLine', mapLine)
      this.TrackCanvas.drawMapLine(mapLine)
    },
    // 计算 canvas 大小
    setCanvasSize() {
      // const scaleW = 2000 / (this.maxX - this.minX)
      // const scaleH = 2000 / (this.minX - this.minLeft)
      // const w =
      // const h = scaleH * (this.minY - this.minTop)
      // const w = scaleW * (this.maxY - this.minLeft)
      const w = this.maxX - this.minX
      console.log('🚀 ~ file: index.vue ~ line 56 ~ setCanvasSize ~ w', w)
      const h = this.maxY - this.minY
      console.log('🚀 ~ file: index.vue ~ line 57 ~ setCanvasSize ~ h', h)

      const scaleW = 2000 / w
      const scaleH = 2000 / h

      this.canvasSize = {
        w: scaleW,
        h: scaleH
      }
    },
    // 模拟数据请求
    getTackList() {
      return new Promise((resolve, reject) => {
        this.$get('./map.json').then(res => {
          if (res.code === 200) {
            this.data = res.data
            resolve(res.data)
          } else {
            reject()
            alert(res.msg || '未知错误')
          }
        })
      })
    },
    // 查找最小值 最大值 计算画布位置
    setScale(list) {
      const xArr = []
      const yArr = []

      list.forEach(item => {
        for (let i = 0; i < item.line.length; i++) {
          const { x, y } = item.line[i]
          xArr.push(x)
          yArr.push(y)
        }
      })
      return {
        maxLeft: Math.max(...xArr),
        minLeft: Math.min(...xArr),
        minTop: Math.min(...yArr),
        maxTop: Math.max(...yArr)
      }
    },
    // 设置轨道数据
    setTrackLine(list) {
      const arr = list
      const arrTemp = []
      for (let i = 0; i < arr.length; i++) {
        const line = arr[i].line
        const name = arr[i].name
        const coordinate = []

        for (let j = 0; j < line.length; j++) {
          const { x, y } = line[j]
          coordinate.push(x, y)
        }

        arrTemp.push({
          name: name, // 股道名称
          color: '#fff',
          coordinate: this.setCoordinate(coordinate)
        })
      }
      return arrTemp
    },
    createdCanvas() {
      const parent = document.querySelector('.canvas-parent')
      this.TrackCanvas = new TrackCanvas(parent)
    },
    setCoordinate(arr) {
      const newArr = []
      const length = arr.length - 4
      let startIndex = 0
      let endIndex = 4
      length < 1 && (newArr[0] = arr.slice(startIndex, endIndex))

      for (let i = 0; i < length; i++) {
        if (i > 0) {
          startIndex += 2
          endIndex += 2
        }
        newArr[i] = arr.slice(startIndex, endIndex)
      }
      return newArr
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
