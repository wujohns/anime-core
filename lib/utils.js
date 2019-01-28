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
        pth: a => Utils.is.obj(a) && a.hasOwnProperty('totalLength'),
        // svg: a => a instanceof SVGElement,
        // dom: a => a.nodeType || is.svg(a),
        str: a => typeof a === 'string',
        fnc: a => typeof a === 'function',
        und: a => typeof a === 'undefined',
        hex: a => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a),
        rgb: a => /^rgb/.test(a),
        hsl: a => /^hsl/.test(a),
        col: a => (Utils.is.hex(a) || Utils.is.rgb(a) || Utils.is.hsl(a))
    },

    // Array
    toArray: (o) => {
        if (Utils.is.arr(o)) return o
        return [o]
    },

    flattenArray: (arr) =>
        arr.reduce(
            (a, b) => a.concat(Utils.is.arr(b) ? Utils.flattenArray(b) : b),
            []
        ),

    // Object
    cloneObject: (o) => {
        let clone = {};
        for (let p in o) clone[p] = o[p];
        return clone;
    },

    replaceObjectProps: (o1, o2) => {
        let o = Utils.cloneObject(o1);
        for (let p in o1) o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
        return o;
    },

    mergeObjects: (o1, o2) => {
        let o = Utils.cloneObject(o1);
        for (let p in o2) o[p] = Utils.is.und(o1[p]) ? o2[p] : o1[p];
        return o;
    }
}

export default Utils