'use strict';

var Lexer = require('lex');
var acorn = require('acorn');

function getStringFromExpression(expr) {
    if (expr.type === 'BinaryExpression' && expr.operator === '+') {
        var left = getStringFromExpression(expr.left);
        var right = getStringFromExpression(expr.right);
        return (left === null || right === null) ? null : (left + right);
    } else if (expr.type === 'Literal') {
        return expr.value;
    } else {
        return null;
    }
}

function extractFromExpression(expression) {
    try {
        var expr = acorn.parseExpressionAt(expression, 0, {});
        return getStringFromExpression(expr);
    } catch (ignored) {
        return null;
    }
}

function extract(quoteChar, message) {
    var str = '';
    for (var i = 0, len = message.length; i < len; i++) {
        var c = message[i];
        if (c === quoteChar && i > 0 && message.charAt(i - 1) !== '\\') {
            break;
        }
        str += c;
    }

    if (str.length === len) {
        return str;
    }

    var str2 = extractFromExpression(quoteChar + message + quoteChar);
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

module.exports = function(config) {
    return {
        tokenize: function tokenize(source) {
            var tokens = [],
                lexer = new Lexer(function() {
                });
            config.stringsRules.forEach(function(rule) {
                lexer.addRule(rule, function(lexeme, quoteChar, message) {
                    var str = extract(quoteChar, message);
                    tokens.push(unescape(str));
                }, []);
            });
            lexer.setInput(source).lex();

            return tokens;
        },
        getScope: function(source) {
            var scope = '',
                lexer = new Lexer(function() {
                });
            config.scopeRules.forEach(function(rule) {
                lexer.addRule(rule, function(lexeme, value) {
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
