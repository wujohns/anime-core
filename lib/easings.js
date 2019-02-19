/**
 * 过渡函数
 *
 * @author wujohns
 * @date 18/12/31
 */
'use strict'

// BezierEasing https://github.com/gre/bezier-easing
const bezier = (() => {
  const kSplineTableSize = 11;
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1 };
  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1 };
  function C (aA1)      { return 3.0 * aA1 };

  function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT };
  function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1) };

  function binarySubdivide (aX, aA, aB, mX1, mX2) {
    let currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) { aB = currentT } else { aA = currentT };
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
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
  }

  let functions = {
    linear: bezier(0.250, 0.250, 0.750, 0.750)
  }

  for (let type in equations) {
    equations[type].forEach((f, i) => {
      functions['ease'+type+names[i]] =
        typeof f === 'function' ? f : bezier(f[0], f[1], f[2], f[3]);
    });
  }

  return functions;

})();

export default easings