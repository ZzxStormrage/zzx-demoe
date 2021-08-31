console.log('SubWay')
import * as d3 from 'd3'
import { data } from '_remark@13.0.0@remark'
// import Subway from './subway.js'

export function getData(data) {
  return data
}

const dataset = getData() // 线路图数据源
console.log('🚀 ~ file: index.js ~ line 11 ~ dataset', dataset)
// const subway = new Subway(dataset) // 线路图的类文件
const baseScale = 2 // 基础缩放倍率
const deviceScale = 1400 / 2640 // 设备与画布宽度比率
const width = 2640 // 画布宽
const height = 1760 // 画布高
const transX = 1320 + 260 // 地图X轴平移（将画布原点X轴平移）
const transY = 580 // 地图X轴平移（将画布原点Y轴平移）
const scaleExtent = [0.8, 4] // 缩放倍率限制
const currentScale = 2 // 当前缩放值
const currentX = 0 // 当前画布X轴平移量
const currentY = 0 // 当前画布Y轴平移量
const selected = false // 线路是否被选中（在右上角的线路菜单被选中）
const scaleStep = 0.5 // 点击缩放按钮缩放步长默认0.5倍
const tooltip = d3.select('#tooltip') // 提示框
const bugArray = [] // 问题路段数组
const svg = d3.select('#sw').append('svg') // 画布
const group = svg.append('g').attr('transform', `translate(${transX}, ${transY}) scale(1)`)// 定义组并平移
const whole = group.append('g').attr('class', 'whole-line') // 虚拟线路（用于点击右上角响应线路可以定位当视野中心，方法不唯一）
const path = group.append('g').attr('class', 'path') // 定义线路
const point = group.append('g').attr('class', 'point') // 定义站点
// const zoom = d3.zoom().scaleExtent(scaleExtent).on('zoom', zoomed) // 定义缩放事件

