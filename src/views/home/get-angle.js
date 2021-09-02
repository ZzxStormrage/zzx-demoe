/**
* 获取角度
*/
export default (lng_a, lat_a, lng_b, lat_b) => {
  var diff_x = lng_b - lng_a
  var diff_y = lat_b - lat_a
  // 返回角度,不是弧度
  return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI)
}
