/*jshint quotmark:false*/
'use strict';
var scan = require('../index.js');
var test = require('tape');
var _ = require('lodash');

test('scanner', function(assert) {
    var expected = {
        test_single_comment_in_js_file: [
            '<b>This</b> is a singular tran slation %s',
            'Quick add work and people',
            `This
	         is a singular
	        tran
	        slation %s`.replace(/\\'/, '\'').replace(/\s+/gm, ' ').trim(),
            "ystart",
            "yy<b>start (d)</b>",
            "{blockersCount, select, 0 {You can't see <b>{count}</b> {relationType} {count, plural, one {relation} other {relations}}.} other {You can't see <b>{count}</b> {relationType} {count, plural, one {relation} other {relations}}, <i>{blockersCount}</i> of them {blockersCount, plural, one {is a blocker} other {are blockers}}.}} The project might be deleted or you do not have sufficient permissions.",
        ],
        nonStringUsage: [
            'token'
        ],
        multilineUsages: [
            'token 1', 'token 2', 'token 3',
            '{data} token 1', '{data} token 2', '{data} token 3', '{data} token 4',
            'jq token 1', 'jq token 2', 'jq token 3',
            'jq {data} token 1', 'jq {data} token 2', 'jq {data} token 3', 'jq {data} token 4',
        ]
    };

    var normalize = stringsPerScope => _.mapValues(stringsPerScope, strings => strings.sort());

    scan(__dirname + '/../test/scannerTest/*', function(err, strings) {
        assert.deepEqual(normalize(strings), normalize(expected), 'Retrieved expected strings');
        assert.end();
    });
});

test('files not found', function(assert) {
    scan(__dirname + '/../tests/*', function(err, strings) {
        assert.equal(err, 'Files not found', 'Throw error if files not found');
        assert.end();
    });
});

test('extract scope', function(assert) {
    scan(__dirname + '/../test/scopeTest/**', function(err, strings) {
        var expected = {
            "scope_for_component": ["string from model",
                'nested message',
                'Add rule FormattedMessage',
                'test {FormattedMessage}',
                'test {FormattedMessage2}',
                'test jsx with import',
                "test jsx"],
            "scope_for_folder": ["Start typing(d) name(s) or email(s)", "test1"],
            "override_scope_file": ["test2"],
            "none": ["deep nested message", "Initial Effort", "Initial Effort {value}", "without {test} scope"],
            "custom_js_scope": ["custom js scope"],
            "custom_js_scope_2": [
                "whole string",
                "concatenated string",
                "concatenated string with {param}",
                "concatenated multiline string",
                "crack" //TODO should be "crack me')"
            ]
        };
        assert.deepEqual(strings, expected, 'Retrieved expected strings');
        assert.end();
    });
});

test('scanner jsx file', function(assert) {
    var expect = [
        'Add rule FormattedMessage',
        'test {FormattedMessage}',
        'test {FormattedMessage2}'
    ];

    scan(__dirname + '/../test/scopeTest/component/views/fomattedMessage.jsx', function(err, strings) {
        assert.deepEqual(strings['scope_for_component'].sort(), expect.sort(), 'Retrieved expected strings');
        assert.end();
    });
});

test('scanner jquery template file', function(assert) {
    var expect = [
        'Initial Effort',
        'Initial Effort {value}'
    ];

    scan(__dirname + '/../test/scopeTest/jquery.template.js', function(err, strings) {
        assert.deepEqual(strings['none'].sort(), expect.sort(), 'Retrieved expected strings');
        assert.end();
    });
});
