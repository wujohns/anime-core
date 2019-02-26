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
  
}

export default Utils