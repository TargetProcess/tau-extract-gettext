var templates = require('tau/core/templates-factory');
var tauIntl = require('tau/ui/tags/ui.tag.intl');
var config = {
    name: 'burn.down.template.details',
    tags: [tauIntl],
    markup: '<div class="chart-bubble">\n    <div>{{formatMessage("Initial Effort")}}</div>    \n    <div>{{formatMessage(`Initial Effort {value}`, {value: 12})}}</div>\n</div>',
    dependencies: []
};

module.exports = templates.register(config);

