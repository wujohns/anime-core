/**
 * utils functions
 *
 * @author wujohns
 * @date 18/12/31
 */
'use strict'

const Utils = {
    // Types
    is: {
        arr: a => Array.isArray(a),
        obj: a => stringContains(Object.prototype.toString.call(a), 'Object'),
        pth: a => is.obj(a) && a.hasOwnProperty('totalLength'),
        svg: a => a instanceof SVGElement,
        dom: a => a.nodeType || is.svg(a),
        str: a => typeof a === 'string',
        fnc: a => typeof a === 'function',
        und: a => typeof a === 'undefined',
        hex: a => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a),
        rgb: a => /^rgb/.test(a),
        hsl: a => /^hsl/.test(a),
        col: a => (is.hex(a) || is.rgb(a) || is.hsl(a))
    },

    // Strings
    stringToHyphens: (str) => {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },

    stringContains: (str, text) => {
        return str.indexOf(text) > -1;
    },

    // Arrays
    filterArray: (arr, callback) => {
        const len = arr.length;
        const thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        let result = [];
        for (let i = 0; i < len; i++) {
            if (i in arr) {
                const val = arr[i];
                if (callback.call(thisArg, val, i, arr)) {
                    result.push(val);
                }
            }
        }
        return result;
    },

    flattenArray: (arr) =>
        arr.reduce(
            (a, b) => a.concat(is.arr(b) ? utils.flattenArray(b) : b),
            []
        ),

    arrayContains: (arr, val) => arr.some(a => a === val),

    // Object
    cloneObject: (o) => {
        let clone = {};
        for (let p in o) clone[p] = o[p];
        return clone;
    },

    replaceObjectProps: (o1, o2) => {
        let o = cloneObject(o1);
        for (let p in o1) o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
        return o;
    },

    mergeObjects: (o1, o2) => {
        let o = cloneObject(o1);
        for (let p in o2) o[p] = is.und(o1[p]) ? o2[p] : o1[p];
        return o;
    },

    // Colors
    rgbToRgba: (rgbValue) => {
        const rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
        return rgb ? `rgba(${rgb[1]},1)` : rgbValue;
    },

    hexToRgba: (hexValue) => {
        const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const hex = hexValue.replace(rgx, (m, r, g, b) => r + r + g + g + b + b );
        const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        const r = parseInt(rgb[1], 16);
        const g = parseInt(rgb[2], 16);
        const b = parseInt(rgb[3], 16);
        return `rgba(${r},${g},${b},1)`;
    },

    hslToRgba: (hslValue) => {
        const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
        const h = parseInt(hsl[1]) / 360;
        const s = parseInt(hsl[2]) / 100;
        const l = parseInt(hsl[3]) / 100;
        const a = hsl[4] || 1;
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
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
        return `rgba(${r * 255},${g * 255},${b * 255},${a})`;
    },

    colorToRgb: (val) => {
        if (is.rgb(val)) return rgbToRgba(val);
        if (is.hex(val)) return hexToRgba(val);
        if (is.hsl(val)) return hslToRgba(val);
    },

    // Units
    getUnit: (val) => {
        const split = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
        if (split) return split[2];
    },

    getTransformUnit: (propName) => {
        if (stringContains(propName, 'translate') || propName === 'perspective') return 'px';
        if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) return 'deg';
    },

    // Values
    minMaxValue: (val, min, max) => Math.min(Math.max(val, min), max),

    getRelativeValue: (to, from) => {
        const operator = /^(\*=|\+=|-=)/.exec(to);
        if (!operator) return to;
        const u = getUnit(to) || 0;
        const x = parseFloat(from);
        const y = parseFloat(to.replace(operator[0], ''));
        switch (operator[0][0]) {
            case '+': return x + y + u;
            case '-': return x - y + u;
            case '*': return x * y + u;
        }
    },

    validateValue: (val, unit) => {
        if (is.col(val)) return colorToRgb(val);
        const originalUnit = getUnit(val);
        const unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
        return unit && !/\s/g.test(val) ? unitLess + unit : unitLess;
    },

    // Length
    getDistance: (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)),

    // TODO ------------------ Path animation

    // 与 dom 操作相关 ----------------------
    // TODO 需要移除或改造的部分
    // String
    selectString: (str) => {
        if (is.col(str)) return;
        try {
            let nodes = document.querySelectorAll(str);
            return nodes;
        } catch(e) {
            return;
        }
    },

    // Array
    toArray: (o) => {
        if (is.arr(o)) return o;
        if (is.str(o)) o = selectString(o) || o;
        if (o instanceof NodeList || o instanceof HTMLCollection) return [].slice.call(o);
        return [o];
    },

    // Value
    getFunctionValue: (val, animatable) => {
        if (!is.fnc(val)) return val;
        return val(animatable.target, animatable.id, animatable.total);
    },

    getCSSValue: (el, prop) => {
        if (prop in el.style) {
            return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0';
        }
    },

    getAnimationType: (el, prop) => {
        if (is.dom(el) && arrayContains(validTransforms, prop)) return 'transform';
        if (is.dom(el) && (el.getAttribute(prop) || (is.svg(el) && el[prop]))) return 'attribute';
        if (is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) return 'css';
        if (el[prop] != null) return 'object';
    },

    getTransformValue: (el, propName) => {
        const defaultUnit = getTransformUnit(propName);
        const defaultVal = stringContains(propName, 'scale') ? 1 : 0 + defaultUnit;
        const str = el.style.transform;
        if (!str) return defaultVal;
        let match = [];
        let props = [];
        let values = [];
        const rgx = /(\w+)\((.+?)\)/g;
        while (match = rgx.exec(str)) {
        props.push(match[1]);
        values.push(match[2]);
        }
        const value = filterArray(values, (val, i) => props[i] === propName);
        return value.length ? value[0] : defaultVal;
    },

    getOriginalTargetValue: (target, propName) => {
        switch (getAnimationType(target, propName)) {
            case 'transform': return getTransformValue(target, propName);
            case 'css': return getCSSValue(target, propName);
            case 'attribute': return target.getAttribute(propName);
        }
        return target[propName] || 0;
    },

    // Length
    getCircleLength: (el) => 2 * Math.PI * el.getAttribute('r'),

    getRectLength: (el) => (el.getAttribute('width') * 2) + (el.getAttribute('height') * 2),

    getLineLength: (el) =>
        getDistance(
            {x: el.getAttribute('x1'), y: el.getAttribute('y1')}, 
            {x: el.getAttribute('x2'), y: el.getAttribute('y2')}
        ),

    getPolylineLength: (el) => {
        const points = el.points;
        let totalLength = 0;
        let previousPos;
        for (let i = 0 ; i < points.numberOfItems; i++) {
            const currentPos = points.getItem(i);
            if (i > 0) totalLength += getDistance(previousPos, currentPos);
            previousPos = currentPos;
        }
        return totalLength;
    },

    getPolygonLength: (el) => {
        const points = el.points;
        return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
    },


}

export default Utils
