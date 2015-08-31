var trasifex = require('tau-transifex');
module.exports = {
    scan: require('./lib/scan'),
    pushToTransifex: function (config, strings) {
        return trasifex(config).updateResourceFile(strings);
    }
};
