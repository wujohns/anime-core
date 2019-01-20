/**
 * Anime Class
 *
 * @author wujohns
 * @date 18/12/31
 */
'use strict'

import Utils from './utils'
import Tween from './tween'

const defaultInstanceSettings = {
    update: undefined,
    begin: undefined,
    run: undefined,
    complete: undefined,
    loop: 1,
    direction: 'normal',
    autoplay: true,
    offset: 0
}

const defaultTweenSettings = {
    duration: 1000,
    delay: 0,
    easing: 'easeOutElastic',
    elasticity: 500,
    round: 0
}

class Anime {
    constructor (params) {
        this.instanceSettings = Utils.replaceObjectProps(defaultInstanceSettings, params)
        this.tweenSettings = Utils.replaceObjectProps(defaultTweenSettings, params)

        // TODO 需要在调整参数后完成的部分
        // 添加的 target 都会按照相同目标 properties 运动
        // const animatables = [{target: params.targets, id: 0, total: 1}]
        this.animations = this._getAnimations(params)

        // 可以确定的参数
        this.children = []
        this._initInstanceTimings()
    }

    // get animations
    _getAnimations (params) {
        const properties = this._getProperties(params)
        const targets = Utils.toArray(params.targets)

        const animations = targets.map((t, i) => {
            const animatable = { target: t, id: i, total: targets.length }
            return properties.map(prop => {
                // 直接实现原有的 createAnimation 逻辑
                const tweens = Tween.normalizeTweens(prop, animatable)
                const duration = tweens[tweens.length - 1].end
                const delay = tweens[0].delay

                return {
                    type: 'Object', property: prop.name,
                    animatable: animatable, tweens: tweens,
                    duration: duration, delay: delay
                }
            })
        })
        return Utils.flattenArray(animations)
    }

    /**
     * get target's properties
     * [
     *      {
     *          name: <key>,                // ex: TranslateX
     *          offset: <settings.offset>,  // ex: 0
     *          tweens: [
     *              {
     *                  value: 100, delay: 0, duration: 1000,
     *                  easing: 'easeOutElastic', elasticity: 500, round: 0
     *              }
     *              ...
     *          ]
     *      }
     *      ...
     * ]
     */
    _getProperties (params) {
        let properties = [];
        const settings = Utils.mergeObjects(this.instanceSettings, this.tweenSettings)
        for (let p in params) {
            // 这里会抽取 settings 以及 targets 之外的参数
            if (!settings.hasOwnProperty(p) && p !== 'targets') {
                properties.push({
                    name: p,
                    offset: settings['offset'],
                    tweens: Tween.normalizePropertyTweens(params[p], this.tweenSettings)
                })
            }
        }
        return properties
    }

    // init the duration and delay
    _initInstanceTimings () {
        if (this.animations.length) {
            const animationInfos = this.animations.map(anim => anim[type])

            this.duration = Math.max(animationInfos)
            this.delay = Math.min(animationInfos)
        } else {
            const instanceOffset = this.instanceSettings.offset
            const tweenDelay = this.tweenSettings.delay
            const tweenDuration = this.tweenSettings.duration

            this.duration = instanceOffset + tweenDelay + tweenDuration
            this.delay = tweenDelay
        }
    }

    // set anime progress
    _setAnimationsProgress (insTime) {
        // TODO 需要解析当前 animations 的结构
        
    }

    // reset anime
    reset () {
        const direction = this.instanceSettings.direction
        const loops = this.instanceSettings.loop

        this.currentTime = 0
        this.progress = 0
        this.paused = true
        this.began = false
        this.completed = false
        this.reversed = direction === 'reverse'
        this.remaining = direction === 'alternate' && loops === 1 ? 2 : loops

        this._setAnimationsProgress(0)
        for (let i = this.children.length; i--; ) {
            this.children[i].reset
        }
    }

    // play anime
    play () {
        if (!this.paused) return;
        this.paused = false;

    }

    adjustTime (time) {
        return this.reversed ? this.duration - time : time
    }
}

export default Anime
