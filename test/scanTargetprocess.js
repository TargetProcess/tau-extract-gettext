'use strict';
var test = require('tape');
var scan = require('../index.js');

test('scan Targetprocess files - measure scan time', function(assert) {
    console.log('Scanning tau/ ...');
    var startTime = Date.now();
    scan('C:/tp3/Code/Main/Tp.Web/JavaScript/tau/scripts/tau/**/*', function() {
        var endTime = Date.now();
        console.log('Finished scanning tau/ in ' + (endTime - startTime) + 'ms');
        assert.end();
    });
});
