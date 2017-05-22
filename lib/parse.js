'use strict';

var acorn = require('acorn');
var injectAcornJsx = require('acorn-jsx/inject');

injectAcornJsx(acorn);

/**
 * @param {String} source
 * @param {*} file
 * @returns {Array} parsed tokens
 */
function parse(source, file) {
    var tokens = [];

    try {
        acorn.parse(source, {
            plugins: {
                jsx: true
            },
            onToken: tokens,
            ecmaVersion: 8,
            sourceType: 'module'
        });
    } catch (/*Error*/e) {
        console.error('Cannot parse file ' + file + '. ' + e.name + ': ' + e.message);
    }

    return tokens;
}

module.exports = parse;
