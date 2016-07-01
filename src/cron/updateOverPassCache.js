
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

    _saveCacheFile (themeFragment, layerUuid, overPassResult) {
        logger.debug('_saveCacheFile');
        const overPassGeoJson = osmtogeojson(overPassResult);
        const cacheDirectory = path.resolve(
            publicDirectory,
            `files/theme/${themeFragment}/overPassCache/`
        );

        if ( !fs.existsSync( cacheDirectory ) ) {
            mkdirp.sync(cacheDirectory);
        }

        const filePath = path.resolve(
            cacheDirectory,
            `${layerUuid}.geojson`
        );

        fs.writeFile(
            filePath,
            JSON.stringify( overPassGeoJson )
        );
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

    *_iterateLayers (themes) {
        logger.debug('_iterateLayers');
        for (let theme of themes) {
            for (let layer of theme.layers) {
                yield {theme, layer};
            }
        }
    }

    start () {
        logger.debug('start');
        let themeCollection = this._db.collection('theme');

        themeCollection.find({
            'layers.type': CONST.layerType.overpass,
            'layers.cache': true,
        }).toArray((err, themes) => {
            if(err) {
                throw err;
            }

            if (themes.length === 0) {
                resolve();
                return;
            }

            this._iterate = this._iterateLayers(themes);
            this._nextIteration();
        });
    }

    _nextIteration () {
        logger.debug('_nextIteration');
        let iteration = this._iterate.next();
        setTimeout(this._processIteration.bind(this, iteration), 30);
    }

    _retryIteration (iteration) {
        logger.debug('_retryIteration');
        setTimeout(this._processIteration.bind(this, iteration), 60);
    }

    _processIteration (iteration) {
        logger.debug('_processIteration');
        if (iteration.done) {
            return this._end();
        }

        let theme = iteration.value.theme;
        let layer = iteration.value.layer;

        if (layer.type !== CONST.layerType.overpass) {
            return this._nextIteration();
        }

        if (layer.cache === false) {
            return this._nextIteration();
        }

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
            );

            this._nextIteration();
        })
        .catch(xhr => {
            switch (xhr.status) {
                case 429:
                    console.log('Too many requests');
                    break;
                case 200:
                    console.log(overPassJson.remark);
                    break;
                default:
                    console.log('Unknown error');
            }

            this._retryIteration();
        });

        // if (needUpdate === true) {
        //     themeCollection.updateOne({
        //             '_id': theme._id
        //         },
        //         {
        //             '$set': {'layers': theme.layers}
        //         },
        //         dummyPromiseCallback.bind(this, resolve, reject)
        //     );
        // }
    }

    _end () {
        logger.info(`Update of the OverPass cache finished`);
        this._db.close();
    }
}


/*
{
  "version": 0.6,
  "generator": "Overpass API",
  "osm3s": {
    "timestamp_osm_base": "2016-07-01T06:27:02Z",
    "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL."
  },
  "elements": [



  ],
"remark": "runtime error: Query timed out in \"query\" at line 1 after 2 seconds."
}
*/
/*
{
  "version": 0.6,
  "generator": "Overpass API",
  "osm3s": {
    "timestamp_osm_base": "2016-06-30T21:28:02Z",
    "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL."
  },
  "elements": [



  ],
"remark": "runtime error: Query run out of memory in \"query\" at line 1 using about 1 MB of RAM."
}
*/
