'use strict';

const glob = require('glob');
const _ = require('lodash');
const async = require('async');
const fs = require('fs');
const path = require('path');
const lex = require('./lex');
const defaultConfig = require('./defaultConfig');
const {parse} = require('./parser');

function isFile(path) {
    const stat = fs.statSync(path);
    return stat.isFile();
}

function getIntlProperty(file, property) {
    return JSON.parse(fs.readFileSync(file).toString())[property];
}

function recursiveSearchScopeFile(dir, scopeFileName, deep, deepSearch) {
    if (deep > deepSearch) {
        return;
    }
    const scopeFile = path.join(dir, scopeFileName);
    if (fs.existsSync(scopeFile)) {
        return scopeFile;
    }
    const nextDeep = deep + 1;
    const nextDir = path.join(dir, '..');
    return recursiveSearchScopeFile(nextDir, scopeFileName, nextDeep, deepSearch);
}

function getScopeFromFile(scopeFileName, file, property, deepSearch) {
    let scope;
    const dir = path.dirname(file);
    const scopeFile = recursiveSearchScopeFile(dir, scopeFileName, 0, deepSearch);
    if (scopeFile) {
        scope = getIntlProperty(scopeFile, property);
    }
    return scope;
}

/**
 * Find tokens for `message="message string token"` in JSX.
 *
 * Note that current implementation is buggy: it extracts strings from `message="..."` attributes
 * for each and every JSX component after first <FormattedMessage /> component is met.
 *
 * Proper implementation would require AST traversal.
 *
 * @param {String} source
 * @returns {Array} of message string tokens
 */
function findStringInReactComponents(source) {
    const tokens = parse(source);
    let formattedMessageFound = false;
    const strings = [];

    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];

        if (formattedMessageFound) {
            if (token.value === 'message' && token.type.label === 'jsxName') {
                strings.push(tokens[index + 2].value);
            }
        } else if (token.value === 'FormattedMessage' && token.type.label === 'jsxName') {
            formattedMessageFound = true;
        }
    }

    return _.uniq(strings);
}

function getStrings(files, config, done) {
    files = files.filter(isFile);
    if (files.length === 0) {
        done('Files not found');
        return;
    }

    const configuredLexer = lex(config);
    const tokenize = configuredLexer.tokenize;
    const getScope = configuredLexer.getScope;
    const tokens = {};

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
                try {
                    tokens[scope] = tokens[scope].concat(findStringInReactComponents(source));
                } catch (e) {
                    console.error('Cannot parse file ' + file + '. ' + e.name + ': ' + e.message);
                }
            }
            return next(null, tokens);
        });
    }, done);
}

function scan(path, done, config) {
    config = config || defaultConfig;

    glob(path, function (er, files) {
        getStrings(files, config, function (err, results) {
            if (err) {
                return done(err, {});
            }

            const strings = _.reduce(results, function (strings, result, key) {
                strings[key] = _.flattenDeep(result);
                return strings;
            }, {});

            return done(null, strings);
        });
    });
}

module.exports = scan;
