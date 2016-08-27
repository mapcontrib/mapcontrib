/**
 * Usage: npm run importIdPresets -- --dir DIR
 */

import presetsBuilder from 'id-presets-builder';
import argp from 'argp';


const argv = argp.createParser({ once: true })
    .description ('Import presets, categories, fields and defaults from an iD reporitory clone')
    .on('end', function (argv) {
        if ( !argv.dir ) {
            this.printUsage(1);
        }
    })
    .on('error', function (error) {
        this.fail(error);
    })
    .body ()
        .text(' Options:')
        .option({
            description: 'iD\'s repository clone directory',
            short: 'd',
            long: 'dir',
            metavar: 'DIR',
            optional: false,
            type: String
        })
        .usage()
        .argv();


// presetsBuilder.generatePresets(argv, callback);
