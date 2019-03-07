/**
 * tween 的格式化
 *
 * @author wujohns
 * @date 19/01/29
 */
'use strict'

import Utils from './utils'

// TODO 该部分择机合并
const Tween = {
  /**
   * format tweens
   * values: [val1, val2, val3]
   * settings: {
   *    delay, duration
   * }
   * 备注：format 的结果为从 val1 -> val2, val2 -> val3 两个 tween
   */
  getTweens: (values, settings) => {
    // 获取 start 与每个 tween 的 duration
    const len = values.length - 1
    const duration = settings.duration / len
    let start = settings.delay

    // tween 格式化
    const decomposeFn = Utils.getDecomposeFnByVal(values[0])
    const tweens = []
    for (let i = 0; i < len; i++) {
      const tween = {
        from: decomposeFn(values[i]),
        to: decomposeFn(values[i+1]),
        start,
        end: start + duration,
        duration
      }
      start = tween.end
      tweens.push(tween)
    }

    return tweens
  }
}

export default Tween