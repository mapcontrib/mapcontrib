
import { ObjectID } from 'mongodb';
import config from 'config';
import _ from 'underscore';
import logger from '../lib/logger';
import throwError from '../lib/throwError';
import dummyPromiseCallback from '../lib/dummyPromiseCallback';
import Database from '../database';
import themeApi from '../api/theme';
import fileApi from '../api/file';
import SERVER_CONST from '../const';
import PUBLIC_CONST from '../public/js/const';


const CONST = _.extend(SERVER_CONST, PUBLIC_CONST);



let database = new Database();

database.connect((err, db) => {
    if (err) throw err;

    let cron = new UpdateOverpassCache(db);

    logger.info(`Update of the OverPass cache started`);

    cron.start()
    .then(() => {
        logger.info(`Update of the OverPass cache finished`);
        db.close();
    })
    .catch(throwError);
});




export default class UpdateOverpassCache {
    constructor (db) {
        this._db = db;
        this._themeCollection = undefined;
    }

    start () {
        // Select the layers which request a cache
        // Loop on those one at a time
        // Play the overpass request with a 900 seconds timeout
        // If timeout, save the date of the try and the reason of the failure
        // If not, transform the results into geojson
        // Control the size, must be lower than the configuration
        // If heavier, save the date of the try and the reason of the failure
        // If not, save the results into a file : files/FRAGMENT/overPassCache/UUID.geojson
        // save the date
        // Next
    }
}
