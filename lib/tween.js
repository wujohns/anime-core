/**
 * tween 的格式化
 *
 * @author wujohns
 * @date 19/01/29
 */
'use strict'

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
    const len = values.length - 1
    const duration = settings.duration / len
    let start = settings.delay

    const tweens = []
    for (let i = 0; i < len; i++) {
      // TODO 先处理 color 然后是 path
      const tween = {
        from: values[i],
        to: values[i+1],
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