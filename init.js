
import inquirer from 'inquirer';
import { ObjectID } from 'mongodb';
import logger from './lib/logger';
import throwError from './lib/throwError';
import dummyPromiseCallback from './lib/dummyPromiseCallback';
import SERVER_CONST from './const';
import PUBLIC_CONST from './public/js/const';
import Database from './lib/database';

const CONST = { ...SERVER_CONST, ...PUBLIC_CONST };


logger.info('/!\\ WARNING /!\\');
logger.info();
logger.info('The MapContrib\'s database will be completely erased!');
logger.info();


const questions = [{
    type: 'confirm',
    name: 'areYouSure',
    message: 'Are you sure you want to do it?',
    default: false,
}];


class Init {
    constructor(db) {
        this._db = db;
        this._themeCollection = undefined;
        this._userCollection = undefined;
    }

    cleanDatabase() {
        const dropPromises = [
            new Promise((resolve) => {
                this._db.dropCollection('theme', () => {
                    resolve();
                });
            }),
            new Promise((resolve) => {
                this._db.dropCollection('user', () => {
                    resolve();
                });
            }),
        ];

        return Promise.all(dropPromises)
        .then(() => {
            logger.info('Database cleaned');
        })
        .catch((err) => {
            throw err;
        });
    }

    fillDatabase() {
        const insertPromises = [
            new Promise((resolve, reject) => {
                this._db.createCollection('theme', (err, collection) => {
                    this._themeCollection = collection;

                    this._themeCollection.insertOne({
                            _id: new ObjectID('5249c43c6e789470197b5973'),
                            name: 'MapContrib',
                            description: 'Ceci est une description :)',
                            fragment: 's8c2d4',
                            color: 'blue',
                            tiles: [

                                'osmFr',
                                'mapboxStreetsSatellite',
                                'osmRoads',
                                'transport',
                                'hot',
                                'openCycleMap',
                                'watercolor',
                                'osmMonochrome',
                                'hydda',
                                'openTopoMap',
                                'openRiverboatMap',
                            ],
                            zoomLevel: 12,
                            center: {
                                lat: 44.82921,
                                lng: -0.5834,
                            },
                            layers: [
                                {
                                    type: CONST.layerType.overpass,
                                    name: 'Déchèteries',
                                    description: 'Déchèteries, centres de tri, etc.',
                                    overpassRequest: "(node['amenity'='recycling']['recycling_type'='centre']({{bbox}});relation['amenity'='recycling']['recycling_type'='centre']({{bbox}});way['amenity'='recycling']['recycling_type'='centre']({{bbox}}));out body center;>;out skel;",
                                    minZoom: 14,
                                    popupContent: '# Nom : {name}\n\n_Amenity :_ {amenity}',
                                    order: 0,
                                    markerShape: 'marker1',
                                    markerColor: 'green',
                                    markerIcon: 'recycle',
                                },
                                {
                                    type: CONST.layerType.overpass,
                                    name: 'Poubelles',
                                    description: 'Poubelles de toutes sortes',
                                    overpassRequest: "(node['amenity'='waste_basket']({{bbox}});relation['amenity'='waste_basket']({{bbox}});way['amenity'='waste_basket']({{bbox}}));out body center;>;out skel;",
                                    minZoom: 14,
                                    popupContent: '# Nom : {name}\n\n_Amenity :_ {amenity}',
                                    order: 1,
                                    markerShape: 'marker1',
                                    markerColor: 'yellow',
                                    markerIcon: 'trash',
                                },
                            ],
                        },
                        { safe: true },
                        dummyPromiseCallback.bind(this, resolve, reject)
                    );
                });
            }),
            new Promise((resolve) => {
                this._db.createCollection('user', (err, collection) => {
                    this._userCollection = collection;

                    resolve();
                });
            }),
        ];

        return Promise.all(insertPromises)
        .then(() => {
            logger.info('Database fulfilled');
        })
        .catch((err) => {
            throw err;
        });
    }

    createIndexes() {
        const indexesPromises = [
            new Promise((resolve, reject) => {
                this._userCollection.createIndex(
                    { osmId: 1 },
                    { unique: true },
                    dummyPromiseCallback.bind(this, resolve, reject)
                );
            }),
            new Promise((resolve, reject) => {
                this._themeCollection.createIndex(
                    { fragment: 1 },
                    { unique: true },
                    dummyPromiseCallback.bind(this, resolve, reject)
                );
            }),
        ];

        return Promise.all(indexesPromises)
        .then(() => {
            logger.info('Collections\' indexes created');
        })
        .catch((err) => {
            throw err;
        });
    }
}


inquirer.prompt( questions ).then((answers) => {
    logger.info();

    if (answers.areYouSure === true) {
        const database = new Database();

        database.connect((err, db) => {
            if (err) throw err;

            const init = new Init(db);

            logger.info('Initialization started');

            init.cleanDatabase()
            .then( init.fillDatabase.bind(init), throwError)
            .then( init.createIndexes.bind(init), throwError)
            .then(() => {
                logger.info('Initialization finished');
                db.close();
            })
            .catch(throwError);
        });
    }
    else {
        logger.info('Initialization aborted');
    }
});
