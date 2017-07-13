'use strict';

const Lexer = require('lex');
const {parseExpression} = require('./parser');

function getStringFromExpression(expr) {
    if (expr.type === 'BinaryExpression' && expr.operator === '+') {
        const left = getStringFromExpression(expr.left);
        const right = getStringFromExpression(expr.right);
        return (left === null || right === null) ? null : (left + right);
    } else if (expr.type === 'Literal') {
        return expr.value;
    } else {
        return null;
    }
}

function extractFromExpression(expression) {
    try {
        const expr = parseExpression(expression);
        return getStringFromExpression(expr);
    } catch (ignored) {
        return null;
    }
}

function extract(quoteChar, message) {
    const len = message.length;
    let str = '';

    for (let i = 0; i < len; i++) {
        const c = message[i];
        if (c === quoteChar && i > 0 && message.charAt(i - 1) !== '\\') {
            break;
        }
        str += c;
    }

    if (str.length === len) {
        return str;
    }

    const str2 = extractFromExpression(quoteChar + message + quoteChar);
    if (str2) {
        return str2;
    } else {
        console.error('Message is extracted partially:',
            quoteChar + message + quoteChar, '->', quoteChar + str + quoteChar);
        return str;
    }
}

function unescape(str) {
    return str.replace(/\\'/g, '\'').replace(/\s+/g, ' ').trim();
}

module.exports = function (config) {
    return {
        tokenize: function tokenize(source) {
            const tokens = [],
                lexer = new Lexer(function () {
                });
            config.stringsRules.forEach(function (rule) {
                lexer.addRule(rule, function (lexeme, quoteChar, message) {
                    const str = extract(quoteChar, message);
                    tokens.push(unescape(str));
                }, []);
            });
            lexer.setInput(source).lex();

            return tokens;
        },
        getScope: function (source) {
            let scope = '';
            const lexer = new Lexer(function () {
            });
            config.scopeRules.forEach(function (rule) {
                lexer.addRule(rule, function (lexeme, value) {
                    if (value) {
                        if (scope) {
                            console.error('Scope is already defined as "' + scope +
                                '", and redefined to "' + value + '"');
                        }
                        scope = value;
                    }
                }, []);
            });
            lexer.setInput(source).lex();
            return scope;
        }
    };
};
