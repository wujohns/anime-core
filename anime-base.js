(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global['anime-base'] = factory());
}(this, function () { 'use strict';

    /**
     * utils functions
     *
     * @author wujohns
     * @date 18/12/31
     */

    class Utils {
        static test () {
            console.log('---- test ----');
        }
    }

    /**
     * entry file
     *
     * @author wujohns
     * @date 18/12/31
     */

    Utils.test();

    var index = {
        aaa: 'aaa'
    };

    return index;

}));
