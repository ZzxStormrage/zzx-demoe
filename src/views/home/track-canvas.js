
const tackList = [
  {
    name: 'track_1',
    coordinate: [
      [200, 500, 1200, 500],
      [1200, 500, 1250, 550],
      [1250, 550, 1250, 650],
      [1250, 650, 1200, 700],
      [1200, 700, 100, 700]
    ],
    lamp: [
      {
        name: 'd3',
        color: 'blue',
        coordinate: [300, 500]
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
    const color = '#ccc'

    const { width, height, bgc } = this.options

    this.ctx.fillStyle = bgc
    this.ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < tackList.length; i++) {
      const { coordinate, lamp } = tackList[i]

      for (let j = 0; j < coordinate.length; j++) {
        const { beginX, beginY, endX, endY } = this.getCoordinate(coordinate[j])
        this.drawLine(beginX, beginY, endX, endY, color, w)
      }

      for (let j = 0; j < lamp.length; j++) {
        const { coordinate, name, color } = lamp[j]
        const { beginX, beginY } = this.getCoordinate(coordinate)
        this.drawLamp(beginX, beginY, LampSize, color, name)
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

  drawText(text, x, y) {
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '18px Arial'
    this.ctx.fillText(text, x, y)
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

    this.ctx.fillStyle = '#fff'
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
