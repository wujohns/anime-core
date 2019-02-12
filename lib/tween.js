/**
 * tween 的格式化
 *
 * @author wujohns
 * @date 19/01/29
 */
'use strict'

// TODO 对输入的参数进行严格限制，避免过度兼容带来程序上的失控
const Tween = {
    // TODO 参数设计
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
