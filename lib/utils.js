/**
 * 工具方法
 *
 * @author wujohns
 * @date 19/02/27
 */
'use strict'

const Utils = {
  // 类型判定
  is: {
    // 基础类型判定
    str: a => typeof a === 'string',
    arr: a => Array.isArray(a),

    // 颜色判定相关
    hex: a => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a),
    rgb: a => /^rgb/.test(a),
    hsl: a => /^hsl/.test(a),
    col: a => (Utils.is.hex(a) || Utils.is.rgb(a) || Utils.is.hsl(a)),
    
    // svg points 判定相关
    points: a => typeof a === 'string' && !Utils.is.col(a)
  },

  // 颜色转换
  rgbToRgba: (rgbValue) => {
    const rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue)
    return rgb ? `rgba(${rgb[1]},1)` : rgbValue
  },

  hexToRgba: (hexValue) => {
    const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const hex = hexValue.replace(rgx, (m, r, g, b) => r + r + g + g + b + b )
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    const r = parseInt(rgb[1], 16)
    const g = parseInt(rgb[2], 16)
    const b = parseInt(rgb[3], 16)
    return `rgba(${r},${g},${b},1)`
  },

  hslToRgba: (hslValue) => {
    const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue)
    const h = parseInt(hsl[1]) / 360
    const s = parseInt(hsl[2]) / 100
    const l = parseInt(hsl[3]) / 100
    const a = hsl[4] || 1
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    let r, g, b
    if (s == 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    return `rgba(${r * 255},${g * 255},${b * 255},${a})`
  },

  colorToRgba: (val) => {
    if (Utils.is.rgb(val)) return Utils.rgbToRgba(val)
    if (Utils.is.hex(val)) return Utils.hexToRgba(val)
    if (Utils.is.hsl(val)) return Utils.hslToRgba(val)
  },

  /**
   * 将 Color 或 Points 值转换为 array
   * 'rgba(100,200,255,0.7)' -> [100, 200, 255, 0.7]
   * '70 80 24' -> [70, 80, 24]
   * @param value {String} - rgba 值或 points 值
   */
  decomposeColorOrPoints: (value) => {
    const rgx = /-?\d*\.?\d+/g
    if (Utils.is.col(value)) value = Utils.colorToRgba(value)
    const strArr = value.match(rgx)
    return strArr ? strArr.map(Number) : [0]
  },

  /**
   * 将 Number 或 Array 值转换为 array
   * @param value {Number|Array} - key 所对应的 array 或 number
   */
  decomposeNumberOrArray: (value) => {
    if (Utils.is.arr(value)) return value
    return [value]
  },

  /**
   * 通过 val 判定后获取 decompose 方法
   * @param val {Array|Number|String} - key 每个阶段所对应的 value
   */
  getDecomposeFnByVal: (val) => {
    if (Utils.is.str(val)) return Utils.decomposeColorOrPoints
    return Utils.decomposeNumberOrArray
  },

  /**
   * 将 array 转换为 rgba 值
   * [100, 200, 255, 0.7] -> 'rgba(100,200,255,0.7)'
   * @parma arr {Array} - rgba 的数组模式([r, g, b, a])
   */
  composeRgba: (arr) => {
    return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
  },

  /**
   * 将 array 转换为 points 值
   * [70, 80, 24] -> '70 80 24'
   * @param arr {Array} - points 的数组模式([70, 80, 24])
   */
  composePoints: (arr) => {
    return arr.join(' ')
  },

  /**
   * 将 array 转换为对应的值
   * @param arr {Array} - points
   */
  composeArrayOrNumber: (arr) => {
    const len = arr.length
    if (len === 1) return arr[0]
    return arr
  },

  /**
   * 通过 val 判定后获取 compose 方法
   * @param val {Array|Number|String} - key 每个阶段所对应的 value
   */
  getComposeFnByVal: (val) => {
    if (Utils.is.col(val)) return Utils.composeRgba
    if (Utils.is.points(val)) return Utils.composePoints
    return Utils.composeArrayOrNumber
  },

  /**
   * 获取范围内的某值
   * 100, 0, 200 -> 100
   * -10, 0, 200 -> 0
   * 300, 0, 200 -> 200
   * @param val {Number} - 优先值
   * @param min {Number} - 最小值
   * @param max {Number} - 最大值
   */
  minMaxValue: (val, min, max) => {
    return Math.min(Math.max(val, min), max)
  }
}

export default Utils