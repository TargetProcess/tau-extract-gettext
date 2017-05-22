/*jshint quotmark:false,sub:true*/
'use strict';

var test = require('tape');
var _ = require('lodash');
var scan = require('../index.js');

var normalize = stringsPerScope => _.mapValues(stringsPerScope, strings => strings.sort());

test('scan', function(assert) {
    var expected = {
        test_single_comment_in_js_file: [
            '<b>This</b> is a singular tran slation %s',
            'Quick add work and people',
            `This
	         is a singular
	        tran
	        slation %s`.replace(/\\'/, '\'').replace(/\s+/gm, ' ').trim(),
            'Text message in JSDoc',
            'HTML message in <b>JSDoc</b>',
            "The changes you've made can't be saved",
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

    scan(__dirname + '/../test/scannerTest/*', function(err, strings) {
        assert.deepEqual(normalize(strings), normalize(expected), 'Retrieved expected strings');
        assert.end();
    });
});

test('files not found', function (assert) {
    scan(__dirname + '/../tests/*', function (err, strings) {
        assert.equal(err, 'Files not found', 'Throw error if files not found');
        assert.end();
    });
});

test('extract scope', function(assert) {
    scan(__dirname + '/../test/scopeTest/**', function(err, strings) {
        var expected = {
            "scope_for_component": [
                'string from model',
                'nested message',
                'FormattedMessage message',
                'MyComponent message after FormattedMessage',
                'test {FormattedMessage}',
                'test {FormattedMessage2}',
                'Help Desk Portal URL {example}',
                '(Ex: http://helpdesk.yourdomain.com)',
                '(type the new password if you want to change it)',
                'Password {hint}',
                'test jsx with import',
                'test jsx'
            ],
            "scope_for_folder": ['Start typing(d) name(s) or email(s)', 'test1'],
            "override_scope_file": ['test2'],
            "none": ['deep nested message', 'Initial Effort', 'Initial Effort {value}', 'without {test} scope'],
            "custom_js_scope": ['custom js scope'],
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

test('scan ES5 JSX file', function (assert) {
    var expected = [
        '(Ex: http://helpdesk.yourdomain.com)',
        '(type the new password if you want to change it)',
        'FormattedMessage message',
        'Help Desk Portal URL {example}',
        'MyComponent message after FormattedMessage', //FIXME this is a bug
        'Password {hint}',
        'test {FormattedMessage2}',
        'test {FormattedMessage}'
    ];

    scan(__dirname + '/../test/scopeTest/component/views/formattedMessage.jsx', function (err, strings) {
        assert.deepEqual(strings['scope_for_component'].sort(), expected.sort(), 'Retrieved expected strings');
        assert.end();
    });
});

test('scan jQuery template file', function(assert) {
    var expected = [
        'Initial Effort',
        'Initial Effort {value}'
    ];

    scan(__dirname + '/../test/scopeTest/jquery.template.js', function(err, strings) {
        assert.deepEqual(strings['none'].sort(), expected.sort(), 'Retrieved expected strings');
        assert.end();
    });
});
