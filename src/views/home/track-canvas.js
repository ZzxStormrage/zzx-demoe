const LampSize = 8
import getAngle from './get-angle'
/**
 * @function drawMapLine 绘制股道图
 *
 * @function drawMapLine 绘制岔道
 */
export default class TrackCanvas {
  constructor(el, options, data) {
    this.options = Object.assign({
      width: 2000,
      height: 2000,
      bgc: '#000'
    },
    options
    )

    this.data = data

    this.canvas = null
    this.ctx = null
    this.ctxScale = 1
    this.init(el)
  }

  init(el) {
    const parent = el
    const {
      width,
      height,
      bgc
    } = this.options

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    const devicePixelRatio = window.devicePixelRatio || 1
    const backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || 1
    const ratio = devicePixelRatio / backingStoreRatio

    this.canvas.width = width * ratio
    this.canvas.height = height * ratio
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'
    this.ctx.fillStyle = bgc
    this.ctx.fill()
    this.ctx.scale(ratio, ratio)

    this.addCanvasEvents()
    parent.appendChild(this.canvas)
  }

  setData(data) {
    this.data = data
  }

  draw() {
    const {
      mapLine,
      mapLight,
      forks,
      derailer,
      otherele,
      maptext,
      mapocs
    } = this.data
    derailer && this.drawDera(derailer)
    forks && this.drawForks(forks)
    mapLight && this.drawMapLight(mapLight, mapLine)
    mapLine && this.drawMapLine(mapLine)
    maptext && this.drawMaptext(maptext)
    otherele && this.drawOtherele(otherele)
    mapocs && this.drawMapocs(mapocs)
  }
  // 绘制终点标
  drawMapocs(list) {
    const h = 12
    const w = 4
    list.forEach(item => {
      const { x, y } = item.point
      const beginX = x
      const beginY = y - h
      const endX = x
      const endY = y + h
      this.drawLine(beginX, beginY, endX, endY, item.color, w)

      const shuX = x
      const shuY = endY - w / 2
      const shuEndX = x - 10
      const shuEndY = shuY

      this.drawLine(shuX, shuY, shuEndX, shuEndY, item.color, w)

      this.drawText(item.name, beginX + w, beginY + h / 2, item.color, 20)
    })
  }
  // 绘制车档
  drawOtherele(otherele) {
    const w = 3
    for (let i = 0; i < otherele.length; i++) {
      const { coordinate, color } = otherele[i]
      // 绘制轨道
      for (let j = 0; j < coordinate.length; j++) {
        const {
          beginX,
          beginY,
          endX,
          endY
        } = this.getCoordinate(
          coordinate[j]
        )
        this.drawLine(beginX, beginY, endX, endY, color, w)
      }
    }
  }

  // 绘制轨道注释
  drawMaptext(maptext) {
    maptext.forEach(item => {
      const name = item.name
      const angle = 360 - item.angle
      const color = item.color

      const { x, y } = item.point
      this.drawText(name, x, y, color, 15, angle)
    })
  }

  // 绘制股道图
  drawMapLine(mapLine) {
    const w = 3
    for (let i = 0; i < mapLine.length; i++) {
      const {
        coordinate,
        color,
        name
      } = mapLine[i]
      // 绘制轨道
      for (let j = 0; j < coordinate.length; j++) {
        const {
          beginX,
          beginY,
          endX,
          endY
        } = this.getCoordinate(
          coordinate[j]
        )
        this.drawLine(beginX, beginY, endX, endY, color, w)
      }
    }
  }

  // 绘制脱轨器
  drawDera(derailer) {
    for (let i = 0; i < derailer.length; i++) {
      const item = derailer[i]
      const {
        point,
        name
      } = item
      this.drawDerailer(point.x, point.y, name)
    }
  }

  // 绘制信号灯
  drawMapLight(mapLight, mapLine) {
    // 灯的大小
    const size = 4

    mapLight.forEach(item => {
      // 获取 相对线的 旋转角度
      const lineData = mapLine.find(data => data.name === item.trackNo)
      const { beginX, beginY, endX, endY } = this.getCoordinate(lineData.coordinate[0])

      let angle = getAngle(beginX, beginY, endX, endY)

      let x = item.point.x
      let y = item.point.y
      const color = item.color
      const upDown = item.upDown
      const name = item.name

      // if (beginX === endX) {
      //   angle = 90
      // }

      // true 灯朝右 or 朝左
      const onLeft = !!((upDown === 2 || upDown === 4))

      if (onLeft) {
        angle += 180
      }

      // true 在轨道下方 or 在轨道下方
      const onUp = !!((upDown === 1 || upDown === 2))
      if (onUp) {
        x -= size + 2
        y -= size + 2
      } else {
        x += size + 2
        y += size + 3
      }

      this.ctx.save()
      this.ctx.translate(x, y)
      this.ctx.rotate((angle * Math.PI) / 180)
      this.ctx.translate(-x, -y)

      this.ctx.beginPath()
      this.ctx.arc(x, y, size, 0, Math.PI * 2, false)
      this.ctx.fillStyle = color
      this.ctx.fill()
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = 'white'
      this.ctx.stroke()

      this.ctx.beginPath()
      // // 横线
      const lineW = 5
      const lineStartX = x + size
      const lineStartY = y
      const lineEndX = lineStartX + lineW
      const lineEndY = y

      this.drawLine(lineStartX, lineStartY, lineEndX, lineEndY)
      // 竖线
      this.ctx.beginPath()
      const shuLineH = 8
      const shuLineStartX = x + size + lineW
      const shuLineStartY = y - shuLineH / 2
      const shuLineEndX = shuLineStartX
      const shuLineEndY = shuLineStartY + shuLineH
      this.drawLine(shuLineStartX, shuLineStartY, shuLineEndX, shuLineEndY)

      // 灯的文字
      let textX = x + size + lineW + 2
      let textY = y + size - 1
      let textRoute = 0

      if (onLeft) {
        textRoute += 180
        textX += name.length * 7
        textY -= size + 2
      }
      this.drawText(item.name, textX, textY, '#fff', 1, textRoute)
      this.ctx.restore()
    })

    // for (let j = 0; j < mapLight.length; j++) {
    //   const item = mapLight[j]
    //   let x = item.point.x
    //   let y = item.point.y
    //   const LampSize = 5
    //   const color = item.color
    //   const upDown = item.upDown

    //   if (item.name === 'D6' || item.name === 'D2') {
    //     console.log(upDown)
    //   }

    //   // 灯的上下位置
    //   if (upDown === 2 || upDown === 1) {
    //     x -= LampSize
    //     y -= LampSize
    //   } else {
    //     x += LampSize
    //     y += LampSize
    //   }

    //   const lineData = mapLine.find(data => data.name === item.trackNo)

    //   const {
    //     beginX,
    //     beginY,
    //     endX,
    //     endY
    //   } = this.getCoordinate(lineData.coordinate[0])
    //   const angle = getAngle(beginX, beginY, endX, endY)

    //   this.ctx.save()
    //   this.ctx.translate(x, y)
    //   this.ctx.rotate((angle * Math.PI) / 180)
    //   this.ctx.translate(-x, -y)

    //   let lingAngle = 0
    //   const lineW = 4
    //   const textX = x + LampSize + lineW + 2
    //   const textY = y + LampSize - 1
    //   if (upDown === 2 || upDown === 4) {
    //     lingAngle = 180 // 灯在朝右
    //   }
    //   this.drawLamp(x, y, LampSize, color, item.name, lingAngle)
    //   this.drawText(item.name, textX, textY, '#fff', 1)
    //   this.ctx.restore()
    // }
  }

  // 移动画布 设置居中
  translateCanvas(data) {
    const {
      scaleX,
      scaleY,
      maxTop,
      minLeft
    } = data
    this.trackTransforms(this.ctx)
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect =
      'none'
    const x = maxTop * scaleX
    const y = minLeft * scaleX
    const dragStart = this.ctx.transformedPoint(x, y)
    if (dragStart) {
      const pt = this.ctx.transformedPoint(x, y)
      this.ctx.translate(0, 0)
      this.ctx.scale(scaleX, scaleX)
      this.reset()
    }
  }

  drawText(text, x, y, color = '#fff', size = 10, rotate = 0) {
    this.ctx.font = `${size}px`
    this.ctx.fillStyle = color

    // 中心位置旋转
    // const strWidth = this.ctx.measureText(text).width
    this.ctx.save()
    this.ctx.translate(x, y)
    this.ctx.rotate((rotate * Math.PI) / 180)
    this.ctx.fillStyle = color
    this.ctx.fillText(text, 0, 0)
    this.ctx.restore()
  }

  // 绘制岔道
  drawForks(forks) {
    for (let i = 0; i < forks.length; i++) {
      const item = forks[i]
      const color = forks[i].color
      const { x, y } = item.point
      this.drawText(item.name, x, y + 2, color)
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

  drawDerailer(x, y, name, color = 'blue', size = 16) {
    // 填充三角形（等边）
    this.ctx.beginPath()
    var height = size * Math.sin(Math.PI / 3)
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x + height, y - height)
    this.ctx.lineTo(x - height, y - height)
    this.ctx.lineTo(x, y)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 2
    this.ctx.stroke()
    this.drawText(name, x + height + 2, y - 3)
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

    const {
      name,
      coordinate
    } = cart
    const {
      beginX,
      beginY
    } = this.getCoordinate(coordinate)
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
      beginX: arr[0],
      beginY: arr[1],
      endX: arr[2],
      endY: arr[3]
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

    this.canvas.addEventListener(
      'mousedown',
      evt => {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect =
          'none'
        lastX = evt.offsetX || evt.pageX - this.canvas.offsetLeft
        lastY = evt.offsetY || evt.pageY - this.canvas.offsetTop
        dragStart = this.ctx.transformedPoint(lastX, lastY)
        dragged = false
      },
      false
    )

    this.canvas.addEventListener(
      'mousemove',
      evt => {
        lastX = evt.offsetX || evt.pageX - this.canvas.offsetLeft
        lastY = evt.offsetY || evt.pageY - this.canvas.offsetTop
        dragged = true
        if (dragStart) {
          const pt = this.ctx.transformedPoint(lastX, lastY)
          this.ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y)
          this.reset()
        }
      },
      false
    )

    this.canvas.addEventListener(
      'mouseup',
      evt => {
        dragStart = null
        if (!dragged) zoom(evt.shiftKey ? -1 : 1)
      },
      false
    )

    const scaleFactor = 1.1

    const zoom = clicks => {
      const pt = this.ctx.transformedPoint(lastX, lastY)
      this.ctx.translate(pt.x, pt.y)
      const factor = Math.pow(scaleFactor, clicks)
      this.ctx.scale(factor, factor)
      this.ctx.translate(-pt.x, -pt.y)
      this.reset()
    }

    const handleScroll = evt => {
      const delta = evt.wheelDelta
        ? evt.wheelDelta / 40
        : evt.detail
          ? -evt.detail
          : 0
      if (delta) zoom(delta)
      return evt.preventDefault() && false
    }
    this.canvas.addEventListener('DOMMouseScroll', handleScroll, false)
    this.canvas.addEventListener('mousewheel', handleScroll, false)
  }

  trackTransforms(ctx) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    let xform = svg.createSVGMatrix()
    ctx.getTransform = () => {
      return xform
    }

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
    ctx.rotate = radians => {
      xform = xform.rotate((radians * 180) / Math.PI)
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
      m2.a = a
      m2.b = b
      m2.c = c
      m2.d = d
      m2.e = e
      m2.f = f
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
      pt.x = x
      pt.y = y
      return pt.matrixTransform(xform.inverse())
    }
  }
}
