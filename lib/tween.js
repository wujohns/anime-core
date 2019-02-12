/**
 * tween 的格式化
 *
 * @author wujohns
 * @date 19/01/29
 */
'use strict'

// TODO 对输入的参数进行严格限制，避免过度兼容带来程序上的失控
const Tween = {
    /**
     * 获取 animations 结构
     * data: {
     *      key1: [val1_1, val1_2, val1_3...],
     *      key2: [val2_1, val2_2, val2_3...]
     * }
     */
    getAnimations: (data, settings) => {
        const animations = []
        for (let key in data) {
            const values = data[key]
            const tweens = Tween.getTweens(values, settings)
        }
    },

    /**
     * format tweens
     * values: [val1, val2, val3]
     */
    getTweens: (values, settings) => {
        let previousTween
        return values.map(val => {
            const tween = {}
            // TODO 处理相关的逻辑
        })
    }
}

// 传入参数设定（offset 与 delay 参数重复，这里只保留 delay）
const settings = {
    duration, delay, easing,
    elasticity, round
}
const data = {
    valA: 100,
    valB: 100
}
const input = {
    valA: [100, 200, 300],
    valB: [200, 400, 600]
}

// 传出参数设定
const output = {
    // TODO 直接为相应的 tweens
}
