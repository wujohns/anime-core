/**
 * tween 的格式化
 *
 * @author wujohns
 * @date 19/01/29
 */
'use strict'

// TODO 可以考虑将两个函数合并再整合到 Anime 对象中
const Tween = {
  /**
   * 获取 animations 结构
   * dataProgress: {
   *    key1: [val1_1, val1_2, val1_3...],
   *    key2: [val2_1, val2_2, val2_3...]
   * }
   * settings: {
   *    delay, duration
   * }
   */
  getAnimations: (dataProgress, settings) => {
    const animations = []
    for (let key in dataProgress) {
      const values = dataProgress[key]
      const tweens = Tween.getTweens(values, settings)
      animations.push({
        key,
        tweens
      })
    }
    return animations
  },

  /**
   * format tweens
   * values: [val1, val2, val3]
   * 
   * 备注：format 的结果为从 val1 -> val2, val2 -> val3 两个 tween
   */
  getTweens: (values, settings) => {
    const len = values.length - 1
    const duration = settings.duration / len
    let start = settings.delay

    const tweens = []
    for (let i = 0; i < len; i++) {
      // 当前不处理 svg-path 与 color 的动画
      const tween = {
        from: values[i],
        to: values[i+1],
        start,
        end: start + duration
      }
      start = tween.end
      tweens.push(tween)
    }

    return tweens
  }
}

export default Tween