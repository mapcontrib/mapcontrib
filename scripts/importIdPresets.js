/**
 * Usage: npm run import-id-presets -- --dir DIR
 */

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import presetsBuilder from 'id-presets-builder';
import argp from 'argp';
import logger from '../lib/logger';
import CONST from '../const';


function onArgpEnd(result) {
    if ( !result || !result.dir ) {
        this.printUsage();
        process.exit();
    }
}

function onArgpError(error) {
    this.fail(error);
}

const argpResult = argp.createParser({ once: true })
    .description('Import presets, categories, fields and defaults from an iD reporitory clone')
    .on('end', onArgpEnd)
    .on('error', onArgpError)
    .body()
        .text(' Options:')
        .option({
            description: 'iD\'s repository clone directory',
            short: 'd',
            long: 'dir',
            metavar: 'DIR',
            optional: false,
            type: String,
        })
        .argv();


const iDDirectoryPath = path.resolve(argpResult.dir);
const iDPresetsDirectoryPath = path.join(iDDirectoryPath, 'data/presets');
const iDLocalesDirectoryPath = path.join(iDDirectoryPath, 'dist/locales');

logger.debug('final directories creation');
mkdirp.sync(CONST.iDPresetsDirectoryPath);
mkdirp.sync(CONST.iDLocalesDirectoryPath);


logger.debug('old locale files purge');
fs.readdir(CONST.iDLocalesDirectoryPath, (err, localeFiles) => {
    if (err) throw err;

    for (const localeFile of localeFiles) {
        fs.unlinkSync(
            path.join(CONST.iDLocalesDirectoryPath, localeFile)
        );
    }
});


logger.info('Generation of presets');
presetsBuilder.generatePresets(iDPresetsDirectoryPath, (err, data) => {
    if (err) throw err;

    const finalPresetsPath = path.join(CONST.iDPresetsPath);
    const newData = {
        defaults: data.defaults,
        presets: data.presets,
        fields: data.fields,
        categories: data.categories,
    };

    logger.debug(`creating ${finalPresetsPath}`);
    fs.writeFile(finalPresetsPath, JSON.stringify(newData));
});


logger.info('Generation of locale files');
fs.readdir(iDLocalesDirectoryPath, (err, iDLocaleFiles) => {
    if (err) throw err;

    for (const iDLocaleFile of iDLocaleFiles) {
        const iDLocaleFilePath = path.join(iDLocalesDirectoryPath, iDLocaleFile);
        const finalLocaleFilePath = path.join(CONST.iDLocalesDirectoryPath, iDLocaleFile);

        fs.readFile(iDLocaleFilePath, 'utf-8', (error, data) => {
            if (error) throw error;

            const json = JSON.parse(data);
            const newData = {};

            if (typeof json.presets === 'undefined') {
                return false;
            }

            if (typeof json.presets.presets !== 'undefined') {
                newData.presets = json.presets.presets;
            }

            if (typeof json.presets.fields !== 'undefined') {
                newData.fields = json.presets.fields;
            }

            if (typeof json.presets.categories !== 'undefined') {
                newData.categories = json.presets.categories;
            }

            logger.debug(`creating ${finalLocaleFilePath}`);
            return fs.writeFile(
                finalLocaleFilePath,
                JSON.stringify(newData)
            );
        });
    }
});


logger.info('End of the generation');
