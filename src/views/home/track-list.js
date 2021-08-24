export default {
  'canvasSize': {
    'w': 1400,
    'h': 1000
  },
  'data': [{
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
  }]
}
