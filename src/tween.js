/**
 * Tween 处理相关
 *
 * @author wujohns
 * @date 19/01/02
 */
'use strict'

import Utils from 'utils'
import easings from 'easings'

const Tween = {
    /**
     * normalize tweens
     * prop: { name: 'transfromX', offset: 0, tweens: normalizePropertyTweens }
     * animatable: {
     *      target: { transfromX: 0 },
     *      id: 0, total: targets.length 
     * }
     */
    normalizeTweens: (prop, animatable) => {
        let previousTween
        return prop.tweens.map(t => {
            // TODO 尝试整合一些逻辑
        })
    },

    /**
     * normalize tween property
     * [100, 200] -> 
     * [
     *      {
     *          value: [ 100, 200 ], delay: 0, duration: 1000,
     *          easing: 'easeOutElastic', elasticity: 500, round: 0
     *      }
     * ]
     * 
     * [ { value: 100 }, { value: 200 } ] ->
     * [
     *      {
     *          value: 100, delay: 0, duration: 500,
     *          easing: 'easeOutElastic', elasticity: 500, round: 0
     *      },
     *      {
     *          value: 200, delay: 0, duration: 500,
     *          easing: 'easeOutElastic', elasticity: 500, round: 0
     *      }
     * ]
     */
    normalizePropertyTweens: (prop, tweenSettings) => {
        const settings = Utils.cloneObject(tweenSettings)
        if (Utils.is.arr(prop)) {
            const isFromTo = (
                prop.length === 2 &&
                !Utils.is.obj(prop[0])
            )
            if (isFromTo) {
                prop = { value: prop }
            } else {
                if (!Utils.is.fnc(tweenSettings.duration)) {
                    settings.duration = tweenSettings.duration / prop.length
                }
            }
        }
        return Utils.toArray(prop).map((v, i) => {
            // Default delay value should be applied only on the first tween
            const delay = i === 0 ? tweenSettings.delay : 0
            // Use path object as a tween value
            let obj = Utils.is.obj(v) && !Utils.is.pth(v) ? v : { value: v }
            // Set default delay value
            if (Utils.is.und(obj.delay)) obj.delay = delay
            return obj
        }).map(k => Utils.mergeObjects(k, settings))
    }
}

export default Tween