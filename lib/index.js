/**
 * anime 入口文件
 *
 * @author wujohns
 * @date 19/01/29
 */
'use strict'

import Tween from './tween'
import easings from './easings'
import Utils from './utils'

// requestAnimationFrame 驱动的动画播放
const activeInstances = []
let raf = 0

const engine = () => {
  raf = requestAnimationFrame((timestamp) => {
    const len = activeInstances.length
    if (len) {
      // 若有 active 的 instance 则播放相应的动画
      for (let i = 0; i < len; i++) {
        if (activeInstances[i]) activeInstances[i].tick(timestamp)
      }
      engine()
    } else {
      // 没有 active 的 instance 则取消相应的 raf
      cancelAnimationFrame(raf)
      raf = 0
    }
  })
}

class Anime {
  /**
   * @param {Object} config - 动画初始配置
   * @param {Object} config.settings - 动画运行配置
   * @param {Object} config.configMap - 动画回调函数map
   * @param {Object} config.dataProgress - 动画相关数据步骤
   * 
   * ex: {
   *  settings: {
   *    duration: 1000,
   *    delay: 0,
   *    endDelay: 0,
   *    elasticity: 500,
   *    easing: 'easeOutElastic',
   *    direction: 'normal' | 'reverse' | 'alternate',
   *    loop: false,
   *    autoPlay: true
   *  },
   *  callbackMap: {
   *    update: (data) => { console.log(data) },
   *    complete: () => {}
   *  },
   *  dataProgress: {
   *    key1: [val1_1, val1_2, val1_3...],
   *    key2: [val2_1, val2_2, val2_3...]
   *  }
   * }
   */
  constructor (config) {
    // 动画运行配置
    this.duration = config.duration || 1000
    this.delay = config.delay || 0
    this.endDelay = config.endDelay || 0
    this.easing = easings[config.easing || 'easeOutElastic']
    this.elasticity = (1000 - Utils.minMaxValue(config.elasticity || 500, 1, 999)) / 1000
    this.direction = config.direction || 'normal'
    this.loop = config.loop || false

    // 动画运行回调配置
    this.callbackMap = {
      update: (data) => {},
      complete: (data) => {},

      ...config.callbackMap
    }

    // animations 的生成（核心为每个 animations 的 tweens）
    const dataProgress = config.dataProgress || {}
    this.animations = this.getAnimations(dataProgress)

    // 运行时间判定
    this.now = 0
    this.startTime = 0
    this.pauseTime = 0
    this.speed = 1

    // 目标值
    this.target = {}
    this.reversed = this.direction === 'reverse'

    // 启动 anime
    const autoPlay = typeof config.autoPlay === 'boolean' ? config.autoPlay : true
    if (autoPlay) this.play()
  }

  /**
   * 获取动画对象
   */
  getAnimations (dataProgress) {
    const animations = []
    for (let key in dataProgress) {
      // 获取相应的 tweens
      const values = dataProgress[key]
      const tweens = Tween.getTweens(values, {
        duration: this.duration,
        delay: this.delay,
        endDelay: this.endDelay
      })

      // animations 存储每个 key 以及其对应的 tweens
      animations.push({
        key,
        tweens,
        composeFn: Utils.getComposeFnByVal(values[0])
      })
    }
    return animations
  }

  /**
   * 启动动画
   */
  play () {
    // 若在动画队列中则不作操作
    const i = activeInstances.indexOf(this)
    if (i > -1) return

    // 加入动画队列并尝试启动
    activeInstances.push(this)
    if (!raf) engine()
  }

  /**
   * 重新启动
   */
  restart () {
    this.startTime = 0
    this.pauseTime = 0
    this.play()
  }


  /**
   * 暂停动画
   */
  pause () {
    // 记录当前时间差
    this.pauseTime = this.now - this.startTime
    this.startTime = 0

    // 将对象移除动画队列
    const i = activeInstances.indexOf(this)
    if (i > -1) activeInstances.splice(i, 1)
  }

  /**
   * 反转动画
   */
  reverse () {
    // 若不在动画队列中则不作操作
    const i = activeInstances.indexOf(this)
    if (i < 0) return

    // 时间转换计算
    const duration = this.delay + this.duration + this.endDelay
    let engineTime = (this.now - this.startTime) * this.speed
    if (engineTime > duration) {
      engineTime = duration
    }
    engineTime = duration - engineTime
    this.startTime = this.now - engineTime/this.speed
    this.reversed = !this.reversed
  }

  /**
   * 每帧触发逻辑
   * @param {number} timestamp - 时间戳
   */
  tick (timestamp) {
    this.now = timestamp
    if (this.pauseTime) {
      this.startTime = this.now - this.pauseTime
      this.pauseTime = 0
    }
    if (!this.startTime) this.startTime = this.now
    let engineTime = (this.now - this.startTime) * this.speed
    this.setProgress(engineTime)
  }

  /**
   * 每帧触发逻辑
   * @param {number} engineTime - 由 timestamp 确定的实际运行时间
   */
  setProgress (engineTime) {
    // 获取动画播放时间
    const duration = this.delay + this.duration + this.endDelay // 动画总时长
    let insTime
    let loopComplete = false
    if (engineTime < duration) {
      // engineTime 小于动画时长正常播放
      insTime = engineTime
    } else {
      // engineTime 大于动画时长播放最后一步
      insTime = duration
      loopComplete = true
    }
    // 反转播放判定
    if (this.reversed) insTime = duration - insTime

    // 动画播放
    this.setAnimationsProgress(insTime)

    // 循环处理
    if (loopComplete) {
      if (this.loop === true || parseInt(this.loop) > 1) {
        // 进入下一循环
        this.startTime = this.now
        if (typeof this.loop === 'number') {
          // loop 为 number 则进行计数
          this.loop = parseInt(this.loop) - 1
        }
        if (this.direction === 'alternate') {
          // 判定是否在下一个循环反转
          this.reversed = !this.reversed
        }
      } else {
        // 停止播放
        const cur = activeInstances.indexOf(this)
        if (cur > -1) activeInstances.splice(cur, 1)

        // 回调处理
        this.callbackMap['complete'](this.target)
      }
    }
  }

  /**
   * 动画计算
   * @param {number} insTime - 需要展现动画的时间戳
   */
  setAnimationsProgress (insTime) {
    const animsLen = this.animations.length
    for (let i = 0; i < animsLen; i++) {
      const anim = this.animations[i]
      const tweens = anim.tweens
      const tweensLen = tweens.length

      // 获取当前 insTime 需要运行的 tween
      let tween = tweens[tweensLen - 1]
      for (let j = 0; j < tweensLen; j++) {
        if (insTime < tweens[j].end) {
          tween = tweens[j]
          break
        }
      }

      // 获取在当前 insTime 中对应的值
      const elapsed = Utils.minMaxValue(insTime - tween.start, 0, tween.duration) / tween.duration
      const eased = this.easing(elapsed, this.elasticity)

      const valueLen = tween.to.length
      const value = []
      for (let j = 0; j < valueLen; j++) {
        const to = tween.to[j]
        const from = tween.from[j]
        value.push(eased * (to - from) + from)
      }

      // target 赋值
      this.target[anim.key] = anim.composeFn(value)
    }

    // 调用更新回调
    this.callbackMap['update'](this.target)
  }
}

export default Anime