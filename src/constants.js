/**
 * 一些常量
 *
 * @author wujohns
 * @date 18/12/31
 */
'use strict'

export default {
    defaultInstanceSettings: {
        update: undefined,
        begin: undefined,
        run: undefined,
        complete: undefined,
        loop: 1,
        direction: 'normal',
        autoplay: true,
        offset: 0
    },

    defaultTweenSettings: {
        duration: 1000,
        delay: 0,
        easing: 'easeOutElastic',
        elasticity: 500,
        round: 0
    },

    validTransforms: ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY', 'perspective']
}
