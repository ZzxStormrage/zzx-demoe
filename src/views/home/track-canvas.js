
const LampSize = 8
export default class TrackCanvas {
  constructor(el, tackList, options) {
    this.options = Object.assign({
      width: 2000,
      height: 2000,
      bgc: '#000'
    }, options)
    this.tackList = tackList
    this.canvas = null
    this.ctx = null
    this.ctxScale = 1
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

    this.addCanvasEvents()
    parent.appendChild(this.canvas)
  }
  draw() {
    const w = 2
    const { width, height, bgc } = this.options

    this.ctx.fillStyle = bgc
    this.ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < this.tackList.length; i++) {
      const { coordinate, lamp, soilBlock, color, derailer } = this.tackList[i]

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
    var p1 = this.ctx.transformedPoint(0, 0)
    var p2 = this.ctx.transformedPoint(this.canvas.width, this.canvas.height)
    this.ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
  }

  getCoordinate(arr) {
    return {
      beginX: arr[0], beginY: arr[1], endX: arr[2], endY: arr[3]
    }
  }

  canvasScale(x, y) {
    this.ctx.scale(x, y)
  }

  reset() {
    this.clearCanvas()

    this.draw()
    this.drawCart()
  }

  addCanvasEvents() {
    this.trackTransforms(this.ctx)
    let lastX = this.canvas.width / 2
    let lastY = this.canvas.height / 2
    let dragStart, dragged

    this.canvas.addEventListener('mousedown', (evt) => {
      document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body
        .style.userSelect = 'none'
      lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft)
      lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop)
      dragStart = this.ctx.transformedPoint(lastX, lastY)
      dragged = false
    }, false)

    this.canvas.addEventListener('mousemove', (evt) => {
      lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft)
      lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop)
      dragged = true
      if (dragStart) {
        const pt = this.ctx.transformedPoint(lastX, lastY)
        this.ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y)
        this.reset()
      }
    }, false)

    this.canvas.addEventListener('mouseup', (evt) => {
      dragStart = null
      if (!dragged) zoom(evt.shiftKey ? -1 : 1)
    }, false)

    const scaleFactor = 1.1

    const zoom = (clicks) => {
      const pt = this.ctx.transformedPoint(lastX, lastY)
      this.ctx.translate(pt.x, pt.y)
      const factor = Math.pow(scaleFactor, clicks)
      this.ctx.scale(factor, factor)
      this.ctx.translate(-pt.x, -pt.y)
      this.reset()
    }

    const handleScroll = (evt) => {
      const delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0
      if (delta) zoom(delta)
      return evt.preventDefault() && false
    }
    this.canvas.addEventListener('DOMMouseScroll', handleScroll, false)
    this.canvas.addEventListener('mousewheel', handleScroll, false)
  }

  trackTransforms(ctx) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    let xform = svg.createSVGMatrix()
    ctx.getTransform = () => { return xform }

    const savedTransforms = []
    const save = ctx.save
    ctx.save = () => {
      savedTransforms.push(xform.translate(0, 0))
      return save.call(ctx)
    }
    const restore = ctx.restore
    ctx.restore = () => {
      xform = savedTransforms.pop()
      return restore.call(ctx)
    }

    const scale = ctx.scale
    ctx.scale = (sx, sy) => {
      xform = xform.scaleNonUniform(sx, sy)
      return scale.call(ctx, sx, sy)
    }
    const rotate = ctx.rotate
    ctx.rotate = (radians) => {
      xform = xform.rotate(radians * 180 / Math.PI)
      return rotate.call(ctx, radians)
    }
    const translate = ctx.translate
    ctx.translate = (dx, dy) => {
      xform = xform.translate(dx, dy)
      return translate.call(ctx, dx, dy)
    }
    const transform = ctx.transform
    ctx.transform = (a, b, c, d, e, f) => {
      const m2 = svg.createSVGMatrix()
      m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f
      xform = xform.multiply(m2)
      return transform.call(ctx, a, b, c, d, e, f)
    }
    const setTransform = ctx.setTransform
    ctx.setTransform = (a, b, c, d, e, f) => {
      xform.a = a
      xform.b = b
      xform.c = c
      xform.d = d
      xform.e = e
      xform.f = f
      return setTransform.call(ctx, a, b, c, d, e, f)
    }
    const pt = svg.createSVGPoint()
    ctx.transformedPoint = (x, y) => {
      pt.x = x; pt.y = y
      return pt.matrixTransform(xform.inverse())
    }
  }

  // addCanvasEvents() {
  //   this.canvas.onmousedown = (e) => this.onmousedown(e)
  //   this.canvas.onmousemove = (e) => this.onmousemove(e)
  //   this.canvas.onmouseup = (e) => this.onmouseup(e)
  //   this.canvas.onmousewheel = this.canvas.onwheel = (e) => this.onwheel(e)
  // }

  // onmousedown(e) {
  // }
  // onmousemove(e) {
  // }
  // onmouseup(e) {
  // }
  // onwheel(e) {
  //   const maxScale = 5
  //   const minScale = 0.2
  //   const preNumber = 0.1

  //   if (e.wheelDelta > 0) { // 放大
  //     this.ctxScale = Math.min(this.ctxScale + preNumber, maxScale)
  //     console.log(this.ctxScale)
  //   } else { //  缩小
  //     this.ctxScale = Math.max(this.ctxScale - preNumber, minScale)
  //     console.log(this.ctxScale)
  //   }
  //   this.reset()
  //   this.canvasScale(this.ctxScale, this.ctxScale)
  // }
}

