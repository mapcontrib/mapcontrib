
import { ObjectID } from 'mongodb';
import config from 'config';
import _ from 'underscore';
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



let database = new Database();

database.connect((err, db) => {
    if (err) throw err;

    let cron = new UpdateOverPassCache(db);

    logger.info(`Update of the OverPass cache started`);

    cron.start()
    .then(() => {
        logger.info(`Update of the OverPass cache finished`);
        db.close();
    })
    .catch(throwError);
});




export default class UpdateOverPassCache {
    constructor (db) {
        this._db = db;
    }

    start () {
        return new Promise((resolve, reject) => {
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

                for (let theme of themes) {
                    for (let layer of theme.layers) {
                        if (layer.type !== CONST.layerType.overpass) {
                            continue;
                        }

                        if (layer.cache === false) {
                            continue;
                        }

                        const url = OverPassHelper.buildUrlForCache(
                            config.get('client.overPassEndPoint'),
                            layer.overpassRequest,
                            config.get('client.overPassCacheFileSize')
                        );

                        let xhr = new XMLHttpRequest();
                        xhr.open('GET', url, false);
                        xhr.send(null);

                        if (xhr.status === 200) {
                            console.log(
                                osmtogeojson(
                                    JSON.parse(xhr.responseText)
                                )
                            );
                        }
                    }
                }

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



                return resolve();
            });
        });
        // If timeout, save the date of the try and the reason of the failure
        // If heavier, save the date of the try and the reason of the failure
        // If not, save the results into a file : files/FRAGMENT/overPassCache/UUID.geojson
        // save the date
        // Next
    }
}
