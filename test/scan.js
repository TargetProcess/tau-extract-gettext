'use strict';
// intlScope: test_single_comment_in_js_file
var scan = require('../index.js'),
    test = require('tape');

function dummyStrings() {
    var intl = {};
    intl.formatMessage = function () {
    };
    intl.formatHTMLMessage = function () {
    };

    intl.formatMessage(`This
    is a singular
    tran
    slation %s`, 'replacement');

    intl.formatHTMLMessage(`<b>This</b>
    is a singular
    tran
    slation %s`, 'replacement');

    /**
     <!--name:board.general.quick.add-->
     <div class="general-quick-add">
     <div role="action-quick-add" class="tau-btn tau-btn-big tau-success tau-btn-quick-add"
     data-title="<%=fn.intl.formatMessage('Quick add work and people')%>">
     <span class="tau-btn__text"><%=fn.intl.formatHTMLMessage("
     {blockersCount, select,
0 {You can't see <b>{count}</b> {relationType} {count, plural, one {relation} other {relations}}.}
other {You can't see <b>{count}</b> {relationType} {count, plural, one {relation} other {relations}}, <i>{blockersCount}</i> of them {blockersCount, plural, one {is a blocker} other {are blockers}}.}}
     The project might be deleted or you do not have sufficient permissions.
     ",{blockersCount:3,relationType:'fdsafdsa',count:3}
     )%></span>
     </div>
     </div>
     */

    /**
     *
     * <div> {{formatMessage("ystart")}} </div>
     *
     */

    /**
     *
     * <div> {{formatHTMLMessage("yy<b>start (d)</b>")}} </div>
     *
     */

}


test('scanner', function (assert) {
    var expect = [
        '<b>This</b> is a singular tran slation %s',
        'Quick add work and people',
        `This
         is a singular
        tran
        slation %s`.replace(/\\'/, '\'').replace(/\s+/gm, ' ').trim(),
        "ystart",
        "yy<b>start (d)</b>",
        "{blockersCount, select, 0 {You can't see <b>{count}</b> {relationType} {count, plural, one {relation} other {relations}}.} other {You can't see <b>{count}</b> {relationType} {count, plural, one {relation} other {relations}}, <i>{blockersCount}</i> of them {blockersCount, plural, one {is a blocker} other {are blockers}}.}} The project might be deleted or you do not have sufficient permissions.",
    ];

    scan(__dirname + '/../test/*', function (err, strings) {
        assert.deepEqual(strings['test_single_comment_in_js_file'].sort(), expect.sort(), 'Retrieved expected strings');
        assert.end();
    });
});

test('files not found', function (assert) {
    scan(__dirname + '/../tests/*', function (err, strings) {
        assert.equal(err, 'Files not found', 'Throw error if files not found');
        assert.end();
    });
});

test('extract scope', function (assert) {
    scan(__dirname + '/../test/scopeTest/**', function (err, strings) {
        var expected = {
            "scope_for_component": ["string from model", 'nested message', 'Add rule FormattedMessage', 'test {FormattedMessage}', 'test {FormattedMessage2}', "test jsx"],
            "scope_for_folder": ["Start typing(d) name(s) or email(s)", "test1"],
            "override_scope_file": ["test2"],
            "none": ["deep nested message", "without scope"],
            "custom_js_scope": ["custom js scope"]
        };
        assert.deepEqual(strings, expected, 'Retrieved expected strings');
        assert.end();
    });
});

test('scanner jsx file', function (assert) {
    var expect = [
        'Add rule FormattedMessage',
        'test {FormattedMessage}',
        'test {FormattedMessage2}'
    ];

    scan(__dirname + '/../test/scopeTest/component/views/fomattedMessage.jsx', function (err, strings) {
        assert.deepEqual(strings['scope_for_component'].sort(), expect.sort(), 'Retrieved expected strings');
        assert.end();
    });
});