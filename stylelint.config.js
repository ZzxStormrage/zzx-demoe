/*
 * @Author: your name
 * @Date: 2021-06-04 11:13:24
 * @LastEditTime: 2021-06-15 18:10:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /tm-admin-template/.stylelint.js
 */
module.exports = {
  defaultSeverity: 'warning',
  extends: ['stylelint-config-airbnb'],
  plugins: ['stylelint-scss'],
  rules: {
    // 推荐规则
    'at-rule-no-unknown': null,
    // 不要使用已被 autoprefixer 支持的浏览器前缀
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-empty-line-before': null,
    'at-rule-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-no-qualifying-type': [
      true,
      {
        ignore: ['attribute', 'class', 'id']
      }
    ],
    'selector-max-id': 2,
    // 最多允许嵌套20层，去掉默认的最多2层
    'max-nesting-depth': 20,
    // 颜色值要小写
    'color-hex-case': 'lower',
    // 颜色值能短则短
    'color-hex-length': 'short',
    'declaration-no-important': null,
    'declaration-property-value-blacklist': null,
    'scss/dollar-variable-pattern': ''
  }
}
