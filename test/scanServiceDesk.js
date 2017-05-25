/*jshint quotmark:false,sub:true*/
'use strict';

var _ = require('lodash');
var test = require('tape');
var scan = require('../index.js');

var normalize = stringsPerScope => _.mapValues(stringsPerScope, strings => strings.sort());

test('scan Service Desk files - check parser support for JSX', function (assert) {
    var expected = {
        'none': [],
        'request-list': [
            'My Requests',
            'Show Closed',
            'Show Descriptions'
        ]
    };

    scan('E:/HelpDesk/Code/src/HelpDesk.Web/scripts/**/*', function(err, strings) {
        assert.deepEqual(normalize(strings), normalize(expected), 'Retrieved expected strings');
        assert.end();
    });
});
