"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getAngle = _interopRequireDefault(require("./get-angle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @function drawMapLine 绘制股道图
 *
 * @function drawMapLine 绘制岔道
 */
var TrackCanvas =
/*#__PURE__*/
function () {
  function TrackCanvas(el, options, data) {
    _classCallCheck(this, TrackCanvas);

    this.options = Object.assign({
      width: 2000,
      height: 2000,
      bgc: '#000'
    }, options);
    this.data = data;
    this.canvas = null;
    this.ctx = null;
    this.ctxScale = 1;
    this.init(el);
  }

  _createClass(TrackCanvas, [{
    key: "init",
    value: function init(el) {
      var parent = el;
      var _this$options = this.options,
          width = _this$options.width,
          height = _this$options.height,
          bgc = _this$options.bgc;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      var devicePixelRatio = window.devicePixelRatio || 1;
      var backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || 1;
      var ratio = devicePixelRatio / backingStoreRatio;
      this.canvas.width = width * ratio;
      this.canvas.height = height * ratio;
      this.canvas.style.width = width + 'px';
      this.canvas.style.height = height + 'px';
      this.ctx.fillStyle = bgc;
      this.ctx.fill();
      this.ctx.scale(ratio, ratio);
      this.addCanvasEvents();
      parent.appendChild(this.canvas);
    }
  }, {
    key: "setData",
    value: function setData(data) {
      this.data = data;
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this$data = this.data,
          mapLine = _this$data.mapLine,
          mapLight = _this$data.mapLight,
          forks = _this$data.forks,
          derailer = _this$data.derailer,
          otherele = _this$data.otherele,
          maptext = _this$data.maptext,
          mapocs = _this$data.mapocs;
      mapLine && this.drawMapLine(mapLine);
      derailer && this.drawDera(derailer);
      forks && this.drawForks(forks);
      mapLight && this.drawMapLight(mapLight, mapLine);
      maptext && this.drawMaptext(maptext);
      otherele && this.drawOtherele(otherele);
      mapocs && this.drawMapocs(mapocs);
    } // 绘制终点标

  }, {
    key: "drawMapocs",
    value: function drawMapocs(list) {
      var _this = this;

      var h = 12;
      var w = 4;
      list.forEach(function (item) {
        var _item$point = item.point,
            x = _item$point.x,
            y = _item$point.y;
        var beginX = x;
        var beginY = y - h;
        var endX = x;
        var endY = y + h;

        _this.drawLine(beginX, beginY, endX, endY, item.color, w);

        var shuX = x;
        var shuY = endY - w / 2;
        var shuEndX = x - 10;
        var shuEndY = shuY;

        _this.drawLine(shuX, shuY, shuEndX, shuEndY, item.color, w);

        _this.drawText(item.name, beginX + w, beginY + h / 2, item.color, 20);
      });
    } // 绘制车档

  }, {
    key: "drawOtherele",
    value: function drawOtherele(otherele) {
      var w = 3;

      for (var i = 0; i < otherele.length; i++) {
        var _otherele$i = otherele[i],
            coordinate = _otherele$i.coordinate,
            color = _otherele$i.color; // 绘制轨道

        for (var j = 0; j < coordinate.length; j++) {
          var _this$getCoordinate = this.getCoordinate(coordinate[j]),
              beginX = _this$getCoordinate.beginX,
              beginY = _this$getCoordinate.beginY,
              endX = _this$getCoordinate.endX,
              endY = _this$getCoordinate.endY;

          this.drawLine(beginX, beginY, endX, endY, color, w);
        }
      }
    } // 绘制轨道注释

  }, {
    key: "drawMaptext",
    value: function drawMaptext(maptext) {
      var _this2 = this;

      maptext.forEach(function (item) {
        var name = item.name;
        var angle = 360 - item.angle;
        var color = item.color;
        var _item$point2 = item.point,
            x = _item$point2.x,
            y = _item$point2.y;

        _this2.drawText(name, x, y, color, 15, angle);
      });
    } // 绘制股道图

  }, {
    key: "drawMapLine",
    value: function drawMapLine(mapLine) {
      var w = 3;

      for (var i = 0; i < mapLine.length; i++) {
        var _mapLine$i = mapLine[i],
            coordinate = _mapLine$i.coordinate,
            color = _mapLine$i.color,
            name = _mapLine$i.name; // 绘制轨道

        for (var j = 0; j < coordinate.length; j++) {
          var _this$getCoordinate2 = this.getCoordinate(coordinate[j]),
              beginX = _this$getCoordinate2.beginX,
              beginY = _this$getCoordinate2.beginY,
              endX = _this$getCoordinate2.endX,
              endY = _this$getCoordinate2.endY;

          this.drawLine(beginX, beginY, endX, endY, color, w);
        }
      }
    } // 绘制脱轨器

  }, {
    key: "drawDera",
    value: function drawDera(derailer) {
      for (var i = 0; i < derailer.length; i++) {
        var item = derailer[i];
        var point = item.point,
            name = item.name;
        this.drawDerailer(point.x, point.y, name);
      }
    } // 绘制信号灯

  }, {
    key: "drawMapLight",
    value: function drawMapLight(mapLight, mapLine) {
      var _this3 = this;

      // 灯的大小
      var size = 4;
      mapLight.forEach(function (item) {
        // 获取 相对线的 旋转角度
        var lineData = mapLine.find(function (data) {
          return data.name === item.trackNo;
        });

        var _this3$getCoordinate = _this3.getCoordinate(lineData.coordinate[0]),
            beginX = _this3$getCoordinate.beginX,
            beginY = _this3$getCoordinate.beginY,
            endX = _this3$getCoordinate.endX,
            endY = _this3$getCoordinate.endY;

        var angle = (0, _getAngle["default"])(beginX, beginY, endX, endY);
        var x = item.point.x;
        var y = item.point.y;
        var color = item.color;
        var upDown = item.upDown;
        var name = item.name; // if (beginX === endX) {
        //   angle = 90
        // }
        // true 灯朝右 or 朝左

        var onLeft = !!(upDown === 2 || upDown === 4);

        if (onLeft) {
          angle += 180;
        } // true 在轨道下方 or 在轨道下方


        var onUp = !!(upDown === 1 || upDown === 2);

        if (onUp) {
          x -= size + 2;
          y -= size + 2;
        } else {
          x += size + 2;
          y += size + 3;
        }

        _this3.ctx.save();

        _this3.ctx.translate(x, y);

        _this3.ctx.rotate(angle * Math.PI / 180);

        _this3.ctx.translate(-x, -y);

        _this3.ctx.beginPath();

        _this3.ctx.arc(x, y, size, 0, Math.PI * 2, false);

        _this3.ctx.fillStyle = color;

        _this3.ctx.fill();

        _this3.ctx.lineWidth = 1;
        _this3.ctx.strokeStyle = 'white';

        _this3.ctx.stroke();

        _this3.ctx.beginPath(); // // 横线


        var lineW = 5;
        var lineStartX = x + size;
        var lineStartY = y;
        var lineEndX = lineStartX + lineW;
        var lineEndY = y;

        _this3.drawLine(lineStartX, lineStartY, lineEndX, lineEndY); // 竖线


        _this3.ctx.beginPath();

        var shuLineH = 8;
        var shuLineStartX = x + size + lineW;
        var shuLineStartY = y - shuLineH / 2;
        var shuLineEndX = shuLineStartX;
        var shuLineEndY = shuLineStartY + shuLineH;

        _this3.drawLine(shuLineStartX, shuLineStartY, shuLineEndX, shuLineEndY); // 灯的文字


        var textX = x + size + lineW + 2;
        var textY = y + size - 1;
        var textRoute = 0;

        if (onLeft) {
          textRoute += 180;
          textX += name.length * 7;
          textY -= size + 2;
        }

        _this3.drawText(item.name, textX, textY, '#fff', 1, textRoute);

        _this3.ctx.restore();
      }); // for (let j = 0; j < mapLight.length; j++) {
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
    } // 移动画布 设置居中

  }, {
    key: "translateCanvas",
    value: function translateCanvas(data) {
      var scaleX = data.scaleX,
          scaleY = data.scaleY,
          maxTop = data.maxTop,
          minLeft = data.minLeft;
      this.trackTransforms(this.ctx);
      document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
      var x = maxTop * scaleX;
      var y = minLeft * scaleX;
      var dragStart = this.ctx.transformedPoint(x, y);

      if (dragStart) {
        var pt = this.ctx.transformedPoint(x, y);
        this.ctx.translate(0, 0);
        this.ctx.scale(scaleX, scaleX);
        this.reset();
      }
    }
  }, {
    key: "drawText",
    value: function drawText(text, x, y) {
      var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#fff';
      var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
      var rotate = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      this.ctx.font = "".concat(size, "px");
      this.ctx.fillStyle = color; // 中心位置旋转
      // const strWidth = this.ctx.measureText(text).width

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotate * Math.PI / 180);
      this.ctx.fillStyle = color;
      this.ctx.fillText(text, 0, 0);
      this.ctx.restore();
    } // 绘制岔道

  }, {
    key: "drawForks",
    value: function drawForks(forks) {
      for (var i = 0; i < forks.length; i++) {
        var item = forks[i];
        var color = forks[i].color;
        var _item$point3 = item.point,
            x = _item$point3.x,
            y = _item$point3.y;
        this.drawText(item.name, x, y + 2, color);
      }
    }
  }, {
    key: "drawLine",
    value: function drawLine(beginX, beginY, endX, endY, color, width) {
      this.ctx.beginPath();
      this.ctx.moveTo(beginX + 0.5, beginY); // 加0.5 为了实现 一像素 线的方法

      this.ctx.lineTo(endX + 0.5, endY);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;
      this.ctx.stroke();
    }
  }, {
    key: "drawDerailer",
    value: function drawDerailer(x, y, name) {
      var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'blue';
      var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 16;
      // 填充三角形（等边）
      this.ctx.beginPath();
      var height = size * Math.sin(Math.PI / 3);
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + height, y - height);
      this.ctx.lineTo(x - height, y - height);
      this.ctx.lineTo(x, y);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.drawText(name, x + height + 2, y - 3);
    }
  }, {
    key: "drawSoilBlock",
    value: function drawSoilBlock(x, y) {
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'yellow';
      this.ctx.beginPath();
      var height = 10;
      var width = 20;
      this.ctx.moveTo(x, y - height);
      this.ctx.lineTo(x, y + height);
      this.ctx.lineTo(x - width, y + height);
      this.ctx.moveTo(x, y - height);
      this.ctx.lineTo(x - width, y - height);
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
  }, {
    key: "drawCart",
    value: function drawCart(cart) {
      if (!cart) return;
      var size = 15;
      var height = 40;
      var name = cart.name,
          coordinate = cart.coordinate;

      var _this$getCoordinate3 = this.getCoordinate(coordinate),
          beginX = _this$getCoordinate3.beginX,
          beginY = _this$getCoordinate3.beginY;

      this.ctx.beginPath();
      this.ctx.moveTo(beginX, beginY);
      this.ctx.lineTo(beginX + size, beginY - height);
      this.ctx.lineTo(beginX - size, beginY - height);
      this.ctx.strokeStyle = '#fff';
      this.ctx.fill();
      this.ctx.stroke();
      this.drawText(name, beginX - size * 2, beginY - height - 10);
    }
  }, {
    key: "clearCanvas",
    value: function clearCanvas() {
      var p1 = this.ctx.transformedPoint(0, 0);
      var p2 = this.ctx.transformedPoint(this.canvas.width, this.canvas.height);
      this.ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    }
  }, {
    key: "getCoordinate",
    value: function getCoordinate(arr) {
      return {
        beginX: arr[0],
        beginY: arr[1],
        endX: arr[2],
        endY: arr[3]
      };
    }
  }, {
    key: "canvasScale",
    value: function canvasScale(x, y) {
      this.ctx.scale(x, y);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.clearCanvas();
      this.draw();
      this.drawCart();
    }
  }, {
    key: "addCanvasEvents",
    value: function addCanvasEvents() {
      var _this4 = this;

      this.trackTransforms(this.ctx);
      var lastX = this.canvas.width / 2;
      var lastY = this.canvas.height / 2;
      var dragStart, dragged;
      this.canvas.addEventListener('mousedown', function (evt) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || evt.pageX - _this4.canvas.offsetLeft;
        lastY = evt.offsetY || evt.pageY - _this4.canvas.offsetTop;
        dragStart = _this4.ctx.transformedPoint(lastX, lastY);
        dragged = false;
      }, false);
      this.canvas.addEventListener('mousemove', function (evt) {
        lastX = evt.offsetX || evt.pageX - _this4.canvas.offsetLeft;
        lastY = evt.offsetY || evt.pageY - _this4.canvas.offsetTop;
        dragged = true;

        if (dragStart) {
          var pt = _this4.ctx.transformedPoint(lastX, lastY);

          _this4.ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);

          _this4.reset();
        }
      }, false);
      this.canvas.addEventListener('mouseup', function (evt) {
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1);
      }, false);
      var scaleFactor = 1.1;

      var zoom = function zoom(clicks) {
        var pt = _this4.ctx.transformedPoint(lastX, lastY);

        _this4.ctx.translate(pt.x, pt.y);

        var factor = Math.pow(scaleFactor, clicks);

        _this4.ctx.scale(factor, factor);

        _this4.ctx.translate(-pt.x, -pt.y);

        _this4.reset();
      };

      var handleScroll = function handleScroll(evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
      };

      this.canvas.addEventListener('DOMMouseScroll', handleScroll, false);
      this.canvas.addEventListener('mousewheel', handleScroll, false);
    }
  }, {
    key: "trackTransforms",
    value: function trackTransforms(ctx) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      var xform = svg.createSVGMatrix();

      ctx.getTransform = function () {
        return xform;
      };

      var savedTransforms = [];
      var save = ctx.save;

      ctx.save = function () {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
      };

      var restore = ctx.restore;

      ctx.restore = function () {
        xform = savedTransforms.pop();
        return restore.call(ctx);
      };

      var scale = ctx.scale;

      ctx.scale = function (sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
      };

      var rotate = ctx.rotate;

      ctx.rotate = function (radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
      };

      var translate = ctx.translate;

      ctx.translate = function (dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
      };

      var transform = ctx.transform;

      ctx.transform = function (a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
      };

      var setTransform = ctx.setTransform;

      ctx.setTransform = function (a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
      };

      var pt = svg.createSVGPoint();

      ctx.transformedPoint = function (x, y) {
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
      };
    }
  }]);

  return TrackCanvas;
}();

exports["default"] = TrackCanvas;