/**
 * anime 入口文件
 *
 * @author wujohns
 * @date 19/01/29
 */
'use strict'

import Tween from './tween'
import easings from './easings'

const minMaxValue = (val, min, max) => {
    return Math.min(Math.max(val, min), max)
}

// requestAnimationFrame 驱动的动画播放
const activeInstances = []
let raf = 0

const play = () => {
    raf = requestAnimationFrame((timestamp) => {
        const len = activeInstances.length
        if (len) {
            // 若有 active 的 instance 则播放相应的动画
            for (let i = 0; i < len; i++) {
                if (activeInstances[i]) activeInstances[i].tick(timestamp)
            }
            play()
        } else {
            // 没有 active 的 instance 则取消相应的 raf
            cancelAnimationFrame(raf)
            raf = 0
        }
    })
}

// TODO 单向运动的 instance 整理中
class Anime {
    /**
     * @param {Object} config - 动画初始配置
     * @param {Object} config.settings - 动画运行配置
     * @param {Object} config.configMap - 动画回调函数map
     * @param {Object} config.dataProgress - 动画相关数据步骤
     * 
     * ex: {
     *  settings: {
     *      duration: 1000,
     *      delay: 0,
     *      elasticity: 500,
     *      easing: 'easeOutElastic',
     *  },
     *  callbackMap: {
     *      update: (data) => { console.log(data) },
     *      complete: () => {}
     *  },
     *  dataProgress: {
     *      key1: [val1_1, val1_2, val1_3...],
     *      key2: [val2_1, val2_2, val2_3...]
     *  }
     * }
     */
    constructor (config) {
        // 动画运行配置
        this.duration = config.duration || 1000
        this.delay = config.delay || 0
        this.easing = easings[config.easing || 'easeOutElastic']
        this.elasticity = (1000 - minMaxValue(config.elasticity || 500, 1, 999)) / 1000

        // 动画运行回调配置
        this.callbackMap = {
            update: (data) => {},
            complete: () => {},

            ...config.callbackMap
        }

        // animations 的生成（核心为每个 animations 的 tweens）
        const dataProgress = config.dataProgress || {}
        this.animations = Tween.getAnimations(dataProgress, {
            duration: this.duration,
            delay: this.delay
        })

        console.log(this.easing)

        // 运行时间判定
        this.now = 0
        this.startTime = 0
        this.speed = 1
    }

    /**
     * 每帧触发逻辑
     * @param {number} timestamp - 时间戳
     */
    tick (timestamp) {
        this.now = timestamp
        if (!this.startTime) this.startTime = now
        const engineTime = (now - startTime) * this.speed
        this.setProgress(engineTime)
    }

    /**
     * 每帧触发逻辑
     * @param {number} engineTime - 由 timestamp 确定的实际运行时间
     */
    setProgress (engineTime) {
        const duration = this.delay + this.duration // 动画总时长
        if (engineTime < duration) {
            // engineTime 小于动画时长正常播放
            setAnimationsProgress(engineTime)
        } else {
            // engineTime 大于动画时长播放最后一步
            setAnimationsProgress(duration)
        }
    }

    /**
     * 动画计算
     * @param {number} insTime - 需要展现动画的时间戳
     */
    setAnimationsProgress (engineTime) {
        // TODO 考虑将 update 的 callback 放置在此处
        const animsLen = this.animations.length
        for (let i = 0; i < animsLen; i++) {
            const anim = animations[i]
            const tweens = anim.tweens
            const tweensLen = tweens.length
            let tween = tweens[tweensLen - 1]
            for (let j = 0; j < tweensLen; j++) {
                if (engineTime < tweens[j].end) {
                    tween = tweens[j]
                    break
                }
            }
            
        }
    }
}

export default Anime