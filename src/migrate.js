
import { ObjectID } from 'mongodb';
import logger from './lib/logger';
import throwError from './lib/throwError';
import dummyPromiseCallback from './lib/dummyPromiseCallback';



export default class Migrate {
    constructor (db, CONST) {
        this._db = db;
        this._CONST = CONST;
    }

    start () {
        return this._mergeLayersInThemes()
        .then( this._mergePresetsInThemes.bind(this), throwError);
    }

    _mergeLayersInThemes () {
        return new Promise((resolve, reject) => {
            let layerCollection = this._db.collection('poiLayer');
            let themeCollection = this._db.collection('theme');

            layerCollection.find().toArray((err, results) => {
                if(err) {
                    throw err;
                }

                if (results.length === 0) {
                    resolve();
                    return;
                }

                let layers = {};

                for (let layer of results) {
                    let themeId = layer.themeId;

                    if (!themeId || themeId.length !== 24) {
                        continue;
                    }

                    if ( !layers[ themeId ] ) {
                        layers[ themeId ] = [];
                    }

                    layer.type = this._CONST.layerType.overpass;
                    layer.uniqid = layer._id.toString();

                    delete layer._id;
                    delete layer.themeId;

                    layers[ themeId ].push(layer);
                }

                for (let themeId in layers) {
                    themeCollection.updateOne({
                            '_id': new ObjectID(themeId)
                        },
                        {
                            '$set': {'layers': layers[ themeId ]}
                        },
                        dummyPromiseCallback.bind(this, resolve, reject)
                    );
                }

                layerCollection.rename('migrated_poiLayer');
            });
        });
    }

    _mergePresetsInThemes () {
        return new Promise((resolve, reject) => {
            let presetCollection = this._db.collection('preset');
            let themeCollection = this._db.collection('theme');

            presetCollection.find().toArray((err, results) => {
                if(err) {
                    throw err;
                }

                if (results.length === 0) {
                    resolve();
                    return;
                }

                let presets = {};

                for (let preset of results) {
                    let themeId = preset.themeId;

                    if (!themeId || themeId.length !== 24) {
                        continue;
                    }

                    if ( !presets[ themeId ] ) {
                        presets[ themeId ] = [];
                    }

                    preset.uniqid = preset._id.toString();

                    delete preset._id;
                    delete preset.themeId;

                    presets[ themeId ].push(preset);
                }

                for (let themeId in presets) {
                    themeCollection.updateOne({
                            '_id': new ObjectID(themeId)
                        },
                        {
                            '$set': {'presets': presets[ themeId ]}
                        },
                        dummyPromiseCallback.bind(this, resolve, reject)
                    );
                }

                presetCollection.rename('migrated_preset');
            });
        });
    }
}
