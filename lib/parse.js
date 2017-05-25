/*jshint -W040,-W109*/
'use strict';

var acorn = require('acorn');
var injectAcornJsx = require('acorn-jsx/inject');
var injectAcornObjectRestSpread = require('acorn-object-rest-spread/inject');
var injectAcornStaticClassPropertyInitializer = require('acorn-static-class-property-initializer/inject');

injectAcornJsx(acorn);
injectAcornObjectRestSpread(acorn);
injectAcornStaticClassPropertyInitializer(acorn);

/**
 * @param {String} source
 * @returns {Array} parsed tokens
 */
function parse(source) {
    var tokens = [];

    acorn.parse(source, {
        plugins: {
            jsx: true,
            objectRestSpread: true,
            staticClassPropertyInitializer: true
        },
        onToken: tokens,
        ecmaVersion: 8,
        sourceType: 'module'
    });

    return tokens;
}

module.exports = parse;
