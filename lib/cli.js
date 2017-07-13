'use strict';

const program = require('commander'),
    _ = require('lodash'),
    fs = require('fs'),
    async = require('async'),
    scan = require('./../index');

function run(program, source) {
    const paths = source.split(',').map(function (path) {
        return path + '/**/*';
    });

    async.map(paths, scan, function (err, results) {
        let strings = results.reduce(function (strings, result) {
            return strings.concat(result);
        }, []);

        strings = _.uniq(strings).sort().reduce(function (strings, string) {
            strings[string] = string;
            return strings;
        }, {});

        const output = JSON.stringify(strings, null, 2);
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
    .version('0.6.0')
    .option('-o, --output [file]', 'Output file', String)
    .parse(process.argv);

if (program.args.length === 0) {
    program.help();
}
