
import { ObjectID } from 'mongodb';
import config from 'config';
import _ from 'underscore';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import osmtogeojson from 'osmtogeojson';
import { XMLHttpRequest } from 'xmlhttprequest';
import logger from '../lib/logger';
import throwError from '../lib/throwError';
import dummyPromiseCallback from '../lib/dummyPromiseCallback';
import Database from '../database';
import themeApi from '../api/theme';
import fileApi from '../api/file';
import SERVER_CONST from '../const';
import PUBLIC_CONST from '../public/js/const';
import OverPassHelper from '../public/js/helper/overPass';

const CONST = _.extend(SERVER_CONST, PUBLIC_CONST);

const publicDirectory = path.resolve(__dirname, '..', 'public');


let database = new Database();

database.connect((err, db) => {
    if (err) throw err;

    let cron = new UpdateOverPassCache(db);

    logger.info(`Update of the OverPass cache started`);

    cron.start();
});




export default class UpdateOverPassCache {
    constructor (db) {
        this._db = db;
    }

    start () {
        logger.debug('start');

        this._themeCollection = this._db.collection('theme');

        this._themeCollection.find({
            'layers.type': CONST.layerType.overpass,

            'layers.cache': true,
        }).toArray((err, themes) => {
            if(err) {
                throw err;
            }

            if (themes.length === 0) {
                return this._end();
            }

            this._iterate = this._iterateLayers(themes);

            let iteration = this._iterate.next();
            this._processIteration(iteration);
        });
    }

    *_iterateLayers (themes) {
        logger.debug('_iterateLayers');
        for (let theme of themes) {
            for (let layer of theme.layers) {
                yield {theme, layer};
            }
        }
    }

    _nextIteration () {
        logger.debug('_nextIteration');
        let iteration = this._iterate.next();

        if (iteration.done) {
            return this._end();
        }

        setTimeout(this._processIteration.bind(this, iteration), 5 * 1000);
    }

    _retryIteration (iteration) {
        logger.debug('_retryIteration');
        setTimeout(this._processIteration.bind(this, iteration), 60 * 1000);
    }

    _processIteration (iteration) {
        logger.debug('_processIteration');

        let theme = iteration.value.theme;
        let layer = iteration.value.layer;

        if (layer.type !== CONST.layerType.overpass) {
            return this._nextIteration();
        }

        if (layer.cache === false) {
            return this._nextIteration();
        }

        logger.info('Next request');
        logger.info('Theme fragment:', theme.fragment);
        logger.info('Layer uniqid:', layer.uniqid);

        const url = OverPassHelper.buildUrlForCache(
            config.get('client.overPassEndPoint'),
            layer.overpassRequest,
            config.get('client.overPassCacheFileSize')
        );

        this._retrieveData(url)
        .then(data => {
            this._saveCacheFile(
                theme.fragment,
                layer.uniqid,
                data
            )
            .then( this._setLayerStateSuccess.bind(this, theme, layer) )
            .then( this._nextIteration.bind(this) );
        })
        .catch(xhr => {
            if (xhr.status === 429) {
                logger.info('OverPass says: Too many requests... Retrying in a few seconds');
                return this._retryIteration(iteration);
            }

            if (xhr.status === 400) {
                logger.debug('OverPass says: Bad request');
                return this._setLayerStateError(theme, layer, CONST.overPassCacheError.badRequest)
                .then( this._nextIteration.bind(this) );
            }

            if (xhr.status !== 200) {
                logger.debug('Unknown error, next!');
                return this._setLayerStateError(theme, layer, CONST.overPassCacheError.unknown)
                .then( this._nextIteration.bind(this) );
            }

            let error;
            const overPassJson = JSON.parse(xhr.responseText);

            if ( overPassJson.remark.indexOf('Query timed out') > -1 ) {
                logger.debug('OverPass says: Timeout');
                error = CONST.overPassCacheError.timeout;
            }
            else if ( overPassJson.remark.indexOf('Query run out of memory') > -1 ) {
                logger.debug('OverPass says: Out of memory');
                error = CONST.overPassCacheError.memory;
            }

            return this._setLayerStateError(theme, layer, error)
            .then( this._nextIteration.bind(this) );
        });
    }

    _retrieveData (url) {
        logger.debug('_retrieveData');

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);

            if (xhr.status === 200) {
                const overPassJson = JSON.parse(xhr.responseText);

                if (overPassJson.remark) {
                    return reject(xhr);
                }

                return resolve(overPassJson);
            }

            return reject(xhr);
        });
    }

    _saveCacheFile (themeFragment, layerUuid, overPassResult) {
        logger.debug('_saveCacheFile');

        return new Promise((resolve, reject) => {
            const overPassGeoJson = osmtogeojson(overPassResult);
            const publicCacheDirectory = `files/theme/${themeFragment}/overPassCache/`;
            const cacheDirectory = path.resolve( publicDirectory, publicCacheDirectory );
            const filePath = path.join( publicCacheDirectory, `${layerUuid}.geojson` );


            if ( !fs.existsSync( cacheDirectory ) ) {
                mkdirp.sync(cacheDirectory);
            }

            fs.writeFile(
                path.resolve( publicDirectory, filePath ),
                JSON.stringify( overPassGeoJson ),
                () => {
                    resolve(`/${filePath}`);
                }
            );
        });
    }

    _setLayerStateSuccess (theme, layer, filePath) {
        logger.debug('_setLayerStateSuccess');

        return new Promise((resolve, reject) => {
            this._themeCollection.updateOne({
                    '_id': theme._id,
                    'layers.uniqid': layer.uniqid
                },
                {
                    '$set': {
                        'layers.$.fileUri': filePath,
                        'layers.$.cacheUpdateSuccess': true,
                        'layers.$.cacheUpdateSuccessDate': new Date().toISOString(),
                        'layers.$.cacheUpdateDate': new Date().toISOString(),
                        'layers.$.cacheUpdateError': null,
                    }
                },
                () => {
                    resolve();
                }
            );
        });
    }

    _setLayerStateError (theme, layer, error) {
        logger.debug('_setLayerStateError');

        return new Promise((resolve, reject) => {
            this._themeCollection.updateOne({
                    '_id': theme._id,
                    'layers.uniqid': layer.uniqid
                },
                {
                    '$set': {
                        'layers.$.cacheUpdateSuccess': false,
                        'layers.$.cacheUpdateDate': new Date().toISOString(),
                        'layers.$.cacheUpdateError': error,
                    }
                },
                () => {
                    resolve();
                }
            );
        });
    }

    _end () {
        logger.info(`Update of the OverPass cache finished`);
        this._db.close();
    }
}
