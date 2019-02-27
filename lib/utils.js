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
    // 颜色判定相关
    hex: a => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a),
    rgb: a => /^rgb/.test(a),
    hsl: a => /^hsl/.test(a),
    col: a => (Utils.is.hex(a) || Utils.is.rgb(a) || Utils.is.hsl(a))
  },

  // 颜色转换
  // TODO 输出格式需要等待 path 的确定后决定
  // TODO 增加注释说明（提供参数案例）
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

  colorToRgba (val) {
    if (Utils.is.rgb(val)) return Utils.rgbToRgba(val)
    if (Utils.is.hex(val)) return Utils.hexToRgba(val)
    if (Utils.is.hsl(val)) return Utils.hslToRgba(val)
  }
}

export default Utils