/*global intl*/
/*jshint quotmark:false*/
// note that intl scope is not at first line
// intlScope: custom_js_scope_2
intl.formatMessage('whole string');
intl.formatMessage('concatenated' + ' string');
intl.formatMessage('concatenated' + ' string with {param}', {param: 'param'});
intl.formatMessage('concatenated' +
    ' multiline' +
    ' string');

var message = 'this message is not extracted';
intl.formatMessage(message);

intl.formatMessage('crack' + " me')");
