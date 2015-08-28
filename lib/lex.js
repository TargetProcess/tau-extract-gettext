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
        if (quoteChar) str = str + c;
    }

    return str;
}

function unescape(str) {
    return str.replace(/\\'/, '\'').replace(/\s+/gm, ' ').trim();
}

module.exports = function tokenize(source) {
    var tokens = [],
        lexer = new Lexer(function () {
        });

    /* lexer.addRule(/__\(.+?\)/g, function(lexeme) {
     var str = extract(lexeme);
     tokens.push(unescape(str));
     }, []);

     lexer.addRule(/__n\(.+?\)/g, function(lexeme) {
     var single = extract(lexeme),
     offset = lexeme.indexOf(single) + single.length + 1,
     plural = extract(lexeme.substr(offset));

     tokens.push(unescape(single));
     if (plural) tokens.push(unescape(plural));
     }, []);*/
    lexer.addRule(/intl\.formatMessage\([\s\S]+?\)/mg, function (lexeme) {
        var str = extract(lexeme);
        tokens.push(unescape(str));
    }, []);
    lexer.addRule(/intl\.formatHTMLMessage\([\s\S]+?\)/g, function (lexeme) {
        var str = extract(lexeme);
        tokens.push(unescape(str));
    }, []);
    lexer.addRule(/\{\{formatMessage\([\s\S]+?\)\}\}/g, function (lexeme) {
        var str = extract(lexeme);
        tokens.push(unescape(str));
    }, []);
    lexer.addRule(/\{\{formatHTMLMessage\([\s\S]+?\)\}\}/g, function (lexeme) {
        var str = extract(lexeme);
        tokens.push(unescape(str));
    }, []);
    /*  lexer.addRule(/fn\.intl\.formatMessage\(.+?\)/g, function(lexeme) {
     var str = extract(lexeme);
     tokens.push(unescape(str));
     }, []);
     lexer.addRule(/fn\.intl\.formatHTMLMessage\(.+?\)/g, function(lexeme) {
     var str = extract(lexeme);
     tokens.push(unescape(str));
     }, []);*/

    lexer.setInput(source);
    lexer.lex();

    return tokens;
};
