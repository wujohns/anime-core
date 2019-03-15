(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.animeCore = factory());
}(this, function () { 'use strict';

  /**
   * 工具方法
   *
   * @author wujohns
   * @date 19/02/27
   */

  const Utils = {
    // 类型判定
    is: {
      // 基础类型判定
      str: a => typeof a === 'string',
      arr: a => Array.isArray(a),

      // 颜色判定相关
      hex: a => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a),
      rgb: a => /^rgb/.test(a),
      hsl: a => /^hsl/.test(a),
      col: a => (Utils.is.hex(a) || Utils.is.rgb(a) || Utils.is.hsl(a)),
      
      // svg points 判定相关
      points: a => typeof a === 'string' && !Utils.is.col(a)
    },

    // 颜色转换
    rgbToRgba: (rgbValue) => {
      const rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
      return rgb ? `rgba(${rgb[1]},1)` : rgbValue
    },

    hexToRgba: (hexValue) => {
      const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const hex = hexValue.replace(rgx, (m, r, g, b) => r + r + g + g + b + b );
      const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      const r = parseInt(rgb[1], 16);
      const g = parseInt(rgb[2], 16);
      const b = parseInt(rgb[3], 16);
      return `rgba(${r},${g},${b},1)`
    },

    hslToRgba: (hslValue) => {
      const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
      const h = parseInt(hsl[1]) / 360;
      const s = parseInt(hsl[2]) / 100;
      const l = parseInt(hsl[3]) / 100;
      const a = hsl[4] || 1;
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      };
      let r, g, b;
      if (s == 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return `rgba(${r * 255},${g * 255},${b * 255},${a})`
    },

    colorToRgba: (val) => {
      if (Utils.is.rgb(val)) return Utils.rgbToRgba(val)
      if (Utils.is.hex(val)) return Utils.hexToRgba(val)
      if (Utils.is.hsl(val)) return Utils.hslToRgba(val)
    },

    /**
     * 将 Color 或 Points 值转换为 array
     * 'rgba(100,200,255,0.7)' -> [100, 200, 255, 0.7]
     * '70 80 24' -> [70, 80, 24]
     * @param value {String} - rgba 值或 points 值
     */
    decomposeColorOrPoints: (value) => {
      const rgx = /-?\d*\.?\d+/g;
      if (Utils.is.col(value)) value = Utils.colorToRgba(value);
      const strArr = value.match(rgx);
      return strArr ? strArr.map(Number) : [0]
    },

    /**
     * 将 Number 或 Array 值转换为 array
     * @param value {Number|Array} - key 所对应的 array 或 number
     */
    decomposeNumberOrArray: (value) => {
      if (Utils.is.arr(value)) return value
      return [value]
    },

    /**
     * 通过 val 判定后获取 decompose 方法
     * @param val {Array|Number|String} - key 每个阶段所对应的 value
     */
    getDecomposeFnByVal: (val) => {
      if (Utils.is.str(val)) return Utils.decomposeColorOrPoints
      return Utils.decomposeNumberOrArray
    },

    /**
     * 将 array 转换为 rgba 值
     * [100, 200, 255, 0.7] -> 'rgba(100,200,255,0.7)'
     * @parma arr {Array} - rgba 的数组模式([r, g, b, a])
     */
    composeRgba: (arr) => {
      return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
    },

    /**
     * 将 array 转换为 points 值
     * [70, 80, 24] -> '70 80 24'
     * @param arr {Array} - points 的数组模式([70, 80, 24])
     */
    composePoints: (arr) => {
      return arr.join(' ')
    },

    /**
     * 将 array 转换为对应的值
     * @param arr {Array} - points
     */
    composeArrayOrNumber: (arr) => {
      const len = arr.length;
      if (len === 1) return arr[0]
      return arr
    },

    /**
     * 通过 val 判定后获取 compose 方法
     * @param val {Array|Number|String} - key 每个阶段所对应的 value
     */
    getComposeFnByVal: (val) => {
      if (Utils.is.col(val)) return Utils.composeRgba
      if (Utils.is.points(val)) return Utils.composePoints
      return Utils.composeArrayOrNumber
    },

    /**
     * 获取范围内的某值
     * 100, 0, 200 -> 100
     * -10, 0, 200 -> 0
     * 300, 0, 200 -> 200
     * @param val {Number} - 优先值
     * @param min {Number} - 最小值
     * @param max {Number} - 最大值
     */
    minMaxValue: (val, min, max) => {
      return Math.min(Math.max(val, min), max)
    }
  };

  /**
   * tween 的格式化
   *
   * @author wujohns
   * @date 19/01/29
   */

  const Tween = {
    /**
     * format tweens
     * values: [val1, val2, val3]
     * settings: {
     *    delay, duration
     * }
     * 备注：format 的结果为从 val1 -> val2, val2 -> val3 两个 tween
     */
    getTweens: (values, settings) => {
      // 获取 start 与每个 tween 的 duration
      const len = values.length - 1;
      const duration = settings.duration / len;
      let start = settings.delay;

      // tween 格式化
      const decomposeFn = Utils.getDecomposeFnByVal(values[0]);
      const tweens = [];
      for (let i = 0; i < len; i++) {
        const tween = {
          from: decomposeFn(values[i]),
          to: decomposeFn(values[i+1]),
          start,
          end: start + duration,
          duration
        };
        start = tween.end;
        tweens.push(tween);
      }
      tweens[len - 1].end += settings.endDelay;

      return tweens
    }
  };

  /**
   * 过渡函数
   *
   * @author wujohns
   * @date 18/12/31
   */

  // BezierEasing https://github.com/gre/bezier-easing
  const bezier = (() => {
    const kSplineTableSize = 11;
    const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1 }  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1 }  function C (aA1)      { return 3.0 * aA1 }
    function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT }  function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1) }
    function binarySubdivide (aX, aA, aB, mX1, mX2) {
      let currentX, currentT, i = 0;
      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) { aB = currentT; } else { aA = currentT; }    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
      return currentT;
    }

    function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
      for (let i = 0; i < 4; ++i) {
        const currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }

    function bezier(mX1, mY1, mX2, mY2) {

      if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) return;
      let sampleValues = new Float32Array(kSplineTableSize);

      if (mX1 !== mY1 || mX2 !== mY2) {
        for (let i = 0; i < kSplineTableSize; ++i) {
          sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
      }

      function getTForX(aX) {

        let intervalStart = 0.0;
        let currentSample = 1;
        const lastSample = kSplineTableSize - 1;

        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
          intervalStart += kSampleStepSize;
        }

        --currentSample;

        const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        const guessForT = intervalStart + dist * kSampleStepSize;
        const initialSlope = getSlope(guessForT, mX1, mX2);

        if (initialSlope >= 0.001) {
          return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        } else if (initialSlope === 0.0) {
          return guessForT;
        } else {
          return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }

      }

      return x => {
        if (mX1 === mY1 && mX2 === mY2) return x;
        if (x === 0) return 0;
        if (x === 1) return 1;
        return calcBezier(getTForX(x), mY1, mY2);
      }

    }

    return bezier;

  })();

  // easings factory
  const easings = (() => {

    const names = ['Quad', 'Cubic', 'Quart', 'Quint', 'Sine', 'Expo', 'Circ', 'Back', 'Elastic'];

    // Elastic easing adapted from jQueryUI http://api.jqueryui.com/easings/

    function elastic(t, p) {
      return t === 0 || t === 1 ? t :
      -Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2.0) * Math.asin(1))) * (Math.PI * 2)) / p );
    }

    // Approximated Penner equations http://matthewlein.com/ceaser/

    const equations = {
      In: [
        [0.550, 0.085, 0.680, 0.530], /* InQuad */
        [0.550, 0.055, 0.675, 0.190], /* InCubic */
        [0.895, 0.030, 0.685, 0.220], /* InQuart */
        [0.755, 0.050, 0.855, 0.060], /* InQuint */
        [0.470, 0.000, 0.745, 0.715], /* InSine */
        [0.950, 0.050, 0.795, 0.035], /* InExpo */
        [0.600, 0.040, 0.980, 0.335], /* InCirc */
        [0.600, -0.280, 0.735, 0.045], /* InBack */
        elastic /* InElastic */
      ], Out: [
        [0.250, 0.460, 0.450, 0.940], /* OutQuad */
        [0.215, 0.610, 0.355, 1.000], /* OutCubic */
        [0.165, 0.840, 0.440, 1.000], /* OutQuart */
        [0.230, 1.000, 0.320, 1.000], /* OutQuint */
        [0.390, 0.575, 0.565, 1.000], /* OutSine */
        [0.190, 1.000, 0.220, 1.000], /* OutExpo */
        [0.075, 0.820, 0.165, 1.000], /* OutCirc */
        [0.175, 0.885, 0.320, 1.275], /* OutBack */
        (t, f) => 1 - elastic(1 - t, f) /* OutElastic */
      ], InOut: [
        [0.455, 0.030, 0.515, 0.955], /* InOutQuad */
        [0.645, 0.045, 0.355, 1.000], /* InOutCubic */
        [0.770, 0.000, 0.175, 1.000], /* InOutQuart */
        [0.860, 0.000, 0.070, 1.000], /* InOutQuint */
        [0.445, 0.050, 0.550, 0.950], /* InOutSine */
        [1.000, 0.000, 0.000, 1.000], /* InOutExpo */
        [0.785, 0.135, 0.150, 0.860], /* InOutCirc */
        [0.680, -0.550, 0.265, 1.550], /* InOutBack */
        (t, f) => t < .5 ? elastic(t * 2, f) / 2 : 1 - elastic(t * -2 + 2, f) / 2 /* InOutElastic */
      ]
    };

    let functions = {
      linear: bezier(0.250, 0.250, 0.750, 0.750)
    };

    for (let type in equations) {
      equations[type].forEach((f, i) => {
        functions['ease'+type+names[i]] =
          typeof f === 'function' ? f : bezier(f[0], f[1], f[2], f[3]);
      });
    }

    return functions;

  })();

  /**
   * anime 入口文件
   *
   * @author wujohns
   * @date 19/01/29
   */

  // requestAnimationFrame 驱动的动画播放
  const activeInstances = [];
  let raf = 0;

  const engine = () => {
    raf = requestAnimationFrame((timestamp) => {
      const len = activeInstances.length;
      if (len) {
        // 若有 active 的 instance 则播放相应的动画
        for (let i = 0; i < len; i++) {
          if (activeInstances[i]) activeInstances[i].tick(timestamp);
        }
        engine();
      } else {
        // 没有 active 的 instance 则取消相应的 raf
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
  };

  class Anime {
    /**
     * @param {Object} config - 动画初始配置
     * @param {Object} config.settings - 动画运行配置
     * @param {Object} config.configMap - 动画回调函数map
     * @param {Object} config.dataProgress - 动画相关数据步骤
     * 
     * ex: {
     *  duration: 1000,
     *  delay: 0,
     *  endDelay: 0,
     *  elasticity: 500,
     *  easing: 'easeOutElastic',
     *  direction: 'normal' | 'reverse' | 'alternate',
     *  loop: false,
     *  autoPlay: true,
     *  speed: 1,
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
      this.duration = config.duration || 1000;
      this.delay = config.delay || 0;
      this.endDelay = config.endDelay || 0;
      this.easing = easings[config.easing || 'easeOutElastic'];
      this.elasticity = (1000 - Utils.minMaxValue(config.elasticity || 500, 1, 999)) / 1000;
      this.direction = config.direction || 'normal';
      this.loop = config.loop || false;

      // 动画运行回调配置
      this.callbackMap = {
        update: (data) => {},
        complete: (data) => {},

        ...config.callbackMap
      };

      // animations 的生成（核心为每个 animations 的 tweens）
      const dataProgress = config.dataProgress || {};
      this.animations = this.getAnimations(dataProgress);

      // 运行时间判定
      this.now = 0;
      this.startTime = 0;
      this.pauseTime = 0;
      this.speed = config.speed || 1;

      // 目标值
      this.target = {};
      this.reversed = this.direction === 'reverse';

      // 启动 anime
      const autoPlay = typeof config.autoPlay === 'boolean' ? config.autoPlay : true;
      if (autoPlay) this.play();
    }

    /**
     * 获取动画对象
     */
    getAnimations (dataProgress) {
      const animations = [];
      for (let key in dataProgress) {
        // 获取相应的 tweens
        const values = dataProgress[key];
        const tweens = Tween.getTweens(values, {
          duration: this.duration,
          delay: this.delay,
          endDelay: this.endDelay
        });

        // animations 存储每个 key 以及其对应的 tweens
        animations.push({
          key,
          tweens,
          composeFn: Utils.getComposeFnByVal(values[0])
        });
      }
      return animations
    }

    /**
     * 启动动画
     */
    play () {
      // 若在动画队列中则不作操作
      const i = activeInstances.indexOf(this);
      if (i > -1) return

      // 加入动画队列并尝试启动
      activeInstances.push(this);
      if (!raf) engine();
    }

    /**
     * 重新启动
     */
    restart () {
      this.startTime = 0;
      this.pauseTime = 0;
      this.play();
    }


    /**
     * 暂停动画
     */
    pause () {
      // 记录当前时间差
      this.pauseTime = this.now - this.startTime;
      this.startTime = 0;

      // 将对象移除动画队列
      const i = activeInstances.indexOf(this);
      if (i > -1) activeInstances.splice(i, 1);
    }

    /**
     * 反转动画
     */
    reverse () {
      // 若不在动画队列中则不作操作
      const i = activeInstances.indexOf(this);
      if (i < 0) return

      // 时间转换计算
      const duration = this.delay + this.duration + this.endDelay;
      let engineTime = (this.now - this.startTime) * this.speed;
      if (engineTime > duration) {
        engineTime = duration;
      }
      engineTime = duration - engineTime;
      this.startTime = this.now - engineTime/this.speed;
      this.reversed = !this.reversed;
    }

    /**
     * 每帧触发逻辑
     * @param {number} timestamp - 时间戳
     */
    tick (timestamp) {
      this.now = timestamp;
      if (this.pauseTime) {
        this.startTime = this.now - this.pauseTime;
        this.pauseTime = 0;
      }
      if (!this.startTime) this.startTime = this.now;
      let engineTime = (this.now - this.startTime) * this.speed;
      this.setProgress(engineTime);
    }

    /**
     * 每帧触发逻辑
     * @param {number} engineTime - 由 timestamp 确定的实际运行时间
     */
    setProgress (engineTime) {
      // 获取动画播放时间
      const duration = this.delay + this.duration + this.endDelay; // 动画总时长
      let insTime;
      let loopComplete = false;
      if (engineTime < duration) {
        // engineTime 小于动画时长正常播放
        insTime = engineTime;
      } else {
        // engineTime 大于动画时长播放最后一步
        insTime = duration;
        loopComplete = true;
      }
      // 反转播放判定
      if (this.reversed) insTime = duration - insTime;

      // 动画播放
      this.setAnimationsProgress(insTime);

      // 循环处理
      if (loopComplete) {
        if (this.loop === true || parseInt(this.loop) > 1) {
          // 进入下一循环
          this.startTime = this.now;
          if (typeof this.loop === 'number') {
            // loop 为 number 则进行计数
            this.loop = parseInt(this.loop) - 1;
          }
          if (this.direction === 'alternate') {
            // 判定是否在下一个循环反转
            this.reversed = !this.reversed;
          }
        } else {
          // 停止播放
          const cur = activeInstances.indexOf(this);
          if (cur > -1) activeInstances.splice(cur, 1);

          // 回调处理
          this.callbackMap['complete'](this.target);
        }
      }
    }

    /**
     * 动画计算
     * @param {number} insTime - 需要展现动画的时间戳
     */
    setAnimationsProgress (insTime) {
      const animsLen = this.animations.length;
      for (let i = 0; i < animsLen; i++) {
        const anim = this.animations[i];
        const tweens = anim.tweens;
        const tweensLen = tweens.length;

        // 获取当前 insTime 需要运行的 tween
        let tween = tweens[tweensLen - 1];
        for (let j = 0; j < tweensLen; j++) {
          if (insTime < tweens[j].end) {
            tween = tweens[j];
            break
          }
        }

        // 获取在当前 insTime 中对应的值
        const elapsed = Utils.minMaxValue(insTime - tween.start, 0, tween.duration) / tween.duration;
        const eased = this.easing(elapsed, this.elasticity);

        const valueLen = tween.to.length;
        const value = [];
        for (let j = 0; j < valueLen; j++) {
          const to = tween.to[j];
          const from = tween.from[j];
          value.push(eased * (to - from) + from);
        }

        // target 赋值
        this.target[anim.key] = anim.composeFn(value);
      }

      // 调用更新回调
      this.callbackMap['update'](this.target);
    }
  }

  return Anime;

}));
