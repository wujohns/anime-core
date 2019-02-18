/**
 * tween 的格式化
 *
 * @author wujohns
 * @date 19/01/29
 */
'use strict'

import easings from './easings'

const minMaxValue = (val, min, max) => {
    return Math.min(Math.max(val, min), max)
}

export default Tween = {
    /**
     * 获取 animations 结构
     * dataProgress: {
     *      key1: [val1_1, val1_2, val1_3...],
     *      key2: [val2_1, val2_2, val2_3...]
     * }
     * settings: {
     *      delay, easing, elasticity
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
        const easing = easings[settings.easing]
        const elasticity = (1000 - minMaxValue(settings.elasticity, 1, 999)) / 1000
        let start = settings.delay

        const tweens = []
        for (let i = 0; i < len; i++) {
            // 当前不处理 svg-path 与 color 的动画
            const tween = {
                from: values[i],
                to: values[i+1],
                start,
                end: start + duration,
                easing,
                elasticity
            }
            start = tween.end
            tweens.push(tween)
        }

        return tweens
    }
}
