// intlScope: test_single_comment_in_js_file
var scan = require('../index.js');
var test = require('tape');

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
     * <div> {{formatMessage("Text message in JSDoc")}} </div>
     *
     */

    /**
     *
     * <div> {{formatHTMLMessage("HTML message in <b>JSDoc</b>")}} </div>
     *
     */

    intl.formatMessage('The changes you\'ve made can\'t be saved');
}
