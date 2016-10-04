'use strict';

var program = require('commander'),
    _ = require('lodash'),
    fs = require('fs'),
    async = require('async'),
    scan = require('./../index');

function run(program, source) {
    var paths = source.split(',').map(function (path) {
        return path + '/**/*';
    });

    async.map(paths, scan, function (err, results) {
        var strings = results.reduce(function (strings, result) {
            return strings.concat(result);
        }, []);

        strings = _.uniq(strings).sort().reduce(function (strings, string) {
            strings[string] = string;
            return strings;
        }, {});

        var output = JSON.stringify(strings, null, 2);
        if (program.output) {
            return fs.writeFile(program.output, output, process.exit);
        }

        console.log(output);

        return process.exit();
    });
}

program
    .command('*')
    .description('Scans for intl functions intl.formatMessage(), intl.formatHTMLMessage() and JSX component <FormattedMessage />')
    .action(function (source) {
        run(program, source);
    });

program
    .version('0.0.1')
    .option('-o, --output [file]', 'Output file', String)
    .parse(process.argv);

if (program.args.length === 0) {
    program.help();
}
