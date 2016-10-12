
import { ObjectID } from 'mongodb';
import throwError from './throwError';
import dummyPromiseCallback from './dummyPromiseCallback';


export default class Migrate {
    constructor(db, CONST) {
        this._db = db;
        this._CONST = CONST;
    }

    start() {
        return this._mergeLayersInThemes()
        .then( this._mergePresetsInThemes.bind(this), throwError)
        .then( this._replaceUniqidByUuid.bind(this), throwError);
    }

    _mergeLayersInThemes() {
        return new Promise((resolve, reject) => {
            const layerCollection = this._db.collection('poiLayer');
            const themeCollection = this._db.collection('theme');

            layerCollection.find().toArray((err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return resolve();
                }

                const layers = {};

                for (const layer of results) {
                    if ({}.hasOwnProperty.call(results, layer)) {
                        const themeId = layer.themeId;

                        if (!themeId || themeId.length !== 24) {
                            continue;
                        }

                        if ( !layers[themeId] ) {
                            layers[themeId] = [];
                        }

                        layer.type = this._CONST.layerType.overpass;
                        layer.uniqid = layer._id.toString();

                        delete layer._id;
                        delete layer.themeId;

                        layers[themeId].push(layer);
                    }
                }

                const promises = [];

                for (const themeId in layers) {
                    if ({}.hasOwnProperty.call(layers, themeId)) {
                        promises.push( new Promise((res, rej) => {
                            themeCollection.updateOne(
                                {
                                    _id: new ObjectID(themeId),
                                },
                                {
                                    $set: { layers: layers[themeId] },
                                },
                                dummyPromiseCallback.bind(this, res, rej)
                            );
                        }));
                    }
                }

                if (promises.length > 0) {
                    return Promise.all(promises, () => {
                        layerCollection.rename('migrated_poiLayer');

                        resolve();
                    });
                }

                return resolve();
            });
        });
    }

    _mergePresetsInThemes() {
        return new Promise((resolve, reject) => {
            const presetCollection = this._db.collection('preset');
            const themeCollection = this._db.collection('theme');

            presetCollection.find().toArray((err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return resolve();
                }

                const presets = {};

                for (const preset of results) {
                    const themeId = preset.themeId;

                    if (!themeId || themeId.length !== 24) {
                        continue;
                    }

                    if ( !presets[themeId] ) {
                        presets[themeId] = [];
                    }

                    preset.uniqid = preset._id.toString();

                    delete preset._id;
                    delete preset.themeId;

                    presets[themeId].push(preset);
                }

                const promises = [];

                for (const themeId in presets) {
                    if ({}.hasOwnProperty.call(presets, themeId)) {
                        promises.push( new Promise((res, rej) => {
                            themeCollection.updateOne(
                                {
                                    _id: new ObjectID(themeId),
                                },
                                {
                                    $set: { presets: presets[themeId] },
                                },
                                dummyPromiseCallback.bind(this, res, rej)
                            );
                        }));
                    }
                }

                if (promises.length > 0) {
                    return Promise.all(promises, () => {
                        presetCollection.rename('migrated_preset');

                        resolve();
                    });
                }

                return resolve();
            });
        });
    }

    _replaceUniqidByUuid() {
        return new Promise((resolve, reject) => {
            const collection = this._db.collection('theme');

            collection.find().toArray((err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return resolve();
                }

                const promises = [];

                for (const theme of results) {
                    let themeUpdated = false;

                    if (theme.layers) {
                        for (const layer of theme.layers) {
                            if (!layer.uuid) {
                                themeUpdated = true;
                                layer.uuid = layer.uniqid;
                            }
                        }
                    }

                    if (theme.presets) {
                        for (const preset of theme.presets) {
                            if (!preset.uuid) {
                                themeUpdated = true;
                                preset.uuid = preset.uniqid;
                            }
                        }
                    }

                    if (theme.tags) {
                        for (const tag of theme.tags) {
                            if (!tag.uuid) {
                                themeUpdated = true;
                                tag.uuid = tag.uniqid;
                            }
                        }
                    }

                    if (themeUpdated) {
                        promises.push( new Promise((res, rej) => {
                            collection.updateOne(
                                {
                                    _id: theme._id,
                                },
                                {
                                    $set: theme,
                                },
                                dummyPromiseCallback.bind(this, res, rej)
                            );
                        }));
                    }
                }

                if (promises.length > 0) {
                    return Promise.all(promises, () => {
                        resolve();
                    });
                }

                return resolve();
            });
        });
    }
}
