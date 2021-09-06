<template>
  <div class="canvas-parent" />
</template>

<script>
import TrackCanvas from './track-canvas.js'
import getAngle from './get-angle'

export default {
  components: {},
  data() {
    return {
      timeer: null,
      pageSize: 0,
      data: {},
      TrackCanvas: null,
      zoom: 20,
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
  created() {},
  mounted() {
    this.createdCanvas()
    this.draw()
  },
  methods: {
    // 绘制各种数据
    async draw() {
      const data = await this.getTackList()

      // 信号灯数据
      const { mapLine, mapLight, forks, maptext, otherele, mapocs } = data

      // 股道
      const mapLineTemp = this.setTrackLine(mapLine, 'line')

      // 灯数据
      const mapLightTmep = this.setMapLight(mapLight, mapLineTemp)

      // 岔道
      const forksTemp = this.setForks(forks, '#fff')

      // 脱轨器
      const derailer = this.setDerailer(data.derailer)

      // 轨道注释
      const maptextTemp = this.setMapText(maptext, '#00FF7F')

      // 车档数据
      const othereleTemp = this.setOtherele(otherele, '#FFD700')

      // 终点标
      const mapocsTemp = this.setMapocs(mapocs, '#FFD700')
      console.log('🚀 ~ file: index.vue ~ line 61 ~ draw ~ mapocsTemp', mapocsTemp)

      this.getCartData()

      const trackData = {
        mapLine: mapLineTemp,
        mapLight: mapLightTmep,
        derailer: derailer,
        forks: forksTemp,
        maptext: maptextTemp,
        otherele: othereleTemp,
        mapocs: mapocsTemp
      }

      this.TrackCanvas.setData(trackData)
      this.TrackCanvas.draw()

      // const { cenX, cenY } = this.setZoom(mapLineTemp)
      this.TrackCanvas.translateCanvas(this.setZoom(mapLineTemp))
    },
    // 计算 canvas 大小
    setCanvasSize() {
      // const scaleW = 2000 / (this.maxX - this.minX)
      // const scaleH = 2000 / (this.minX - this.minLeft)
      // const w =
      // const h = scaleH * (this.minY - this.minTop)
      // const w = scaleW * (this.maxY - this.minLeft)
      const w = this.maxX - this.minX
      const h = this.maxY - this.minY
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

    // 模拟请求
    getCartData() {
      const ms = 4000
      this.pageSize++
      this.clearTimeer()

      this.timeer = setTimeout(() => {
        const params = {
          stationId: 11,
          pageNum: 1,
          pageSize: this.pageSize
        }
        this.getcart(params).then(res => {
          this.getCartData()
        }).catch((err) => {
          alert(err.msg || '未知错误')
          this.clearTimeer()
        })
      }, ms)
    },

    clearTimeer() {
      clearInterval(this.timeer)
      this.timeer = null
    },
    // 请求 车的数据
    getcart(params) {
      return new Promise((resolve, reject) => {
        this.$get('http://jiche.4djb.com/railway/train/trainhistoryall', params).then(res => {
          if (res.code === 200) {
            resolve(res.data)
          } else {
            reject()
          }
        })
      })
    },

    // 查找最小值 最大值 计算画布位置
    setZoom(list) {
      let xArr = []
      let yArr = []

      list.forEach(item => {
        for (let i = 0; i < item.coordinate.length; i++) {
          const [x1, y1, x2, y2] = item.coordinate[i]
          xArr.push(x1, x2)
          yArr.push(y1, y2)
        }
      })

      xArr = xArr.filter(item => item)
      yArr = yArr.filter(item => item)

      const maxLeft = Math.max(...xArr)
      const minLeft = Math.min(...xArr)
      const minTop = Math.min(...yArr)
      const maxTop = Math.max(...yArr)
      const cenX = (parseFloat(maxLeft) + parseFloat(minLeft)) / 2
      const cenY = (parseFloat(minTop) + parseFloat(maxTop)) / 2
      const scaleX = 2000 / (maxLeft - minLeft)
      const scaleY = 2000 / (maxTop - minTop)

      return {
        scaleX: scaleX,
        scaleY: scaleY,
        cenX: cenX,
        cenY: cenY,
        maxTop: maxTop,
        minLeft: minLeft
      }
    },
    // 设置终点标
    setMapocs(list, c = '#888888') {
      const arrTemp = []
      list.forEach(item => {
        const coordinate = []
        const { name, pa, pb, point, trackNo } = item
        const startX = Number((pa.x / this.zoom).toFixed(2))
        const startY = Number((pa.y / this.zoom).toFixed(2))
        const endX = Number((pb.x / this.zoom).toFixed(2))
        const endY = Number((pb.y / this.zoom).toFixed(2))
        coordinate.push(startX, startY, endX, endY)

        const pointTemp = {
          x: point.x / this.zoom,
          y: point.y / this.zoom
        }

        arrTemp.push({
          name: name,
          coordinate: coordinate,
          color: c,
          point: pointTemp
        })
      })

      return arrTemp
    },
    // 设置轨道数据
    setTrackLine(list, key, c = '#888888') {
      const arr = list
      const arrTemp = []
      for (let i = 0; i < arr.length; i++) {
        const line = arr[i][key]
        const name = arr[i].name
        const coordinate = []

        const color = c

        for (let j = 0; j < line.length; j++) {
          const { x, y } = line[j]
          const startX = Number((x / this.zoom).toFixed(2))
          const startY = Number((y / this.zoom).toFixed(2))

          coordinate.push(startX, startY)
        }

        arrTemp.push({
          name: name, // 股道名称
          color: color,
          coordinate: this.setCoordinate(coordinate)
        })
      }
      return arrTemp
    },
    // 设置岔道数据
    setForks(list, c = '#fff') {
      const arrTemp = []

      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const { name, point } = item
        const pointTemp = {
          x: point.x / this.zoom,
          y: point.y / this.zoom
        }
        arrTemp.push({
          name: name || i + 1, // 股道名称
          color: c,
          point: pointTemp
        })
      }

      return arrTemp
    },

    // 设置轨道注释
    setMapText(list, c = '#fff') {
      const arrTemp = []

      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const { name, point, angle } = item
        const pointTemp = {
          x: point.x / this.zoom,
          y: point.y / this.zoom
        }
        arrTemp.push({
          name: name || i + 1, // 股道名称
          color: c,
          point: pointTemp,
          angle: angle
        })
      }

      return arrTemp
    },

    // 设置脱轨器
    setDerailer(list, c = 'blue') {
      const arrTemp = []

      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const { name, point } = item
        const pointTemp = {
          x: point.x / this.zoom,
          y: point.y / this.zoom
        }
        arrTemp.push({
          name: name || i + 1, // 股道名称
          color: c,
          point: pointTemp
        })
      }

      return arrTemp
    },
    // 设置灯数据
    setMapLight(mapLight, mapline) {
      const setColor = (state) => {
      //  "state":1,  //信号灯的状态 0无 1红 2蓝 3白
        let color = '#000'
        switch (state) {
          case 0:
            color = '#000'
            break
          case 1:
            color = '#FF0000'
            break
          case 2:
            color = '#0000FF'
            break
          case 3:
            color = '#fff'
            break
        }
        return color
      }

      const arrTemp = []

      for (let i = 0; i < mapLight.length; i++) {
        const item = mapLight[i]
        const { line, name, state, point, trackNo } = item

        const pointTemp = {
          x: point.x / this.zoom,
          y: point.y / this.zoom
        }
        arrTemp.push(Object.assign(item, {
          name: name, // 股道名称
          color: setColor(state),
          point: pointTemp,
          trackNo: trackNo
        }))
      }

      return arrTemp
    },
    // 设置车档数据
    setOtherele(list, color) {
      const arrTemp = []
      for (let i = 0; i < list.length; i++) {
        const line = list[i].line
        const coordinate = []
        for (let j = 0; j < line.length; j++) {
          const { x, y } = line[j]
          const startX = Number((x / this.zoom).toFixed(2))
          const startY = Number((y / this.zoom).toFixed(2))

          coordinate.push(startX, startY)
        }

        arrTemp.push({
          color: color,
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
        if (newArr[i].includes(undefined)) {
          console.log(newArr[i])
        }
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
