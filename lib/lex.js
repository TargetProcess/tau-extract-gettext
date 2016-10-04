'use strict';

var Lexer = require('lex');

function extract(lexeme) {
    var str = '',
        quoteChar = null;

    for (var i = 0, len = lexeme.length; i < len; i++) {
        var c = lexeme[i];

        if (!quoteChar && /["'`]/.test(c)) {
            quoteChar = c;
            continue;
        }

        if (c === quoteChar && lexeme.charAt(i - 1) !== '\\') break;
        if (quoteChar) str += c;
    }

    return str;
}

function unescape(str) {
    return str.replace(/\\'/, '\'').replace(/\s+/g, ' ').trim();
}

module.exports = function (config) {
    return {
        tokenize: function tokenize(source) {
            var tokens = [],
                lexer = new Lexer(function () {
                });
            config.stringsRules.forEach(function (rule) {
                lexer.addRule(rule, function (lexeme) {
                    var str = extract(lexeme);
                    tokens.push(unescape(str));
                }, []);
            });
            lexer.setInput(source);
            lexer.lex();

            return tokens;
        },
        getScope: function (source) {
            var scope = '',
                lexer = new Lexer(function () {
                });
            config.scopeRules.forEach(function (rule) {
                lexer.addRule(rule, function (lexeme, value) {
                    if (value) {
                        scope = value;
                    }
                }, []);
            });
            lexer.setInput(source);
            lexer.lex();
            return scope;
        }
    };
};
