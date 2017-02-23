
import Backbone from 'backbone';
import logger from '../lib/logger';
import Database from '../lib/database';
import FileApi from '../api/file';
import ThemeModel from '../public/js/model/theme';


const database = new Database();


export default class CleanObsoleteLayerFiles {
    constructor(db) {
        this._db = db;
    }

    start() {
        logger.debug('start');

        this._themeCollection = this._db.collection('theme');

        this._themeCollection.find({})
        .toArray((err, themes) => {
            if (err) {
                throw err;
            }

            if (themes.length === 0) {
                return this._end();
            }

            for (const theme of themes) {
                Backbone.Relational.store.reset();

                logger.info('Cleaning theme:', theme.fragment);

                FileApi.cleanObsoleteLayerFiles(
                    new ThemeModel(theme)
                );
            }

            return this._end();
        });
    }

    _end() {
        logger.info('Cleaning of the obsolete layer files finished');

        this._db.close();
    }
}


database.connect((err, db) => {
    if (err) throw err;

    const cron = new CleanObsoleteLayerFiles(db);

    logger.info('Cleaning of the obsolete layer files started');

    cron.start();
});
