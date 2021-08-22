
const tackList = [
  {
    name: 'track_1', // 股道名称
    color: '#fff',
    // 线的坐标 相对于画布位置  开始X轴位置 开始y轴位置 结束X轴位置 结束y轴位置
    coordinate: [
      [200, 500, 1200, 500],
      [1200, 500, 1250, 550],
      [1250, 550, 1250, 650],
      [1250, 650, 1200, 700],
      [1200, 700, 100, 700]
    ],
    // 土挡的位置
    soilBlock: {
      name: '土挡1',
      coordinate: [200, 500],
      direction: 'right' // right or left
    },
    // 脱轨器
    derailer: {
      name: '脱轨器-01',
      coordinate: [220, 500]
    },
    // 灯的坐标 相对于画布
    lamp: [
      {
        name: 'd3',
        color: 'blue',
        coordinate: [300, 500] // 灯的坐标
      },
      {
        name: 'd3',
        color: 'blue',
        coordinate: [600, 500]
      },
      {
        name: 'd3',
        color: 'blue',
        coordinate: [900, 500]
      },
      {
        name: 'd3',
        color: 'blue',
        coordinate: [1200, 500]
      },
      {
        name: 'd3',
        color: 'red',
        coordinate: [200, 700]
      },
      {
        name: 'd3',
        color: 'red',
        coordinate: [300, 700]
      },
      {
        name: 'd3',
        color: 'red',
        coordinate: [600, 700]
      },
      {
        name: 'd3',
        color: 'red',
        coordinate: [1100, 700]
      }
    ]
  }
]

// const cart = {
//   name: 'DF4D147',
//   typeName: 'track_1',
//   coordinate: [400, 500]
// }

const LampSize = 8
export default class TrackCanvas {
  constructor(el, options) {
    this.options = {
      width: 2000,
      height: 2000,
      bgc: '#000'
    }
    this.canvas = null
    this.ctx = null
    this.init(el)
  }

  init(el) {
    const parent = el
    const { width, height, bgc } = this.options

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    const devicePixelRatio = window.devicePixelRatio || 1
    const backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || 1
    const ratio = devicePixelRatio / backingStoreRatio

    this.canvas.width = width * ratio
    this.canvas.height = height * ratio
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'
    this.ctx.scale(ratio, ratio)

    parent.appendChild(this.canvas)
  }
  draw() {
    const w = 2
    const { width, height, bgc } = this.options

    this.ctx.fillStyle = bgc
    this.ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < tackList.length; i++) {
      const { coordinate, lamp, soilBlock, color, derailer } = tackList[i]

      // 绘制轨道
      for (let j = 0; j < coordinate.length; j++) {
        const { beginX, beginY, endX, endY } = this.getCoordinate(coordinate[j])
        this.drawLine(beginX, beginY, endX, endY, color, w)
      }

      // 绘制灯
      for (let j = 0; j < lamp.length; j++) {
        const { coordinate, name, color } = lamp[j]
        const { beginX, beginY } = this.getCoordinate(coordinate)
        this.drawLamp(beginX, beginY, LampSize, color, name)
      }

      // 绘制土挡
      if (soilBlock) {
        const { coordinate } = soilBlock
        const { beginX, beginY } = this.getCoordinate(coordinate)
        this.drawSoilBlock(beginX, beginY)
      }

      // 绘制脱轨器
      if (derailer) {
        const { coordinate, name } = derailer
        const { beginX, beginY } = this.getCoordinate(coordinate)
        this.drawDerailer(beginX, beginY, name)
      }
    }
  }

  drawLine(beginX, beginY, endX, endY, color, width) {
    this.ctx.beginPath()
    this.ctx.moveTo(beginX + 0.5, beginY) // 加0.5 为了实现 一像素 线的方法
    this.ctx.lineTo(endX + 0.5, endY)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.stroke()
  }

  drawLamp(beginX, beginY, size, color, text) {
    this.ctx.beginPath()
    this.ctx.arc(beginX, beginY, size, 0, Math.PI * 2, false)
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.stroke()

    const x = beginX - 10
    const y = beginY - 18
    this.drawText(text, x, y)
  }

  drawText(text, x, y, color = '#fff') {
    this.ctx.fillStyle = color
    this.ctx.font = '18px Arial'
    this.ctx.fillText(text, x, y)
  }

  drawDerailer(x, y, name, color = 'blue') {
    // 填充三角形（等边）
    this.ctx.beginPath()
    const size = 30
    var height = size * Math.sin(Math.PI / 3)
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x + height, y - height)
    this.ctx.lineTo(x - height, y - height)
    this.ctx.lineTo(x, y)

    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 3
    this.ctx.stroke()
    this.drawText(name, x - size, y - size - 10)
  }

  drawSoilBlock(x, y, color = 'yellow') {
    this.ctx.beginPath()
    const height = 10
    const width = 20
    this.ctx.moveTo(x, y - height)
    this.ctx.lineTo(x, y + height)
    this.ctx.lineTo(x - width, y + height)
    this.ctx.moveTo(x, y - height)
    this.ctx.lineTo(x - width, y - height)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
  }

  drawCart(cart) {
    if (!cart) return
    console.log('drawCart', cart)
    const size = 15
    const height = 40

    const { name, coordinate } = cart
    const { beginX, beginY } = this.getCoordinate(coordinate)
    this.ctx.beginPath()
    this.ctx.moveTo(beginX, beginY)
    this.ctx.lineTo(beginX + size, beginY - height)
    this.ctx.lineTo(beginX - size, beginY - height)
    this.ctx.strokeStyle = '#fff'
    this.ctx.fill()
    this.ctx.stroke()
    this.drawText(name, beginX - size * 2, beginY - height - 10)
  }

  clearCanvas() {
    const { width, height } = this.options
    this.ctx.clearRect(0, 0, width, height)
  }

  getCoordinate(arr) {
    return {
      beginX: arr[0], beginY: arr[1], endX: arr[2], endY: arr[3]
    }
  }
}
