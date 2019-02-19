/**
 * rollup configs
 *
 * @author wujohns
 * @date 18/12/31
 */
'use strict'

export default {
    input: 'lib/index.js',
    output: {
        name: 'animeBase',
        file: 'anime-base.js',
        format: 'umd'
    }
}