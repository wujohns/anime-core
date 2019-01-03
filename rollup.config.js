/**
 * rollup configs
 *
 * @author wujohns
 * @date 18/12/31
 */
'use strict'

export default {
    input: 'src/index.js',
    output: {
        name: 'anime-base',
        file: 'anime-base.js',
        format: 'umd'
    }
}