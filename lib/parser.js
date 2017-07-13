const babylon = require('babylon');

const plugins = ['jsx', 'estree', 'classProperties', 'objectRestSpread'];
const sourceType = 'module';

/**
 * @param {String} source
 * @returns {Array} parsed tokens
 */
function parse(source) {
    const parsedTree = babylon.parse(source, {
        plugins,
        sourceType,
        tokens: true
    });

    return parsedTree.tokens;
}

/**
 * Parses single expression
 * @param {String} source
 * @returns {Node} parsed tree
 */
function parseExpression(source) {
    return babylon.parseExpression(source, {
        plugins,
        sourceType
    });
}

module.exports = {
    parse,
    parseExpression
};
