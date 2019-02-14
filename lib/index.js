/**
 * anime 入口文件
 *
 * @author wujohns
 * @date 19/01/29
 */
'use strict'

import Tween from './tween'

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
            cancelAnimationFrame(raf)
            raf = 0
        }
    })
}

// TODO 先整理出可以运行的 instance，然后在抽取参数
const instance = {
    tick: (timestamp) => {
        // 先处理单方向移动，再处理反复运动
    }
}