'use strict';

var glob = require('glob');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var path = require('path');
var lex = require('./lex');
var defaultConfig = require('./defaultConfig');
var acorn = require('acorn');
var acornPlugin = require('acorn-jsx');

function isFile(path) {
    var stat = fs.statSync(path);
    return stat.isFile();
}

function getIntlProperty(file, property) {
    return JSON.parse(fs.readFileSync(file).toString())[property];
}

function recursiveSearchScopeFile(dir, scopeFileName, deep, deepSearch) {
    if (deep > deepSearch) {
        return;
    }
    var scopeFile = path.join(dir, scopeFileName);
    if (fs.existsSync(scopeFile)) {
        return scopeFile;
    }
    var nextDeep = deep + 1;
    var nextDir = path.join(dir, '..');
    return recursiveSearchScopeFile(nextDir, scopeFileName, nextDeep, deepSearch);
}

function getScopeFromFile(scopeFileName, file, property, deepSearch) {
    var scope;
    var dir = path.dirname(file);
    var scopeFile = recursiveSearchScopeFile(dir, scopeFileName, 0, deepSearch);
    if (scopeFile) {
        scope = getIntlProperty(scopeFile, property);
    }
    return scope;
}

function findStringInReactComponents(source) {
    var tokens = [];
    acorn.parse(source, {
        plugins: {jsx: true},
        onToken: tokens,
        ecmaVersion: 6,
        sourceType:'module'
    });
    return _.chain(tokens).map(function (token, tokenIndex) {
        if (token.value === 'FormattedMessage' && token.type.label === 'jsxName') {
            for (var index = tokenIndex; index < tokens.length; index++) {
                var currentToken = tokens[index];
                if (currentToken.value === 'message' && currentToken.type.label === 'jsxName') {
                    return tokens[index + 2].value;
                }
            }
        }
    }).compact().value();
}

function getStrings(pathMask, done, config) {
    var configuredLexer = lex(config);
    var tokenize = configuredLexer.tokenize;
    var getScope = configuredLexer.getScope;

    glob(pathMask, function (er, files) {
        var tokens = {};
        if (files.length === 0) {
            done('Files not found');
            return;
        }
        files = files.filter(isFile);

        async.reduce(files, tokens, function (tokens, file, next) {
            fs.readFile(file, function (err, src) {
                if (err) {
                    return next(null, tokens);
                }
                if (src.length === 0) {
                    return next(null, tokens);
                }

                var source = src.toString();
                var scope = getScope(source) ||
                    getScopeFromFile(
                        config.scopeFileName,
                        file,
                        config.scopeProperty,
                        config.searchDeepScopeFile
                    ) ||
                    config.defaultScope;

                if (!tokens[scope]) {
                    tokens[scope] = [];
                }
                tokens[scope] = tokens[scope].concat(tokenize(source));

                if (path.extname(file) === '.jsx') {
                    tokens[scope] = tokens[scope].concat(findStringInReactComponents(source));
                }
                return next(null, tokens);
            });
        }, done);
    });
}

function scan(path, done, config) {
    config = config || defaultConfig;
    getStrings(path, function (err, results) {
        if (err) {
            return done(err, {});
        }

        var strings = _.reduce(results, function (strings, result, key) {
            strings[key] = _.flattenDeep(result);
            return strings;
        }, {});

        return done(null, strings);
    }, config);
}

module.exports = scan;
